import { prisma } from "@/lib/db";
import { MOCK_RACES, type Race, type RaceCategory } from "@/lib/mock-races";

/**
 * Obtiene la información completa de una carrera por su identificador.
 * Intenta consultar Prisma primero; si no se encuentra o la base de datos no está disponible,
 * recurre al catálogo en memoria (MOCK_RACES).
 */
export async function getRaceById(id: string): Promise<Race | null> {
  try {
    const dbRace = await prisma.race.findUnique({
      where: { id },
      include: {
        distances: true,
        organization: true,
      },
    });

    if (dbRace) {
      const date = new Date(dbRace.date);
      const day = date.getDate().toString().padStart(2, "0");
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const month = months[date.getMonth()];
      const year = date.getFullYear().toString();

      const category = (dbRace.category.toLowerCase() as RaceCategory) || "ruta";
      const distances = dbRace.distances.map((d) => d.name);
      const minPrice = dbRace.distances.length > 0 ? Math.min(...dbRace.distances.map((d) => d.price)) : 500;
      const spotsTaken = dbRace.distances.reduce((acc, d) => acc + d.currentParticipants, 0);
      const spotsTotal = dbRace.distances.reduce((acc, d) => acc + d.maxParticipants, 0) || 1000;

      // Buscar si tenemos datos mockeados adicionales para enriquecer la experiencia visual
      const mockMatch = MOCK_RACES.find((m) => m.id === id || m.title.toLowerCase() === dbRace.title.toLowerCase());

      // Cálculo inteligente de ruta y puestos de abasto según distancias y categoría
      const maxDistanceKm = distances.reduce((max, d) => {
        const parsed = parseInt(d.replace(/\D/g, ""));
        return parsed > max ? parsed : max;
      }, 10);

      const calculatedHydrationPoints = Math.max(2, Math.round(maxDistanceKm / 2.5));
      const calculatedGain = category === "trail" ? "+420 m" : category === "nocturna" ? "+60 m" : "+95 m";
      const calculatedMaxAlt = category === "trail" ? "2,740 m" : "2,240 m";
      const calculatedSurface = dbRace.surface || (category === "trail" ? "Senderos y Montaña" : "Asfalto certificado");
      const startPointName = dbRace.startPoint || dbRace.location;

      const dynamicElevationProfile = {
        gain: calculatedGain,
        minAlt: "2,200 m",
        maxAlt: calculatedMaxAlt,
        difficulty: (category === "trail" ? "Alta" : "Fácil") as "Fácil" | "Moderada" | "Alta" | "Técnica",
        points: category === "trail"
          ? [2200, 2380, 2560, 2740, 2520, 2340, 2410, 2200]
          : [2200, 2215, 2235, 2240, 2230, 2220, 2210, 2200],
      };

      const dynamicRouteDetails = {
        surface: calculatedSurface,
        hydrationPoints: calculatedHydrationPoints,
        medicalStations: Math.max(1, Math.round(calculatedHydrationPoints / 2)),
        pacers: ["Pacers oficiales de ritmo"],
        gpxUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(startPointName + " " + dbRace.location)}`,
      };

      return {
        id: dbRace.id,
        title: dbRace.title,
        day,
        month,
        year,
        location: dbRace.location,
        imageUrl: dbRace.imageUrl || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
        price: minPrice,
        category,
        distances: distances.length > 0 ? distances : ["10K", "21K"],
        status: {
          label: spotsTaken / spotsTotal > 0.85 ? "Últimos lugares" : "Inscripciones abiertas",
          tone: spotsTaken / spotsTotal > 0.85 ? "hot" : "open",
        },
        spotsTaken,
        spotsTotal,
        elevation: mockMatch?.elevation || calculatedGain,
        description: mockMatch?.description || "Vive una experiencia atlética inolvidable con cronometraje oficial y medalla conmemorativa.",
        startTime: mockMatch?.startTime || "07:00 hrs",
        deadline: mockMatch?.deadline || "3 días antes del evento - 23:59",
        expo: mockMatch?.expo,
        distanceOptions: dbRace.distances.map((d) => ({
          id: d.id,
          name: d.name,
          price: d.price,
          spotsAvailable: Math.max(0, d.maxParticipants - d.currentParticipants),
          maxSpots: d.maxParticipants,
        })),
        elevationProfile: mockMatch?.elevationProfile || dynamicElevationProfile,
        routeDetails: mockMatch?.routeDetails || dynamicRouteDetails,
        startPoint: dbRace.startPoint || startPointName,
        endPoint: dbRace.endPoint || "Mismo punto de salida (Circuito cerrado)",
        surface: calculatedSurface,
        kitItems: mockMatch?.kitItems,
        organizer: {
          name: dbRace.organization?.name || "Organización Pisale",
          verified: true,
        },
      };
    }
  } catch (error) {
    // Si la BD no está configurada o falla la conexión, caemos transparentemente a los datos locales
    // console.warn("Prisma query fallback to mock races:", error);
  }

  // Fallback a los datos mockeados
  const mock = MOCK_RACES.find((r) => r.id === id);
  return mock || null;
}

export async function getAllRaces(): Promise<Race[]> {
  try {
    const dbRaces = await prisma.race.findMany({
      include: { distances: true, organization: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbRaces.length > 0) {
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      
      const mappedDbRaces: Race[] = dbRaces.map((dbRace) => {
        const date = new Date(dbRace.date);
        const day = date.getDate().toString().padStart(2, "0");
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const category = (dbRace.category.toLowerCase() as RaceCategory) || "ruta";
        const distances = dbRace.distances.map((d) => d.name);
        const minPrice = dbRace.distances.length > 0 ? Math.min(...dbRace.distances.map((d) => d.price)) : 500;
        const spotsTaken = dbRace.distances.reduce((acc, d) => acc + d.currentParticipants, 0);
        const spotsTotal = dbRace.distances.reduce((acc, d) => acc + d.maxParticipants, 0) || 1000;

        return {
          id: dbRace.id,
          title: dbRace.title,
          day,
          month,
          year,
          location: dbRace.location,
          imageUrl: dbRace.imageUrl || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
          price: minPrice,
          category,
          distances: distances.length > 0 ? distances : ["10K", "21K"],
          status: {
            label: spotsTaken / spotsTotal > 0.85 ? "Últimos lugares" : "Inscripciones abiertas",
            tone: spotsTaken / spotsTotal > 0.85 ? "hot" : "open",
          },
          spotsTaken,
          spotsTotal,
          elevation: "+120 m",
          distanceOptions: dbRace.distances.map((d) => ({
            id: d.id,
            name: d.name,
            price: d.price,
            spotsAvailable: Math.max(0, d.maxParticipants - d.currentParticipants),
            maxSpots: d.maxParticipants,
          })),
        };
      });

      // Retornar las carreras creadas en la base de datos seguidas del catálogo
      return [...mappedDbRaces, ...MOCK_RACES];
    }
  } catch (err) {
    console.error("Error fetching db races in getAllRaces:", err);
  }
  return MOCK_RACES;
}
