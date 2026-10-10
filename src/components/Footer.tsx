"use client";

import Link from "next/link";
import { Flame, ArrowRight, Mail, MapPin, ShieldCheck, Smartphone } from "lucide-react";

const COLUMNS = [
  {
    title: "Corredores",
    links: ["Explorar carreras", "Calendario 2026", "Resultados en vivo", "Mis inscripciones", "Boleto digital"],
  },
  {
    title: "Organizadores",
    links: ["Crear evento", "Precios", "Panel de control", "Cronometraje RFID", "Casos de éxito"],
  },
  {
    title: "Písale",
    links: ["Sobre nosotros", "Blog", "Trabaja con nosotros", "Prensa", "Contacto"],
  },
];

// Lucide v1 ya no incluye íconos de marcas, por eso van como SVG inline.
const SOCIALS = [
  {
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z",
  },
  {
    label: "TikTok",
    path: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 5 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z",
  },
  {
    label: "Facebook",
    path: "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.5V21h3.1z",
  },
  {
    label: "X",
    path: "M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2.2 3h6.2l4.3 5.7L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z",
  },
  {
    label: "Strava",
    path: "M15.4 17.2 13.3 13h-3.1l5.2 10 5.1-10h-3.1l-2 4.2zM10.4 1 3.5 14.4h4.1l2.8-5.3 2.8 5.3h4L10.4 1z",
  },
];

export function Footer() {
  const year = 2026;

  return (
    <footer className="relative overflow-hidden border-t border-violet-100 bg-linear-to-b from-[#fbfaff] via-violet-50/60 to-fuchsia-50/70">
      {/* Halos de fondo */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-200/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20">
        {/* Newsletter */}
        <div className="border-beam mb-16 grid items-center gap-8 rounded-[2rem] border border-white bg-white/75 p-8 shadow-[0_20px_60px_-25px_rgba(91,33,182,0.3)] backdrop-blur-2xl md:grid-cols-[1.2fr_1fr] md:p-10">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              No te pierdas ninguna <span className="text-brand">salida</span>.
            </h2>
            <p className="mt-2 font-medium text-slate-500">
              Preventas, early birds y carreras nuevas cerca de ti. Un correo a la semana, sin spam.
            </p>
          </div>
          <form className="flex flex-col gap-2 sm:flex-row" action="#">
            <label htmlFor="footer-email" className="sr-only">Correo electrónico</label>
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="footer-email"
                type="email"
                required
                placeholder="tu@correo.com"
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
            <button
              id="footer-subscribe"
              type="submit"
              className="btn-shine group flex h-14 items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:shadow-fuchsia-500/40"
            >
              Suscribirme
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        {/* Columnas */}
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white shadow-lg shadow-fuchsia-500/30 transition-transform duration-500 group-hover:-rotate-12">
                <Flame className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
                písale<span className="text-fuchsia-500">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-slate-500">
              La plataforma de inscripciones a carreras más rápida de México. Hecha por corredores, para corredores.
            </p>

            <div className="mt-6 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white/80 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-linear-to-br hover:from-violet-600 hover:to-fuchsia-500 hover:text-white hover:shadow-lg hover:shadow-fuchsia-500/30"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-fuchsia-500" /> Hecho en México 🇲🇽</span>
              <span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-violet-500" /> App iOS y Android · Próximamente</span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-900">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="group inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-violet-700"
                    >
                      <span className="h-px w-0 bg-fuchsia-500 transition-all duration-300 group-hover:w-3" />
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Barra inferior */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-violet-100 py-8 text-sm font-medium text-slate-500 md:flex-row">
          <p>© {year} Písale. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-violet-700">Términos</Link>
            <Link href="#" className="hover:text-violet-700">Privacidad</Link>
            <Link href="#" className="hover:text-violet-700">Cookies</Link>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Pagos 100% seguros
            </span>
          </div>
        </div>
      </div>

      {/* Wordmark gigante */}
      <div className="pointer-events-none relative -mb-[0.22em] select-none text-center font-display text-[22vw] font-extrabold leading-none tracking-tighter">
        <span className="bg-linear-to-b from-violet-300/60 via-fuchsia-200/40 to-transparent bg-clip-text text-transparent">
          písale
        </span>
      </div>
    </footer>
  );
}
