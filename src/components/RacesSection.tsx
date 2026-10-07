"use client";

import { useState } from "react";
import { ArrowRight, Route, Mountain, Moon, LayoutGrid } from "lucide-react";
import { MOCK_RACES, type RaceCategory } from "@/lib/mock-races";
import { RaceCard } from "@/components/RaceCard";

const FILTERS: { id: "todas" | RaceCategory; label: string; icon: typeof Route }[] = [
  { id: "todas", label: "Todas", icon: LayoutGrid },
  { id: "ruta", label: "Ruta", icon: Route },
  { id: "trail", label: "Trail", icon: Mountain },
  { id: "nocturna", label: "Nocturnas", icon: Moon },
];

export function RacesSection() {
  const [active, setActive] = useState<(typeof FILTERS)[number]["id"]>("todas");
  const races = active === "todas" ? MOCK_RACES : MOCK_RACES.filter((r) => r.category === active);

  return (
    <section id="carreras" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-4 py-28">
      <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Temporada 2026–27
          </span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Tu próxima <span className="text-brand">meta</span> te espera.
          </h2>
          <p className="mt-4 text-lg font-medium text-slate-500">
            Los eventos más esperados de México, con inscripción en menos de un minuto.
          </p>
        </div>

        {/* Filtros segmentados */}
        <div className="flex flex-wrap gap-1 rounded-full border border-slate-200/80 bg-white/70 p-1 shadow-sm backdrop-blur-xl">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              id={`filter-${f.id}`}
              onClick={() => setActive(f.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                active === f.id
                  ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <f.icon className="h-4 w-4" /> {f.label}
            </button>
          ))}
        </div>
      </div>

      <div key={active} className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {races.map((race, i) => (
          <RaceCard key={race.id} race={race} index={i} />
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <button
          id="races-view-all"
          className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-violet-300 hover:text-violet-700 hover:shadow-md"
        >
          Ver calendario completo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
