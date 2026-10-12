import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getRaceById } from "@/lib/races";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const instant = false;

export default async function CarreraExitoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = await params;
  const { session_id } = await searchParams;

  const race = await getRaceById(id);
  if (!race) {
    notFound();
  }

  const session = await auth();

  // Buscar el registro en la base de datos si existe session_id
  let registration = null;
  if (session_id) {
    if (session_id.startsWith("demo_")) {
      const regId = session_id.replace("demo_", "");
      registration = await prisma.registration.findUnique({
        where: { id: regId },
      });
    } else {
      registration = await prisma.registration.findUnique({
        where: { stripeSessionId: session_id },
      });

      // Si viene de Stripe real y aún no está CONFIRMED, confirmamos inmediatamente:
      if (registration && registration.status !== "CONFIRMED") {
        try {
          const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
          if (stripeSession.payment_status === "paid") {
            const bibNumber = registration.bibNumber || `PSL-${Math.floor(1000 + Math.random() * 9000)}`;
            registration = await prisma.registration.update({
              where: { id: registration.id },
              data: {
                status: "CONFIRMED",
                bibNumber: bibNumber,
                stripePaymentIntentId:
                  typeof stripeSession.payment_intent === "string"
                    ? stripeSession.payment_intent
                    : undefined,
              },
            });
          }
        } catch (e) {
          console.error("Error verificando sesion de stripe:", e);
        }
      }
    }
  }

  // Fallback si no hay registro aún o no tenía session_id
  if (!registration && session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      registration = await prisma.registration.findFirst({
        where: { userId: user.id, raceId: race.id },
        orderBy: { registeredAt: "desc" },
      });
      // Si la persona llegó a la página de éxito y está PENDING, confirmarla:
      if (registration && registration.status !== "CONFIRMED") {
        const bibNumber = registration.bibNumber || `PSL-${Math.floor(1000 + Math.random() * 9000)}`;
        registration = await prisma.registration.update({
          where: { id: registration.id },
          data: { status: "CONFIRMED", bibNumber },
        });
      }
    }
  }

  // Fallback si no hay registro aún
  const bibNumber = registration?.bibNumber || "PSL-2026-084";
  const distance = registration?.distanceName || race.distances[0] || "21K";
  const shirtSize = registration?.shirtSize || "M";
  const runnerName = session?.user?.name || "Corredor Oficial";
  const runnerEmail = session?.user?.email || "";

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-24 pt-36 sm:pt-40">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[130px]" />
        <div className="absolute top-1/3 -left-20 h-[450px] w-[450px] rounded-full bg-fuchsia-400/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header de Confirmación */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-linear-to-tr from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/25 text-white mb-5 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Inscripción Exitosa y Confirmada
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            ¡Nos vemos en la meta,{" "}
            <span className="bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {runnerName.split(" ")[0]}!
            </span>
          </h1>

          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Tu lugar para <strong className="text-slate-900">{race.title}</strong> está 100% asegurado. Hemos enviado tus accesos a{" "}
            <strong className="text-violet-700">{runnerEmail || "tu correo registrado"}</strong>.
          </p>
        </div>

        {/* Tarjeta de Boleto Digital / Wallet Pass */}
        <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(91,33,182,0.15)] backdrop-blur-2xl">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Detalles del Boleto */}
            <div className="flex-1 space-y-5 w-full">
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Evento Oficial
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {race.title}
                  </h2>
                </div>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                  {distance}
                </span>
              </div>

              {/* Grid de Datos del Corredor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Número / Folio
                  </span>
                  <span className="font-mono text-sm sm:text-base font-black text-violet-600 whitespace-nowrap tracking-tight block">
                    {bibNumber}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Talla Playera
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {shirtSize}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Fecha Evento
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {race.day} {race.month} {race.year}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Hora Arranque
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {race.startTime || "06:30 hrs"}
                  </span>
                </div>
              </div>

              {/* Ubicación y Expo */}
              <div className="rounded-2xl bg-violet-50/70 p-4 border border-violet-100 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <MapPin className="h-4 w-4 text-violet-600" /> {race.location}
                </div>
                {race.expo && (
                  <p className="text-slate-500 pl-6">
                    <strong>Entrega de kits:</strong> {race.expo.location} ({race.expo.dates})
                  </p>
                )}
              </div>
            </div>

            {/* Código QR y Acciones */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900 text-white w-full lg:w-64 text-center shadow-xl">
              <div className="bg-white p-3 rounded-xl mb-3 shadow-md">
                {/* QR Code Icon / Visual Mockup */}
                <QrCode className="h-32 w-32 text-slate-900" />
              </div>
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-300">
                {bibNumber}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Muestra este QR en la entrega de kits
              </span>
            </div>
          </div>

          {/* Botones de Navegación */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all"
            >
              Ver en mi Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Explorar Más Carreras
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
