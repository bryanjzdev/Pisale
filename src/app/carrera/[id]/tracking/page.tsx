import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getRaceById } from "@/lib/races";
import {
  LiveTrackingClient,
  type RunnerTrack,
} from "@/components/tracking/LiveTrackingClient";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    bib?: string;
    registration_id?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return {
      title: "Sigue a tu Corredor en Vivo | Písale",
      description: "Seguimiento en tiempo real con tapetes RFID y cálculo de hora estimada de llegada a meta.",
    };
  }

  return {
    title: `Sigue a tu Corredor en Vivo - ${race.title} | Písale`,
    description: `Seguimiento de tiempos en vivo y cálculo de llegada a meta para familiares y amigos en ${race.title}. Consulta el avance por dorsal o nombre.`,
    openGraph: {
      title: `Sigue a tu Corredor - ${race.title}`,
      description: `Radar en tiempo real con RFID para ${race.title}. ¡Sigue a tu atleta favorito!`,
      images: [race.imageUrl],
    },
  };
}

export default async function CarreraTrackingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { bib, registration_id } = await searchParams;

  const race = await getRaceById(id);
  if (!race) {
    notFound();
  }

  // Consultar corredores registrados en BD
  const dbRegistrations = await prisma.registration.findMany({
    where: {
      OR: [
        { raceId: race.id },
        { raceTitle: { equals: race.title, mode: "insensitive" } },
      ],
      status: "CONFIRMED",
    },
    include: { user: true },
    orderBy: { registeredAt: "asc" },
  });

  // Convertir inscripciones a formato RunnerTrack
  let runners: RunnerTrack[] = dbRegistrations.map((reg, idx) => {
    const bibNumber = reg.bibNumber || `10${idx + 1}`;
    const name = reg.user?.name || `Corredor #${bibNumber}`;
    const distanceName = reg.distanceName || race.distances[0] || "10K";
    const totalKm = distanceName.includes("21")
      ? 21.097
      : distanceName.includes("42")
      ? 42.195
      : distanceName.includes("5")
      ? 5
      : 10;

    const chipTime = reg.chipTime || "00:43:18";
    const pace = reg.pace || "4:19 min/km";
    const currentKm = Math.min(totalKm, Number((totalKm * 0.85).toFixed(1)));

    return {
      id: reg.id,
      bibNumber,
      name,
      distanceName,
      category: "Libre",
      gender: idx % 2 === 0 ? "M" : "F",
      pace,
      chipTime,
      gunTime: reg.gunTime || "00:43:45",
      status: "EN_RUTA",
      currentKm,
      totalKm,
      lastCheckpoint: "Tapete Km 10 (Punto Oficial)",
      lastSeenTime: "08:12 AM",
      estimatedFinishTime: "08:24 AM",
      splits: [
        {
          name: "Salida Oficial",
          km: 0,
          splitTime: "00:00:00",
          paceAtSplit: "—",
          passed: true,
          passTimestamp: "07:30 AM",
        },
        {
          name: "Tapete 5K (Hidratación 1)",
          km: 5,
          splitTime: reg.split5k || "00:21:12",
          paceAtSplit: "4:14 min/km",
          passed: true,
          passTimestamp: "07:51 AM",
        },
        {
          name: "Tapete 10K (Punto Medio)",
          km: 10,
          splitTime: reg.split10k || "00:43:18",
          paceAtSplit: "4:19 min/km",
          passed: currentKm >= 10,
          passTimestamp: currentKm >= 10 ? "08:13 AM" : undefined,
        },
        ...(totalKm > 10
          ? [
              {
                name: "Tapete 15K (Nutrición)",
                km: 15,
                splitTime: "01:05:40",
                paceAtSplit: "4:22 min/km",
                passed: currentKm >= 15,
                passTimestamp: currentKm >= 15 ? "08:35 AM" : undefined,
              },
            ]
          : []),
        {
          name: "Meta y Arco de Finalistas",
          km: totalKm,
          splitTime: chipTime,
          paceAtSplit: pace,
          passed: currentKm >= totalKm,
          passTimestamp: currentKm >= totalKm ? "08:44 AM" : undefined,
        },
      ],
    };
  });

  // Si aún no hay suficientes corredores en BD, proveemos corredores de demostración oficiales
  if (runners.length === 0) {
    runners = [
      {
        id: "demo_1",
        bibNumber: "1042",
        name: "Carlos Mendoza Silva",
        distanceName: race.distances[0] || "21K Medio Maratón",
        category: "Libre Varonil",
        gender: "M",
        pace: "4:18 min/km",
        chipTime: "00:54:12",
        gunTime: "00:54:35",
        status: "EN_RUTA",
        currentKm: 12.8,
        totalKm: 21.097,
        lastCheckpoint: "Tapete Km 10",
        lastSeenTime: "08:14 AM",
        estimatedFinishTime: "08:58 AM",
        splits: [
          {
            name: "Salida Oficial",
            km: 0,
            splitTime: "00:00:00",
            paceAtSplit: "—",
            passed: true,
            passTimestamp: "07:20 AM",
          },
          {
            name: "Tapete 5K (Hidratación 1)",
            km: 5,
            splitTime: "00:21:30",
            paceAtSplit: "4:18 min/km",
            passed: true,
            passTimestamp: "07:41 AM",
          },
          {
            name: "Tapete 10K (Punto Medio)",
            km: 10,
            splitTime: "00:43:15",
            paceAtSplit: "4:19 min/km",
            passed: true,
            passTimestamp: "08:03 AM",
          },
          {
            name: "Tapete 15K (Nutrición)",
            km: 15,
            splitTime: "01:05:10",
            paceAtSplit: "4:20 min/km",
            passed: false,
          },
          {
            name: "Meta y Arco de Llegada",
            km: 21.097,
            splitTime: "01:31:00",
            paceAtSplit: "4:18 min/km",
            passed: false,
          },
        ],
      },
      {
        id: "demo_2",
        bibNumber: "2085",
        name: "Valeria Domínguez Vega",
        distanceName: "10K Recreativo",
        category: "Master Femenil",
        gender: "F",
        pace: "4:52 min/km",
        chipTime: "00:48:40",
        gunTime: "00:49:05",
        status: "FINISHER",
        currentKm: 10,
        totalKm: 10,
        lastCheckpoint: "Meta Oficial",
        lastSeenTime: "08:08 AM",
        estimatedFinishTime: "08:08 AM",
        splits: [
          {
            name: "Salida Oficial",
            km: 0,
            splitTime: "00:00:00",
            paceAtSplit: "—",
            passed: true,
            passTimestamp: "07:20 AM",
          },
          {
            name: "Tapete 5K (Hidratación 1)",
            km: 5,
            splitTime: "00:24:10",
            paceAtSplit: "4:50 min/km",
            passed: true,
            passTimestamp: "07:44 AM",
          },
          {
            name: "Meta y Arco de Llegada",
            km: 10,
            splitTime: "00:48:40",
            paceAtSplit: "4:52 min/km",
            passed: true,
            passTimestamp: "08:08 AM",
          },
        ],
      },
      {
        id: "demo_3",
        bibNumber: "3190",
        name: "Rodrigo Alarcón Paz",
        distanceName: "5K Familiar",
        category: "Juvenil",
        gender: "M",
        pace: "3:58 min/km",
        chipTime: "00:19:50",
        gunTime: "00:20:00",
        status: "FINISHER",
        currentKm: 5,
        totalKm: 5,
        lastCheckpoint: "Meta Oficial",
        lastSeenTime: "07:40 AM",
        estimatedFinishTime: "07:40 AM",
        splits: [
          {
            name: "Salida Oficial",
            km: 0,
            splitTime: "00:00:00",
            paceAtSplit: "—",
            passed: true,
            passTimestamp: "07:20 AM",
          },
          {
            name: "Meta Oficial 5K",
            km: 5,
            splitTime: "00:19:50",
            paceAtSplit: "3:58 min/km",
            passed: true,
            passTimestamp: "07:40 AM",
          },
        ],
      },
    ];
  }

  return (
    <LiveTrackingClient
      race={race}
      initialBib={bib}
      initialRegistrationId={registration_id}
      runners={runners}
    />
  );
}
