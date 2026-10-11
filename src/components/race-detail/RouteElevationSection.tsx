import { MapPin, Mountain, Flag, Droplets, Activity, Navigation, ArrowUpRight } from "lucide-react";
import type { Race } from "@/lib/mock-races";

export function RouteElevationSection({ race }: { race: Race }) {
  const profile = race.elevationProfile;
  const route = race.routeDetails;

  // Si hay puntos de elevación, generamos el path SVG
  const points = profile?.points || [2200, 2220, 2240, 2260, 2280, 2250, 2230, 2210, 2200];
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 100;

  // Calculamos coordenadas SVG (viewBox 0 0 800 240)
  const width = 800;
  const height = 240;
  const padding = 20;
  const usableHeight = height - padding * 2;

  const coords = points.map((val, idx) => {
    const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
    const normalizedY = (val - minVal) / range;
    const y = height - padding - normalizedY * usableHeight;
    return { x, y, val };
  });

  const linePath = coords.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-700 mb-2">
            <Navigation className="h-3 w-3" /> Circuito Oficial
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ruta y Perfil Altimétrico
          </h2>
        </div>
        {profile?.difficulty && (
          <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm self-start sm:self-auto">
            Dificultad: {profile.difficulty}
          </span>
        )}
      </div>

      {/* Grid de Métricas de la Ruta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:bg-white hover:shadow-md">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <Mountain className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Desnivel (+)</span>
          </div>
          <p className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
            {profile?.gain || race.elevation || "+150 m"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:bg-white hover:shadow-md">
          <div className="flex items-center gap-2 text-fuchsia-600 mb-1">
            <Activity className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cota Máxima</span>
          </div>
          <p className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
            {profile?.maxAlt || "2,285 m"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:bg-white hover:shadow-md">
          <div className="flex items-center gap-2 text-sky-600 mb-1">
            <Droplets className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Puestos Abasto</span>
          </div>
          <p className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
            {route?.hydrationPoints || 6} estaciones
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:bg-white hover:shadow-md">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Flag className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Superficie</span>
          </div>
          <p className="font-display text-base font-extrabold text-slate-900 truncate" title={route?.surface || "Asfalto certificado"}>
            {route?.surface || "Asfalto"}
          </p>
        </div>
      </div>

      {/* Gráfica de Altimetría Interactiva SVG */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-950 p-5 text-white shadow-inner mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Perfil de Elevación Altimétrico
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Salida ➔ Meta
          </span>
        </div>

        <div className="h-48 sm:h-56 w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="elevationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d946ef" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Grid horizontal de referencia */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />

            {/* Área sombreada */}
            <path d={areaPath} fill="url(#elevationGrad)" />

            {/* Línea del perfil */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#strokeGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Marcadores de puntos clave */}
            {coords.map((pt, i) => (
              <g key={i} className="group">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="fill-white stroke-fuchsia-600 stroke-2 transition-all hover:r-6"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Ejes y etiquetas */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-800 pt-2">
          <span>KM 0 · Salida ({profile?.minAlt || "2,240 m"})</span>
          <span className="hidden sm:inline">Punto más alto: {profile?.maxAlt || "2,285 m"}</span>
          <span>Meta · Fin del circuito</span>
        </div>
      </div>

      {/* Mapa Visual o Imagen de Satélite del Recorrido */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200">
        <div
          className="h-64 sm:h-80 w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${
              route?.routeMapUrl ||
              "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
            })`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600/90 backdrop-blur-md">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="font-bold text-sm leading-tight">Mapa oficial del trazado</p>
              <p className="text-xs text-white/70">Avalado y cerrado al tránsito vehicular</p>
            </div>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(race.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur-md transition-colors hover:bg-white/30"
          >
            Ver en Google Maps
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
