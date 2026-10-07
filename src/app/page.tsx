import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Trophy,
  Timer,
  Users,
  QrCode,
  Activity,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Building2,
} from "lucide-react";
import { RacesSection } from "@/components/RacesSection";

const CITIES = ["CDMX", "Monterrey", "Guadalajara", "Puebla", "Querétaro", "Mérida", "Oaxaca", "Tijuana", "León", "Cancún"];

const LIVE_RESULTS = [
  { pos: 1, name: "Andrea M.", time: "1:12:48", color: "from-amber-300 to-orange-400" },
  { pos: 2, name: "Luis R.", time: "1:13:05", color: "from-slate-200 to-slate-300" },
  { pos: 3, name: "Sofía G.", time: "1:13:41", color: "from-orange-200 to-amber-300" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900">
      {/* ===== Fondo: aurora + grid ===== */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1100px]">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-violet-300/40 blur-[130px]" />
        <div className="absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-fuchsia-300/35 blur-[120px]" />
        <div className="absolute left-1/3 top-[420px] h-[420px] w-[520px] rounded-full bg-orange-200/40 blur-[120px]" />
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-4 pb-20 pt-36 md:pt-44 lg:grid-cols-[1.1fr_1fr]">
        <div className="text-center lg:text-left">
          <Link
            href="#carreras"
            className="animate-fade-up group mb-8 inline-flex items-center gap-2 rounded-full border border-white bg-white/70 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all hover:shadow-md"
          >
            <span className="flex items-center gap-1 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-2.5 py-0.5 text-xs font-bold text-white">
              <Sparkles className="h-3 w-3" /> Nuevo
            </span>
            Resultados en vivo con chip RFID
            <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1
            className="animate-fade-up font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-slate-900 sm:text-6xl md:text-7xl xl:text-[5.5rem]"
            style={{ animationDelay: "80ms" }}
          >
            Inscríbete.
            <br />
            Corre. <span className="text-brand">Písale.</span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-7 max-w-xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl lg:mx-0"
            style={{ animationDelay: "160ms" }}
          >
            La plataforma de carreras más rápida de México. Inscripción en segundos, boleto digital con QR y tus tiempos en tiempo real.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              id="hero-explore"
              href="#carreras"
              className="btn-shine group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-8 text-base font-bold text-white shadow-[0_14px_40px_-10px_rgba(192,38,211,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_rgba(192,38,211,0.7)] sm:w-auto"
            >
              Explorar carreras
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              id="hero-organizer"
              href="#organizadores"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-8 text-base font-bold text-slate-700 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700 hover:shadow-lg sm:w-auto"
            >
              <Building2 className="h-5 w-5" /> Soy organizador
            </Link>
          </div>

          {/* Prueba social */}
          <div
            className="animate-fade-up mt-10 flex items-center justify-center gap-4 lg:justify-start"
            style={{ animationDelay: "320ms" }}
          >
            <div className="flex -space-x-3">
              {["from-violet-400 to-indigo-500", "from-fuchsia-400 to-pink-500", "from-orange-300 to-rose-400", "from-emerald-300 to-teal-500"].map((g, i) => (
                <span key={i} className={`flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br ${g} text-xs font-bold text-white ring-4 ring-[#fbfaff]`}>
                  {["AM", "LR", "SG", "JP"][i]}
                </span>
              ))}
            </div>
            <div className="text-left text-sm">
              <p className="font-bold text-slate-900">+50,000 corredores</p>
              <p className="font-medium text-slate-500">ya se inscriben con Písale</p>
            </div>
          </div>
        </div>

        {/* Composición flotante */}
        <div className="relative mx-auto h-[520px] w-full max-w-[480px]">
          {/* Ticket digital */}
          <div className="animate-float absolute left-0 top-6 z-20 w-[300px] sm:left-6">
            <div className="border-beam rounded-[1.75rem] border border-white bg-white/85 p-2 shadow-[0_30px_70px_-20px_rgba(91,33,182,0.45)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[1.35rem] bg-linear-to-br from-violet-600 via-fuchsia-600 to-orange-500 p-5 text-white">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-xl" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">Boleto digital</p>
                <p className="mt-1 font-display text-2xl font-extrabold leading-tight">Medio Maratón CDMX</p>
                <div className="mt-4 flex gap-5 text-sm">
                  <div><p className="text-[10px] uppercase text-white/70">Fecha</p><p className="font-bold">15 Nov</p></div>
                  <div><p className="text-[10px] uppercase text-white/70">Salida</p><p className="font-bold">06:30</p></div>
                  <div><p className="text-[10px] uppercase text-white/70">Bloque</p><p className="font-bold">B</p></div>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Número</p>
                  <p className="font-display text-4xl font-extrabold tracking-tight text-slate-900">#2048</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                  <QrCode className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Resultados en vivo */}
          <div className="animate-float-slow absolute bottom-4 right-0 z-30 w-[280px] rounded-3xl border border-white bg-white/90 p-4 shadow-[0_30px_70px_-20px_rgba(190,24,93,0.35)] backdrop-blur-2xl" style={{ animationDelay: "1.2s" }}>
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Activity className="h-4 w-4 text-fuchsia-500" /> Resultados en vivo
              </p>
              <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" /> LIVE
              </span>
            </div>
            <div className="space-y-2">
              {LIVE_RESULTS.map((r) => (
                <div key={r.pos} className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br ${r.color} font-display text-sm font-extrabold text-slate-900`}>
                    {r.pos}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-700">{r.name}</span>
                  <span className="font-mono text-sm font-bold text-slate-900">{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chip de ritmo */}
          <div className="animate-float absolute right-4 top-0 z-10 flex items-center gap-3 rounded-2xl border border-white bg-white/85 px-4 py-3 shadow-xl shadow-violet-900/10 backdrop-blur-xl" style={{ animationDelay: "0.6s" }}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nuevo PR</p>
              <p className="font-display text-lg font-extrabold text-slate-900">4:52 /km</p>
            </div>
          </div>

          {/* Chip de confirmación */}
          <div className="animate-float-slow absolute bottom-40 left-0 z-30 flex items-center gap-2 rounded-full border border-white bg-white/90 py-2 pl-2 pr-4 shadow-xl shadow-violet-900/10 backdrop-blur-xl" style={{ animationDelay: "2s" }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
              <BadgeCheck className="h-4 w-4" />
            </span>
            <p className="text-sm font-bold text-slate-800">Inscripción confirmada</p>
          </div>

          {/* Halo */}
          <div className="absolute left-1/2 top-1/2 -z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-violet-400/40 via-fuchsia-400/30 to-orange-300/40 blur-3xl" />
        </div>
      </section>

      {/* ===== Marquee de ciudades ===== */}
      <section className="relative z-10 border-y border-violet-100/80 bg-white/50 py-6 backdrop-blur-xl">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <div className="animate-marquee flex shrink-0 gap-14 pr-14">
            {[...CITIES, ...CITIES].map((c, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap font-display text-2xl font-bold text-slate-300">
                <Zap className="h-5 w-5 text-fuchsia-300" /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Bento de métricas ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-24">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: Users, value: "50K+", label: "Corredores activos", g: "from-violet-500 to-indigo-500" },
            { icon: Trophy, value: "320+", label: "Carreras exitosas", g: "from-fuchsia-500 to-pink-500" },
            { icon: Timer, value: "<1 min", label: "Para inscribirte", g: "from-orange-400 to-rose-500" },
            { icon: ShieldCheck, value: "99.9%", label: "Pagos seguros", g: "from-emerald-400 to-teal-500" },
          ].map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-3xl border border-white bg-white/70 p-6 shadow-[0_8px_30px_-12px_rgba(76,29,149,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(76,29,149,0.25)]"
            >
              <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-linear-to-br ${s.g} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`} />
              <span className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${s.g} text-white shadow-lg`}>
                <s.icon className="h-5 w-5" />
              </span>
              <p className="font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Carreras ===== */}
      <RacesSection />

      {/* ===== CTA organizadores ===== */}
      <section id="organizadores" className="relative z-10 mx-auto max-w-7xl px-4 pb-28">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-violet-600 via-fuchsia-600 to-orange-500 p-10 text-white shadow-[0_40px_100px_-30px_rgba(192,38,211,0.6)] md:p-16">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/75">Para organizadores</p>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Lanza tu carrera en minutos, no en semanas.
              </h2>
              <p className="mt-4 max-w-lg text-lg font-medium text-white/85">
                Cobros, kits, números de corredor y resultados. Todo desde un panel diseñado para que tú solo te preocupes por la meta.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                id="cta-create-event"
                href="#"
                className="btn-shine flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 font-bold text-violet-700 shadow-xl transition-transform hover:-translate-y-0.5"
              >
                Crear mi evento <ArrowRight className="h-5 w-5" />
              </Link>
              <span className="text-center text-sm font-medium text-white/75 md:text-right">Sin costo de alta · Comisión solo por inscripción</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}