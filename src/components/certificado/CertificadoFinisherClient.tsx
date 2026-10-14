"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import {
  Printer,
  Download,
  Share2,
  ArrowLeft,
  Check,
  CheckCircle2,
  Award,
  Sparkles,
  ShieldCheck,
  Copy,
  Calendar,
  MapPin,
  Timer,
  Trophy,
  Flame,
  Palette,
  ExternalLink,
} from "lucide-react";
import { RealQRCode } from "@/components/common/RealQRCode";

export interface CertificadoData {
  runnerName: string;
  raceTitle: string;
  raceLocation: string;
  raceDate: string;
  distanceName: string;
  chipTime: string;
  gunTime: string;
  pace: string;
  overallRank: number;
  categoryRank: number;
  genderRank?: number;
  totalParticipants?: number;
  bibNumber: string;
  categoryName?: string;
  gender?: string;
  organizerName?: string;
  registrationId?: string;
  raceId: string;
}

const THEMES = [
  {
    id: "gold",
    name: "Oro Real & Obsidiana",
    tag: "Clásico Oficial",
    accent: "from-amber-600 via-yellow-500 to-amber-700",
    borderOuter: "border-amber-600/40",
    borderInner: "border-amber-500/60",
    bgCertificate: "bg-[#fffdf9]",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    accentText: "text-amber-700",
    heroBox: "bg-amber-50/70 border-amber-200/80",
    sealPrimary: "#b45309",
    sealSecondary: "#f59e0b",
  },
  {
    id: "navy",
    name: "Azul Campeón Olímpico",
    tag: "Prestigio Internacional",
    accent: "from-blue-700 via-indigo-600 to-slate-900",
    borderOuter: "border-indigo-600/40",
    borderInner: "border-indigo-400/50",
    bgCertificate: "bg-[#f8faff]",
    badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-300",
    accentText: "text-indigo-800",
    heroBox: "bg-indigo-50/70 border-indigo-200/80",
    sealPrimary: "#1e40af",
    sealSecondary: "#3b82f6",
  },
  {
    id: "carbon",
    name: "Písale Elite Volt",
    tag: "Estilo Pro Athletic",
    accent: "from-violet-700 via-purple-600 to-fuchsia-600",
    borderOuter: "border-violet-600/40",
    borderInner: "border-fuchsia-400/50",
    bgCertificate: "bg-[#faf9ff]",
    badgeBg: "bg-violet-100 text-violet-900 border-violet-300",
    accentText: "text-violet-700",
    heroBox: "bg-violet-50/70 border-violet-200/80",
    sealPrimary: "#6d28d9",
    sealSecondary: "#a855f7",
  },
];

