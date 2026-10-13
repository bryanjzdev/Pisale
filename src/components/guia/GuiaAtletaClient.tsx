"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  Clock,
  Flag,
  ShieldCheck,
  Droplets,
  HeartPulse,
  Bus,
  Car,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Radio,
  FileText,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronRight,
  Info,
  Footprints,
  Luggage,
  ShieldAlert,
  HelpCircle,
  Share2,
  ExternalLink,
  Zap,
  Check,
  BellRing,
} from "lucide-react";
import { RealQRCode } from "@/components/common/RealQRCode";

export interface GuiaAtletaProps {
  race: {
    id: string;
    title: string;
    day: string;
    month: string;
    year: string;
    location: string;
    category?: string;
    startTime?: string;
    distances: string[];
    startPoint?: string;
    endPoint?: string;
    expo?: {
      location: string;
      dates: string;
      hours: string;
    };
    routeDetails?: {
      surface?: string;
      hydrationPoints?: number;
      medicalStations?: number;
      pacers?: string[];
    };
  };
  runner?: {
    name?: string;
    email?: string;
    bibNumber?: string;
    distance?: string;
    registrationId?: string;
  };
}

type TabType = "todos" | "salida" | "guardarropa" | "hidratacion" | "transporte" | "chip";

export function GuiaAtletaClient({ race, runner }: GuiaAtletaProps) {
  const [activeTab, setActiveTab] = useState<TabType>("todos");
  const [selectedCorral, setSelectedCorral] = useState<"A" | "B" | "C">("B");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const startTimeStr = race.startTime || "07:00 hrs";
  const mainDistance = runner?.distance || race.distances[0] || "10K";
  const bibNumber = runner?.bibNumber || "PSL-OFICIAL";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Guía Oficial del Atleta - ${race.title}`,
            text: `Consulta horarios de bloques, guardarropa, hidratación y transporte para ${race.title}.`,
            url: window.location.href,
          });
          return;
        } catch {
          // Fallback a portapapeles
        }
      }
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Datos de los corrales
  const corrales = [
    {
      bloque: "A",
      nombre: "Bloque A: Élite & Competitivo",
      tiempo: "< 40 min (10K) / < 1h 25m (21K)",
      ritmo: "Ritmo < 4:00 min/km",
      colorTag: "bg-amber-500 text-white",
      borderTone: "border-amber-400 bg-amber-50/50",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      apertura: "06:00 hrs",
      cierre: "06:40 hrs",
      disparo: startTimeStr,
      brazalete: "Amarillo Dorado / Acreditación Oficial",
      desc: "Diseñado para atletas clasificados, corredores élite y de alto rendimiento. Acceso exclusivo por puerta frontal norte.",
      tips: "Requiere calentar previamente fuera del cajón; el corral se sella puntualmente a las 06:40 hrs.",
    },
    {
      bloque: "B",
      nombre: "Bloque B: Intermedio & Constante",
      tiempo: "40 - 50 min (10K) / 1h 25m - 1h 50m (21K)",
      ritmo: "Ritmo 4:00 - 5:00 min/km",
      colorTag: "bg-blue-600 text-white",
      borderTone: "border-blue-400 bg-blue-50/50",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      apertura: "06:15 hrs",
      cierre: "06:50 hrs",
      disparo: "07:05 hrs",
      brazalete: "Azul Marino / Tiempo Registrado",
      desc: "Para corredores con experiencia en ruta buscando romper su récord personal con pacers oficiales de 4:15, 4:30 y 4:45.",
      tips: "Ubica la bandera de tu pacer de ritmo al ingresar para salir a velocidad uniforme.",
    },
    {
      bloque: "C",
      nombre: "Bloque C: Recreativo & Debutantes",
      tiempo: "> 50 min (10K) / > 1h 50m (21K)",
      ritmo: "Ritmo > 5:00 min/km o trote mixto",
      colorTag: "bg-emerald-600 text-white",
      borderTone: "border-emerald-400 bg-emerald-50/50",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      apertura: "06:30 hrs",
      cierre: "07:00 hrs",
      disparo: "07:10 hrs",
      brazalete: "Verde Esmeralda / General",
      desc: "Ideal para disfrutar el ambiente, debutar en la distancia o caminar/trotar sin presión de corte agresivo.",
      tips: "Si no alcanzaste a entrar a tu corral asignado A o B, deberás arrancar en el Bloque C por reglamento de seguridad.",
    },
  ];

  // Puntos de hidratación detallados
  const puntosHidratacion = [
    {
      km: "Km 2.5",
      tipo: "Agua Purificada",
      detalle: "Vasos biodegradables en ambos laterales de la calzada. 8 mesas de servicio.",
      medico: "Bandereros de primeros auxilios",
      icono: "agua",
      color: "border-sky-200 bg-sky-50/60",
    },
    {
      km: "Km 5.0",
      tipo: "Agua + Bebida Isotónica",
      detalle: "Electrolitos (Gatorade/Electrolit) y agua fría. Zona de botes para desecho rápido.",
      medico: "Ambulancia Alfa 1 + Desfibrilador (DEA) + Paramédicos en carpa",
      icono: "isotonico",
      color: "border-violet-200 bg-violet-50/60",
    },
    {
      km: "Km 7.5",
      tipo: "Agua + Esponjas Húmedas",
      detalle: "Abastecimiento de agua y esponjas heladas para regulación térmica corporal.",
      medico: "Sanitarios portátiles y puesto de curaciones menores",
      icono: "esponja",
      color: "border-cyan-200 bg-cyan-50/60",
    },
    {
      km: "Km 10.0 / 12.5",
      tipo: "Agua + Isotónico + Fruta",
      detalle: "Gajos de naranja, plátano en porciones higiénicas y recarga de electrolitos.",
      medico: "Puesto Médico Avanzado + 2 Paramédicos ciclistas móviles",
      icono: "fruta",
      color: "border-amber-200 bg-amber-50/60",
    },
    {
      km: "Km 15.0+",
      tipo: "Geles Energéticos & Sales",
      detalle: "Para distancias de 21K/42K: geles con carbohidratos complejos y cápsulas de sal.",
      medico: "Ambulancia de soporte avanzado Bravo 2",
      icono: "energia",
      color: "border-rose-200 bg-rose-50/60",
    },
    {
      km: "Meta Oficial",
      tipo: "Zona de Recuperación Integral",
      detalle: "Botella sellada 600ml agua, botella isotónica 500ml, fruta, snack proteico y medalla.",
      medico: "Hospital de campo post-meta, camillas y fisioterapeutas de descarga",
      icono: "meta",
      color: "border-emerald-200 bg-emerald-50/60",
    },
  ];

  // Preguntas frecuentes de logística
  const faqs = [
    {
      q: "¿Qué sucede si llego después de la hora de cierre de mi corral?",
      a: "Por protocolo de seguridad y evitar colisiones contra el flujo de salida, los accesos a los Bloques A y B se cierran estrictamente a las 06:40 y 06:50 hrs respectivamente. Si llegas tarde, deberás incorporarte al Bloque C al final de la retaguardia. Recuerda que tu tiempo de chip inicia cuando cruzas el tapete de salida, no en el disparo de los punteros.",
    },
    {
      q: "¿Puedo dejar mi teléfono celular o llaves en el guardarropa?",
      a: "Sí puedes dejar llaves o celulares bajo tu propio resguardo siempre que estén dentro del morral oficial debidamente sellado con tu número de folio visible. Sin embargo, el comité desaconseja ingresar joyas, dinero en efectivo cuantioso o computadoras personales, ya que el servicio no cuenta con seguro contra objetos de alto valor no declarados.",
    },
    {
      q: "¿Es obligatorio correr con el dorsal oficial visible al frente?",
      a: "Sí, es 100% obligatorio. El chip electrónico UHF está colocado en el reverso del número. Debe ir al frente en el pecho sujeto con 4 imperdibles. Si lo tapas con chamarra cerrada, cangurera o lo doblas, corres el riesgo de que las antenas electromagnéticas de meta no capturen tu marca y no aparezcas en el cronometraje oficial.",
    },
    {
      q: "¿Hay servicio de transporte de barredora para corredores rezagados?",
      a: "Sí. El tiempo límite de ruta se calcula a un ritmo de 8:30 min/km. Detrás del último corredor circula el vehículo de barredora oficial con asistencia médica y espacio para trasladar con dignidad a quienes decidan no continuar hacia la zona de meta.",
    },
    {
      q: "¿Puedo recibir asistencia médica o agua de amigos en el camino?",
      a: "Está permitido recibir porras y ánimos en aceras públicas. Sin embargo, no se permite que personas en bicicleta, patines o motos acompañen a corredores dentro del carril confinado oficial, ya que es motivo de descalificación por entorpecer la ruta de evacuación de ambulancias.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-20 pt-24 sm:pt-28">
      {/* ========================================================
          VISTA INTERACTIVA WEB (OCULTA EN IMPRESIÓN)
          ======================================================== */}
      <div className="print:hidden">
        {/* Barra Superior Flotante de Acciones */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white/90 p-4 border border-slate-200/90 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Link
                href={`/carrera/${race.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-full"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Volver a la Carrera</span>
              </Link>

              {runner?.registrationId && (
                <Link
                  href={`/carrera/${race.id}/boleto?registration_id=${runner.registrationId}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3.5 py-2 rounded-full transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Ver mi Boleto</span>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                title="Compartir enlace de la guía"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Enlace Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Compartir</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-5 py-2 text-xs font-black text-white shadow-md shadow-fuchsia-500/20 hover:shadow-fuchsia-500/35 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir Guía (1 Hoja)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Encabezado Principal Tipo Hero Nacarado */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-6 sm:p-10 shadow-sm backdrop-blur-xl">
            {/* Destellos decorativos de fondo */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-fuchsia-200/30 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-3.5 py-1 text-xs font-bold text-violet-700">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  <span>Manual Oficial de Logística & Operaciones</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                  Guía Oficial del{" "}
                  <span className="bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
                    Atleta 2026
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Todo lo que necesitas dominar antes de pisar la línea de arranque en{" "}
                  <strong className="text-slate-900 font-bold">{race.title}</strong>: corrales de
                  salida, consigna de guardarropa, estaciones de abastecimiento y rutas de transporte.
                </p>

                {/* Chips de datos del evento */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 font-bold text-slate-800">
                    <Calendar className="h-3.5 w-3.5 text-violet-600" />
                    {race.day} {race.month} {race.year}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 font-bold text-slate-800">
                    <Clock className="h-3.5 w-3.5 text-fuchsia-600" />
                    Arranque: {startTimeStr}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 font-bold text-slate-800">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    {race.location}
                  </span>
                </div>
              </div>

              {/* Tarjeta de Identificación Rápida del Atleta */}
              <div className="w-full md:w-72 shrink-0 rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-4.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    Ficha de Corredor
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                    <ShieldCheck className="h-3 w-3" /> Confirmado
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Atleta</span>
                    <span className="text-sm font-black text-slate-900 truncate block">
                      {runner?.name || "Corredor Inscrito"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="rounded-xl bg-violet-50/80 p-2 border border-violet-100">
                      <span className="text-[9px] font-bold text-violet-600 uppercase block">Dorsal / Folio</span>
                      <span className="font-mono text-xs font-black text-violet-900">{bibNumber}</span>
                    </div>
                    <div className="rounded-xl bg-fuchsia-50/80 p-2 border border-fuchsia-100">
                      <span className="text-[9px] font-bold text-fuchsia-600 uppercase block">Distancia</span>
                      <span className="text-xs font-black text-fuchsia-900">{mainDistance}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Corral sugerido:</span>
                    <strong className="text-violet-700 font-extrabold">Bloque B (40-50m)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas Interactivas de Navegación Rápida */}
        <div className="sticky top-16 z-30 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-8 backdrop-blur-md">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar rounded-2xl bg-white/95 p-2 border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab("todos")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "todos"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Toda la Guía</span>
            </button>

            <button
              onClick={() => setActiveTab("salida")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "salida"
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Flag className="h-3.5 w-3.5 text-violet-400" />
              <span>1. Bloques de Salida</span>
            </button>

            <button
              onClick={() => setActiveTab("guardarropa")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "guardarropa"
                  ? "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Luggage className="h-3.5 w-3.5 text-fuchsia-400" />
              <span>2. Guardarropa</span>
            </button>

            <button
              onClick={() => setActiveTab("hidratacion")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "hidratacion"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              <span>3. Hidratación & Médicos</span>
            </button>

            <button
              onClick={() => setActiveTab("transporte")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "transporte"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Bus className="h-3.5 w-3.5 text-emerald-400" />
              <span>4. Accesos & Transporte</span>
            </button>

            <button
              onClick={() => setActiveTab("chip")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "chip"
                  ? "bg-orange-600 text-white shadow-sm shadow-orange-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Radio className="h-3.5 w-3.5 text-orange-400" />
              <span>5. Chip RFID & Dorsal</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            SECCIONES DE CONTENIDO INTERACTIVO
            ======================================================== */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ========================================================
              SECCIÓN 1: BLOQUES Y CORRALES DE SALIDA
              ======================================================== */}
          {(activeTab === "todos" || activeTab === "salida") && (
            <section id="bloques-salida" className="scroll-mt-32 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-violet-700">
                    <Flag className="h-4 w-4" />
                    <span>Sección 1</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Bloques y Corrales de Salida
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Organización por olas según tu tiempo estimado de carrera para garantizar una salida fluida y segura.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-1 text-xs font-bold text-violet-800 border border-violet-200 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Apertura de corrales: 06:00 hrs</span>
                </div>
              </div>

              {/* Selector interactivo de Corral para el corredor */}
              <div className="rounded-3xl border border-violet-100 bg-linear-to-r from-violet-50/60 to-fuchsia-50/40 p-5 sm:p-6 backdrop-blur-md">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                  Simula o consulta las instrucciones de tu bloque:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {corrales.map((c) => (
                    <button
                      key={c.bloque}
                      onClick={() => setSelectedCorral(c.bloque as "A" | "B" | "C")}
                      className={`text-left rounded-2xl p-4 transition-all cursor-pointer border ${
                        selectedCorral === c.bloque
                          ? "bg-white shadow-md border-violet-400 ring-2 ring-violet-400/20"
                          : "bg-white/60 hover:bg-white border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-black ${c.colorTag}`}>
                          Bloque {c.bloque}
                        </span>
                        {selectedCorral === c.bloque && (
                          <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{c.tiempo}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{c.ritmo}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarjetas Detalladas de Corrales */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {corrales.map((c) => (
                  <div
                    key={c.bloque}
                    className={`rounded-3xl border p-6 transition-all bg-white shadow-xs hover:shadow-md ${
                      selectedCorral === c.bloque ? "border-violet-500 ring-2 ring-violet-500/10" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${c.colorTag}`}>
                          Bloque {c.bloque}
                        </span>
                        <h3 className="font-display text-lg font-black text-slate-900 mt-2">
                          {c.nombre.split(":")[1]}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {c.tiempo.split("/")[0]}
                      </span>
                    </div>

                    <div className="space-y-3 border-y border-slate-100 py-4 my-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Apertura de acceso:</span>
                        <strong className="text-slate-900 font-bold">{c.apertura}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Cierre Estricto:
                        </span>
                        <strong className="text-rose-600 font-black">{c.cierre}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Disparo de Salida:</span>
                        <strong className="text-slate-900 font-black">{c.disparo}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Brazalete / Dorsal:</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${c.badgeColor}`}>
                          {c.brazalete.split("/")[0]}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {c.desc}
                    </p>

                    <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100">
                      💡 <strong>Recomendación:</strong> {c.tips}
                    </div>
                  </div>
                ))}
              </div>

              {/* Protocolo de penalización por retardo */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4.5 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold block">Regla de Oro en Corrales:</strong>
                  <p>
                    Si llegas después del cierre de tu corral (06:40 hrs Bloque A / 06:50 hrs Bloque B), 
                    deberás formarte obligatoriamente en la retaguardia del <strong>Bloque C</strong>. Queda 
                    estrictamente prohibido brincar vallas o empujar; cualquier altercado con el staff de jueces 
                    conlleva retiro de dorsal.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================
              SECCIÓN 2: SERVICIO DE GUARDARROPA
              ======================================================== */}
          {(activeTab === "todos" || activeTab === "guardarropa") && (
            <section id="guardarropa" className="scroll-mt-32 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-fuchsia-700">
                    <Luggage className="h-4 w-4" />
                    <span>Sección 2</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Servicio de Guardarropa Oficial
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Custodia segura de tus pertenencias personales para que corras ligero y te abrigues al cruzar la meta.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-3.5 py-1 text-xs font-bold text-fuchsia-800 border border-fuchsia-200 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Recepción: 05:30 - 06:30 hrs</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Horarios y Proceso de Folio */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700 font-black">
                      1
                    </div>
                    <div>
                      <h3 className="font-display text-base font-black text-slate-900">
                        Horarios y Reglas de Custodia
                      </h3>
                      <p className="text-xs text-slate-500">Operado por personal voluntario certificado</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-start gap-2.5 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                      <Clock className="h-4 w-4 text-fuchsia-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Recepción de mochilas:</strong> Inicia a las 05:30 hrs y concluye a las 06:30 hrs (30 min antes del primer disparo). Sin prórroga.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                      <Clock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Reclamo y entrega:</strong> Disponible desde las 08:00 hrs hasta las 11:30 hrs en la carpa de guardarropa post-meta.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 rounded-2xl bg-violet-50/70 p-3.5 border border-violet-100">
                      <FileText className="h-4 w-4 text-violet-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Etiqueta y Número de Folio:</strong> Cada morral debe llevar firmemente adherido el talón desprendible con tu número de folio (<strong>{bibNumber}</strong>). La entrega es personalísima y se cotejará con el dorsal físico o tu INE.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Artículos Permitidos vs Prohibidos */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-black">
                      2
                    </div>
                    <div>
                      <h3 className="font-display text-base font-black text-slate-900">
                        Artículos Permitidos y Prohibidos
                      </h3>
                      <p className="text-xs text-slate-500">Cuida la seguridad de todos los participantes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Permitidos */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Artículos Permitidos
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-slate-600">
                        <li>• Morral oficial de la carrera (40x50 cm)</li>
                        <li>• Sudadera o ropa abrigadora seca</li>
                        <li>• Calzado de descanso o chanclas</li>
                        <li>• Toalla pequeña y desodorante</li>
                        <li>• Llaves de auto o casa</li>
                      </ul>
                    </div>

                    {/* Prohibidos */}
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
                      <span className="font-bold text-rose-800 flex items-center gap-1.5 text-xs">
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                        Estrictamente Prohibidos
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-slate-600">
                        <li>• Laptops, tablets y cámaras caras</li>
                        <li>• Joyas, alhajas y efectivo cuantioso</li>
                        <li>• Botellas o termos de vidrio</li>
                        <li>• Armas u objetos punzocortantes</li>
                        <li>• Maletas de viaje voluminosas</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    * El comité organizador no se hace responsable por objetos de alto valor no declarados depositados dentro del morral.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================
              SECCIÓN 3: PUNTOS DE HIDRATACIÓN Y MÉDICOS
              ======================================================== */}
          {(activeTab === "todos" || activeTab === "hidratacion") && (
            <section id="hidratacion" className="scroll-mt-32 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-700">
                    <Droplets className="h-4 w-4" />
                    <span>Sección 3</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Puntos de Hidratación y Servicios Médicos
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Distribución de abastecimiento por kilómetro, ambulancias en ruta y protocolos de atención médica.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold text-sky-800 border border-sky-200 shrink-0">
                  <HeartPulse className="h-3.5 w-3.5 text-rose-600" />
                  <span>Ambulancias en Km 5, 10, 15 y Meta</span>
                </div>
              </div>

              {/* Roadmap Interactivo Kilómetro por Kilómetro */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Ruta de Abastecimiento Certificada
                  </span>
                  <span className="text-xs text-sky-700 font-bold">
                    Agua purificada cada 2.5 km e isotónico en puntos clave
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {puntosHidratacion.map((p, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-4.5 transition-all ${p.color}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-black text-slate-900 bg-white/90 px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-2xs">
                          {p.km}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800">
                          Puesto #{idx + 1}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mt-2">
                        {p.tipo}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {p.detalle}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2 text-[11px] text-slate-700 font-medium">
                        <HeartPulse className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{p.medico}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guía de Seguridad Médica */}
              <div className="rounded-3xl border border-rose-100 bg-linear-to-r from-rose-50/60 to-orange-50/40 p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <HeartPulse className="h-5 w-5 text-rose-600" />
                  <span>Protocolo de Emergencia y Recomendaciones Fisiológicas</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
                  <div className="rounded-2xl bg-white p-4 border border-rose-100/80 shadow-2xs">
                    <strong className="text-slate-900 block mb-1">🚨 En caso de mareo o fatiga extrema:</strong>
                    Reduce el paso a caminata, busca la banqueta y levanta la mano hacia los bandereros o paramédicos en bicicleta.
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-rose-100/80 shadow-2xs">
                    <strong className="text-slate-900 block mb-1">🥤 Cómo tomar hidratación en carrera:</strong>
                    Presiona levemente la orilla del vaso para formar un embudo y bebe a pequeños sorbos para evitar atragantarte con la zancada.
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-rose-100/80 shadow-2xs">
                    <strong className="text-slate-900 block mb-1">🚫 No pruebes nada nuevo el día D:</strong>
                    No consumas marcas de geles, suplementos o calzado que no hayas probado previamente en tus fondos de entrenamiento.
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================
              SECCIÓN 4: ACCESOS Y TRANSPORTE
              ======================================================== */}
          {(activeTab === "todos" || activeTab === "transporte") && (
            <section id="transporte" className="scroll-mt-32 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    <Bus className="h-4 w-4" />
                    <span>Sección 4</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Accesos, Transporte y Vialidad
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Recomendaciones de Metro, Metrobús, horarios de cierres viales y estacionamientos sugeridos.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Cierres viales: 05:00 a 11:30 hrs</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metro y Metrobús */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Transporte Público</h3>
                      <p className="text-[11px] text-slate-500">La opción más recomendada</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">🚇 Estaciones de Metro cercanas:</strong>
                      Apertura especial 05:00 hrs para corredores con dorsal. Estaciones Insurgentes, Sevilla, Chapultepec o Auditorio.
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">🚍 Metrobús:</strong>
                      Línea 1 y Línea 7 con circuitos recortados temporales durante el paso de la punta de corredores.
                    </div>

                    <p className="text-[11px] text-emerald-700 font-semibold">
                      💡 Consejo: Utiliza apps de movilidad (Uber / Didi) con destino a 3 calles fuera del perímetro de cierre.
                    </p>
                  </div>
                </div>

                {/* Cierres Viales */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Cierres Viales</h3>
                      <p className="text-[11px] text-slate-500">Coordinación Tránsito & Protección Civil</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="rounded-2xl bg-rose-50/50 p-3 border border-rose-100">
                      <strong className="text-rose-900 block mb-0.5">🚫 Horario de confinamiento:</strong>
                      Desde las <strong>05:00 hrs</strong> hasta las <strong>11:30 hrs</strong> del día del evento.
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">Avenidas principales cerradas:</strong>
                      Calzadas de la ruta oficial, Paseo de la Reforma, glorietas y accesos directos al circuito.
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">Vías alternas sugeridas:</strong>
                      Circuito Interior, Av. Chapultepec, Periférico y Río Churubusco.
                    </div>
                  </div>
                </div>

                {/* Estacionamientos */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Estacionamientos</h3>
                      <p className="text-[11px] text-slate-500">Públicos y regulados</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">Estacionamientos subterráneos:</strong>
                      Estacionamiento Auditorio Nacional, plazas comerciales y edificios de oficinas aledaños.
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-amber-900">
                      <strong className="block mb-0.5 flex items-center gap-1 font-bold">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        ¡Evita la grúa!
                      </strong>
                      Queda estrictamente prohibido aparcar en vías de evacuación de ambulancias o sobre la ruta de carrera.
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Llega con <strong>60 a 75 minutos de anticipación</strong> para encontrar lugar con calma.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================
              SECCIÓN 5: REGLAMENTO DEL CHIP RFID Y DORSAL
              ======================================================== */}
          {(activeTab === "todos" || activeTab === "chip") && (
            <section id="chip-rfid" className="scroll-mt-32 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
                    <Radio className="h-4 w-4" />
                    <span>Sección 5</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Reglamento del Chip RFID & Dorsal
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Instrucciones obligatorias para que el sistema de cronometraje capture tus tiempos oficiales sin fallas.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-800 border border-orange-200 shrink-0">
                  <Radio className="h-3.5 w-3.5 text-orange-600" />
                  <span>Chip BibTag UHF Desechable</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Ilustración / Diagrama del Dorsal y Chip */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-linear-to-b from-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-lg text-center relative overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-radial from-violet-500/10 to-transparent" />
                  
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400 block mb-2">
                    Diagrama Oficial de Colocación
                  </span>
                  
                  {/* Tarjeta simulada de Dorsal */}
                  <div className="mx-auto max-w-xs rounded-2xl bg-white p-5 text-slate-900 shadow-2xl border-4 border-violet-500/40 relative my-4">
                    {/* Indicadores de 4 seguros en esquinas */}
                    <div className="absolute top-2 left-2 h-2.5 w-2.5 rounded-full bg-slate-400 border border-slate-600" title="Imperdible 1" />
                    <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-slate-400 border border-slate-600" title="Imperdible 2" />
                    <div className="absolute bottom-2 left-2 h-2.5 w-2.5 rounded-full bg-slate-400 border border-slate-600" title="Imperdible 3" />
                    <div className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-slate-400 border border-slate-600" title="Imperdible 4" />

                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
                      {race.title}
                    </span>
                    <span className="font-mono text-3xl font-black text-slate-950 my-1 block tracking-tight">
                      {bibNumber}
                    </span>
                    <span className="text-[10px] font-black text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                      {mainDistance}
                    </span>

                    {/* Chip RFID ilustrado en el reverso */}
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-900">
                        <Radio className="h-3 w-3 text-amber-700" />
                        <span>Chip RFID Adherido al Reverso</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block mt-1">
                        ⚠️ Almohadilla dieléctrica - NO retirar
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">
                    Colocar al frente, a la <strong>altura del pecho</strong>, perfectamente estirado con 4 imperdibles.
                  </p>
                </div>

                {/* Lista de Reglas Críticas del Chip */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex items-start gap-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700 shrink-0 font-black text-xs">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">NUNCA perfores ni atravieses el chip</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        El chip transponder UHF y su antena están en la parte posterior del dorsal. Coloca los imperdibles únicamente en los 4 orificios de las esquinas. Si un imperdible perfora el chip, quedará inservible.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex items-start gap-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700 shrink-0 font-black text-xs">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">NO dobles ni arrugues el dorsal</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Doblar el número puede fracturar el micro-circuito o alterar la inductancia de la antena, impidiendo la lectura electromagnética en los tapetes de cronometraje.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex items-start gap-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0 font-black text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Mantén el dorsal siempre visible</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        No cubras tu número con chamarras cerradas, cinturones porta-geles, cangureras o mochilas al pasar sobre los tapetes de salida, puntos de control intermedios y meta.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex items-start gap-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 shrink-0 font-black text-xs">
                      ⏱️
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Tiempo Oficial vs. Tiempo Neto (Chip)</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Tu tiempo personal inicia exactamente al momento de cruzar el tapete de salida y termina al pisar el tapete de meta. Tu constancia y certificado digital reflejarán tu Tiempo Neto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================
              SECCIÓN DE PREGUNTAS FRECUENTES (FAQ)
              ======================================================== */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <HelpCircle className="h-4 w-4 text-violet-600" />
              <span>Dudas Comunes</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Preguntas Frecuentes de Logística
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-violet-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
                        openFaq === idx ? "rotate-180 text-violet-600" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Banner Inferior de Llamada a la Acción de Impresión */}
          <div className="rounded-3xl border border-violet-200 bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
                📄 Versión de Bolsillo para el Día de la Carrera
              </span>
              <h3 className="font-display text-2xl font-black">
                ¿Prefieres llevar tu guía impresa en 1 sola hoja?
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                Descarga o imprime el resumen ejecutivo optimizado con tabla de horarios, guardarropa, estaciones médicas y números de emergencia.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="rounded-full bg-white px-7 py-3.5 text-xs font-black text-slate-900 shadow-xl hover:bg-slate-100 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              Imprimir Guía de 1 Hoja
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================
          DOCUMENTO RESUMIDO DE 1 SOLA HOJA PARA IMPRESIÓN (@media print)
          Diseñado con alta densidad tipográfica, bordes negros/grises nítidos
          y encuadre exacto para 1 hoja estándar Carta / A4.
          ======================================================== */}
      <div className="hidden print:block font-sans text-slate-950 bg-white p-6 max-w-4xl mx-auto text-[11px] leading-tight">
        {/* Cabecera del Documento de Impresión */}
        <div className="border-b-2 border-slate-950 pb-3 mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest uppercase bg-slate-950 text-white px-2 py-0.5 rounded">
                PÍSALE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                GUÍA OFICIAL DEL ATLETA · LOGÍSTICA DE EVENTO
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-950 mt-1 uppercase tracking-tight">
              {race.title}
            </h1>
            <div className="text-[10px] text-slate-600 font-semibold mt-0.5 flex items-center gap-3">
              <span>📅 {race.day} {race.month} {race.year}</span>
              <span>⏰ Arranque Oficial: {startTimeStr}</span>
              <span>📍 {race.location}</span>
            </div>
          </div>

          <div className="text-right border-l-2 border-slate-200 pl-4">
            <span className="text-[9px] font-extrabold uppercase text-slate-500 block">Dorsal / Folio</span>
            <span className="font-mono text-base font-black text-slate-950 block">{bibNumber}</span>
            <span className="text-[9px] font-bold text-slate-600 block">{runner?.name || "Atleta Inscrito"}</span>
            <span className="text-[9px] font-extrabold text-violet-800 uppercase block">{mainDistance}</span>
          </div>
        </div>

        {/* Grid de 2 Columnas para condensar todo en 1 hoja */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-3.5">
            
            {/* 1. Bloques y Corrales de Salida */}
            <div className="border border-slate-300 rounded-lg p-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-900">
                  1. Horarios de Corrales y Salida
                </span>
                <span className="text-[9px] text-rose-600 font-bold">Cierre Estricto</span>
              </div>
              
              <table className="w-full text-[10px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[9px] uppercase">
                    <th className="pb-1 font-bold">Bloque</th>
                    <th className="pb-1 font-bold">Tiempo Est.</th>
                    <th className="pb-1 font-bold">Cierre</th>
                    <th className="pb-1 font-bold">Salida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-1 font-black text-slate-950">A (Élite)</td>
                    <td className="py-1">&lt; 40 min</td>
                    <td className="py-1 font-bold text-rose-600">06:40 hrs</td>
                    <td className="py-1">{startTimeStr}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-black text-slate-950">B (Intermedio)</td>
                    <td className="py-1">40 - 50 min</td>
                    <td className="py-1 font-bold text-rose-600">06:50 hrs</td>
                    <td className="py-1">07:05 hrs</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-black text-slate-950">C (Recreativo)</td>
                    <td className="py-1">&gt; 50 min</td>
                    <td className="py-1 font-bold text-rose-600">07:00 hrs</td>
                    <td className="py-1">07:10 hrs</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[9px] text-slate-600 mt-1.5 italic">
                * Quien llegue después del cierre de su corral deberá arrancar en el Bloque C sin excepción.
              </p>
            </div>

            {/* 2. Servicio de Guardarropa */}
            <div className="border border-slate-300 rounded-lg p-2.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1 mb-1.5">
                2. Servicio de Guardarropa
              </span>
              <div className="space-y-1 text-[10px] text-slate-800">
                <p>• <strong>Recepción:</strong> 05:30 hrs a 06:30 hrs (cierre 30 min antes de la salida).</p>
                <p>• <strong>Entrega:</strong> 08:00 hrs a 11:30 hrs presentando tu dorsal físico.</p>
                <p>• <strong>Identificación:</strong> Morral oficial con el talón de folio <strong>{bibNumber}</strong> pegado.</p>
                <p className="text-rose-700 font-bold">• <strong>Prohibidos:</strong> Joyas, laptops, efectivo, termos de vidrio y bultos grandes.</p>
              </div>
            </div>

            {/* 3. Reglamento Chip RFID */}
            <div className="border border-slate-300 rounded-lg p-2.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1 mb-1.5">
                3. Reglamento del Chip RFID & Dorsal
              </span>
              <ul className="space-y-1 text-[9.5px] text-slate-800">
                <li>• <strong>Ubicación:</strong> Colocar al frente en el pecho, sujeto con 4 imperdibles.</li>
                <li>• <strong>NO perforar el chip:</strong> La antena UHF está adherida al reverso; nunca la perfores.</li>
                <li>• <strong>NO doblar:</strong> No arrugues el número ni lo tapes con chamarras o cangureras.</li>
                <li>• <strong>Tiempo Neto:</strong> Tu cronometraje oficial inicia al pisar el tapete de salida.</li>
              </ul>
            </div>

          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-3.5">
            
            {/* 4. Hidratación y Puestos Médicos */}
            <div className="border border-slate-300 rounded-lg p-2.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1 mb-2">
                4. Hidratación & Servicios Médicos
              </span>
              <table className="w-full text-[9.5px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[8.5px] uppercase">
                    <th className="pb-1 font-bold">KM</th>
                    <th className="pb-1 font-bold">Suministro</th>
                    <th className="pb-1 font-bold">Asistencia Médica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-1 font-bold">Km 2.5</td>
                    <td className="py-1">Agua Purificada</td>
                    <td className="py-1">Primeros auxilios</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">Km 5.0</td>
                    <td className="py-1">Agua + Isotónico</td>
                    <td className="py-1 text-rose-600 font-bold">Ambulancia Alfa 1 + DEA</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">Km 7.5</td>
                    <td className="py-1">Agua + Esponjas</td>
                    <td className="py-1">Sanitarios portátiles</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">Km 10/12</td>
                    <td className="py-1">Agua + Fruta + Isotónico</td>
                    <td className="py-1 text-rose-600 font-bold">Puesto Médico Avanzado</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">Meta</td>
                    <td className="py-1">Kit recuperación + Medalla</td>
                    <td className="py-1">Hospital de campo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Transporte y Vialidad */}
            <div className="border border-slate-300 rounded-lg p-2.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1 mb-1.5">
                5. Accesos y Transporte
              </span>
              <div className="space-y-1 text-[9.5px] text-slate-800">
                <p>• <strong>Metro Recomendado:</strong> Apertura especial 05:00 hrs con dorsal oficial.</p>
                <p>• <strong>Cierres Viales:</strong> Confinamiento de 05:00 a 11:30 hrs en avenidas principales.</p>
                <p>• <strong>Vías Alternas:</strong> Circuito Interior, Periférico, Av. Chapultepec.</p>
                <p>• <strong>Estacionamientos:</strong> Auditorio Nacional y plazas subterráneas autorizadas.</p>
                <p className="text-amber-800 font-bold">• <strong>Llegada sugerida:</strong> 60 a 75 minutos antes de tu bloque.</p>
              </div>
            </div>

            {/* Contactos de Emergencia & Código QR */}
            <div className="border-2 border-slate-900 rounded-lg p-2.5 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-slate-500 block">
                  Central de Emergencias Písale
                </span>
                <span className="font-mono text-sm font-black text-slate-900 block">
                  911 / 55-8000-PISALE
                </span>
                <span className="text-[8.5px] text-slate-600 block mt-0.5">
                  Protección Civil · Cruz Roja Mexicana · Jueces FMAA
                </span>
              </div>
              <div className="text-center shrink-0">
                <RealQRCode value={bibNumber} size={50} />
                <span className="font-mono text-[8px] font-bold block mt-0.5">{bibNumber}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Pie de Página de la Hoja de Impresión */}
        <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[8px] text-slate-500">
          <span>PÍSALE TICKETING & TIMING SYSTEMS · GUÍA OFICIAL PARA ATLETAS CONFIRMADOS</span>
          <span>CONSULTA TUS RESULTADOS EN VIVO EN PISALE.MX/RESULTADOS</span>
        </div>
      </div>
    </div>
  );
}
