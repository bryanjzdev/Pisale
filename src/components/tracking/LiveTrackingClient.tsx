"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Navigation,
  Timer,
  Share2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Heart,
  Flame,
  Zap,
  ArrowRight,
  User,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import type { Race } from "@/lib/mock-races";

export type RunnerTrack = {
  id: string;
  bibNumber: string;
  name: string;
  distanceName: string;
  category: string;
  gender: string;
  pace: string;
  chipTime: string;
  gunTime: string;
  status: "EN_RUTA" | "FINISHER" | "EN_SALIDA";
  currentKm: number;
  totalKm: number;
  lastCheckpoint: string;
  lastSeenTime: string;
  estimatedFinishTime: string;
  splits: {
    name: string;
    km: number;
    splitTime: string;
    paceAtSplit: string;
    passed: boolean;
    passTimestamp?: string;
  }[];
};

interface Props {
  race: Race;
  initialBib?: string;
  initialRegistrationId?: string;
  runners: RunnerTrack[];
}

export function LiveTrackingClient({
  race,
  initialBib,
  initialRegistrationId,
  runners,
}: Props) {
  // Búsqueda de corredor
  const [searchQuery, setSearchQuery] = useState(initialBib || "");
  const [selectedRunnerId, setSelectedRunnerId] = useState<string>(() => {
    if (initialBib) {
      const found = runners.find(
        (r) => r.bibNumber.toLowerCase() === initialBib.toLowerCase()
      );
      if (found) return found.id;
    }
    if (initialRegistrationId) {
      const found = runners.find((r) => r.id === initialRegistrationId);
      if (found) return found.id;
    }
    return runners[0]?.id || "";
  });

  // Modo Simulación en Vivo (para que los familiares puedan ver avanzar al atleta)
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0); // 0 a 100
  const [cheersCount, setCheersCount] = useState(14);
  const [cheerSent, setCheerSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Corredor seleccionado
  const selectedRunner = useMemo(() => {
    return runners.find((r) => r.id === selectedRunnerId) || runners[0];
  }, [selectedRunnerId, runners]);

  // Filtrado de corredores en búsqueda
  const filteredRunners = useMemo(() => {
    if (!searchQuery.trim()) return runners.slice(0, 6);
    const q = searchQuery.toLowerCase().trim();
    return runners.filter(
      (r) =>
        r.bibNumber.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
    );
  }, [searchQuery, runners]);

  // Inicializar progreso según el corredor seleccionado
  useEffect(() => {
    if (selectedRunner) {
      const pct = Math.min(
        100,
        Math.round((selectedRunner.currentKm / selectedRunner.totalKm) * 100)
      );
      setSimulationProgress(pct);
    }
  }, [selectedRunner]);

  // Intervalo de simulación viva
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Cálculos dinámicos según progreso simulado
  const dynamicDistanceKm = selectedRunner
    ? Number(((simulationProgress / 100) * selectedRunner.totalKm).toFixed(2))
    : 0;

  const isCompleted = simulationProgress >= 100;

  // Compartir por WhatsApp
  const handleShareWhatsApp = () => {
    if (!selectedRunner) return;
    const text = encodeURIComponent(
      `🏃‍♂️ ¡Sigue mi avance en vivo en ${race.title}! Soy el dorsal #${selectedRunner.bibNumber}. Consulta mi tiempo y hora de llegada aquí: ${window.location.origin}/carrera/${race.id}/tracking?bib=${selectedRunner.bibNumber}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Copiar Enlace
  const handleCopyLink = () => {
    if (!selectedRunner) return;
    const url = `${window.location.origin}/carrera/${race.id}/tracking?bib=${selectedRunner.bibNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Enviar porras / aplausos virtuales
  const handleSendCheer = () => {
    setCheersCount((prev) => prev + 1);
    setCheerSent(true);
    setTimeout(() => setCheerSent(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-900 pb-20">
      {/* Top Header con Breadcrumbs */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/carrera/${race.id}`}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Navigation className="h-4 w-4 rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                  Radar en Vivo · RFID Timing
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                {race.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/carrera/${race.id}/estrategia`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Timer className="h-3.5 w-3.5 text-orange-600" />
              Pacer Virtual
            </Link>
            <Link
              href="/resultados"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Tabla Live
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* BANNER PRINCIPAL / BUSCADOR DE CORREDOR */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <Zap className="h-3.5 w-3.5" />
              Sigue a tu Corredor en Tiempo Real
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              ¿Dónde viene tu atleta favorito?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Ingresa el número de dorsal o nombre del corredor para ver su ritmo exacto, tapetes RFID cruzados y la hora calculada de llegada a la meta para que lo esperes con porras.
            </p>

            {/* Input de Búsqueda */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Escribe el dorsal (ej. #1042 o 2048) o nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all shadow-inner"
                />
              </div>

              {/* Sugerencias Rápidas */}
              {searchQuery.trim() !== "" && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-30 divide-y divide-slate-800">
                  {filteredRunners.length === 0 ? (
                    <div className="p-4 text-xs text-slate-400 text-center">
                      No se encontró ningún corredor con ese dorsal o nombre.
                    </div>
                  ) : (
                    filteredRunners.map((runner) => (
                      <button
                        key={runner.id}
                        onClick={() => {
                          setSelectedRunnerId(runner.id);
                          setSearchQuery("");
                        }}
                        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-violet-600/30 text-violet-300 font-mono font-bold text-xs flex items-center justify-center">
                            #{runner.bibNumber}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">
                              {runner.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {runner.distanceName} · {runner.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {runner.chipTime}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selector de Chips de Corredores Populares */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Corredores en pista:
              </span>
              {runners.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRunnerId(r.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedRunner?.id === r.id
                      ? "bg-violet-600 text-white shadow-sm ring-2 ring-violet-400"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  #{r.bibNumber} · {r.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: PANEL DEL CORREDOR Y RADAR DE RUTA */}
        {selectedRunner && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: TARJETA DE ESTADO Y MÉTRICAS (Lg: 5 columnas) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                
                {/* Cabecera del Atleta */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-mono font-black text-xl flex items-center justify-center shadow-md">
                      #{selectedRunner.bibNumber}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-black text-slate-900 leading-tight">
                        {selectedRunner.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedRunner.distanceName} · Rama {selectedRunner.gender} · {selectedRunner.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      isCompleted
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Award className="h-3 w-3 text-amber-700" />
                        Finisher
                      </>
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                        En Carrera
                      </>
                    )}
                  </span>
                </div>

                {/* Grid de Tiempos y Ritmo */}
                <div className="grid grid-cols-2 gap-3.5 py-5 border-b border-slate-100">
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Clock className="h-3.5 w-3.5 text-violet-600" />
                      Tiempo Chip Actual
                    </div>
                    <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                      {selectedRunner.chipTime}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Activity className="h-3.5 w-3.5 text-orange-600" />
                      Ritmo Promedio
                    </div>
                    <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                      {selectedRunner.pace}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/60 p-3.5 col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        Hora Estimada de Llegada a Meta (ETA)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        {isCompleted ? "¡Ya cruzó la meta!" : "Cálculo en vivo"}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-black text-emerald-950">
                        {selectedRunner.estimatedFinishTime}
                      </span>
                      {!isCompleted && (
                        <span className="text-xs text-emerald-700 font-semibold">
                          (aprox. 14 minutos restantes)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón de Enviar Porras Virtuales */}
                <div className="pt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendCheer}
                      className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <Heart
                        className={`h-4 w-4 fill-rose-500 text-rose-500 ${
                          cheerSent ? "animate-bounce" : ""
                        }`}
                      />
                      <span>¡Enviar Porra! ({cheersCount})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      title="Copiar enlace"
                      className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                    >
                      {copiedLink ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>

              </div>

              {/* CONTROLES DE SIMULACIÓN PARA FAMILIARES */}
              <div className="rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50/70 via-fuchsia-50/40 to-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-violet-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-violet-600" />
                    Simulador Interactivo de Avance
                  </span>
                  <span className="font-mono text-xs font-black text-violet-800">
                    {simulationProgress}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-3.5 leading-relaxed">
                  Pulsa reproducir para ver cómo se movería el corredor en tiempo real conforme cruza los tapetes RFID del circuito.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isSimulating ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Simular en Vivo
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsSimulating(false);
                      setSimulationProgress(0);
                    }}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    title="Reiniciar"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA: RADAR DE LA RUTA Y TAPETES RFID (Lg: 7 columnas) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 block mb-1">
                      Puntos de Control RFID
                    </span>
                    <h3 className="font-display text-xl font-black text-slate-900">
                      Circuito y Tapetes de Cronometraje
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Kilómetros Recorridos
                    </span>
                    <span className="font-mono text-lg font-black text-violet-700">
                      {dynamicDistanceKm} / {selectedRunner.totalKm} km
                    </span>
                  </div>
                </div>

                {/* TRACK VISUAL ELEVADO */}
                <div className="relative mb-8 pt-4">
                  {/* Barra de Fondo */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-emerald-500 transition-all duration-300"
                      style={{ width: `${simulationProgress}%` }}
                    />
                  </div>

                  {/* Pin del Corredor */}
                  <div
                    className="absolute -top-1 transition-all duration-300 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
                    style={{ left: `${Math.max(2, Math.min(98, simulationProgress))}%` }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="h-7 w-7 rounded-full bg-violet-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-lg ring-4 ring-white">
                        🏃
                      </span>
                      <span className="absolute -inset-1 rounded-full bg-violet-400 opacity-60 animate-ping pointer-events-none" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
                      {dynamicDistanceKm} km
                    </span>
                  </div>
                </div>

                {/* TIMELINE DE TAPETES RFID */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedRunner.splits.map((split, index) => {
                    const isPassed =
                      simulationProgress >= (split.km / selectedRunner.totalKm) * 100;
                    const isCurrent =
                      !isPassed &&
                      (index === 0 ||
                        simulationProgress >=
                          (selectedRunner.splits[index - 1].km /
                            selectedRunner.totalKm) *
                            100);

                    return (
                      <div key={split.name} className="relative flex items-start gap-4">
                        {/* Nodo del tapete */}
                        <div
                          className={`absolute -left-6 sm:-left-8 mt-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white transition-all ${
                            isPassed
                              ? "bg-emerald-500 text-white shadow-sm"
                              : isCurrent
                              ? "bg-violet-600 text-white shadow-md animate-pulse"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <span className="text-[10px]">{index + 1}</span>
                          )}
                        </div>

                        {/* Contenido del Tapete */}
                        <div
                          className={`flex-1 p-4 rounded-2xl border transition-all ${
                            isPassed
                              ? "bg-emerald-50/50 border-emerald-200/70"
                              : isCurrent
                              ? "bg-violet-50/60 border-violet-200 shadow-xs"
                              : "bg-slate-50/50 border-slate-100 opacity-70"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-black text-sm text-slate-900">
                                {split.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600">
                                Km {split.km}
                              </span>
                            </div>

                            <span
                              className={`text-xs font-mono font-bold ${
                                isPassed
                                  ? "text-emerald-700"
                                  : isCurrent
                                  ? "text-violet-700"
                                  : "text-slate-400"
                              }`}
                            >
                              {isPassed
                                ? `Cruzado: ${split.splitTime}`
                                : isCurrent
                                ? "En aproximación..."
                                : "Pendiente"}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>
                              Ritmo parcial: <strong>{split.paceAtSplit}</strong>
                            </span>
                            {split.passTimestamp && isPassed && (
                              <span>
                                Hora de paso: <strong>{split.passTimestamp}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ACCIONES DEL CORREDOR / RESULTADOS */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Datos certificados por tapetes RFID de cronometraje oficial</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/carrera/${race.id}/certificado?bib=${selectedRunner.bibNumber}`}
                      className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-2xs"
                    >
                      Ver Diploma
                    </Link>
                    <Link
                      href={`/carrera/${race.id}/story?bib=${selectedRunner.bibNumber}`}
                      className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs hover:opacity-95 transition-opacity shadow-2xs"
                    >
                      Story 9:16
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
