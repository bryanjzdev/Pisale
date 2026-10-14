"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Camera,
  Search,
  Download,
  Share2,
  Filter,
  Sparkles,
  ArrowLeft,
  X,
  Check,
  CheckCircle2,
  Trophy,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Award,
  Heart,
  Eye,
} from "lucide-react";
import type { Race } from "@/lib/mock-races";

export type RacePhoto = {
  id: string;
  url: string;
  zone: "Meta" | "Ruta" | "Salida" | "Podio" | "Medallas";
  bibs: string[];
  runnerNames?: string[];
  photographer: string;
  timeTaken: string;
  likes: number;
};

const ZONES = [
  { id: "TODAS", label: "Todas las fotos" },
  { id: "Meta", label: "🏁 Arco de Meta" },
  { id: "Ruta", label: "🏃 En Ruta (Km 10)" },
  { id: "Salida", label: "💥 Disparo de Salida" },
  { id: "Medallas", label: "🏅 Entrega de Medalla" },
  { id: "Podio", label: "🏆 Podio & Ganadores" },
];

export function GaleriaFotosClient({
  race,
  initialBib,
  photos,
}: {
  race: Race;
  initialBib?: string;
  photos: RacePhoto[];
}) {
  const [bibSearch, setBibSearch] = useState(initialBib || "");
  const [selectedZone, setSelectedZone] = useState("TODAS");
  const [activePhoto, setActivePhoto] = useState<RacePhoto | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filtrado de fotos por dorsal y por zona
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Filtro de zona
      if (selectedZone !== "TODAS" && photo.zone !== selectedZone) {
        return false;
      }
      // Filtro de dorsal
      if (bibSearch.trim()) {
        const query = bibSearch.trim().toLowerCase().replace("#", "");
        const matchesBib = photo.bibs.some((b) =>
          b.toLowerCase().includes(query)
        );
        const matchesName = photo.runnerNames?.some((n) =>
          n.toLowerCase().includes(query)
        );
        return matchesBib || matchesName;
      }
      return true;
    });
  }, [photos, selectedZone, bibSearch]);

  const toggleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos((prev) => ({ ...prev, [photoId]: !prev[photoId] }));
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
    // Simular descarga o abrir la imagen
    if (activePhoto) {
      const link = document.createElement("a");
      link.href = activePhoto.url;
      link.download = `Pisale_${race.id}_Dorsal_${activePhoto.bibs[0] || "Finisher"}.jpg`;
      link.target = "_blank";
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share && activePhoto) {
      navigator.share({
        title: `Mi foto en ${race.title} - Písale`,
        text: `¡Mira mi foto oficial en ${race.title}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace de la foto copiado al portapapeles.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-900 pb-20">
      {/* Top Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/carrera/${race.id}`}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-violet-700">
                  Galería Oficial de Fotógrafos
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                {race.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/carrera/${race.id}/tracking`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Radar en Vivo
            </Link>
            <Link
              href="/resultados"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
            >
              Resultados
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* BANNER PRINCIPAL / BUSCADOR DE FOTOS POR DORSAL */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold mb-3">
              <Camera className="h-3.5 w-3.5" />
              Cobertura Fotográfica Profesional
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Encuentra tus Fotos Oficiales por Dorsal
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Nuestros fotógrafos oficiales capturaron tu esfuerzo en la salida, ruta, arco de meta y entrega de medalla. Escribe tu número de dorsal para filtrar al instante únicamente tus fotos.
            </p>

            {/* Input de Búsqueda de Dorsal */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Escribe tu número de dorsal (ej. #1042)..."
                value={bibSearch}
                onChange={(e) => setBibSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500 transition-all shadow-inner"
              />
              {bibSearch && (
                <button
                  onClick={() => setBibSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sugerencias Rápidas de Dorsales */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Dorsales con fotos:
              </span>
              {["1042", "2085", "3190", "1105", "4012"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBibSearch(b)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    bibSearch === b
                      ? "bg-fuchsia-600 text-white ring-2 ring-fuchsia-400"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  #{b}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* PESTAÑAS DE ZONAS DE FOTOGRAFÍA */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedZone === zone.id
                  ? "bg-slate-900 text-white shadow-sm shadow-slate-900/20"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {zone.label}
            </button>
          ))}
        </div>

        {/* CONTADOR DE FOTOS Y ESTADO */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredPhotos.length}</strong> fotos disponibles
            {bibSearch ? ` para el dorsal #${bibSearch}` : ""}
          </span>
          <span className="hidden sm:inline">
            Resolución HD · Descarga con marco oficial conmemorativo
          </span>
        </div>

        {/* GRID DE FOTOGRAFÍAS */}
        {filteredPhotos.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No encontramos fotos para el dorsal #{bibSearch}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Prueba buscando otro dorsal o limpia el filtro para ver todas las fotos oficiales del evento.
            </p>
            <button
              onClick={() => {
                setBibSearch("");
                setSelectedZone("TODAS");
              }}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Ver todas las fotos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Imagen */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img
                    src={photo.url}
                    alt={`Foto en ${photo.zone}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badge de Zona */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                    {photo.zone}
                  </span>

                  {/* Botón de Like */}
                  <button
                    onClick={(e) => toggleLike(photo.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 transition-colors"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        likedPhotos[photo.id]
                          ? "fill-rose-500 text-rose-500"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Hover Icono de Maximizar */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-3 rounded-full bg-white/90 backdrop-blur-md text-slate-900 shadow-lg">
                      <Maximize2 className="h-5 w-5" />
                    </span>
                  </div>
                </div>

                {/* Pie de Foto */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {photo.bibs.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-md bg-violet-50 border border-violet-200 text-violet-700 font-mono text-[10px] font-black"
                      >
                        #{b}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {photo.timeTaken}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL DETALLE / VISOR HD DE FOTO CON MARCO OFICIAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row">
            
            {/* Botón Cerrar */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Lado Imagen con Marco Conmemorativo */}
            <div className="relative flex-1 bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
                <img
                  src={activePhoto.url}
                  alt="Foto Finisher"
                  className="max-h-[65vh] w-auto object-contain"
                />

                {/* MARCO GRÁFICO SUPERPUESTO (FOTO FINISHER) */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400 block">
                      FOTO OFICIAL FINISHER · PÍSALE MX
                    </span>
                    <h4 className="font-display font-black text-sm text-white drop-shadow-sm">
                      {race.title}
                    </h4>
                    <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                      {race.day} {race.month} {race.year} · {race.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white font-mono text-xs font-black shadow-sm inline-block">
                      Dorsal #{activePhoto.bibs[0] || "FINISHER"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Lateral de Información y Descarga */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-white divide-y divide-slate-100">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 block mb-1">
                    Zona: {activePhoto.zone}
                  </span>
                  <h3 className="font-display text-lg font-black text-slate-900">
                    Detalles de la Captura
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Capturada por {activePhoto.photographer} a las {activePhoto.timeTaken}.
                  </p>
                </div>

                {/* Dorsales Identificados */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Dorsales Identificados en la foto:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activePhoto.bibs.map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 font-mono text-xs font-black"
                      >
                        Dorsal #{b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enlace al Certificado o Tracking */}
                {activePhoto.bibs[0] && (
                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Corredor Oficial
                    </span>
                    <Link
                      href={`/carrera/${race.id}/certificado?bib=${activePhoto.bibs[0]}`}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
                    >
                      <Award className="h-3.5 w-3.5" />
                      Ver Certificado de este Corredor →
                    </Link>
                  </div>
                )}
              </div>

              {/* Botones de Descarga y Compartir */}
              <div className="pt-6 space-y-2.5">
                <button
                  onClick={handleDownload}
                  className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      ¡Descarga Iniciada!
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Descargar Foto en Alta Definición
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Compartir Foto
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
