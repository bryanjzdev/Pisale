"use client";

import { useState, useMemo } from "react";
import type { Race } from "@/lib/mock-races";
import { RaceCard } from "@/components/RaceCard";
import {
  Search,
  SlidersHorizontal,
  Compass,
  Mountain,
  Moon,
  Sparkles,
  X,
  TrendingDown,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";

export function CarrerasExplorer({ initialRaces }: { initialRaces: Race[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [selectedDistance, setSelectedDistance] = useState<string>("TODAS");
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc">("recent");

  // Filtrado y ordenamiento interactivo
  const filteredRaces = useMemo(() => {
    return initialRaces
      .filter((race) => {
        // Búsqueda por texto (título, ciudad/ubicación)
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = race.title.toLowerCase().includes(query);
          const matchLocation = race.location.toLowerCase().includes(query);
          if (!matchTitle && !matchLocation) return false;
        }

        // Filtro por categoría
        if (selectedCategory !== "TODAS") {
          if (race.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Filtro por distancia
        if (selectedDistance !== "TODAS") {
          const hasDistance = race.distances.some((d) =>
            d.toUpperCase().includes(selectedDistance.toUpperCase())
          );
          if (!hasDistance) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return a.price - b.price;
        }
        if (sortBy === "price-desc") {
          return b.price - a.price;
        }
        return 0; // Orden por defecto (más recientes primero)
      });
  }, [initialRaces, searchTerm, selectedCategory, selectedDistance, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("TODAS");
    setSelectedDistance("TODAS");
    setSortBy("recent");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "TODAS" ||
    selectedDistance !== "TODAS" ||
    sortBy !== "recent";

  return (
    <div className="space-y-8">
      {/* Barra de Filtros y Búsqueda */}
      <div className="rounded-3xl border border-white/80 bg-white/85 p-5 sm:p-6 shadow-[0_15px_45px_-10px_rgba(91,33,182,0.12)] backdrop-blur-2xl space-y-5">
        {/* Input de Búsqueda Principal */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por carrera, ciudad o sede (ej. Reforma, Chapultepec, Guadalajara...)"
            className="w-full h-12 pl-12 pr-10 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categorías Principales */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Categoría:
          </span>

          {[
            { id: "TODAS", label: "Todas las Carreras", icon: Sparkles },
            { id: "ruta", label: "Ruta Urbana", icon: Compass },
            { id: "trail", label: "Trail & Montaña", icon: Mountain },
            { id: "nocturna", label: "Nocturnas", icon: Moon },
          ].map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Distancias y Orden */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {/* Distancias */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Distancia:
            </span>
            {["TODAS", "5K", "10K", "21K", "42K"].map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistance(dist)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDistance === dist
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {dist === "TODAS" ? "Cualquiera" : dist}
              </button>
            ))}
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:border-violet-600 focus:outline-none cursor-pointer"
            >
              <option value="recent">Próximas y Recientes</option>
              <option value="price-asc">Menor Precio</option>
              <option value="price-desc">Mayor Precio</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-violet-600 hover:text-violet-800 ml-2 transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-bold text-slate-600">
          Mostrando{" "}
          <span className="font-extrabold text-slate-900">{filteredRaces.length}</span>{" "}
          {filteredRaces.length === 1 ? "carrera disponible" : "carreras disponibles"}
        </p>

        <Link
          href="/organizador/crear"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> ¿Eres organizador? Publica aquí
        </Link>
      </div>

      {/* Grid de Carreras */}
      {filteredRaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRaces.map((race, idx) => (
            <RaceCard key={race.id} race={race} index={idx} />
          ))}
        </div>
      ) : (
        /* Estado vacío si no hay coincidencias */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 mb-4">
            <Compass className="h-7 w-7" />
          </div>
          <h3 className="font-display text-xl font-black text-slate-900">
            No encontramos carreras con esos filtros
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Intenta cambiar el término de búsqueda o selecciona otra categoría o distancia.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Ver todas las carreras
          </button>
        </div>
      )}
    </div>
  );
}
