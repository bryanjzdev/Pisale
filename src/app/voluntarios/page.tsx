import { getAllRaces } from "@/lib/races";
import Link from "next/link";
import Image from "next/image";
import {
  HeartHandshake,
  Users,
  Shirt,
  Medal,
  FileCheck,
  Coffee,
  QrCode,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Compass,
} from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Convocatoria de Voluntarios & Staff Deportivo | Písale",
  description:
    "Únete al staff oficial de las mejores carreras de México. Recibe playera Dry-Fit, kit de nutrición, acreditación digital y constancia de voluntariado.",
};

const VOLUNTEER_PERKS = [
  {
    icon: Shirt,
    title: "Playera Oficial Dry-Fit Staff",
    desc: "Edición exclusiva para voluntarios y jueces de ruta, no disponible a la venta general.",
    color: "from-violet-500 to-indigo-600",
  },
  {
    icon: Medal,
    title: "Medalla & Reconocimiento Finisher Crew",
    desc: "Medalla conmemorativa de staff y diploma digital con firma del director del evento.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: FileCheck,
    title: "Constancia de Servicio Comunitario",
    desc: "Acreditación oficial válida para servicio social universitario o curricular (8 a 12 horas).",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Coffee,
    title: "Kit de Hidratación & Alimentos",
    desc: "Desayuno energético, barra proteica, fruta, agua y bebidas isotónicas ilimitadas.",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    icon: QrCode,
    title: "Gafete Digital con Código QR",
    desc: "Acceso preferente a zonas operativas, arco de meta y logística con tu credencial en el celular.",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: Sparkles,
    title: "Pase de Descuento para Correr",
    desc: "50% de descuento en tu próxima inscripción a cualquier evento operado por la red Písale.",
    color: "from-rose-500 to-red-600",
  },
];

const ROLES_LIST = [
  {
    emoji: "💧",
    name: "Puntos de Hidratación",
    schedule: "06:00 - 10:30 hrs",
    spots: "14 cupos",
    focus: "Ruta 5K / 10K / 21K",
  },
  {
    emoji: "🏅",
    name: "Meta y Entrega de Medallas",
    schedule: "06:30 - 11:30 hrs",
    spots: "8 cupos",
    focus: "Arco de Meta & Recovery",
  },
  {
    emoji: "🎽",
    name: "Expo Entrega de Kits",
    schedule: "Víspera / 08:30 - 16:30 hrs",
    spots: "10 cupos",
    focus: "Validación de Boletos QR",
  },
  {
    emoji: "🎒",
    name: "Guardarropa y Paquetería",
    schedule: "05:30 - 11:00 hrs",
    spots: "6 cupos",
    focus: "Zona de Salida",
  },
];

export default async function VoluntariosHubPage() {
  const races = await getAllRaces();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fbfaff] via-white to-violet-50/40 pt-24 pb-20">
      {/* Halos decorativos */}
      <div className="pointer-events-none fixed -left-40 top-20 h-96 w-96 rounded-full bg-violet-200/30 blur-[130px]" />
      <div className="pointer-events-none fixed -right-40 top-80 h-96 w-96 rounded-full bg-orange-200/30 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/90 px-4 py-1.5 text-xs font-black tracking-wider uppercase text-violet-700 shadow-xs backdrop-blur-md">
            <HeartHandshake className="h-4 w-4 text-violet-600 animate-pulse" />
            <span>Red Nacional de Voluntarios Písale</span>
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Vive la emoción del running <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500">
              desde el corazón del evento.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg font-medium text-slate-600 leading-relaxed">
            Las grandes carreras se construyen gracias a personas apasionadas como tú. Súmate al equipo oficial
            de hidratación, entrega de medallas, guardarropa o entrega de kits y recibe tu acreditación digital con código QR.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#convocatorias-abiertas"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition-all hover:bg-slate-800 hover:scale-[1.02]"
            >
              Explorar Carreras Abiertas
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/carrera/10k-chapultepec/voluntarios"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-700 backdrop-blur-md shadow-xs transition-all hover:border-violet-300 hover:text-violet-700 hover:bg-white"
            >
              <QrCode className="h-4 w-4 text-violet-600" />
              Consultar mi Gafete Digital
            </Link>
          </div>
        </div>

        {/* BENEFICIOS Y PERKS */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ¿Qué recibes al formar parte del Staff Oficial?
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Reconocemos tu compromiso y pasión con beneficios exclusivos desde el primer día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VOLUNTEER_PERKS.map((perk) => (
              <div
                key={perk.title}
                className="group relative rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${perk.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <perk.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{perk.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN DE ROLES DISPONIBLES */}
        <div className="mt-20 rounded-3xl border border-violet-200/80 bg-linear-to-br from-violet-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black tracking-wider uppercase text-amber-300 backdrop-blur-md">
              <Compass className="h-3.5 w-3.5" /> Áreas Operativas
            </span>
            <h2 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              ¿En qué área te gustaría colaborar?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 font-medium">
              Tú eliges el horario y la zona en la que deseas sumarte. Contamos con coordinadores capacitados para guiarte en todo momento.
            </p>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLES_LIST.map((role) => (
              <div
                key={role.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10"
              >
                <div className="text-3xl mb-2">{role.emoji}</div>
                <h4 className="font-bold text-base text-white">{role.name}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-300 font-medium">
                  <p className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {role.schedule}
                  </p>
                  <p className="text-violet-300 font-semibold">{role.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LISTADO DE CARRERAS CON CONVOCATORIA ABIERTA */}
        <div id="convocatorias-abiertas" className="mt-24 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-violet-600 block mb-1">
                Convocatorias Oficiales 2026
              </span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                Carreras buscando Staff & Voluntarios
              </h2>
            </div>
            <p className="text-sm font-bold text-slate-500">
              {races.length} eventos reclutando activamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {races.map((race) => (
              <div
                key={race.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10"
              >
                {/* Imagen del evento */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={race.imageUrl}
                    alt={race.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badge fecha */}
                  <div className="absolute top-3 left-3 rounded-2xl bg-white/95 px-3 py-1.5 text-center shadow-md backdrop-blur-md">
                    <span className="block font-display text-lg font-black text-slate-900 leading-none">
                      {race.day}
                    </span>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-violet-600">
                      {race.month}
                    </span>
                  </div>

                  {/* Badge vacantes */}
                  <div className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                    Convocatoria Abierta
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      {race.location}
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-violet-700 transition-colors">
                      {race.title}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-xs font-bold text-sky-700">
                        💧 Hidratación
                      </span>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        🏅 Medallas
                      </span>
                      <span className="rounded-full bg-fuchsia-50 border border-fuchsia-200 px-2.5 py-0.5 text-xs font-bold text-fuchsia-700">
                        🎽 Kits
                      </span>
                    </div>

                    <p className="mt-4 text-xs font-medium text-slate-500 leading-relaxed">
                      Incluye acreditación oficial con QR, playera técnica de voluntariado y constancia curricular de horas de apoyo.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Cupo disponible en 4 áreas
                    </span>

                    <Link
                      href={`/carrera/${race.id}/voluntarios`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-violet-700 hover:shadow-md hover:shadow-violet-600/30"
                    >
                      Postularme
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
