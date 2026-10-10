"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Flame,
  ChevronDown,
  Search,
  Menu,
  X,
  Route,
  Mountain,
  Moon,
  Medal,
  Trophy,
  Building2,
  ArrowUpRight,
  Sparkles,
  CalendarDays,
} from "lucide-react";

const RACE_CATEGORIES = [
  { icon: Route, title: "Ruta 5K · 10K", desc: "Ideal para empezar o romper tu PR", color: "from-violet-500 to-indigo-500" },
  { icon: Medal, title: "Medio Maratón", desc: "21K para corredores constantes", color: "from-fuchsia-500 to-pink-500" },
  { icon: Trophy, title: "Maratón", desc: "42K, el reto definitivo", color: "from-orange-400 to-rose-500" },
  { icon: Mountain, title: "Trail Running", desc: "Montaña, desnivel y naturaleza", color: "from-emerald-400 to-teal-500" },
  { icon: Moon, title: "Carreras Nocturnas", desc: "Neón, música y buena vibra", color: "from-sky-400 to-blue-500" },
  { icon: CalendarDays, title: "Calendario 2026", desc: "Todas las fechas en un vistazo", color: "from-amber-400 to-orange-500" },
];

const NAV_LINKS = [
  { label: "Resultados", href: "#", badge: "Live" },
  { label: "Organizadores", href: "#" },
  { label: "Comunidad", href: "#" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? "pt-3" : "pt-5"
      }`}
    >
      <nav
        className={`border-beam relative mx-4 flex w-full items-center justify-between rounded-full border border-white/70 bg-white/65 pl-2.5 pr-2.5 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ${
          scrolled
            ? "h-14 max-w-5xl shadow-[0_10px_40px_-12px_rgba(91,33,182,0.25)]"
            : "h-16 max-w-6xl shadow-[0_4px_24px_-8px_rgba(91,33,182,0.15)]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 pl-1 pr-3" aria-label="Inicio Písale">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white shadow-lg shadow-fuchsia-500/30 transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:scale-105">
            <Flame className="h-5 w-5" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
          </span>
          <span className="font-display text-[1.35rem] font-extrabold tracking-tight text-slate-900">
            písale<span className="text-fuchsia-500">.</span>
          </span>
        </Link>

        {/* Links desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
            <button
              id="nav-carreras"
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                megaOpen ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-900/[0.04] hover:text-slate-900"
              }`}
            >
              Carreras
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Mega menú */}
            <div
              className={`absolute left-1/2 top-full pt-4 transition-all duration-300 ${
                megaOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{ transform: `translateX(-50%) translateY(${megaOpen ? 0 : -8}px)` }}
            >
              <div className="grid w-[720px] grid-cols-[1.4fr_1fr] gap-2 rounded-3xl border border-white/80 bg-white/90 p-2 shadow-[0_30px_80px_-20px_rgba(76,29,149,0.35)] backdrop-blur-2xl">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {RACE_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.title}
                      href="#carreras"
                      onClick={() => setMegaOpen(false)}
                      className="group/item flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-violet-50/70"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${cat.color} text-white shadow-md transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-6`}>
                        <cat.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-900">{cat.title}</span>
                        <span className="block text-xs leading-snug text-slate-500">{cat.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Destacado */}
                <Link
                  href="#carreras"
                  className="group/feat relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[1.25rem] p-5 text-white"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/feat:scale-110"
                    style={{ backgroundImage: "url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800)" }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-violet-950/85 via-fuchsia-900/30 to-transparent" />
                  <span className="relative mb-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles className="h-3 w-3" /> Destacado
                  </span>
                  <p className="relative text-xs font-semibold text-white/80">15 Nov · CDMX</p>
                  <p className="relative font-display text-xl font-bold leading-tight">Medio Maratón Ciudad de México</p>
                  <span className="relative mt-3 inline-flex items-center gap-1 text-sm font-bold">
                    Inscribirme <ArrowUpRight className="h-4 w-4 transition-transform group-hover/feat:translate-x-0.5 group-hover/feat:-translate-y-0.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-900/[0.04] hover:text-slate-900"
            >
              {link.label}
              {link.badge && (
                <span className="flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-600 ring-1 ring-rose-200">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                  </span>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1.5">
          <button
            id="nav-search"
            className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 py-2 pl-3 pr-2 text-sm text-slate-400 transition-all hover:border-violet-200 hover:text-slate-600 hover:shadow-sm md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="hidden xl:inline">Buscar carrera…</span>
            <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-slate-500">⌘K</kbd>
          </button>

          <Link
            href="#"
            className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-violet-700 sm:flex"
          >
            <Building2 className="h-4 w-4" /> Crear evento
          </Link>

          <Link
            id="nav-login"
            href="/login"
            className="btn-shine flex h-10 items-center rounded-full bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-[length:200%_100%] px-5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-fuchsia-500/40"
          >
            Iniciar sesión
          </Link>

          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900/5 lg:hidden"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menú móvil */}
        <div
          className={`absolute inset-x-0 top-full mt-3 origin-top rounded-3xl border border-white/80 bg-white/95 p-3 shadow-2xl shadow-violet-900/15 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
            mobileOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-1">
            {RACE_CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat.title}
                href="#carreras"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-2xl p-2.5 hover:bg-violet-50"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br ${cat.color} text-white`}>
                  <cat.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-slate-800">{cat.title}</span>
              </Link>
            ))}
          </div>
          <div className="my-2 h-px bg-slate-100" />
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}