import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, BadgeCheck, Sparkles, Mountain, Share2 } from "lucide-react";
import type { Race } from "@/lib/mock-races";

const TONES = {
  hot: { badge: "bg-rose-500 text-white", dot: "bg-white", glow: "shadow-rose-500/30" },
  open: { badge: "bg-emerald-500 text-white", dot: "bg-white", glow: "shadow-emerald-500/30" },
  early: { badge: "bg-violet-600 text-white", dot: "bg-white", glow: "shadow-violet-500/30" },
} as const;

const CATEGORY_LABEL = { ruta: "Ruta", trail: "Trail", nocturna: "Nocturna" } as const;

export function RaceHero({ race }: { race: Race }) {
  const tone = TONES[race.status.tone] || TONES.open;

  return (
    <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 text-white selection:bg-fuchsia-500 selection:text-white">
      {/* Background Image con overlay de gradientes cinematográficos */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${race.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d071a] via-[#0d071a]/85 to-[#0d071a]/40" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0d071a]/95 via-[#0d071a]/60 to-transparent" />
        
        {/* Glows de ambiente */}
        <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-fuchsia-600/25 blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Barra superior de navegación / breadcrumbs */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/#carreras"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Volver a todas las carreras</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Boleto Digital Instantáneo
            </span>
          </div>
        </div>

        {/* Contenido del Hero */}
        <div className="max-w-4xl">
          {/* Badges de categoría y estado */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-violet-200 backdrop-blur-md">
              {CATEGORY_LABEL[race.category]} · {race.year}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-lg backdrop-blur-md ${tone.badge} ${tone.glow}`}>
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${tone.dot}`} />
              {race.status.label}
            </span>
            {race.elevation && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                <Mountain className="h-3.5 w-3.5 text-fuchsia-300" />
                {race.elevation} desnivel
              </span>
            )}
          </div>

          {/* Título de la carrera */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-sm">
            {race.title}
          </h1>

          {/* Breve descripción si existe */}
          {race.description && (
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-3xl font-medium leading-relaxed">
              {race.description}
            </p>
          )}

          {/* Metadatos principales en píldoras con iconos */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            {/* Fecha */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl transition-all hover:bg-white/15">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/30 text-violet-300 border border-violet-400/30">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white/60">Fecha</span>
                <span className="text-sm font-bold text-white leading-tight">
                  {race.day} {race.month} {race.year}
                </span>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl transition-all hover:bg-white/15">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-400/30">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white/60">Ubicación</span>
                <span className="text-sm font-bold text-white truncate max-w-[130px] block leading-tight" title={race.location}>
                  {race.location}
                </span>
              </div>
            </div>

            {/* Hora de arranque */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl transition-all hover:bg-white/15">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/30 text-amber-300 border border-amber-400/30">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white/60">Arranque</span>
                <span className="text-sm font-bold text-white leading-tight">
                  {race.startTime || "07:00 hrs"}
                </span>
              </div>
            </div>

            {/* Organizador */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl transition-all hover:bg-white/15">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white/60">Organizador</span>
                <span className="text-sm font-bold text-white truncate max-w-[130px] block leading-tight">
                  {race.organizer?.name || "Oficial Písale"}
                </span>
              </div>
            </div>
          </div>

          {/* Chips de distancias disponibles */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 mr-1">
              Distancias disponibles:
            </span>
            {race.distances.map((dist) => (
              <span
                key={dist}
                className="rounded-full border border-violet-400/40 bg-violet-500/20 px-3.5 py-1 font-display text-sm font-bold text-white backdrop-blur-md shadow-sm"
              >
                {dist}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
