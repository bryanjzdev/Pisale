import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Users,
  Trophy,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import {
  BotonAprobarOrganizacion,
  BotonRechazarOrganizacion,
  BotonToggleCarrera,
} from "@/components/admin/AdminActionButtons";

export const instant = false;

export const metadata = {
  title: "Panel Maestro de Administración | Písale",
  description: "Control central de la plataforma: aprobación de promotores, supervisión de eventos y métricas de transacciones.",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin");
  }

  // 1. Verificar si el usuario es Administrador o Dueño
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const isOwnerEmail = session.user.email.toLowerCase() === "bjm.dev.soft@gmail.com";
  const isAdmin = dbUser?.role === "ADMIN" || isOwnerEmail;

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Auto-promover al dueño a rol ADMIN si aún no lo tiene en BD
  if (isOwnerEmail && dbUser && dbUser.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: "ADMIN" },
    });
  }

  // 2. Consultar datos globales de la plataforma
  const [organizations, races, confirmedRegistrations, totalUsersCount] = await Promise.all([
    prisma.organization.findMany({
      include: {
        owner: true,
        races: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.race.findMany({
      include: {
        organization: true,
        distances: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.registration.findMany({
      where: { status: "CONFIRMED" },
    }),
    prisma.user.count(),
  ]);

  // Métricas
  const totalGMV = confirmedRegistrations.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
  const platformFee = Math.round(totalGMV * 0.05); // 5% de comisión estimada
  const pendingOrgs = organizations.filter((o) => o.status === "PENDING");
  const verifiedOrgs = organizations.filter((o) => o.status === "VERIFIED");

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-28 pt-32 sm:pt-36">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-violet-400/20 blur-[140px]" />
        <div className="absolute top-1/2 -left-20 h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header SuperAdmin */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-bold text-violet-700 backdrop-blur-md mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-600" /> Modo SuperAdmin · Dueño de Plataforma
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Panel Maestro de Písale
            </h1>
            <p className="mt-2 text-base text-slate-500 font-medium">
              Control central de marketplace: aprobación de solicitudes de promotores, supervisión de eventos y finanzas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Mi Dashboard Atleta
            </Link>
            <Link
              href="/organizador/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50/80 px-4 text-xs font-bold text-violet-700 hover:bg-violet-100 transition-colors shadow-sm"
            >
              Panel Organizador
            </Link>
          </div>
        </div>

        {/* Banner de Alerta si hay Organizadores Pendientes */}
        {pendingOrgs.length > 0 && (
          <div className="mb-10 rounded-3xl border border-amber-300 bg-amber-50/90 p-6 shadow-md backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-200 text-amber-900">
                <Clock className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {pendingOrgs.length} {pendingOrgs.length === 1 ? "Solicitud de Promotor Pendiente" : "Solicitudes de Promotores Pendientes"}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Hay nuevos organizadores esperando tu validación oficial para poder publicar carreras y recibir pagos.
                </p>
              </div>
            </div>
            <a
              href="#solicitudes-pendientes"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all shrink-0"
            >
              Revisar Solicitudes ↓
            </a>
          </div>
        )}

        {/* Métricas Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {/* Card 1: Volumen Procesado */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Volumen Transaccionado
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display text-3xl font-black text-slate-900 tracking-tight">
              ${totalGMV.toLocaleString("es-MX")} <span className="text-xs font-semibold text-slate-400">MXN</span>
            </p>
            <p className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Procesado vía Stripe oficial
            </p>
          </div>

          {/* Card 2: Comisión Písale */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Comisión Písale (5%)
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display text-3xl font-black text-violet-600 tracking-tight">
              ${platformFee.toLocaleString("es-MX")} <span className="text-xs font-semibold text-slate-400">MXN</span>
            </p>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Ingreso neto estimado de la plataforma
            </p>
          </div>

          {/* Card 3: Corredores */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Inscripciones Pagadas
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display text-3xl font-black text-slate-900 tracking-tight">
              {confirmedRegistrations.length}
            </p>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Boletos y folios generados con QR
            </p>
          </div>

          {/* Card 4: Organizadores */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Promotores / Clubes
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display text-3xl font-black text-slate-900 tracking-tight">
              {organizations.length}
            </p>
            <p className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span className="font-bold text-emerald-600">{verifiedOrgs.length} verificados</span>
              {pendingOrgs.length > 0 && (
                <span className="font-bold text-amber-600">· {pendingOrgs.length} pendientes</span>
              )}
            </p>
          </div>
        </div>

        {/* Sección 1: Solicitudes Pendientes de Aprobación */}
        <section id="solicitudes-pendientes" className="mb-14 scroll-mt-36">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 mb-1.5">
                <Clock className="h-3.5 w-3.5" /> Bandeja de Validación
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900">
                Solicitudes de Organizadores por Aprobar ({pendingOrgs.length})
              </h2>
            </div>
          </div>

          {pendingOrgs.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 text-center backdrop-blur-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                No hay solicitudes pendientes en este momento
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Todos los promotores y clubes registrados ya han sido verificados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingOrgs.map((org) => (
                <div
                  key={org.id}
                  className="rounded-3xl border-2 border-amber-300/80 bg-white p-6 shadow-md space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-800 mb-1.5">
                        {org.type || "CLUB"} · Pendiente
                      </span>
                      <h3 className="font-display text-lg font-black text-slate-900">
                        {org.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Dueño: {org.owner.name || "Sin nombre"} ({org.owner.email})
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">WhatsApp</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-violet-600" />
                        {org.phone || "No especificado"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">RFC / Razón</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <FileText className="h-3 w-3 text-slate-400" />
                        {org.rfc || "No proporcionado"}
                      </span>
                    </div>
                  </div>

                  {org.description && (
                    <p className="text-xs text-slate-600 italic bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      "{org.description}"
                    </p>
                  )}

                  {/* Acciones de Validación */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <BotonRechazarOrganizacion orgId={org.id} />
                    <BotonAprobarOrganizacion orgId={org.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección 2: Supervisión Global de Carreras */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 mb-1.5">
                <Trophy className="h-3.5 w-3.5" /> Eventos en la Plataforma
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900">
                Catálogo Global de Carreras ({races.length})
              </h2>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Carrera</th>
                    <th className="px-6 py-4">Organizador</th>
                    <th className="px-6 py-4">Fecha & Sede</th>
                    <th className="px-6 py-4">Distancias</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {races.map((race) => (
                    <tr key={race.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {race.imageUrl && (
                            <img
                              src={race.imageUrl}
                              alt=""
                              className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-200"
                            />
                          )}
                          <div>
                            <Link
                              href={`/carrera/${race.id}`}
                              className="font-bold text-slate-900 hover:text-violet-600 transition-colors flex items-center gap-1"
                            >
                              {race.title}
                              <ExternalLink className="h-3 w-3 text-slate-400" />
                            </Link>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">
                              {race.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">
                          {race.organization?.name || "Sin organización"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {new Date(race.date).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[11px] text-slate-400">{race.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {race.distances.map((d) => (
                            <span
                              key={d.id}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700"
                            >
                              {d.name} (${d.price})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            race.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {race.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <BotonToggleCarrera raceId={race.id} currentStatus={race.status as any} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sección 3: Promotores y Clubes Oficiales */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Promotores Autorizados
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900">
                Organizaciones Verificadas ({verifiedOrgs.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {verifiedOrgs.map((org) => (
              <div
                key={org.id}
                className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                      {org.type || "CLUB"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verificado
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{org.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Contacto: {org.phone || org.owner.email}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{org.races.length} carreras creadas</span>
                  <BotonRechazarOrganizacion orgId={org.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
