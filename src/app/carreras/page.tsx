import { getAllRaces } from "@/lib/races";
import { CarrerasExplorer } from "@/components/carreras/CarrerasExplorer";
import { Sparkles, Trophy, Calendar } from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Explorador de Carreras y Maratones 2026 | Písale",
  description: "Encuentra tu próximo maratón, medio maratón o carrera de montaña en México. Inscríbete en segundos con pago seguro.",
};

export default async function CarrerasPage() {
  const races = await getAllRaces();

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-28 pt-32 sm:pt-36">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-violet-400/20 blur-[140px]" />
        <div className="absolute top-1/2 -left-20 h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-bold text-violet-700 backdrop-blur-md mb-4 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" /> Calendario Oficial de Eventos 2026
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-900">
            Encuentra tu próximo{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
              gran reto atlético
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Explora maratones urbanos, carreras de montaña y circuitos nocturnos. Asegura tu lugar con boleto digital instantáneo.
          </p>
        </div>

        {/* Explorador Interactivo con Filtros */}
        <CarrerasExplorer initialRaces={races} />
      </div>
    </div>
  );
}
