import { getAllRaces } from "@/lib/races";
import { getResultadosCarrera } from "@/app/actions/results";
import { LiveResultsView } from "@/components/results/LiveResultsView";
import { Timer, Sparkles, Trophy } from "lucide-react";

export const instant = false;

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: Promise<{ carrera?: string }>;
}) {
  const { carrera } = await searchParams;

  const allRaces = await getAllRaces();
  const selectedRace =
    (carrera ? allRaces.find((r) => r.id === carrera) : null) ||
    allRaces[0] || {
      id: "demo-race",
      title: "Maratón de los Muertos",
      distances: ["10K", "21K"],
    };

  const { results } = await getResultadosCarrera(selectedRace.id);

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
            Consulta tus tiempos certificados, ritmo promedio por kilómetro, posiciones por categoría y descarga tu certificado oficial de finalista.
          </p>
        </div>

        {/* Vista Interactiva de Resultados */}
        <LiveResultsView
          races={formattedRaces.length > 0 ? formattedRaces : [selectedRace]}
          initialRaceId={selectedRace.id}
          initialResults={results}
        />
      </div>
    </div>
  );
}
