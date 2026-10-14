"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Download,
  Share2,
  Sparkles,
  Trophy,
  Flame,
  Check,
  Loader2,
  Palette,
  Calendar,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export type RunnerStoryData = {
  runnerName: string;
  bibNumber: string;
  raceTitle: string;
  distanceName: string;
  raceDate: string;
  raceLocation: string;
  category?: string;
};

const THEMES = [
  {
    id: "cyber",
    name: "Cyber Neón",
    bgClass: "from-slate-950 via-slate-900 to-violet-950",
    accentGrad: "from-violet-500 via-fuchsia-500 to-orange-500",
    bibBg: "bg-white text-slate-900",
    bibBorder: "border-violet-400",
    bibNumberColor: "text-violet-600",
    glowColor: "rgba(168, 85, 247, 0.35)",
  },
  {
    id: "sunset",
    name: "Atardecer Fuego",
    bgClass: "from-slate-950 via-neutral-900 to-orange-950",
    accentGrad: "from-amber-400 via-orange-500 to-rose-600",
    bibBg: "bg-white text-slate-900",
    bibBorder: "border-orange-400",
    bibNumberColor: "text-orange-600",
    glowColor: "rgba(249, 115, 22, 0.35)",
  },
  {
    id: "volt",
    name: "Volt Eléctrico",
    bgClass: "from-slate-950 via-zinc-900 to-emerald-950",
    accentGrad: "from-emerald-400 via-teal-400 to-cyan-500",
    bibBg: "bg-white text-slate-900",
    bibBorder: "border-emerald-400",
    bibNumberColor: "text-emerald-600",
    glowColor: "rgba(16, 185, 129, 0.35)",
  },
];

