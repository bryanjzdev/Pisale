"use client";

import { useRef, useState, type MouseEvent } from "react";
import { MapPin, Heart, ArrowUpRight, Mountain, Users } from "lucide-react";
import type { Race } from "@/lib/mock-races";

const TONES = {
  hot: { badge: "bg-rose-500/90 text-white", dot: "bg-white" },
  open: { badge: "bg-emerald-500/90 text-white", dot: "bg-white" },
  early: { badge: "bg-white/90 text-violet-700", dot: "bg-violet-500" },
} as const;

const CATEGORY_LABEL = { ruta: "Ruta", trail: "Trail", nocturna: "Nocturna" } as const;

export function RaceCard({ race, index = 0 }: { race: Race; index?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const percent = Math.round((race.spotsTaken / race.spotsTotal) * 100);
  const tone = TONES[race.status.tone];

  // Tilt 3D + spotlight que sigue al cursor
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="animate-fade-up [perspective:1200px]" style={{ animationDelay: `${index * 90}ms` }}>
      <article
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative flex h-full flex-col rounded-[1.75rem] border border-white bg-white/80 p-2 shadow-[0_8px_30px_-12px_rgba(76,29,149,0.18)] backdrop-blur-xl transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_30px_60px_-20px_rgba(162,28,175,0.35)]"
        style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))", transformStyle: "preserve-3d" }}
      >
        {/* Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(217,70,239,0.10), transparent 45%)" }}
        />

        {/* Imagen */}
        <div className="relative h-56 overflow-hidden rounded-[1.35rem] bg-linear-to-br from-violet-300 via-fuchsia-300 to-orange-200">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${race.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-violet-950/70 via-violet-950/10 to-transparent" />

          {/* Fecha */}
          <div className="absolute left-3 top-3 flex flex-col items-center rounded-2xl bg-white/90 px-3 py-1.5 text-center shadow-lg backdrop-blur-md" style={{ transform: "translateZ(30px)" }}>
            <span className="font-display text-2xl font-extrabold leading-none text-slate-900">{race.day}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-600">{race.month}</span>
          </div>

          {/* Status + like */}
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-lg backdrop-blur-md ${tone.badge}`}>
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${tone.dot}`} />
              {race.status.label}
            </span>
            <button
              onClick={() => setLiked((v) => !v)}
              aria-label="Guardar carrera"
              className="relative z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-90"
            >
              <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
            </button>
          </div>

          {/* Chips inferiores */}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              {race.distances.map((d) => (
                <span key={d} className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 font-display text-xs font-bold text-white backdrop-blur-md">
                  {d}
                </span>
              ))}
            </div>
            {race.elevation && (
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                <Mountain className="h-3 w-3" /> {race.elevation}
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
          <span className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-500">
            {CATEGORY_LABEL[race.category]} · {race.year}
          </span>
          <h3 className="font-display text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-violet-700">
            {race.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <MapPin className="h-4 w-4 text-fuchsia-500" /> {race.location}
          </p>

          {/* Cupo */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-500">
                <Users className="h-3.5 w-3.5" /> {race.spotsTaken.toLocaleString("es-MX")} inscritos
              </span>
              <span className={percent >= 90 ? "text-rose-600" : "text-slate-700"}>{percent}% lleno</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-[length:200%_100%] animate-shimmer"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-end justify-between border-t border-dashed border-slate-200 pt-4">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Desde</span>
              <span className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
                ${race.price.toLocaleString("es-MX")}
                <span className="ml-1 text-xs font-semibold text-slate-400">MXN</span>
              </span>
            </div>
            <button
              id={`race-cta-${race.id}`}
              className="btn-shine relative z-20 flex h-11 items-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 pl-5 pr-1.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all duration-300 hover:shadow-fuchsia-500/45"
            >
              Inscribirme
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
