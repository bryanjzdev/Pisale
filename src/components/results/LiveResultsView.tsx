"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Search,
  CheckCircle2,
  Share2,
  Printer,
  X,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import type { AthleteResult } from "@/app/actions/results";

export function LiveResultsView({
  races,
  initialRaceId,
  initialResults,
  allGlobalResults = [],
}: {
  races: { id: string; title: string; date?: string; distances: string[] }[];
  initialRaceId: string;
  initialResults: AthleteResult[];
  allGlobalResults?: AthleteResult[];
}) {
  const router = useRouter();
  const [selectedRaceId, setSelectedRaceId] = useState(initialRaceId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("TODAS");
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteResult | null>(null);

  const currentRace = races.find((r) => r.id === selectedRaceId) || races[0];

  // Si hay búsqueda activa por texto o dorsal, buscamos en todas las inscripciones del sistema;
  // de lo contrario, mostramos los resultados de la carrera seleccionada.
  const activeDataset =
    searchQuery.trim().length > 0 ? allGlobalResults : initialResults;

  const filteredResults = activeDataset.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bibNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.raceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistance =
      selectedDistance === "TODAS" ||
      item.distanceName.toUpperCase().includes(selectedDistance.toUpperCase());

    return matchesSearch && matchesDistance;
  });

  const podium = filteredResults.slice(0, 3);

  return (
    <div className="space-y-10">
      
      {/* Selector de Carreras (Chips / Tabs con enlaces reales) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-4 rounded-3xl border border-slate-200/80 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
            Evento:
          </span>
          {races.map((race) => (
            <Link
              key={race.id}
              href={`/resultados?carrera=${race.id}`}
              onClick={() => {
                setSelectedRaceId(race.id);
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
                selectedRaceId === race.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {race.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
            Live Timing Activo
          </span>
        </div>
      </div>

      {/* Buscador & Filtros de Distancia */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Barra de Búsqueda Global */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por dorsal (ej. PSL-8378) o atleta..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filtro por Distancias */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["TODAS", "10K", "21K"].map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistance(dist)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedDistance === dist
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* PODIO DE HONOR (TOP 1 a 3 REALES) */}
      {!searchQuery && podium.length > 0 && (
        <div className="relative pt-6">
          <div className="text-center mb-6">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase text-amber-800 tracking-wider mb-2">
              🏆 Líderes Oficiales
            </span>
            <h2 className="font-display text-2xl font-black text-slate-900">
              Podio de la Carrera
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
            {/* 2do Lugar (Plata) */}
            {podium[1] ? (
              <div
                onClick={() => setSelectedAthlete(podium[1])}
                className="order-2 md:order-1 relative rounded-3xl bg-linear-to-b from-slate-100 to-white p-6 border-2 border-slate-200 shadow-md text-center transform transition-all hover:scale-105 cursor-pointer"
              >
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-700 font-display font-black text-lg mb-3 shadow-inner">
                  🥈 2º
                </div>
                <span className="font-mono text-xs font-bold text-slate-500 block">
                  {podium[1].bibNumber}
                </span>
                <h3 className="font-display font-black text-slate-900 text-base mt-0.5 truncate">
                  {podium[1].name}
                </h3>
                <p className="font-display text-2xl font-black text-slate-800 mt-2">
                  {podium[1].chipTime}
                </p>
                <span className="text-[11px] text-slate-500 font-bold block mt-1">
                  Ritmo: {podium[1].pace}
                </span>
              </div>
            ) : (
              <div className="order-2 md:order-1" />
            )}

            {/* 1er Lugar (Oro - Destacado) */}
            {podium[0] && (
              <div
                onClick={() => setSelectedAthlete(podium[0])}
                className="order-1 md:order-2 relative rounded-3xl bg-linear-to-b from-amber-500/10 via-white to-white p-7 border-2 border-amber-400 shadow-xl shadow-amber-500/10 text-center transform md:-translate-y-4 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white font-display font-black text-2xl mb-3 shadow-lg shadow-amber-500/30">
                  🥇 1º
                </div>
                <span className="font-mono text-xs font-black text-amber-700 block">
                  {podium[0].bibNumber}
                </span>
                <h3 className="font-display font-black text-slate-900 text-lg mt-0.5 truncate">
                  {podium[0].name}
                </h3>
                <p className="font-display text-3xl font-black text-amber-600 mt-2">
                  {podium[0].chipTime}
                </p>
                <span className="text-xs text-slate-600 font-bold block mt-1">
                  Ritmo: {podium[0].pace} · Split 5K: {podium[0].split5k}
                </span>
              </div>
            )}

            {/* 3er Lugar (Bronce) */}
            {podium[2] ? (
              <div
                onClick={() => setSelectedAthlete(podium[2])}
                className="order-3 relative rounded-3xl bg-linear-to-b from-orange-50 to-white p-6 border-2 border-orange-200 shadow-md text-center transform transition-all hover:scale-105 cursor-pointer"
              >
                <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700 font-display font-black text-lg mb-3 shadow-inner">
                  🥉 3º
                </div>
                <span className="font-mono text-xs font-bold text-slate-500 block">
                  {podium[2].bibNumber}
                </span>
                <h3 className="font-display font-black text-slate-900 text-base mt-0.5 truncate">
                  {podium[2].name}
                </h3>
                <p className="font-display text-2xl font-black text-slate-800 mt-2">
                  {podium[2].chipTime}
                </p>
                <span className="text-[11px] text-slate-500 font-bold block mt-1">
                  Ritmo: {podium[2].pace}
                </span>
              </div>
            ) : (
              <div className="order-3" />
            )}
          </div>
        </div>
      )}

      {/* TABLA COMPLETA DE CLASIFICACIÓN CON DATOS REALES */}
      <div className="overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-black text-slate-900">
              {searchQuery ? "Resultados de la Búsqueda" : "Tabla General de Tiempos"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredResults.length} corredor{filteredResults.length === 1 ? "" : "es"} registrado{filteredResults.length === 1 ? "" : "s"}
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {searchQuery ? "Búsqueda en todo el sistema" : currentRace.title}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Lugar</th>
                <th className="py-3.5 px-4">Dorsal</th>
                <th className="py-3.5 px-4">Atleta</th>
                <th className="py-3.5 px-4">Distancia</th>
                <th className="py-3.5 px-4 font-black">Tiempo Chip</th>
                <th className="py-3.5 px-4">Ritmo</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Split 5K</th>
                <th className="py-3.5 px-4 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <p className="font-bold text-sm text-slate-600">
                      No hay corredores registrados para esta selección todavía.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery
                        ? "Verifica el dorsal o nombre ingresado."
                        : "Sé el primero en inscribirte a esta carrera para aparecer en el podio oficial."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredResults.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedAthlete(r)}
                    className="group hover:bg-violet-50/50 transition-colors cursor-pointer bg-violet-50/40"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center justify-center h-7 w-7 rounded-lg font-mono font-black text-xs ${
                          r.overallRank === 1
                            ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                            : r.overallRank === 2
                            ? "bg-slate-300 text-slate-900"
                            : r.overallRank === 3
                            ? "bg-orange-200 text-orange-950"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        #{r.overallRank}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-violet-700">
                      {r.bibNumber}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                          {r.name}
                        </span>
                        <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                          Oficial
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {r.distanceName}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-sm font-black text-slate-950">
                      {r.chipTime}
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {r.pace}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-500 hidden sm:table-cell">
                      {r.split5k || "—"}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button className="text-violet-600 font-black hover:text-violet-800 text-[11px] inline-flex items-center gap-1 cursor-pointer">
                        Ver Detalle →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLE / CERTIFICADO DE FINISHER */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            {/* Botón Cerrar */}
            <button
              onClick={() => setSelectedAthlete(null)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Encabezado del Certificado */}
            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3">
                <CheckCircle2 className="h-3 w-3" /> Finisher Oficial Certificado
              </span>
              <h2 className="font-display text-2xl font-black text-slate-900">
                {selectedAthlete.name}
              </h2>
              <span className="font-mono text-sm font-bold text-violet-600 block mt-1">
                DORSAL: {selectedAthlete.bibNumber} · {selectedAthlete.distanceName}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedAthlete.raceTitle}
              </p>
            </div>

            {/* Métrica Principal (Tiempo Chip) */}
            <div className="rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 p-0.5 shadow-lg">
              <div className="rounded-[15px] bg-white p-5 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Tiempo Oficial de Chip
                </span>
                <span className="font-display text-4xl sm:text-5xl font-black text-slate-950 block my-1">
                  {selectedAthlete.chipTime}
                </span>
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                  <span>Ritmo: {selectedAthlete.pace}</span>
                  <span>•</span>
                  <span>Tiempo Disparo: {selectedAthlete.gunTime}</span>
                </div>
              </div>
            </div>

            {/* Desglose de Clasificación */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">General</span>
                <span className="font-display text-lg font-black text-slate-900 block mt-0.5">
                  #{selectedAthlete.overallRank}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Rama</span>
                <span className="font-display text-lg font-black text-slate-900 block mt-0.5">
                  #{selectedAthlete.genderRank}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Categoría</span>
                <span className="font-display text-lg font-black text-slate-900 block mt-0.5">
                  #{selectedAthlete.categoryRank}
                </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href={`/carrera/${selectedRaceId}/story?registration_id=${selectedAthlete.id}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-opacity"
              >
                <Share2 className="h-4 w-4" />
                Crear Story para Redes
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