export function CertificadoFinisherClient({
  data,
}: {
  data: CertificadoData;
}) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Formato de folio oficial de verificación
  const folioCertificado = `PSL-CERT-${(data.registrationId || data.bibNumber || "2026")
    .slice(0, 8)
    .toUpperCase()}`;

  // URL para el código QR de verificación
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/carrera/${data.raceId}/certificado?bib=${encodeURIComponent(
          data.bibNumber
        )}`
      : `https://pisale.mx/carrera/${data.raceId}/certificado?bib=${data.bibNumber}`;

  // Imprimir diploma en hoja horizontal carta
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Descargar diploma en PNG de alta resolución (300dpi aprox)
  const handleDownloadPng = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `Certificado_Finisher_${data.bibNumber || "atleta"}_${data.runnerName
        .replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generando certificado PNG:", error);
      alert("Hubo un inconveniente al generar la imagen. Puedes usar el botón de Imprimir / PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Compartir diploma en redes sociales
  const handleShare = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 0.98,
        pixelRatio: 2.2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `Certificado_${data.bibNumber}_${data.runnerName.replace(/\s+/g, "_")}.png`,
        { type: "image/png" }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `¡Mi Certificado Oficial de Finisher en ${data.raceTitle}!`,
          text: `¡Misión cumplida! Completé ${data.distanceName} con un tiempo oficial de ${data.chipTime} (Dorsal ${data.bibNumber}) en ${data.raceTitle}. Certificado con chip RFID en Písale.`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Certificado Finisher - ${data.runnerName}`,
          text: `Tiempo oficial de ${data.chipTime} en ${data.raceTitle}. ¡Dorsal ${data.bibNumber}!`,
          url: verificationUrl,
        });
      } else {
        handleDownloadPng();
      }
    } catch (err) {
      console.error("Error compartiendo certificado:", err);
      handleDownloadPng();
    } finally {
      setIsDownloading(false);
    }
  };

  // Copiar link de verificación al portapapeles
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* Estilos Globales para Impresión Exacta en Hoja Horizontal Carta (Landscape) */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter landscape !important;
            margin: 0 !important;
          }
          html,
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Ocultar barra superior, navbar, footers, fondos de la web */
          .no-print,
          nav,
          header,
          footer {
            display: none !important;
          }
          /* Área del certificado a pantalla completa horizontal */
          #certificado-print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 12mm !important;
            box-shadow: none !important;
            border: none !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#f7f6fb] text-slate-900 pb-24 pt-28 sm:pt-32 selection:bg-amber-200">
        
        {/* Elementos decorativos de fondo en pantalla (no se imprimen) */}
        <div className="no-print pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute top-10 right-1/4 h-[550px] w-[550px] rounded-full bg-amber-300/15 blur-[140px]" />
          <div className="absolute top-1/2 -left-20 h-[500px] w-[500px] rounded-full bg-violet-400/15 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* BARRA SUPERIOR DE ACCIONES Y NAVEGACIÓN (NO PRINT) */}
          <div className="no-print bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <Link
                href={`/resultados?carrera=${data.raceId}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver a Resultados</span>
              </Link>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold uppercase tracking-wide">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                RFID Verificado
              </span>
            </div>

            {/* Selector de Acabado / Tema del Diploma */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl w-full sm:w-auto justify-center overflow-x-auto">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2 flex items-center gap-1">
                <Palette className="h-3 w-3" /> Acabado:
              </span>
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setSelectedTheme(th)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedTheme.id === th.id
                      ? "bg-white text-slate-900 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {th.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Botones Principales: Imprimir PDF, Descargar PNG, Compartir */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
              
              <button
                onClick={handleCopyLink}
                title="Copiar enlace de verificación"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={handleShare}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Share2 className="h-3.5 w-3.5 text-violet-600" />
                <span>Compartir</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="h-3.5 w-3.5 text-amber-600" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                onClick={handleDownloadPng}
                disabled={isDownloading}
                className="btn-shine inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white text-xs font-extrabold hover:shadow-lg transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>{isDownloading ? "Generando..." : "Descargar PNG"}</span>
              </button>

            </div>

          </div>

          {/* DIPLOMA EN FORMATO HORIZONTAL (LANDSCAPE) */}
          <div className="w-full flex justify-center">
            
            <div
              id="certificado-print-area"
              ref={certificateRef}
              className={`relative w-full max-w-[1040px] aspect-[1.414/1] min-h-[580px] sm:min-h-[640px] ${selectedTheme.bgCertificate} p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl border-4 ${selectedTheme.borderOuter} overflow-hidden flex flex-col justify-between text-slate-900 selection:bg-transparent`}
            >
              
              {/* Marco Geométrico Deportivo Perimetral (Doble Filete + Esquinas Deportivas) */}
              <div
                className={`pointer-events-none absolute inset-3 sm:inset-4 md:inset-5 border-2 ${selectedTheme.borderInner} rounded-2xl`}
              >
                {/* Esquinas Deportivas Ornamentales (Chevron Angular) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-600" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-600" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-600" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-600" />
              </div>

              {/* Marca de Agua Sutil en el Fondo (Silueta de Pista y Corredores) */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03] flex items-center justify-center">
                <svg
                  viewBox="0 0 800 600"
                  className="w-full h-full text-slate-950 fill-current"
                >
                  <circle cx="400" cy="300" r="260" stroke="currentColor" strokeWidth="8" fill="none" />
                  <circle cx="400" cy="300" r="220" stroke="currentColor" strokeWidth="4" fill="none" />
                  <circle cx="400" cy="300" r="180" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M250,300 L550,300 M400,150 L400,450" stroke="currentColor" strokeWidth="4" />
                </svg>
              </div>

              {/* SECCIÓN 1: ENCABEZADO INSTITUCIONAL */}
              <div className="relative z-10 flex items-start justify-between gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
                
                {/* Logo & Marca Pisale Official Timing */}
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <img
                      src="/assets/Logo_Pisale.png"
                      alt="Logo Písale"
                      className="h-11 sm:h-13 w-auto object-contain drop-shadow-xs"
                    />
                  </div>

                  <div>
                    <span className="font-display font-black text-sm sm:text-base tracking-wider text-slate-900 uppercase block">
                      PÍSALE TIMING SYSTEMS
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                      CRONOMETRAJE ELECTRÓNICO HOMOLOGADO RFID
                    </span>
                  </div>
                </div>

                {/* Título Central del Diploma */}
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-amber-300 font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1 shadow-xs">
                    CERTIFICADO OFICIAL
                  </span>
                  <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                    DIPLOMA DE FINISHER
                  </h1>
                </div>

              </div>

              {/* SECCIÓN 2: CUERPO DEL CERTIFICADO & NOMBRE DISTINGUIDO */}
              <div className="relative z-10 text-center my-auto py-2 sm:py-4 space-y-2 sm:space-y-3">
                
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  El Comité Organizador y el Colegio de Jueces certifican que
                </p>

                {/* NOMBRE DEL ATLETA EN TIPOGRAFÍA DISTINGUIDA */}
                <div className="py-1">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-slate-950 tracking-wide uppercase drop-shadow-xs">
                    {data.runnerName}
                  </h2>
                  <div className="w-48 sm:w-64 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-2" />
                </div>

                <p className="text-[11px] sm:text-xs font-medium text-slate-600 max-w-xl mx-auto">
                  ha completado satisfactoriamente y con registro oficial la distancia reglamentaria de:
                </p>

                {/* DISTANCIA Y NOMBRE DE LA CARRERA */}
                <div className="flex flex-col items-center justify-center gap-1 pt-1">
                  
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider border shadow-xs ${selectedTheme.badgeBg}`}
                  >
                    <Award className="h-3.5 w-3.5" />
                    {data.distanceName}
                  </span>

                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    {data.raceTitle}
                  </h3>

                  <div className="flex items-center justify-center gap-4 text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-600" />
                      {data.raceLocation}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-amber-600" />
                      {data.raceDate}
                    </span>
                  </div>

                </div>

              </div>

              {/* SECCIÓN 3: TABLA / CUADRO DE TIEMPOS OFICIALES (HERO METRICS) */}
              <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 py-3 border-y border-slate-200/90 bg-white/60 rounded-2xl p-2 sm:p-3 shadow-inner">
                
                {/* 1. TIEMPO CHIP OFICIAL (DESTACADO) */}
                <div
                  className={`col-span-3 sm:col-span-2 rounded-xl p-2.5 sm:p-3 text-center border shadow-xs ${selectedTheme.heroBox}`}
                >
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    TIEMPO CHIP OFICIAL (NETO)
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 block mt-0.5">
                    {data.chipTime}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 block mt-0.5">
                    ● Tiempo Homologado RFID
                  </span>
                </div>

                {/* 2. TIEMPO GUN (DISPARO) */}
                <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    TIEMPO GUN
                  </span>
                  <span className="font-mono text-sm sm:text-lg font-black text-slate-900 block mt-0.5">
                    {data.gunTime}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold mt-0.5">Disparo</span>
                </div>

                {/* 3. RITMO MEDIO (PACE) */}
                <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    RITMO MEDIO
                  </span>
                  <span className="font-mono text-sm sm:text-lg font-black text-slate-900 block mt-0.5">
                    {data.pace}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold mt-0.5">Promedio</span>
                </div>

                {/* 4. POSICIÓN GENERAL */}
                <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    LUGAR GENERAL
                  </span>
                  <span className="font-mono text-sm sm:text-lg font-black text-slate-900 block mt-0.5">
                    #{data.overallRank}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold mt-0.5">
                    {data.totalParticipants ? `de ${data.totalParticipants}` : "General"}
                  </span>
                </div>

                {/* 5. POSICIÓN CATEGORÍA & DORSAL */}
                <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    CATEGORÍA / RAMA
                  </span>
                  <span className="font-mono text-sm sm:text-lg font-black text-slate-900 block mt-0.5">
                    #{data.categoryRank}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold mt-0.5">
                    Dorsal: <strong>{data.bibNumber}</strong>
                  </span>
                </div>

              </div>

              {/* SECCIÓN 4: SELLOS OFICIALES RFID & FIRMAS DIGITALES */}
              <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 mt-2">
                
                {/* FIRMA 1: DIRECTOR TÉCNICO DE CARRERA */}
                <div className="text-center w-full sm:w-auto order-2 sm:order-1">
                  <div className="h-10 flex items-center justify-center">
                    {/* Trazo gráfico vectorial de firma digital */}
                    <svg viewBox="0 0 160 40" className="h-8 w-36 text-slate-800 fill-none stroke-current stroke-2">
                      <path d="M10,25 C30,10 40,35 60,18 C70,10 85,30 110,15 C125,5 140,25 155,20" />
                      <path d="M35,30 L130,28" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                  </div>
                  <div className="w-40 sm:w-52 border-t border-slate-400 mx-auto pt-1">
                    <span className="text-[10px] font-black text-slate-900 uppercase block leading-tight truncate px-1">
                      {data.organizerName || "Comité Organizador Oficial"}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">
                      Dirección General de Carrera
                    </span>
                  </div>
                </div>

                {/* SELLO CENTRAL: TIEMPO OFICIAL CERTIFICADO RFID */}
                <div className="flex items-center gap-3 order-1 sm:order-2">
                  
                  {/* Medallón / Sello Dorado Vectorial */}
                  <div className="relative flex items-center justify-center">
                    <svg
                      viewBox="0 0 120 120"
                      className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md animate-spin-slow"
                    >
                      {/* Círculo Dentado Exterior */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={selectedTheme.sealPrimary}
                        strokeWidth="3"
                        strokeDasharray="6 3"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="47"
                        fill={selectedTheme.sealPrimary}
                        fillOpacity="0.08"
                        stroke={selectedTheme.sealSecondary}
                        strokeWidth="1.5"
                      />
                      {/* Texto Curvo en Sello */}
                      <path
                        id="sealPath"
                        d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                        fill="none"
                      />
                      <text className="text-[8px] font-black uppercase tracking-widest fill-current text-slate-800">
                        <textPath href="#sealPath" startOffset="50%" textAnchor="middle">
                          ★ TIEMPO OFICIAL CERTIFICADO RFID ★
                        </textPath>
                      </text>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mb-0.5" />
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter text-slate-900 leading-none">
                        PÍSALE
                      </span>
                      <span className="text-[6px] font-bold uppercase tracking-widest text-emerald-700 leading-none mt-0.5">
                        VERIFICADO
                      </span>
                    </div>
                  </div>

                  {/* QR de Validación Oficial */}
                  <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
                    <RealQRCode value={verificationUrl} size={48} className="rounded-md" />
                    <span className="text-[7px] font-mono font-bold text-slate-500 mt-0.5">
                      E-VERIFY
                    </span>
                  </div>

                </div>

                {/* FIRMA 2: JUEZ PRINCIPAL DE CRONOMETRAJE */}
                <div className="text-center w-full sm:w-auto order-3">
                  <div className="h-10 flex items-center justify-center">
                    {/* Trazo gráfico vectorial de firma digital */}
                    <svg viewBox="0 0 160 40" className="h-8 w-36 text-slate-800 fill-none stroke-current stroke-2">
                      <path d="M15,20 C45,5 30,35 65,22 C85,15 95,32 120,18 C135,10 145,28 150,15" />
                      <path d="M30,32 L135,28" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                  </div>
                  <div className="w-40 sm:w-52 border-t border-slate-400 mx-auto pt-1">
                    <span className="text-[10px] font-black text-slate-900 uppercase block leading-tight">
                      Dirección Técnica de Tiempos
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">
                      Colegio Oficial de Jueces RFID
                    </span>
                  </div>
                </div>

              </div>

              {/* PIE DE SEGURIDAD DEL CERTIFICADO */}
              <div className="relative z-10 pt-2 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 border-t border-slate-100">
                <span>
                  FOLIO: <strong>{folioCertificado}</strong> · DORSAL: <strong>{data.bibNumber}</strong>
                </span>
                <span className="hidden sm:inline">
                  CRONOMETRAJE COMPUTARIZADO POR SISTEMAS PÍSALE MX
                </span>
                <span>
                  EMITIDO: {new Date().toLocaleDateString("es-MX")}
                </span>
              </div>

            </div>

          </div>

          {/* TARJETA INFORMATIVA INFERIOR (NO PRINT) */}
          <div className="no-print bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-display font-black text-base text-slate-900">
                  ¿Listo para colgar tu diploma?
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Puedes guardarlo en PDF para imprimirlo en papel fotográfico u opalina horizontal, o descargarlo como imagen de alta resolución para presumir tu logro en redes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/dashboard"
                className="w-full md:w-auto text-center px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Ir a mi Dashboard
              </Link>
              <button
                onClick={handlePrint}
                className="w-full md:w-auto text-center px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Imprimir Diploma
              </button>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
