import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Calendar, Medal, Timer, TrendingUp, Trophy, QrCode, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Cargar inscripciones reales del usuario
  const registrations = await prisma.registration.findMany({
    where: { userId: session.user.id },
    orderBy: { registeredAt: "desc" },
  });

  const firstName = session.user?.name?.split(" ")[0] || "Corredor";
  const confirmedCount = registrations.filter((r) => r.status === "CONFIRMED").length;

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
          <Link 
            href="/"
            className="btn-shine group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-8 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Explorar más carreras
          </Link>
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
            
            {registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <Timer className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No tienes carreras próximas</h3>
                <p className="text-slate-500 mt-2 max-w-sm text-sm">
                  Aún no te has inscrito a ningún maratón. ¡Es momento de empezar el reto!
                </p>
                <Link
                  href="/"
                  className="mt-5 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Ver carreras disponibles
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
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

                      <div className="text-right">
                        <span className="block font-mono text-sm font-black text-violet-600">
                          {reg.bibNumber || "Pendiente"}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-600">
                          {reg.status === "CONFIRMED" ? "Pagado / Confirmado" : "Pendiente"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Total pagado: <strong>${reg.amountPaid} MXN</strong>
                      </span>
                      {reg.raceId && (
                        <Link
                          href={`/carrera/${reg.raceId}/exito?session_id=${reg.stripeSessionId || `demo_${reg.id}`}`}
                          className="inline-flex items-center gap-1 font-bold text-violet-600 hover:text-violet-800 transition-colors"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          Ver Boleto Digital
                        </Link>
                      )}
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
