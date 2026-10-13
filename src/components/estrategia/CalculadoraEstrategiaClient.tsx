"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Timer,
  Printer,
  ArrowLeft,
  Sparkles,
  Zap,
  TrendingDown,
  TrendingUp,
  Activity,
  Droplets,
  Share2,
  Check,
  Flame,
  Info,
  Sliders,
  Scissors,
  Clock,
  MapPin,
  Calendar,
  Compass,
  Trophy,
} from "lucide-react";

export interface CalculadoraEstrategiaProps {
  race: {
    id: string;
    title: string;
    day: string;
    month: string;
    year: string;
    location: string;
    category?: string;
    startTime?: string;
    distances: string[];
    startPoint?: string;
    endPoint?: string;
    elevationProfile?: {
      gain: string;
      minAlt: string;
      maxAlt: string;
      difficulty: string;
    };
    routeDetails?: {
      surface?: string;
      hydrationPoints?: number;
      medicalStations?: number;
    };
  };
  runner?: {
    name?: string;
    bibNumber?: string;
    distance?: string;
    registrationId?: string;
  };
}

type StrategyType = "negative" | "even" | "positive";

export function CalculadoraEstrategiaClient({
  race,
  runner,
}: CalculadoraEstrategiaProps) {
  // Distancia seleccionada
  const [selectedDistance, setSelectedDistance] = useState<string>(() => {
    if (runner?.distance && race.distances.includes(runner.distance)) {
      return runner.distance;
    }
    return race.distances[0] || "10K";
  });

  // Convertir distancia en kilómetros numéricos
  const totalKm = useMemo(() => {
    const raw = selectedDistance.toLowerCase();
    if (raw.includes("42") || raw.includes("maratón") || raw.includes("maraton")) return 42.195;
    if (raw.includes("21") || raw.includes("medio")) return 21.0975;
    if (raw.includes("15")) return 15;
    if (raw.includes("10")) return 10;
    if (raw.includes("5")) return 5;
    const match = selectedDistance.match(/\d+/);
    return match ? parseFloat(match[0]) : 10;
  }, [selectedDistance]);

  // Tiempo objetivo (Horas, Minutos, Segundos)
  const [hours, setHours] = useState<number>(() => {
    if (totalKm >= 42) return 3;
    if (totalKm >= 21) return 1;
    return 0;
  });
  const [minutes, setMinutes] = useState<number>(() => {
    if (totalKm >= 42) return 45;
    if (totalKm >= 21) return 45;
    return 50;
  });
  const [seconds, setSeconds] = useState<number>(0);

  // Tipo de estrategia
  const [strategy, setStrategy] = useState<StrategyType>("negative");
  // Hora de salida
  const [startClock, setStartClock] = useState<string>(race.startTime?.replace(/[^0-9:]/g, "") || "07:00");
  const [copied, setCopied] = useState(false);

  // Calcular tiempo total en segundos
  const totalSeconds = useMemo(() => {
    return hours * 3600 + minutes * 60 + seconds;
  }, [hours, minutes, seconds]);

  // Ritmo promedio en segundos por km
  const avgPaceSec = useMemo(() => {
    if (totalKm <= 0 || totalSeconds <= 0) return 300;
    return totalSeconds / totalKm;
  }, [totalSeconds, totalKm]);

  // Formato ritmo min/km (ej. "4:58")
  const formatPace = (secPerKm: number) => {
    const m = Math.floor(secPerKm / 60);
    const s = Math.round(secPerKm % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Formato tiempo transcurrido (ej. "01:45:00" o "45:30")
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.round(totalSec % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calcular hora del día para un segundo acumulado
  const formatClockTime = (addedSec: number) => {
    const [startH, startM] = startClock.split(":").map(Number);
    const baseH = isNaN(startH) ? 7 : startH;
    const baseM = isNaN(startM) ? 0 : startM;
    const initialDaySec = baseH * 3600 + baseM * 60;
    const targetSec = (initialDaySec + addedSec) % (24 * 3600);

    const ch = Math.floor(targetSec / 3600);
    const cm = Math.floor((targetSec % 3600) / 60);
    const cs = Math.round(targetSec % 60);

    const ampm = ch >= 12 ? "PM" : "AM";
    const h12 = ch % 12 || 12;
    return `${h12}:${cm.toString().padStart(2, "0")}:${cs.toString().padStart(2, "0")} ${ampm}`;
  };

  // Calcular splits km por km
  const kmSplits = useMemo(() => {
    const numKms = Math.ceil(totalKm);
    const splits: Array<{
      km: number;
      paceSec: number;
      accumSec: number;
      clockTime: string;
      label?: string;
      isHydration?: boolean;
      isGel?: boolean;
      tip?: string;
    }> = [];

    let currentAccum = 0;

    for (let k = 1; k <= numKms; k++) {
      const isLast = k === numKms;
      const kmDistance = isLast ? totalKm - (numKms - 1) : 1;

      // Factor de variación según estrategia
      let variationFactor = 1.0;
      const progress = (k - 1) / (numKms - 1 || 1); // 0 a 1

      if (strategy === "negative") {
        // Arranca +2.5% más lento y termina -3% más rápido
        variationFactor = 1.025 - progress * 0.055;
      } else if (strategy === "positive") {
        // Arranca -2.5% más rápido y termina +3% más lento
        variationFactor = 0.975 + progress * 0.055;
      } else {
        // Even split
        variationFactor = 1.0;
      }

      const kmPaceSec = avgPaceSec * variationFactor;
      const kmTotalDuration = kmPaceSec * kmDistance;
      currentAccum += kmTotalDuration;

      // Hitos de nutrición / hidratación
      const isHydration = k % 3 === 0 || k === 2 || k === 5 || k === 10 || k === 15 || k === 20;
      const isGel = k === 7 || k === 14 || k === 21 || k === 28 || k === 35;

      let tip = "";
      if (k === 1) tip = "Salida controlada. No te dejes llevar por la adrenalina del grupo.";
      else if (k === Math.round(numKms / 2)) tip = "Mitad de carrera. Evalúa sensaciones y afianza el ritmo.";
      else if (k === numKms) tip = "¡Sprint final! Deja todo en el asfalto hacia el arco de meta.";
      else if (isGel) tip = "Consume tu gel energético y acompáñalo con 150ml de agua.";
      else if (isHydration) tip = "Bebe a pequeños sorbos en el puesto de abasto.";

      splits.push({
        km: k,
        paceSec: kmPaceSec,
        accumSec: currentAccum,
        clockTime: formatClockTime(currentAccum),
        label: isLast ? `Km ${totalKm.toFixed(1)} (Meta)` : `Km ${k}`,
        isHydration,
        isGel,
        tip,
      });
    }

    return splits;
  }, [totalKm, avgPaceSec, strategy, startClock]);

  // Presets rápidos según distancia
  const presets = useMemo(() => {
    if (totalKm >= 42) {
      return [
        { label: "Sub 3h 00m (Boston)", h: 2, m: 59, s: 0 },
        { label: "Sub 3h 30m", h: 3, m: 29, s: 0 },
        { label: "Sub 3h 45m", h: 3, m: 44, s: 0 },
        { label: "Sub 4h 00m", h: 3, m: 59, s: 0 },
        { label: "Sub 4h 30m", h: 4, m: 29, s: 0 },
      ];
    }
    if (totalKm >= 21) {
      return [
        { label: "Sub 1h 30m", h: 1, m: 29, s: 0 },
        { label: "Sub 1h 40m", h: 1, m: 39, s: 0 },
        { label: "Sub 1h 45m", h: 1, m: 44, s: 0 },
        { label: "Sub 1h 50m", h: 1, m: 49, s: 0 },
        { label: "Sub 2h 00m", h: 1, m: 59, s: 0 },
        { label: "Sub 2h 15m", h: 2, m: 14, s: 0 },
      ];
    }
    if (totalKm >= 10) {
      return [
        { label: "Sub 40 min", h: 0, m: 39, s: 30 },
        { label: "Sub 45 min", h: 0, m: 44, s: 30 },
        { label: "Sub 50 min", h: 0, m: 49, s: 30 },
        { label: "Sub 55 min", h: 0, m: 54, s: 30 },
        { label: "Sub 60 min", h: 0, m: 59, s: 30 },
      ];
    }
    return [
      { label: "Sub 20 min", h: 0, m: 19, s: 45 },
      { label: "Sub 22 min", h: 0, m: 21, s: 45 },
      { label: "Sub 25 min", h: 0, m: 24, s: 45 },
      { label: "Sub 28 min", h: 0, m: 27, s: 45 },
      { label: "Sub 30 min", h: 0, m: 29, s: 45 },
    ];
  }, [totalKm]);

  const handleApplyPreset = (p: { h: number; m: number; s: number }) => {
    setHours(p.h);
    setMinutes(p.m);
    setSeconds(p.s);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const text = `Estrategia para ${race.title} (${selectedDistance}): Meta de ${formatTime(totalSeconds)} a ritmo promedio de ${formatPace(avgPaceSec)} min/km. Generado con Písale.`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Estrategia de Carrera - ${race.title}`,
            text,
            url: window.location.href,
          });
          return;
        } catch {
          // fallback
        }
      }
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Pulsera: cada cuántos km mostrar en la pulsera impresa para que quepa en la muñeca
  const wristbandInterval = totalKm >= 42 ? 2 : totalKm >= 21 ? 1 : 1;
  const wristbandSplits = kmSplits.filter(
    (s) => s.km % wristbandInterval === 0 || s.km === Math.ceil(totalKm)
  );

  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-24 pt-24 sm:pt-28">
      {/* ========================================================
          BARRA SUPERIOR FLOTANTE (OCULTA EN IMPRESIÓN)
          ======================================================== */}
      <div className="print:hidden mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white/90 p-4 border border-slate-200/90 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link
              href={`/carrera/${race.id}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-full"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver a la Carrera</span>
            </Link>

            <Link
              href={`/carrera/${race.id}/guia`}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-2 rounded-full transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-sky-600" />
              <span>Guía del Atleta</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Compartir</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-5 py-2 text-xs font-black text-white shadow-md shadow-fuchsia-500/20 hover:shadow-fuchsia-500/35 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir Pulsera de Muñeca (Pace Band)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          HERO DE ESTRATEGIA (OCULTO EN IMPRESIÓN)
          ======================================================== */}
      <div className="print:hidden mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-6 sm:p-8 shadow-sm backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-3.5 py-1 text-xs font-bold text-orange-700">
                <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                <span>Pacer Virtual & Pulsera de Muñeca</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Estrategia de Carrera: <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500">{race.title}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Calcula tus parciales km a km, sincroniza hidratación y geles energéticos, y genera tu pulsera recortable para la muñeca.
              </p>
            </div>

            {/* Badges rápidos de la carrera */}
            <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-800">
                <Calendar className="h-3.5 w-3.5 text-violet-600" />
                <span>{race.day} {race.month} {race.year}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-800">
                <Clock className="h-3.5 w-3.5 text-orange-500" />
                <span>Disparo: {race.startTime || "07:00 hrs"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PANEL DE CONFIGURACIÓN & RESULTADOS
          ======================================================== */}
      <div className="print:hidden mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: CONTROLES DE PLANIFICACIÓN (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <Sliders className="h-4 w-4 text-violet-600" />
              <h2 className="font-display text-base font-extrabold text-slate-900">
                Configura tu Meta
              </h2>
            </div>

            {/* Selector de Distancia */}
            <div className="mb-5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                1. Selecciona Distancia
              </label>
              <div className="grid grid-cols-3 gap-2">
                {race.distances.map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => setSelectedDistance(dist)}
                    className={`rounded-2xl px-3 py-2.5 text-xs font-black transition-all cursor-pointer border ${
                      selectedDistance === dist
                        ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/25"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Tiempo Objetivo */}
            <div className="mb-5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                2. Tiempo Objetivo (Horas : Minutos : Segundos)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Horas</span>
                  <select
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-violet-500"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((h) => (
                      <option key={h} value={h}>{h} h</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Minutos</span>
                  <select
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-violet-500"
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                      <option key={m} value={m}>{m.toString().padStart(2, "0")} m</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Segundos</span>
                  <select
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-violet-500"
                  >
                    {[0, 15, 30, 45].map((s) => (
                      <option key={s} value={s}>{s.toString().padStart(2, "0")} s</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Presets rápidos */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wide">
                  Metas Populares para {selectedDistance}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="rounded-full bg-slate-100 hover:bg-violet-100 hover:text-violet-900 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estrategia de Ritmo */}
            <div className="mb-5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                3. Estrategia de Splits
              </label>
              <div className="space-y-2">
                <label
                  onClick={() => setStrategy("negative")}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    strategy === "negative"
                      ? "border-violet-500 bg-violet-50/60 ring-2 ring-violet-500/10"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={strategy === "negative"}
                    onChange={() => setStrategy("negative")}
                    className="mt-0.5 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="block text-xs font-black text-slate-900">
                      Negative Split (Recomendado) 🚀
                    </span>
                    <span className="block text-[11px] text-slate-500 leading-snug">
                      Inicia 2.5% más suave y acelera en la segunda mitad. Estrategia óptima para evitar la fatiga prematura.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setStrategy("even")}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    strategy === "even"
                      ? "border-violet-500 bg-violet-50/60 ring-2 ring-violet-500/10"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={strategy === "even"}
                    onChange={() => setStrategy("even")}
                    className="mt-0.5 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="block text-xs font-black text-slate-900">
                      Even Split (Ritmo Constante) ⏱️
                    </span>
                    <span className="block text-[11px] text-slate-500 leading-snug">
                      Mantiene exactamente los mismos segundos por kilómetro del inicio al fin.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setStrategy("positive")}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    strategy === "positive"
                      ? "border-violet-500 bg-violet-50/60 ring-2 ring-violet-500/10"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={strategy === "positive"}
                    onChange={() => setStrategy("positive")}
                    className="mt-0.5 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="block text-xs font-black text-slate-900">
                      Positive Split (Arranque Veloz) ⚡
                    </span>
                    <span className="block text-[11px] text-slate-500 leading-snug">
                      Aprovecha pendientes a favor al inicio; requiere cuidar las reservas de glucógeno.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Hora de Disparo Oficial */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1.5">
                4. Hora Estimada de tu Salida
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startClock}
                  onChange={(e) => setStartClock(e.target.value)}
                  className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-violet-500"
                />
                <span className="text-[11px] text-slate-500">
                  Calcula la hora real en que cruzarás cada kilómetro.
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Nutrición y Pacer Summary */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 text-amber-950">
            <div className="flex items-center gap-2 mb-2 text-xs font-black text-amber-900">
              <Droplets className="h-4 w-4 text-amber-600" />
              <span>Plan de Nutrición & Abastecimiento Sugerido</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Para una carrera de <strong>{selectedDistance}</strong> en <strong>{formatTime(totalSeconds)}</strong>, se recomienda ingerir entre <strong>{Math.round(totalKm * 35)}ml y {Math.round(totalKm * 50)}ml de líquido</strong> divididos en los puntos oficiales de abastecimiento, y <strong>{totalKm >= 21 ? Math.floor(totalKm / 8) : 1} geles de carbohidratos</strong>.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESULTADOS, TIMELINE & VISTA PREVIA PULSERA (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Métricas Principales en Tarjetas Glass */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Ritmo Promedio
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-violet-600 block mt-1">
                {formatPace(avgPaceSec)}
              </span>
              <span className="text-[10px] font-bold text-slate-500">min / km</span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Velocidad
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-fuchsia-600 block mt-1">
                {(3600 / avgPaceSec).toFixed(1)}
              </span>
              <span className="text-[10px] font-bold text-slate-500">km / h</span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Tiempo Meta
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-600 block mt-1">
                {formatTime(totalSeconds)}
              </span>
              <span className="text-[10px] font-bold text-slate-500">{selectedDistance}</span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Llegada a Meta
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-slate-900 block mt-1">
                {formatClockTime(totalSeconds)}
              </span>
              <span className="text-[10px] font-bold text-slate-500">Hora reloj</span>
            </div>
          </div>

          {/* VISTA PREVIA DE LA PULSERA DE MUÑECA */}
          <div className="rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50/50 via-white to-fuchsia-50/40 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-violet-600" />
                <h3 className="font-display text-sm font-black text-slate-900">
                  Vista Previa de tu Pulsera de Muñeca (Pace Band)
                </h3>
              </div>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 bg-white hover:bg-violet-50 border border-violet-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                <Printer className="h-3 w-3" />
                <span>Imprimir Hoja de Pulseras</span>
              </button>
            </div>

            {/* Simulación visual de la pulsera */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[580px] rounded-2xl border-2 border-dashed border-violet-300 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6">
                      <Image
                        src="/assets/Logo_Pisale.png"
                        alt="Pisale"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span className="font-black text-slate-900 text-[11px]">{race.title}</span>
                    <span className="rounded-full bg-violet-100 px-2 py-0.2 text-[9px] font-black text-violet-800">
                      {selectedDistance}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-black text-violet-700">
                      META: {formatTime(totalSeconds)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-bold">
                      Ritmo: {formatPace(avgPaceSec)}/km
                    </span>
                  </div>
                </div>

                {/* Parciales en fila horizontal tipo pulsera de silicona / papel */}
                <div className="grid grid-flow-col auto-cols-max gap-1 overflow-x-auto text-center py-1">
                  {wristbandSplits.map((s) => (
                    <div
                      key={s.km}
                      className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 min-w-[50px]"
                    >
                      <span className="text-[9px] font-extrabold text-slate-400 block">
                        KM {s.km}
                      </span>
                      <span className="font-mono text-[10px] font-black text-slate-900 block">
                        {formatTime(s.accumSec)}
                      </span>
                      <span className="text-[8px] font-bold text-violet-600 block">
                        {formatPace(s.paceSec)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-center text-[9px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <Scissors className="h-3 w-3" />
                  <span>Corte por la línea punteada · Cinta transparente para sujetar a la muñeca</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABLA DESGLOSE KM A KM */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-black text-slate-900">
                  Desglose Kilómetro por Kilómetro
                </h3>
                <p className="text-[11px] text-slate-500">
                  Estrategia {strategy === "negative" ? "Negative Split" : strategy === "positive" ? "Positive Split" : "Even Split"}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {kmSplits.length} splits calculados
              </span>
            </div>

            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="py-2.5 px-4">Km</th>
                    <th className="py-2.5 px-3">Ritmo Split</th>
                    <th className="py-2.5 px-3">Tiempo Acumulado</th>
                    <th className="py-2.5 px-3">Hora de Paso</th>
                    <th className="py-2.5 px-4">Hito / Recomendación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {kmSplits.map((s) => (
                    <tr
                      key={s.km}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        s.km === Math.ceil(totalKm) ? "bg-emerald-50/60 font-bold" : ""
                      }`}
                    >
                      <td className="py-2.5 px-4 font-black text-slate-900">
                        {s.label}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-violet-700">
                        {formatPace(s.paceSec)} <span className="text-[9px] text-slate-400">/km</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-black text-slate-900">
                        {formatTime(s.accumSec)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {s.clockTime}
                      </td>
                      <td className="py-2.5 px-4 text-[11px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {s.isGel && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-800">
                              ⚡ Gel
                            </span>
                          )}
                          {s.isHydration && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-extrabold text-sky-800">
                              💧 Abasto
                            </span>
                          )}
                          <span className="text-slate-500">{s.tip}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DOCUMENTO FÍSICO DE PULSERA LISTO PARA IMPRIMIR
          Optimizado con @media print (1 Hoja Carta con 2 pulseras)
          ======================================================== */}
      <div className="hidden print:block print:p-6 print:m-0 text-slate-900">
        <div className="text-center mb-6 pb-4 border-b-2 border-slate-900">
          <h1 className="text-xl font-black uppercase tracking-tight">
            Písale · Pulsera de Ritmos Oficial (Pace Band)
          </h1>
          <p className="text-xs text-slate-600 font-bold mt-1">
            {race.title} · {selectedDistance} · Objetivo: {formatTime(totalSeconds)} (Ritmo: {formatPace(avgPaceSec)}/km)
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Atleta: {runner?.name || "Corredor Oficial"} {runner?.bibNumber && `· Dorsal: ${runner.bibNumber}`}
          </p>
        </div>

        {/* Generamos 2 copias para la hoja (por seguridad / repuesto) */}
        {[1, 2].map((bandIndex) => (
          <div key={bandIndex} className="mb-8 border-2 border-dashed border-slate-400 p-4 rounded-xl">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-2 text-xs">
              <div>
                <span className="font-black text-sm block">{race.title}</span>
                <span className="font-bold text-[10px] text-slate-600 uppercase">
                  {selectedDistance} · META: {formatTime(totalSeconds)} · Ritmo: {formatPace(avgPaceSec)}/km
                </span>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                <span>Pulsera #{bandIndex} · {race.day} {race.month} {race.year}</span>
              </div>
            </div>

            {/* Parciales en tabla compacta tipo banda */}
            <div className="grid grid-flow-col auto-cols-fr gap-1 border border-slate-300 text-center text-xs">
              {wristbandSplits.map((s) => (
                <div key={s.km} className="border-r border-slate-200 p-1 last:border-r-0">
                  <div className="text-[9px] font-black text-slate-600">K{s.km}</div>
                  <div className="font-mono text-[10px] font-black text-slate-900">{formatTime(s.accumSec)}</div>
                  <div className="text-[8px] text-slate-500">{formatPace(s.paceSec)}</div>
                </div>
              ))}
            </div>

            <div className="mt-2 text-[8px] text-slate-400 text-center font-bold">
              ✂️ Recortar por la línea punteada · Colocar en la muñeca y asegurar con cinta adhesiva transparente impermeable
            </div>
          </div>
        ))}

        <div className="text-center text-[10px] text-slate-500 mt-6 border-t border-slate-200 pt-3">
          Generado automáticamente por Písale Platform · pisale.mx · ¡Éxito en tu carrera!
        </div>
      </div>
    </div>
  );
}
