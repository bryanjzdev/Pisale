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
import { KitOficialSection } from "@/components/home/KitOficialSection";
import { getAllRaces } from "@/lib/races";

const CITIES = ["CDMX", "Monterrey", "Guadalajara", "Puebla", "Querétaro", "Mérida", "Oaxaca", "Tijuana", "León", "Cancún"];

const LIVE_RESULTS = [
  { pos: 1, name: "Andrea M.", time: "1:12:48", color: "from-amber-300 to-orange-400" },
  { pos: 2, name: "Luis R.", time: "1:13:05", color: "from-slate-200 to-slate-300" },
  { pos: 3, name: "Sofía G.", time: "1:13:41", color: "from-orange-200 to-amber-300" },
];

export const instant = false;

export default async function Home() {
  const races = await getAllRaces();
  return (
    <div className="relative overflow-hidden text-slate-900 selection:bg-orange-200 selection:text-orange-950">
      {/* ===== Fondo: aurora atlética + grid ===== */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1100px]">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-orange-400/20 blur-[140px]" />
        <div className="absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-amber-300/25 blur-[130px]" />
        <div className="absolute left-1/3 top-[420px] h-[420px] w-[520px] rounded-full bg-sky-300/20 blur-[130px]" />
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-4 pb-20 pt-36 md:pt-44 lg:grid-cols-[1.1fr_1fr]">
        <div className="text-center lg:text-left">
          <Link
            href="#carreras"
            className="animate-fade-up group mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all hover:shadow-md hover:border-orange-300"
          >
            <span className="flex items-center gap-1 rounded-full bg-linear-to-r from-orange-600 to-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
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
              href="/carreras"
              className="btn-shine group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-600 via-amber-500 to-emerald-500 px-8 text-base font-bold text-white shadow-[0_14px_40px_-10px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.65)] sm:w-auto"
            >
              Explorar carreras
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              id="hero-organizer"
              href="/organizador/crear"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-8 text-base font-bold text-slate-700 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600 hover:shadow-lg sm:w-auto"
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
              {["from-orange-500 to-amber-500", "from-amber-400 to-yellow-500", "from-sky-400 to-cyan-500", "from-emerald-400 to-teal-500"].map((g, i) => (
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

        {/* Composición Hero Deportiva: Imagen atlética en acción + Telemetría HUD + Ticket Digital */}
        <div className="relative mx-auto h-[550px] w-full max-w-[500px]">
          {/* Card Fotográfica Deportiva Central (Ultra-rápida y atlética) */}
          <div className="relative h-[480px] w-full overflow-hidden rounded-[2.2rem] border border-white/80 bg-slate-900 shadow-[0_30px_90px_-20px_rgba(234,88,12,0.3)] backdrop-blur-2xl">
            {/* Foto de corredor en máxima zancada */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
              style={{
                backgroundImage: `url('/assets/run/hero-cdmx-angel.jpg')`,
              }}
            />
            {/* Gradientes deportivos atléticos para legibilidad */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-orange-950/40 via-transparent to-slate-950/50" />

            {/* HUD Telemetría Superior */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 border border-emerald-500/30 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Live Tracking Activo
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 border border-white/30 px-2.5 py-1 text-[11px] font-black text-white backdrop-blur-md">
                KM 18.4 / 21K
              </span>
            </div>

            {/* HUD Telemetría Inferior del Atleta */}
            <div className="absolute bottom-4 inset-x-4 z-10 rounded-2xl bg-slate-950/85 border border-white/15 p-3.5 backdrop-blur-xl">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="border-r border-white/10 pr-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Ritmo</p>
                  <p className="font-mono text-base sm:text-lg font-black text-amber-400">3:58 <span className="text-[10px] font-bold text-slate-400">/km</span></p>
                </div>
                <div className="border-r border-white/10 pr-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Cadencia</p>
                  <p className="font-mono text-base sm:text-lg font-black text-teal-300">178 <span className="text-[10px] font-bold text-slate-400">spm</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Pulso</p>
                  <p className="font-mono text-base sm:text-lg font-black text-rose-400">164 <span className="text-[10px] font-bold text-slate-400">bpm</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket digital superpuesto */}
          <div className="animate-float absolute -left-4 sm:-left-8 top-10 z-20 w-[270px] sm:w-[290px]">
            <div className="border-beam rounded-[1.75rem] border border-white bg-white/90 p-2 shadow-[0_25px_60px_-15px_rgba(234,88,12,0.35)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[1.35rem] bg-linear-to-br from-slate-950 via-slate-900 to-orange-950 border border-orange-500/20 p-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Boleto Digital Oficial</p>
                <p className="mt-0.5 font-display text-xl font-black leading-tight">Maratón Teotihuacán</p>
                <div className="mt-3 flex gap-4 text-xs">
                  <div><p className="text-[9px] uppercase text-white/70">Distancia</p><p className="font-black text-amber-300">21K</p></div>
                  <div><p className="text-[9px] uppercase text-white/70">Kit</p><p className="font-black">Dry-Fit (M)</p></div>
                  <div><p className="text-[9px] uppercase text-white/70">Bloque</p><p className="font-black text-emerald-400">Elite A</p></div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dorsal</p>
                  <p className="font-display text-3xl font-black tracking-tight text-slate-900">#2048</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200/80">
                  <QrCode className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>

          {/* Chip de confirmación y medalla */}
          <div className="animate-float-slow absolute -right-3 bottom-20 z-30 flex items-center gap-2 rounded-full border border-white bg-white/95 py-2 pl-2 pr-4 shadow-xl shadow-orange-900/15 backdrop-blur-xl" style={{ animationDelay: "1.5s" }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md">
              <Trophy className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-black text-slate-900">Medalla 3D Finisher</p>
              <p className="text-[10px] font-bold text-emerald-600">Garantizada con Kit</p>
            </div>
          </div>

          {/* Halo deportivo */}
          <div className="absolute left-1/2 top-1/2 -z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-orange-400/30 via-amber-400/20 to-sky-300/20 blur-3xl" />
        </div>
      </section>

      {/* ===== Marquee de ciudades ===== */}
      <section className="relative z-10 border-y border-orange-100/80 bg-white/60 py-6 backdrop-blur-xl">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <div className="animate-marquee flex shrink-0 gap-14 pr-14">
            {[...CITIES, ...CITIES].map((c, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap font-display text-2xl font-bold text-slate-400 hover:text-slate-600 transition-colors">
                <Zap className="h-5 w-5 text-amber-500" /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Bento de métricas ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-24">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: Users, value: "50K+", label: "Corredores activos", g: "from-orange-500 to-amber-600" },
            { icon: Trophy, value: "320+", label: "Carreras exitosas", g: "from-amber-500 to-yellow-600" },
            { icon: Timer, value: "<1 min", label: "Para inscribirte", g: "from-sky-500 to-cyan-600" },
            { icon: ShieldCheck, value: "99.9%", label: "Pagos seguros", g: "from-emerald-500 to-teal-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-3xl border border-white bg-white/70 p-6 shadow-[0_8px_30px_-12px_rgba(234,88,12,0.1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(234,88,12,0.2)]"
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
      <RacesSection initialRaces={races} />

      {/* ===== Anatomía del Kit Oficial (Experiencia de Carrera) ===== */}
      <KitOficialSection />

      {/* ===== CTA organizadores ===== */}
      <section id="organizadores" className="relative z-10 mx-auto max-w-7xl px-4 pb-28">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-500/20 bg-linear-to-br from-slate-950 via-slate-900 to-orange-950 p-10 text-white shadow-[0_40px_100px_-30px_rgba(234,88,12,0.4)] md:p-16">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Para organizadores</p>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Lanza tu carrera en minutos, no en semanas.
              </h2>
              <p className="mt-4 max-w-lg text-lg font-medium text-slate-300">
                Cobros, kits, números de corredor y resultados. Todo desde un panel diseñado para que tú solo te preocupes por la meta.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                id="cta-create-event"
                href="/organizador/crear"
                className="btn-shine flex h-14 items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-8 font-extrabold text-slate-950 shadow-xl shadow-orange-500/30 transition-transform hover:-translate-y-0.5 hover:scale-105"
              >
                Crear mi evento <ArrowRight className="h-5 w-5" />
              </Link>
              <span className="text-center text-sm font-medium text-slate-400 md:text-right">Sin costo de alta · Comisión solo por inscripción</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}