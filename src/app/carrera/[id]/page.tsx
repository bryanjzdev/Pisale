import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getRaceById } from "@/lib/races";
import { RaceHero } from "@/components/race-detail/RaceHero";
import { RunnerKitGrid } from "@/components/race-detail/RunnerKitGrid";
import { RouteElevationSection } from "@/components/race-detail/RouteElevationSection";
import { RaceActionCard } from "@/components/race-detail/RaceActionCard";
import { MobileFloatingCta } from "@/components/race-detail/MobileFloatingCta";
import { Building2, Info, MapPin, PackageCheck, ShieldCheck, BookOpen, ArrowRight, Timer, Zap, Camera, HeartHandshake, Edit3 } from "lucide-react";

export const instant = false;


type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return {
      title: "Carrera no encontrada | Písale",
      description: "La carrera solicitada no está disponible o ha sido retirada.",
    };
  }

  return {
    title: `${race.title} (${race.distances.join(", ")}) | Písale`,
    description: race.description || `Inscríbete a ${race.title} en ${race.location}. Cronometraje oficial y boleto digital instantáneo.`,
    openGraph: {
      title: race.title,
      description: race.description,
      images: [race.imageUrl],
    },
  };
}

import { connection } from "next/server";

export default async function CarreraDetallePage({ params }: Props) {
  await connection();
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    notFound();
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userEmail = session?.user?.email;
  const isOwnerEmail = userEmail?.toLowerCase() === "bjm.dev.soft@gmail.com";
  const isAdminOrOwner = (session?.user as any)?.role === "ADMIN" || isOwnerEmail;

  return (
    <div className="relative min-h-screen bg-[#fbfaff] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-24 lg:pb-16">
      {/* Fondo con aurora sutil */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[800px] overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-violet-300/30 blur-[130px]" />
        <div className="absolute right-0 top-20 h-[450px] w-[450px] rounded-full bg-fuchsia-300/25 blur-[120px]" />
      </div>

      {/* Barra de Gestión Rápida para Administradores / Organizadores */}
      {isAdminOrOwner && (
        <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 -mb-20">
          <div className="rounded-2xl border border-violet-200 bg-white/95 p-3 sm:px-4 shadow-md backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 font-bold">
                <Edit3 className="h-3.5 w-3.5" />
              </span>
              <span className="font-semibold text-slate-700">
                <strong className="text-slate-900">Modo Organizador / Admin:</strong> Puedes actualizar horarios, precios, cupos, ruta o portada de este evento.
              </span>
            </div>
            <Link
              href={`/organizador/carrera/${race.id}/editar`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 font-bold text-white transition-all shadow-xs shrink-0"
            >
              <Edit3 className="h-3 w-3" />
              <span>Editar Información</span>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Principal con Fotografía y Badges */}
      <RaceHero race={race} />

      {/* Contenido en dos columnas (Información detallada + Panel lateral Sticky) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px] gap-8 xl:gap-12 items-start">
          
          {/* Columna Izquierda: Información, Ficha Técnica, Kit y Altimetría */}
          <div className="flex flex-col gap-8">
            
            {/* Tarjeta de Resumen y Entrega de Kits */}
            {race.expo && (
              <div className="rounded-3xl border border-violet-100 bg-linear-to-r from-violet-50/70 via-fuchsia-50/40 to-white p-6 sm:p-7 shadow-sm backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20">
                    <PackageCheck className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
                        Expo & Entrega de Paquetes
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {race.expo.location}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 font-medium">
                      📅 <strong>Fechas:</strong> {race.expo.dates}
                      <br />
                      ⏰ <strong>Horario:</strong> {race.expo.hours}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      * Recuerda llevar tu identificación oficial y tu boleto digital con código QR de Písale.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tarjeta de Acceso a la Guía Oficial del Atleta */}
            <div className="rounded-3xl border border-sky-100 bg-linear-to-r from-sky-50/70 via-indigo-50/40 to-white p-6 sm:p-7 shadow-sm backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 block mb-1">
                      Logística & Operaciones
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Guía Oficial del Atleta 2026
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      Corrales de salida por ritmo, guardarropa, estaciones de abastecimiento y rutas de transporte.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/carrera/${race.id}/guia`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shrink-0 shadow-sm"
                >
                  <span>Ver Guía Oficial</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Tarjeta de Acceso a Estrategia y Pulsera de Ritmos (Condicional) */}
            {race.features?.strategy !== false && (
              <div className="rounded-3xl border border-violet-100 bg-linear-to-r from-violet-50/70 via-fuchsia-50/40 to-white p-6 sm:p-7 shadow-sm backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-md shadow-violet-500/20">
                      <Timer className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700 block mb-1">
                        Pacer Virtual & Rendimiento
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-900">
                        Calculadora de Ritmos & Pulsera de Muñeca
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        Calcula tus splits km a km, estrategia de ritmo y genera tu pulsera recortable para la muñeca (Pace Band).
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/carrera/${race.id}/estrategia`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-xs font-black text-white hover:opacity-95 transition-all shrink-0 shadow-sm shadow-violet-500/20"
                  >
                    <span>Planificar Ritmo</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Grid: Live Tracking & Galería de Fotos Oficial (Condicional) */}
            {(race.features?.liveTracking !== false || race.features?.photos !== false) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tarjeta Sigue a tu Corredor */}
                {race.features?.liveTracking !== false && (
                  <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                          Familiares & Amigos
                        </span>
                        <h3 className="font-display font-black text-slate-900 text-base">
                          Sigue a tu Corredor en Vivo
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      Consulta el avance por dorsal o nombre sobre el circuito RFID y mira la hora calculada de llegada a la meta (ETA).
                    </p>
                    <Link
                      href={`/carrera/${race.id}/tracking`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>Abrir Radar en Vivo</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}

                {/* Tarjeta Galería de Fotos Oficial */}
                {race.features?.photos !== false && (
                  <div className="rounded-3xl border border-fuchsia-200/80 bg-gradient-to-br from-fuchsia-50/70 via-purple-50/40 to-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white flex items-center justify-center shadow-sm">
                        <Camera className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-fuchsia-700 block">
                          Foto Finisher HD
                        </span>
                        <h3 className="font-display font-black text-slate-900 text-base">
                          Fotos Oficiales por Dorsal
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      Encuentra tus fotografías en ruta, meta y podio. Descárgalas en alta resolución con el marco conmemorativo oficial.
                    </p>
                    <Link
                      href={`/carrera/${race.id}/fotos`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>Ver Fotos del Evento</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Tarjeta de Convocatoria a Voluntarios & Staff Oficial (Condicional) */}
            {race.features?.volunteers !== false && (
              <div className="rounded-3xl border border-amber-200/90 bg-linear-to-r from-amber-50/80 via-orange-50/40 to-white p-6 sm:p-7 shadow-sm backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
                      <HeartHandshake className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                          Comunidad & Convocatoria Oficial
                        </span>
                        <span className="rounded-full bg-amber-200/70 text-amber-900 px-2 py-0.5 text-[10px] font-black">
                          Cupos Abiertos
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900">
                        Sé parte del Staff / Voluntariado
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-xl">
                        Únete al equipo operativo en hidratación, entrega de kits, guardarropa y entrega de medallas. Recibe playera Dry-Fit oficial, kit de alimentación, medalla de staff y tu gafete digital con QR.
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/carrera/${race.id}/voluntarios`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-xs font-black text-white hover:opacity-95 transition-all shrink-0 shadow-sm shadow-orange-500/20"
                  >
                    <span>Sé parte del Staff / Voluntariado</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Ficha Técnica: Kit del Corredor */}
            <RunnerKitGrid items={race.kitItems} />

            {/* Ficha Técnica: Ruta y Perfil Altimétrico */}
            <RouteElevationSection race={race} />

            {/* Información del Organizador y Políticas */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Organizado por {race.organizer?.name || "Asociación Oficial"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Evento verificado por el comité organizador y avalado en Písale
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cancelaciones y cambios:</strong> Se permite transferencia de número hasta 7 días antes de la carrera.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Resultados en vivo:</strong> Consulta tus tiempos parciales y finales en tiempo real desde la plataforma.
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Tarjeta Sticky de Inscripción y Validación de Auth */}
          <aside className="w-full">
            <RaceActionCard
              race={race}
              isLoggedIn={isLoggedIn}
              userEmail={userEmail}
            />
          </aside>

        </div>
      </div>

      {/* Barra flotante inferior para dispositivos móviles */}
      <MobileFloatingCta race={race} isLoggedIn={isLoggedIn} />
    </div>
  );
}
