import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Calendar, Medal, Timer, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Obtenemos el nombre (y solo el primer nombre para hacerlo más amigable)
  const firstName = session.user?.name?.split(" ")[0] || "Corredor";

  return (
    <div className="min-h-screen bg-[#fbfaff] selection:bg-violet-200">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-fuchsia-300/20 rounded-full blur-[130px] opacity-70" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Hola, <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-600">{firstName}</span>
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Aquí está el resumen de tu rendimiento y próximos eventos.
            </p>
          </div>
          <Link 
            href="/carreras"
            className="btn-shine group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-8 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Explorar carreras
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
              <h3 className="font-bold text-slate-700">Carreras completadas</h3>
            </div>
            <p className="font-display text-4xl font-extrabold text-slate-900">0</p>
          </div>

          {/* Stat Card 2 */}
          <div className="border-beam relative bg-white/70 p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
                <Medal className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-700">Logros desbloqueados</h3>
            </div>
            <p className="font-display text-4xl font-extrabold text-slate-900">0</p>
          </div>

          {/* Stat Card 3 */}
          <div className="border-beam relative bg-white/70 p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-700">Ritmo promedio</h3>
            </div>
            <p className="font-display text-4xl font-extrabold text-slate-900">--:--</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximos eventos */}
          <section className="bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900">Próximos eventos</h2>
              <Calendar className="h-6 w-6 text-slate-400" />
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <Timer className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No tienes carreras próximas</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Aún no te has inscrito a ningún maratón. ¡Es momento de empezar el reto!
              </p>
            </div>
          </section>

          {/* Historial */}
          <section className="bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900">Historial</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-3xl">
              <p className="text-slate-500 font-medium">Tus tiempos aparecerán aquí después de tu primera carrera.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
