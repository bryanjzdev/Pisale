import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { Calendar, Medal, Timer, TrendingUp, Trophy, QrCode, ArrowRight, Sparkles, CheckCircle2, Building2, LogOut, ShieldCheck, Printer, Download, AlertCircle } from "lucide-react";
import Link from "next/link";
import { BotonEnviarCorreoTicket } from "@/components/common/BotonEnviarCorreoTicket";
import { BotonDescartarPendiente } from "@/components/common/BotonDescartarPendiente";

export const instant = false;

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Resolver ID de usuario
  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (dbUser) userId = dbUser.id;
  }

  // Limpieza inicial de registros huérfanos sin stripeSessionId que quedaron PENDING por errores pasados
  if (userId) {
    try {
      await prisma.registration.deleteMany({
        where: {
          userId,
          status: "PENDING",
          stripeSessionId: null,
        },
      });
    } catch (e) {
      console.error("Error limpiando registros huérfanos:", e);
    }
  }

  // Cargar inscripciones del usuario
  let registrations = userId
    ? await prisma.registration.findMany({
        where: { userId },
        orderBy: { registeredAt: "desc" },
      })
    : [];

  // Auto-verificar sesiones de Stripe pendientes
  for (const reg of registrations) {
    if (reg.status === "PENDING" && reg.stripeSessionId) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(reg.stripeSessionId);
        if (stripeSession.payment_status === "paid") {
          const bibNumber = reg.bibNumber || `PSL-${Math.floor(1000 + Math.random() * 9000)}`;
          await prisma.registration.update({
            where: { id: reg.id },
            data: {
              status: "CONFIRMED",
              bibNumber,
              stripePaymentIntentId:
                typeof stripeSession.payment_intent === "string"
                  ? stripeSession.payment_intent
                  : undefined,
            },
          });
          reg.status = "CONFIRMED";
          reg.bibNumber = bibNumber;
        }
      } catch (err) {
        console.error("Error auto-verifying pending session:", err);
      }
    }
  }

  // Si el usuario ya tiene un boleto CONFIRMED para una carrera, eliminar cualquier intento PENDING obsoleto de esa misma carrera
  const confirmedRaceIds = registrations
    .filter((r) => r.status === "CONFIRMED" && r.raceId)
    .map((r) => r.raceId as string);

  if (confirmedRaceIds.length > 0 && userId) {
    try {
      await prisma.registration.deleteMany({
        where: {
          userId,
          status: "PENDING",
          raceId: { in: confirmedRaceIds },
        },
      });
      // Filtrar de la lista local en memoria también
      registrations = registrations.filter(
        (r) => !(r.status === "PENDING" && r.raceId && confirmedRaceIds.includes(r.raceId))
      );
    } catch (e) {
      console.error("Error limpiando intentos pendientes obsoletos:", e);
    }
  }

  const confirmedRegistrations = registrations.filter((r) => r.status === "CONFIRMED");
  const pendingRegistrations = registrations.filter((r) => r.status === "PENDING");

  const firstName = session.user?.name?.split(" ")[0] || "Corredor";
  const confirmedCount = confirmedRegistrations.length;
  const isOwnerOrAdmin =
    session.user.email?.toLowerCase() === "bjm.dev.soft@gmail.com" ||
    (session.user as any).role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#fbfaff] selection:bg-violet-200">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-fuchsia-300/20 rounded-full blur-[130px] opacity-70" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-violet-300/20 rounded-full blur-[120px] opacity-70" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-700 backdrop-blur-md mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Panel de Atleta Oficial
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Hola, <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-600">{firstName}</span>
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Aquí está el resumen de tus boletos, inscripciones y rendimiento.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {isOwnerOrAdmin && (
              <Link
                href="/admin"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/90 px-4 text-xs font-extrabold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm"
              >
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                Panel SuperAdmin
              </Link>
            )}
            <Link
              href="/organizador/dashboard"
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Building2 className="h-4 w-4 text-violet-600" />
              Panel Organizador
            </Link>
            <Link 
              href="/carreras"
              className="btn-shine group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-6 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Explorar carreras
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100/80 transition-colors shadow-sm cursor-pointer"
                title="Cerrar sesión para cambiar de cuenta"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stat Card 1 */}
          <div className="border-beam relative bg-white/70 p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-700">Carreras inscritas</h3>
            </div>
            <p className="font-display text-4xl font-extrabold text-slate-900">
              {confirmedCount}
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className="border-beam relative bg-white/70 p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
                <Medal className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-700">Logros desbloqueados</h3>
            </div>
            <p className="font-display text-4xl font-extrabold text-slate-900">
              {confirmedCount > 0 ? "1" : "0"}
            </p>
          </div>

          {/* Stat Card 3 */}
          <div className="border-beam relative bg-white/70 p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-700">Estado de Cuenta</h3>
            </div>
            <p className="font-display text-2xl font-extrabold text-emerald-600">
              Activo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximos eventos / Boletos Comprados */}
          <section className="bg-white/70 p-7 sm:p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900">Tus Boletos y Carreras</h2>
              <Calendar className="h-6 w-6 text-slate-400" />
            </div>

            {/* Sección de Intentos Pendientes de Pago (si los hay) */}
            {pendingRegistrations.length > 0 && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4.5">
                <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-xs">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Inscripciones Incompletas / Pendientes de Pago ({pendingRegistrations.length})</span>
                </div>
                <p className="text-[11px] text-amber-700/90 mb-3">
                  Iniciaste el proceso de inscripción pero no se concluyó el pago. Puedes completar tu inscripción o descartar el intento.
                </p>
                <div className="space-y-2">
                  {pendingRegistrations.map((pReg) => (
                    <div
                      key={pReg.id}
                      className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-amber-200/80 shadow-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">
                          {pReg.raceTitle || "Carrera Pisale"} · {pReg.distanceName || "General"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Total por pagar: <strong>${pReg.amountPaid} MXN</strong>
                          {pReg.shirtSize && ` · Talla ${pReg.shirtSize}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BotonDescartarPendiente registrationId={pReg.id} />
                        {pReg.raceId && (
                          <Link
                            href={`/carrera/${pReg.raceId}`}
                            className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800 transition-all"
                          >
                            Completar Pago
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {confirmedRegistrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <Timer className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No tienes carreras próximas</h3>
                <p className="text-slate-500 mt-2 max-w-sm text-sm">
                  Aún no te has inscrito a ningún maratón. ¡Es momento de empezar el reto!
                </p>
                <Link
                  href="/carreras"
                  className="mt-5 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Ver carreras disponibles
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {confirmedRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-violet-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 uppercase mb-2">
                          {reg.distanceName || "Distancia General"}
                        </span>
                        <h3 className="font-display text-lg font-black text-slate-900 group-hover:text-violet-600 transition-colors">
                          {reg.raceTitle || "Carrera Pisale"}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Inscrito el {new Date(reg.registeredAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                          {reg.shirtSize && ` · Talla ${reg.shirtSize}`}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        {reg.bibNumber ? (
                          <span className="font-mono text-sm font-black text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-100">
                            {reg.bibNumber}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Asignando folio...</span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Pagado
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 font-medium">
                        Total pagado: <strong>${reg.amountPaid} MXN</strong>
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <BotonEnviarCorreoTicket
                          registrationId={reg.id}
                          runnerEmail={session?.user?.email || undefined}
                          compact={true}
                        />
                        {reg.raceId && (
                          <>
                            <Link
                              href={`/carrera/${reg.raceId}/boleto?registration_id=${reg.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors"
                            >
                              <Printer className="h-3 w-3 text-violet-600" />
                              Boleto PDF
                            </Link>
                            <Link
                              href={`/carrera/${reg.raceId}/exito?session_id=${reg.stripeSessionId || `demo_${reg.id}`}`}
                              className="inline-flex items-center gap-1 font-bold text-violet-600 hover:text-violet-800 transition-colors"
                            >
                              <QrCode className="h-3.5 w-3.5" />
                              Ver Boleto
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Historial */}
          <section className="bg-white/70 p-7 sm:p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900">Historial de Tiempos</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/70 rounded-3xl border border-slate-100">
              <Trophy className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-slate-700 font-bold text-sm">Tus tiempos oficiales</p>
              <p className="text-slate-400 font-medium text-xs max-w-xs mt-1">
                Aparecerán automáticamente aquí en tiempo real una vez que cruces la meta del evento.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
