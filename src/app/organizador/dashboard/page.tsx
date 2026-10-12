import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Building2,
  DollarSign,
  Users,
  Trophy,
  Plus,
  ArrowUpRight,
  Calendar,
  MapPin,
  CheckCircle2,
  Shirt,
  Download,
  QrCode,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { ExportCsvButton } from "@/components/organizador/ExportCsvButton";

export const dynamic = "force-dynamic";
export const instant = false;

export const metadata = {
  title: "Panel del Organizador | Písale",
  description: "Gestiona tus eventos deportivos, revisa ventas en tiempo real, padrón de corredores y pedidos de kits.",
};

export default async function OrganizadorDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/organizador/dashboard");
  }

  // Resolver ID de usuario
  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (dbUser) userId = dbUser.id;
  }

  if (!userId) {
    redirect("/login");
  }

  // 1. Obtener organización del usuario y sus carreras
  const organization = await prisma.organization.findFirst({
    where: { ownerId: userId },
    include: {
      races: {
        include: {
          distances: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const races = organization?.races || [];
  const raceIds = races.map((r) => r.id);

  // 2. Obtener todas las inscripciones para las carreras del organizador
  const registrations = raceIds.length > 0
    ? await prisma.registration.findMany({
        where: { raceId: { in: raceIds } },
        include: { user: true },
        orderBy: { registeredAt: "desc" },
      })
    : [];

  const confirmedRegistrations = registrations.filter((r) => r.status === "CONFIRMED");

  // Métricas
  const totalRevenue = confirmedRegistrations.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
  const totalRunners = confirmedRegistrations.length;
  const totalEvents = races.length;

  // Breakdown de tallas de playera
  const shirtCounts: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0 };
  confirmedRegistrations.forEach((r) => {
    const size = r.shirtSize || "M";
    if (shirtCounts[size] !== undefined) {
      shirtCounts[size] += 1;
    } else {
      shirtCounts[size] = 1;
    }
  });

  const orgName = organization?.name || session.user.name || "Club Organizador";

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-28 pt-32 sm:pt-36">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-violet-400/20 blur-[140px]" />
        <div className="absolute top-1/2 -left-20 h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header del Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-bold text-violet-700 backdrop-blur-md mb-3">
              <Building2 className="h-3.5 w-3.5" /> Panel Oficial de Organización
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              {orgName}
            </h1>
            <p className="mt-2 text-base text-slate-500 font-medium">
              Monitoreo de ingresos, corredores registrados y logística de kits en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Ver como Corredor
            </Link>

            <Link
              href="/organizador/crear"
              className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-6 text-xs font-extrabold text-white shadow-lg shadow-fuchsia-500/25 hover:opacity-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              Publicar Nueva Carrera
            </Link>
          </div>
        </div>

        {/* Grid de Métricas Clave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {/* Card 1: Ingresos */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_10px_35px_-10px_rgba(91,33,182,0.08)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 text-slate-500 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                $
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Recaudación Neta</span>
            </div>
            <div className="font-display text-3xl sm:text-4xl font-black text-slate-900">
              ${totalRevenue.toLocaleString("es-MX")}
              <span className="text-xs font-bold text-slate-400 ml-1.5">MXN</span>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Stripe & OXXO Pay
            </p>
          </div>

          {/* Card 2: Corredores */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_10px_35px_-10px_rgba(91,33,182,0.08)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 text-slate-500 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Inscritos Oficiales</span>
            </div>
            <div className="font-display text-3xl sm:text-4xl font-black text-slate-900">
              {totalRunners}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Lugares confirmados
            </p>
          </div>

          {/* Card 3: Carreras activas */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_10px_35px_-10px_rgba(91,33,182,0.08)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 text-slate-500 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Eventos Activos</span>
            </div>
            <div className="font-display text-3xl sm:text-4xl font-black text-slate-900">
              {totalEvents}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Publicadas en Písale
            </p>
          </div>

          {/* Card 4: Pedido de playeras */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_10px_35px_-10px_rgba(91,33,182,0.08)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Shirt className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Playeras Solicitadas</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-2 text-center">
              {(["S", "M", "L", "XL"] as const).map((s) => (
                <div key={s} className="rounded-xl bg-slate-50 border border-slate-100 py-1.5">
                  <span className="block text-[10px] font-bold text-slate-400">{s}</span>
                  <span className="font-display text-sm font-extrabold text-slate-900">
                    {shirtCounts[s] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección: Carreras Publicadas */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-black text-slate-900">Tus Eventos y Carreras</h2>
              <p className="text-xs text-slate-500 font-medium">Revisa cupos y enlaces directos de cada convocatoria.</p>
            </div>
          </div>

          {races.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 p-12 text-center backdrop-blur-xl">
              <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-slate-800">No has publicado ninguna carrera aún</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Crea tu primera carrera y empieza a vender inscripciones con pasarela de pagos integrada.
              </p>
              <Link
                href="/organizador/crear"
                className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Crear mi primera carrera
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {races.map((race) => {
                const raceRegs = confirmedRegistrations.filter((r) => r.raceId === race.id);
                const raceTotal = raceRegs.reduce((acc, r) => acc + (r.amountPaid || 0), 0);

                return (
                  <div
                    key={race.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_10px_35px_-10px_rgba(91,33,182,0.1)] backdrop-blur-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Portada */}
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${race.imageUrl || ""})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                            {race.category}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display text-lg font-black text-slate-900 leading-snug">
                        {race.title}
                      </h3>

                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-violet-600" />
                          {new Date(race.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {race.location}
                        </div>
                      </div>

                      {/* Distancias configuradas */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {race.distances.map((d) => (
                          <span
                            key={d.id}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700"
                          >
                            {d.name}: ${d.price} MXN
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Ventas</span>
                        <span className="font-display text-sm font-extrabold text-slate-900">
                          ${raceTotal.toLocaleString("es-MX")} MXN
                        </span>
                      </div>

                      <Link
                        href={`/carrera/${race.id}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100 transition-colors"
                      >
                        Ver Convocatoria
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sección: Padrón Oficial de Corredores */}
        <section className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_45px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl font-black text-slate-900">Padrón de Corredores Registrados</h2>
              <p className="text-xs text-slate-500 font-medium">
                Listado oficial de atletas inscritos con número de folio para la entrega de kits y chips.
              </p>
            </div>

            {confirmedRegistrations.length > 0 && (
              <ExportCsvButton registrations={confirmedRegistrations} />
            )}
          </div>

          {confirmedRegistrations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold text-slate-600">Aún no hay inscripciones registradas</p>
              <p className="text-xs text-slate-400 mt-0.5">En cuanto un corredor pague su boleto aparecerá listado aquí con su folio.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold">
                    <th className="pb-3 pl-2">Folio / Número</th>
                    <th className="pb-3">Corredor</th>
                    <th className="pb-3">Carrera</th>
                    <th className="pb-3">Distancia</th>
                    <th className="pb-3">Talla</th>
                    <th className="pb-3">Pagado</th>
                    <th className="pb-3 text-right pr-2">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {confirmedRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pl-2 font-mono font-black text-violet-700">
                        {reg.bibNumber || "Pendiente"}
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-slate-900 block">
                          {reg.user?.name || "Corredor"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {reg.user?.email || "Sin email"}
                        </span>
                      </td>
                      <td className="py-3.5 max-w-[200px] truncate font-semibold text-slate-800">
                        {reg.raceTitle || "Carrera Oficial"}
                      </td>
                      <td className="py-3.5 font-bold">
                        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] text-violet-700">
                          {reg.distanceName || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-slate-900">
                        {reg.shirtSize || "M"}
                      </td>
                      <td className="py-3.5 font-extrabold text-slate-900">
                        ${reg.amountPaid} MXN
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Confirmado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
