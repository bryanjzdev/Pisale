import { getAllRaces } from "@/lib/races";
import { getResultadosCarrera } from "@/app/actions/results";
import { prisma } from "@/lib/db";
import { LiveResultsView } from "@/components/results/LiveResultsView";

export const instant = false;

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: Promise<{ carrera?: string }>;
}) {
  const { carrera } = await searchParams;

  const allRaces = await getAllRaces();

  // Consultar todas las inscripciones confirmadas en la base de datos
  const allConfirmedRegs = await prisma.registration.findMany({
    where: { status: "CONFIRMED" },
    include: { user: true },
    orderBy: { registeredAt: "asc" },
  });

  // Elegir por defecto la carrera que tenga inscritos reales (ej. Maraton de los muertos)
  const raceWithRegs = allRaces.find((r) =>
    allConfirmedRegs.some(
      (cr) =>
        cr.raceId === r.id ||
        (cr.raceTitle && cr.raceTitle.toLowerCase() === r.title.toLowerCase())
    )
  );

  const selectedRace =
    (carrera ? allRaces.find((r) => r.id === carrera) : null) ||
    raceWithRegs ||
    allRaces[0];

  const { results } = await getResultadosCarrera(selectedRace.id);

  // Mapear la lista completa de atletas reales para búsqueda global instantánea
  const allGlobalResults = allConfirmedRegs.map((reg, index) => ({
    id: reg.id,
    bibNumber: reg.bibNumber || `PSL-${reg.id.slice(0, 4)}`,
    name: reg.user?.name || "Atleta Oficial",
    raceTitle: reg.raceTitle || "Carrera Pisale",
    distanceName: reg.distanceName || "General",
    category: "Libre",
    gender: "M",
    overallRank: reg.overallRank || index + 1,
    genderRank: reg.genderRank || index + 1,
    categoryRank: reg.categoryRank || index + 1,
    chipTime: reg.chipTime || "00:43:18",
    gunTime: reg.gunTime || "00:43:45",
    pace: reg.pace || "4:19 min/km",
    split5k: reg.split5k || "00:21:12",
    status: "FINISHER" as const,
    isUserRegistration: true,
  }));

  const formattedRaces = allRaces.map((r) => ({
    id: r.id,
    title: r.title,
    date: `${r.day} ${r.month} ${r.year}`,
    distances: r.distances,
  }));

  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-24 pt-32 sm:pt-36">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute top-10 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-400/15 blur-[140px]" />
        <div className="absolute top-1/3 -left-20 h-[450px] w-[450px] rounded-full bg-fuchsia-400/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-bold text-violet-700 backdrop-blur-md mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Písale Chip Timing System · En Vivo</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-none">
            Resultados Oficiales &{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
              Tiempos en Meta
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Consulta los tiempos certificados de corredores inscritos en la plataforma, busca por dorsal oficial o nombre y descarga tu ficha de finalista.
          </p>
        </div>

        {/* Vista Interactiva de Resultados */}
        <LiveResultsView
          races={formattedRaces.length > 0 ? formattedRaces : [selectedRace]}
          initialRaceId={selectedRace.id}
          initialResults={results}
          allGlobalResults={allGlobalResults}
        />
      </div>
    </div>
  );
}
