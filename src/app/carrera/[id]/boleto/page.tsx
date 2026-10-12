import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getRaceById } from "@/lib/races";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Trophy,
  CheckCircle2,
  Info,
} from "lucide-react";
import { RealQRCode } from "@/components/common/RealQRCode";
import { BotonImprimirBoleto } from "@/components/common/BotonImprimirBoleto";
import { BotonEnviarCorreoTicket } from "@/components/common/BotonEnviarCorreoTicket";

export const instant = false;

export default async function BoletoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    session_id?: string;
    registration_id?: string;
  }>;
}) {
  const { id } = await params;
  const { session_id, registration_id } = await searchParams;

  const race = await getRaceById(id);
  if (!race) {
    notFound();
  }

  const session = await auth();

  // Buscar inscripción
  let registration = null;

  if (registration_id) {
    registration = await prisma.registration.findUnique({
      where: { id: registration_id },
      include: { user: true },
    });
  } else if (session_id) {
    if (session_id.startsWith("demo_")) {
      const regId = session_id.replace("demo_", "");
      registration = await prisma.registration.findUnique({
        where: { id: regId },
        include: { user: true },
      });
    } else {
      registration = await prisma.registration.findUnique({
        where: { stripeSessionId: session_id },
        include: { user: true },
      });
    }
  }

  // Fallback buscando por usuario actual si aún no se encontró
  if (!registration && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (dbUser) {
      registration = await prisma.registration.findFirst({
        where: { userId: dbUser.id, raceId: race.id },
        orderBy: { registeredAt: "desc" },
        include: { user: true },
      });
    }
  }

  const runnerName =
    registration?.user?.name || session?.user?.name || "Corredor Oficial";
  const runnerEmail =
    registration?.user?.email || session?.user?.email || "atleta@pisale.mx";
  const bibNumber = registration?.bibNumber || "PSL-2026-VIP";
  const distance =
    registration?.distanceName || race.distances[0] || "21K Medio Maratón";
  const shirtSize = registration?.shirtSize || "M";
  const registrationId = registration?.id || "REG-PISALE-OFFICIAL";
  const amountPaid = registration?.amountPaid || race.price || 550;
  const registeredDate = registration?.registeredAt
    ? new Date(registration.registeredAt).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : `${race.day} ${race.month} ${race.year}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-fuchsia-500 selection:text-white print:bg-white print:text-slate-900 pb-20 pt-28 sm:pt-32">
      {/* Barra de Herramientas Superior (Oculta en Impresión) */}
      <div className="print-hidden mx-auto max-w-5xl px-4 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900/80 p-4 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <Link
            href={`/carrera/${race.id}/exito${session_id ? `?session_id=${session_id}` : ""}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Confirmación
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {registration && (
              <BotonEnviarCorreoTicket
                registrationId={registration.id}
                runnerEmail={runnerEmail}
                compact={true}
              />
            )}
            <BotonImprimirBoleto />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Info className="h-3.5 w-3.5 text-violet-400" />
          <span>
            Para guardarlo en tu celular o PC: Da clic en <strong>Imprimir / Descargar</strong> y selecciona el destino <em>Guardar como PDF</em>.
          </span>
        </div>
      </div>

      {/* BOLETO PRINCIPAL / BOARDING PASS DEPORTIVO */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="print-break-inside-avoid relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.6)] print:shadow-none print:border-2 print:border-slate-900 print:bg-white print:text-slate-900">
          
          {/* Banda Superior Estilo Federación */}
          <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md font-display font-black text-lg">
                P
              </span>
              <div>
                <span className="font-display text-sm sm:text-base font-black tracking-wider uppercase block">
                  PÍSALE · PASAPORTE OFICIAL DE COMPETIDOR
                </span>
                <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">
                  World Athletics & Timing System Certified
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-black">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>FOLIO OFICIAL: {bibNumber}</span>
            </div>
          </div>

          {/* Cuerpo Central del Pase */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Lado Izquierdo: Datos Principales de Carrera y Atleta (8 Cols) */}
            <div className="lg:col-span-8 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-dashed border-slate-800 print:border-slate-400">
              
              {/* Evento y Categoría */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <span className="inline-block rounded-full bg-violet-500/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-violet-300 print:bg-slate-100 print:text-violet-700 mb-2">
                    {race.category} · Edición Oficial 2026
                  </span>
                  <h1 className="font-display text-2xl sm:text-4xl font-black text-white print:text-slate-900 tracking-tight leading-none">
                    {race.title}
                  </h1>
                </div>

                <div className="rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-center text-white shadow-lg print:border print:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-widest block opacity-80">
                    Distancia
                  </span>
                  <span className="font-display text-xl font-black block">
                    {distance}
                  </span>
                </div>
              </div>

              {/* Nombre del Atleta */}
              <div className="rounded-2xl bg-slate-800/50 p-5 border border-slate-800 mb-6 print:bg-slate-50 print:border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Atleta Registrado
                </span>
                <p className="font-display text-xl sm:text-2xl font-black text-white print:text-slate-900">
                  {runnerName}
                </p>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                  Contacto: {runnerEmail} · Inscripción confirmada el {registeredDate}
                </p>
              </div>

              {/* Grid Métrico de Carrera (Tipo Boarding Pass) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Dorsal / Folio
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-violet-400 print:text-violet-800 mt-1 block">
                    {bibNumber}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Talla Playera
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-white print:text-slate-900 mt-1 block">
                    {shirtSize}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Arranque
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-white print:text-slate-900 mt-1 block">
                    {race.startTime || "06:30 hrs"}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Pagado
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-emerald-400 print:text-emerald-700 mt-1 block">
                    ${amountPaid} MXN
                  </span>
                </div>
              </div>

              {/* Logística y Sede */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 print:text-slate-700">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-900/60 p-4 border border-slate-800/80 print:bg-white print:border-slate-300">
                  <MapPin className="h-5 w-5 text-fuchsia-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white print:text-slate-900 block font-bold">
                      Sede de Salida y Meta
                    </strong>
                    <span>{race.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-900/60 p-4 border border-slate-800/80 print:bg-white print:border-slate-300">
                  <Calendar className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white print:text-slate-900 block font-bold">
                      Fecha del Evento
                    </strong>
                    <span>
                      {race.day} {race.month} {race.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Expo / Kits */}
              {race.expo && (
                <div className="mt-4 rounded-2xl bg-violet-950/30 p-4 border border-violet-800/40 text-xs print:bg-slate-50 print:border-slate-300">
                  <div className="flex items-center gap-2 font-bold text-violet-300 print:text-violet-900">
                    <Trophy className="h-4 w-4" />
                    <span>Entrega Oficial de Kits y Paquetes de Corredor:</span>
                  </div>
                  <p className="text-slate-300 print:text-slate-600 mt-1 pl-6">
                    <strong>Lugar:</strong> {race.expo.location} · <strong>Horarios:</strong> {race.expo.dates}
                  </p>
                </div>
              )}
            </div>

            {/* Lado Derecho: Talón Perforado de Control de Kits (4 Cols) */}
            <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-slate-950/60 print:bg-white text-center">
              <div>
                <div className="inline-block rounded-full bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-300 print:bg-slate-100 print:text-slate-800 mb-4">
                  Talón de Control Expo
                </div>

                <h3 className="font-display text-lg font-black text-white print:text-slate-900 mb-1">
                  Check-In Oficial
                </h3>
                <p className="text-[11px] text-slate-400 print:text-slate-600 mb-5">
                  Presenta este código en la mesa de entrega de kits junto con tu INE/identificación.
                </p>

                {/* Código QR de Alta Definición */}
                <div className="mx-auto w-fit rounded-2xl bg-white p-3.5 shadow-2xl border-4 border-slate-800 print:border-slate-300">
                  <RealQRCode value={bibNumber} size={160} />
                </div>

                <div className="mt-3">
                  <span className="font-mono text-sm font-black tracking-widest text-violet-400 print:text-violet-800 block">
                    {bibNumber}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {registrationId.slice(0, 16)}
                  </span>
                </div>
              </div>

              {/* Casillas de Control para Staff de Expo */}
              <div className="mt-6 pt-5 border-t border-slate-800 print:border-slate-300 text-left space-y-2 text-[11px] text-slate-300 print:text-slate-700">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">
                  Uso Exclusivo Staff Písale
                </span>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-600" disabled />
                  <span>Chip de cronometraje activado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-600" disabled />
                  <span>Playera oficial entregada ({shirtSize})</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-600" disabled />
                  <span>Número de dorsal asignado</span>
                </label>
              </div>
            </div>

          </div>

          {/* Línea Perforada Decorativa Inferior */}
          <div className="border-t border-dashed border-slate-800 print:border-slate-300 px-6 sm:px-10 py-3 bg-slate-950 print:bg-white flex flex-wrap items-center justify-between text-[10px] text-slate-500 print:text-slate-600">
            <span>
              PÍSALE TICKETING & TIMING PLATFORM · PLATAFORMA DEPORTIVA OFICIAL
            </span>
            <span>
              COMPROBANTE VÁLIDO CON CÓDIGO QR Y FOLIO ACTIVO
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
