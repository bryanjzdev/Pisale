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
import { Building2, Info, MapPin, PackageCheck, ShieldCheck, BookOpen, ArrowRight } from "lucide-react";

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

export default async function CarreraDetallePage({ params }: Props) {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    notFound();
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userEmail = session?.user?.email;

  return (
    <div className="relative min-h-screen bg-[#fbfaff] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-24 lg:pb-16">
      {/* Fondo con aurora sutil */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[800px] overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-violet-300/30 blur-[130px]" />
        <div className="absolute right-0 top-20 h-[450px] w-[450px] rounded-full bg-fuchsia-300/25 blur-[120px]" />
      </div>

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
