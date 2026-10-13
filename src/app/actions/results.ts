"use server";

import { prisma } from "@/lib/db";
import { getAllRaces, getRaceById } from "@/lib/races";

export type AthleteResult = {
  id: string;
  bibNumber: string;
  name: string;
  raceTitle: string;
  distanceName: string;
  category: string;
  gender: string;
  overallRank: number;
  genderRank: number;
  categoryRank: number;
  chipTime: string;
  gunTime: string;
  pace: string;
  split5k?: string;
  split10k?: string;
  split21k?: string;
  status: "FINISHER" | "EN_RUTA" | "DNS";
  isUserRegistration?: boolean;
};

// Generador de competidores base realistas para simular un cronometraje oficial completo
const DEMO_RUNNERS = [
  { name: "Carlos Eduardo Ramírez", bib: "PSL-1024", distance: "10K", chip: "00:34:12", gun: "00:34:14", pace: "3:25 min/km", s5: "00:16:45", gender: "M" },
  { name: "Sofía Montes de Oca", bib: "PSL-1108", distance: "10K", chip: "00:36:45", gun: "00:36:48", pace: "3:40 min/km", s5: "00:18:10", gender: "F" },
  { name: "Mateo Hernández Silva", bib: "PSL-1250", distance: "10K", chip: "00:38:22", gun: "00:38:30", pace: "3:50 min/km", s5: "00:19:05", gender: "M" },
  { name: "Valeria Gómez Cruz", bib: "PSL-2340", distance: "10K", chip: "00:41:15", gun: "00:41:25", pace: "4:07 min/km", s5: "00:20:20", gender: "F" },
  { name: "Alejandro Torres Peña", bib: "PSL-3105", distance: "10K", chip: "00:44:50", gun: "00:45:10", pace: "4:29 min/km", s5: "00:22:15", gender: "M" },
  { name: "Mariana Delgado Ríos", bib: "PSL-4099", distance: "10K", chip: "00:48:30", gun: "00:48:55", pace: "4:51 min/km", s5: "00:24:00", gender: "F" },
  { name: "Daniel Rivas Castillo", bib: "PSL-5201", distance: "10K", chip: "00:52:10", gun: "00:52:40", pace: "5:13 min/km", s5: "00:25:50", gender: "M" },
  { name: "Renata Morales Vega", bib: "PSL-6310", distance: "10K", chip: "00:56:45", gun: "00:57:15", pace: "5:40 min/km", s5: "00:28:10", gender: "F" },
  // 21K
  { name: "Javier Mendoza Alanís", bib: "PSL-7100", distance: "21K", chip: "01:14:20", gun: "01:14:25", pace: "3:31 min/km", s5: "00:17:20", s10: "00:35:10", gender: "M" },
  { name: "Camila Navarro Ruiz", bib: "PSL-7240", distance: "21K", chip: "01:22:45", gun: "01:23:00", pace: "3:55 min/km", s5: "00:19:30", s10: "00:39:15", gender: "F" },
  { name: "Emiliano Soto Pineda", bib: "PSL-7380", distance: "21K", chip: "01:29:10", gun: "01:29:35", pace: "4:13 min/km", s5: "00:21:00", s10: "00:42:10", gender: "M" },
  { name: "Fernanda Ortiz Lara", bib: "PSL-7490", distance: "21K", chip: "01:38:50", gun: "01:39:20", pace: "4:41 min/km", s5: "00:23:15", s10: "00:46:40", gender: "F" },
];

/**
 * Obtiene la lista unificada de resultados oficiales para una carrera
 */
export async function getResultadosCarrera(raceId: string): Promise<{
  race: any;
  results: AthleteResult[];
}> {
  try {
    const race = await getRaceById(raceId);
    if (!race) {
      return { race: null, results: [] };
    }

    // Consultar inscripciones reales de la base de datos
    const dbRegistrations = await prisma.registration.findMany({
      where: {
        raceId: raceId,
        status: "CONFIRMED",
      },
      include: { user: true },
      orderBy: { registeredAt: "asc" },
    });

    const resultsList: AthleteResult[] = [];

    // 1. Agregar inscripciones reales de la base de datos
    dbRegistrations.forEach((reg, index) => {
      // Si ya tiene tiempo asignado lo usamos, si no le asignamos uno estelar
      const chipTime = reg.chipTime || "00:42:18";
      const gunTime = reg.gunTime || "00:42:35";
      const pace = reg.pace || "4:13 min/km";
      const split5k = reg.split5k || "00:20:55";

      resultsList.push({
        id: reg.id,
        bibNumber: reg.bibNumber || `PSL-${reg.id.slice(0, 4)}`,
        name: reg.user?.name || "Atleta Oficial",
        raceTitle: reg.raceTitle || race.title,
        distanceName: reg.distanceName || "10K",
        category: "Libre 20-39",
        gender: "M",
        overallRank: reg.overallRank || index + 4,
        genderRank: reg.genderRank || index + 3,
        categoryRank: reg.categoryRank || index + 2,
        chipTime,
        gunTime,
        pace,
        split5k,
        split10k: reg.split10k || (reg.distanceName?.includes("21") ? "00:42:18" : undefined),
        status: "FINISHER",
        isUserRegistration: true,
      });
    });

    // 2. Agregar competidores del pelotón para tener una tabla completa y podios
    DEMO_RUNNERS.forEach((demo, idx) => {
      resultsList.push({
        id: `demo-${idx}`,
        bibNumber: demo.bib,
        name: demo.name,
        raceTitle: race.title,
        distanceName: demo.distance,
        category: "Libre 20-39",
        gender: demo.gender,
        overallRank: idx + 1,
        genderRank: Math.ceil((idx + 1) / 2),
        categoryRank: Math.ceil((idx + 1) / 2),
        chipTime: demo.chip,
        gunTime: demo.gun,
        pace: demo.pace,
        split5k: demo.s5,
        split10k: demo.s10,
        status: "FINISHER",
        isUserRegistration: false,
      });
    });

    // Ordenar por tiempo de chip
    resultsList.sort((a, b) => a.chipTime.localeCompare(b.chipTime));

    // Reasignar posiciones generales
    resultsList.forEach((r, idx) => {
      r.overallRank = idx + 1;
    });

    return {
      race,
      results: resultsList,
    };
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    return { race: null, results: [] };
  }
}

/**
 * Permite al organizador registrar o simular tiempos oficiales en meta
 */
export async function registrarTiempoOficial(
  registrationId: string,
  data: {
    chipTime: string;
    gunTime: string;
    pace: string;
    split5k?: string;
  }
) {
  try {
    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        chipTime: data.chipTime,
        gunTime: data.gunTime,
        pace: data.pace,
        split5k: data.split5k,
        finishedAt: new Date(),
      },
    });

    return { success: true, updated };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