export function RunnerStoryGenerator({ data }: { data: RunnerStoryData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const firstName = data.runnerName.split(" ")[0].toUpperCase();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      // Forzar escala para que quede en alta resolución HD (ideal para Instagram Story)
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `pisale-story-${data.bibNumber || "runner"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al generar imagen de Story:", err);
      alert("No se pudo generar la imagen. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `pisale-story-${data.bibNumber}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `¡Inscrito a ${data.raceTitle}!`,
          text: `¡Nos vemos en la meta con mi dorsal ${data.bibNumber}! Regístrate en Písale.`,
        });
      } else {
        // Fallback a descarga si no soporta Web Share API de archivos
        handleDownload();
      }
    } catch (err) {
      console.error("Error compartiendo imagen:", err);
      handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-5xl mx-auto py-6">
      
      {/* Visualizador de la Tarjeta Story (Formato 9:16) */}
      <div className="relative group shrink-0">
        <div
          ref={cardRef}
          style={{
            boxShadow: `0 30px 80px -15px ${selectedTheme.glowColor}`,
          }}
          className={`relative w-[340px] sm:w-[380px] h-[604px] sm:h-[675px] rounded-[2.5rem] bg-gradient-to-b ${selectedTheme.bgClass} p-6 sm:p-7 flex flex-col justify-between overflow-hidden border border-white/15 select-none transition-all duration-500`}
        >
          {/* Luces y texturas de fondo */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            <div
              className={`absolute top-1/2 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-gradient-to-tr ${selectedTheme.accentGrad}`}
            />
            {/* Patrón de líneas deportivas sutiles */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Encabezado del Story */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-display font-black text-xs shadow-md">
                  P
                </span>
                <span className="font-display font-black text-xs tracking-wider text-white uppercase">
                  PÍSALE · PASAPORTE OFICIAL
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-white/90 backdrop-blur-md border border-white/15">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>CONFIRMADO</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/70 block">
                ¡RETADOR EN PISTA!
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mt-0.5">
                {firstName} ESTÁ LISTO
              </h2>
            </div>
          </div>

          {/* DORSAL DE CARRERA 3D (CENTRO) */}
          <div className="relative z-10 my-auto">
            <div
              className={`relative rounded-3xl ${selectedTheme.bibBg} p-5 sm:p-6 shadow-2xl border-4 ${selectedTheme.bibBorder} transform transition-transform hover:scale-[1.02]`}
            >
              {/* Orificios / Perforaciones de imperdibles en esquinas */}
              <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-slate-900/20 border border-slate-900/40" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-slate-900/20 border border-slate-900/40" />
              <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-slate-900/20 border border-slate-900/40" />
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-slate-900/20 border border-slate-900/40" />

              {/* Título del evento en el dorsal */}
              <div className="text-center border-b border-slate-200 pb-2 mb-2">
                <span className="font-display font-black text-[11px] sm:text-xs text-slate-800 uppercase tracking-wider block truncate">
                  {data.raceTitle}
                </span>
              </div>

              {/* Número de Dorsal Gigante */}
              <div className="text-center py-1 sm:py-2">
                <span
                  className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${selectedTheme.bibNumberColor} block`}
                >
                  {data.bibNumber}
                </span>
                <span className="font-display font-black text-xs sm:text-sm text-slate-900 tracking-wider uppercase block mt-1">
                  {data.runnerName}
                </span>
              </div>

              {/* Badge de Distancia */}
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-black uppercase text-slate-600">
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-md">
                  CATEGORÍA LIBRE
                </span>
                <span
                  className={`bg-gradient-to-r ${selectedTheme.accentGrad} text-white px-3 py-0.5 rounded-full shadow-xs`}
                >
                  {data.distanceName}
                </span>
              </div>
            </div>

            {/* Medalla Virtual Flotante */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-2.5 border border-white/15 backdrop-blur-md text-white text-center">
              <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wide">
                OBJETIVO: CRUZAR LA META 2026 🏁
              </span>
            </div>
          </div>

          {/* Pie de la Tarjeta Story */}
          <div className="relative z-10 space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2 text-[10px] text-white/90">
              <div className="flex items-center gap-1.5 bg-black/30 rounded-xl p-2 border border-white/10">
                <Calendar className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                <span className="font-bold truncate">{data.raceDate}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 rounded-xl p-2 border border-white/10">
                <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span className="font-bold truncate">{data.raceLocation}</span>
              </div>
            </div>

            {/* Watermark de Marca */}
            <div className="flex items-center justify-between text-[10px] text-white/60 pt-2 border-t border-white/10">
              <span className="font-bold">#PisaleAtleta</span>
              <span className="font-mono tracking-widest uppercase">
                pisale.mx
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Controles y Descarga */}
      <div className="flex-1 max-w-md w-full space-y-6 text-slate-900">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Formato 9:16 para Instagram & TikTok Stories</span>
          </div>
          <h2 className="font-display text-3xl font-black text-slate-900">
            Presume tu Inscripción Oficial
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Genera una tarjeta de alta definición con tu número de dorsal, distancia y medalla virtual lista para compartir con amigos o guardar en tu carrete.
          </p>
        </div>

        {/* Selector de Temas Visuales */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Estilo Visual
          </label>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                  selectedTheme.id === theme.id
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <div
                  className={`h-2.5 w-full rounded-full bg-gradient-to-r ${theme.accentGrad} mb-1.5`}
                />
                <span>{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 p-4 text-sm font-black text-white shadow-xl shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-75"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generando imagen HD...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Descargar Imagen HD para Stories</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4 text-violet-600" />
            <span>Compartir Directo (Móvil / Instagram / WhatsApp)</span>
          </button>
        </div>

        <div className="rounded-2xl bg-violet-50/70 p-4 border border-violet-100 text-xs text-violet-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span>Tip para Corredores:</span>
          </div>
          <p className="text-violet-700/90 text-[11px] leading-relaxed">
            Súbela a tus Stories de Instagram y etiqueta a <strong>@pisalemx</strong> para salir en el muro de retadores destacados de la carrera.
          </p>
        </div>
      </div>

    </div>
  );
}
