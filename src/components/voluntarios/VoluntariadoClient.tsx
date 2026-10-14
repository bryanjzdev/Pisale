"use client";

import { useState, useEffect, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shirt,
  Coffee,
  Medal,
  FileCheck2,
  Droplets,
  Package,
  Compass,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  Share2,
  QrCode,
  Phone,
  Mail,
  User,
  HeartHandshake,
  BadgeAlert,
  Zap,
} from "lucide-react";
import { RealQRCode } from "@/components/common/RealQRCode";
import type { Race } from "@/lib/mock-races";

interface VolunteerRegistration {
  id: string;
  folio: string;
  fullName: string;
  email: string;
  phone: string;
  shirtSize: "CH" | "M" | "G" | "XL" | "XXL";
  areaId: string;
  areaTitle: string;
  areaEmoji: string;
  shift: "matutino" | "completo";
  shiftLabel: string;
  emergencyName: string;
  emergencyPhone: string;
  registeredAt: string;
  raceId: string;
  status: "CONFIRMADO";
}

interface VoluntariadoClientProps {
  race: Race;
  currentUser?: {
    name?: string;
    email?: string;
  };
}

const VOLUNTEER_AREAS = [
  {
    id: "hidratacion",
    emoji: "💧",
    title: "Puntos de Hidratación en Ruta",
    badge: "Abastecimiento",
    desc: "Armado de estaciones y entrega ágil de vasos de agua e isotónico. ¡La energía y ánimo que mantiene corriendo a los atletas!",
    schedule: "06:00 - 10:30 hrs",
    spotsAvailable: 14,
    colorTheme: "from-sky-500 to-blue-600",
    bgSoft: "bg-sky-50/80 border-sky-200 text-sky-800",
    badgeColor: "bg-sky-100 text-sky-700 border-sky-300",
    icon: Droplets,
  },
  {
    id: "meta_medallas",
    emoji: "🏅",
    title: "Zona de Meta y Entrega de Medallas",
    badge: "Finisher Crew",
    desc: "Colocación de medallas oficiales a los corredores al cruzar el arco de meta, entrega de kits de recuperación y mantas térmicas.",
    schedule: "06:30 - 11:30 hrs",
    spotsAvailable: 8,
    colorTheme: "from-amber-500 to-orange-500",
    bgSoft: "bg-amber-50/80 border-amber-200 text-amber-800",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-300",
    icon: Medal,
  },
  {
    id: "guardarropa",
    emoji: "🎒",
    title: "Guardarropa y Paquetería",
    badge: "Logística & Resguardo",
    desc: "Recepción, etiquetado con número de dorsal, resguardo protegido y entrega ágil de pertenencias personales a atletas.",
    schedule: "05:30 - 11:00 hrs",
    spotsAvailable: 6,
    colorTheme: "from-violet-500 to-purple-600",
    bgSoft: "bg-violet-50/80 border-violet-200 text-violet-800",
    badgeColor: "bg-violet-100 text-violet-700 border-violet-300",
    icon: Package,
  },
  {
    id: "expo_kits",
    emoji: "🎽",
    title: "Entrega de Kits en Expo Deportiva",
    badge: "Atención al Atleta",
    desc: "Validación de boletos QR digitales de Písale, entrega de camisetas técnicas, dorsales con chip y regalos de patrocinadores.",
    schedule: "Víspera de carrera / 08:30 - 16:30 hrs",
    spotsAvailable: 10,
    colorTheme: "from-fuchsia-500 to-pink-600",
    bgSoft: "bg-fuchsia-50/80 border-fuchsia-200 text-fuchsia-800",
    badgeColor: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
    icon: Shirt,
  },
  {
    id: "jueces_ruta",
    emoji: "⏱️",
    title: "Jueces de Ruta y Señalización",
    badge: "Seguridad y Pista",
    desc: "Control de cruces peatonales, señalización de desvíos en bifurcaciones de ruta (5K/10K/21K) y enlace de primeros auxilios.",
    schedule: "05:45 - 10:45 hrs",
    spotsAvailable: 7,
    colorTheme: "from-emerald-500 to-teal-600",
    bgSoft: "bg-emerald-50/80 border-emerald-200 text-emerald-800",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: Compass,
  },
];

const SHIRT_SIZES: Array<{ size: "CH" | "M" | "G" | "XL" | "XXL"; label: string; chest: string }> = [
  { size: "CH", label: "Chica (CH / S)", chest: "36-38 cm" },
  { size: "M", label: "Mediana (M)", chest: "38-40 cm" },
  { size: "G", label: "Grande (G / L)", chest: "40-42 cm" },
  { size: "XL", label: "Extra Grande (XL)", chest: "42-44 cm" },
  { size: "XXL", label: "Doble Extra (XXL)", chest: "44-46 cm" },
];

export function VoluntariadoClient({ race, currentUser }: VoluntariadoClientProps) {
  const [activeTab, setActiveTab] = useState<"registro" | "consulta">("registro");
  const [volunteer, setVolunteer] = useState<VolunteerRegistration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [shirtSize, setShirtSize] = useState<"CH" | "M" | "G" | "XL" | "XXL">("M");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("hidratacion");
  const [shift, setShift] = useState<"matutino" | "completo">("matutino");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Cupos calculados
  const totalStaffRequired = Math.min(150, Math.max(60, Math.round((race.spotsTotal || 1000) * 0.1)));
  const baseStaffRegistered = Math.round(totalStaffRequired * 0.65);
  const spotsAvailableCount = Math.max(8, totalStaffRequired - baseStaffRegistered - (volunteer ? 1 : 0));
  const percentFilled = Math.min(100, Math.round(((totalStaffRequired - spotsAvailableCount) / totalStaffRequired) * 100));

  // Cargar registro previo desde localStorage si existe
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storageKey = `pisale_volunteer_${race.id}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed: VolunteerRegistration = JSON.parse(savedData);
        setVolunteer(parsed);
      }
    } catch {
      // Ignorar error de storage
    }
  }, [race.id]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = async () => {
    if (!volunteer) return;
    const shareData = {
      title: `Acreditación Staff Oficial - ${race.title}`,
      text: `¡Soy voluntario oficial de ${race.title}! Acreditado en el área de ${volunteer.areaTitle} con folio ${volunteer.folio}. Únete tú también con Písale.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback a portapapeles
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Por favor ingresa un correo electrónico válido.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setFormError("Por favor ingresa un número de teléfono/WhatsApp a 10 dígitos.");
      return;
    }
    if (!emergencyName.trim()) {
      setFormError("Por favor indica el nombre de tu contacto de emergencia.");
      return;
    }
    if (!emergencyPhone.trim() || emergencyPhone.replace(/\D/g, "").length < 10) {
      setFormError("Por favor indica el teléfono de tu contacto de emergencia.");
      return;
    }
    if (!acceptedTerms) {
      setFormError("Debes aceptar el compromiso de puntualidad y código de voluntario.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const area = VOLUNTEER_AREAS.find((a) => a.id === selectedAreaId) || VOLUNTEER_AREAS[0];
      const randomFolioNumber = Math.floor(7000 + Math.random() * 2900);
      const folio = `VOL-${randomFolioNumber}`;
      const shiftLabel =
        shift === "matutino" ? "Turno Matutino (05:30 - 11:00 hrs)" : "Jornada Completa (05:30 - 14:00 hrs)";

      const newVolunteer: VolunteerRegistration = {
        id: `vol_${Date.now()}`,
        folio,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        shirtSize,
        areaId: area.id,
        areaTitle: area.title,
        areaEmoji: area.emoji,
        shift,
        shiftLabel,
        emergencyName: emergencyName.trim(),
        emergencyPhone: emergencyPhone.trim(),
        registeredAt: new Date().toISOString(),
        raceId: race.id,
        status: "CONFIRMADO",
      };

      try {
        localStorage.setItem(`pisale_volunteer_${race.id}`, JSON.stringify(newVolunteer));
        // Guardar también en índice de búsqueda local
        const allKey = `pisale_all_volunteers`;
        const existingAll = JSON.parse(localStorage.getItem(allKey) || "[]");
        localStorage.setItem(allKey, JSON.stringify([...existingAll, newVolunteer]));
      } catch {
        // Fallback
      }

      setVolunteer(newVolunteer);
      setIsSubmitting(false);

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 350, behavior: "smooth" });
      }
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchError("Ingresa tu folio (ej. VOL-7401) o correo de registro.");
      return;
    }

    try {
      const specific = localStorage.getItem(`pisale_volunteer_${race.id}`);
      if (specific) {
        const parsed: VolunteerRegistration = JSON.parse(specific);
        if (
          parsed.folio.toLowerCase() === q ||
          parsed.email.toLowerCase() === q ||
          parsed.phone.includes(q)
        ) {
          setVolunteer(parsed);
          setActiveTab("registro");
          return;
        }
      }

      const all = JSON.parse(localStorage.getItem(`pisale_all_volunteers`) || "[]");
      const found = all.find(
        (v: VolunteerRegistration) =>
          (v.folio.toLowerCase() === q || v.email.toLowerCase() === q) && v.raceId === race.id
      );

      if (found) {
        setVolunteer(found);
        setActiveTab("registro");
        return;
      }
      setSearchError("No encontramos una postulación con ese folio o correo para esta carrera.");
    } catch {
      setSearchError("Ocurrió un error al buscar tu acreditación.");
    }
  };

  const selectedAreaObj = VOLUNTEER_AREAS.find((a) => a.id === selectedAreaId) || VOLUNTEER_AREAS[0];

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 print:bg-white print:text-slate-900 pb-20 pt-28 sm:pt-32">
      {/* Fondo con aurora sutil para pantalla */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[700px] overflow-hidden print:hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-amber-300/20 blur-[130px]" />
        <div className="absolute right-0 top-16 h-[460px] w-[460px] rounded-full bg-fuchsia-300/20 blur-[140px]" />
        <div className="absolute left-1/3 top-48 h-[380px] w-[380px] rounded-full bg-violet-300/25 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Navegación y Volver a la carrera */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href={`/carrera/${race.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver a la carrera</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Convocatoria Oficial</span>
            <span className="text-slate-300">/</span>
            <span className="text-violet-700 font-bold">Voluntariado & Staff</span>
          </div>
        </div>

        {/* =========================================================================
            SECCIÓN A: CABECERA Y BENEFICIOS DE STAFF (print:hidden)
           ========================================================================= */}
        <header className="mb-10 text-center sm:text-left print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-500/10 via-orange-500/10 to-violet-500/10 border border-amber-300/60 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-800 mb-3 shadow-xs">
                <HeartHandshake className="h-3.5 w-3.5 text-orange-600" />
                <span>Convocatoria Oficial · Crew & Voluntariado Deportivo</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                Sé el Motor de la Carrera:{" "}
                <span className="text-brand">Staff Oficial</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                Toda gran carrera necesita entre 50 y 150 voluntarios para entrega de kits, hidratación en ruta,
                guardarropa y entrega de medallas. Vive la fiesta del atletismo desde adentro y recibe tu acreditación oficial.
              </p>
            </div>

            {/* Ficha rápida de sede y cupos */}
            <div className="shrink-0 rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:w-80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Users className="h-3.5 w-3.5 text-violet-600" />
                  Cupos de Staff Oficial
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold">
                  {percentFilled}% Cubierto
                </span>
              </div>

              {/* Barra de progreso de cupos */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 mb-3">
                <div
                  className="h-full rounded-full bg-linear-to-r from-violet-600 via-fuchsia-600 to-amber-500 transition-all duration-700"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-2xl font-black text-slate-900">{spotsAvailableCount}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1">cupos restantes</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Meta: {totalStaffRequired}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-violet-500 shrink-0" />
                  <span>{race.day} {race.month} {race.year}</span>
                </div>
                <div className="flex items-center gap-1 truncate" title={race.location}>
                  <MapPin className="h-3 w-3 text-fuchsia-500 shrink-0" />
                  <span className="truncate">{race.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas destacadas de beneficios (4 tarjetas) */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Beneficios Exclusivos para el Staff Oficial
              </h2>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Todo incluido sin costo para los miembros del Crew
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Beneficio 1 */}
              <div className="group rounded-3xl border border-sky-100 bg-linear-to-b from-sky-50/60 to-white p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 mb-3.5 group-hover:scale-105 transition-transform">
                  <Shirt className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 block mb-1">
                  Textil Oficial
                </span>
                <h3 className="font-display font-black text-slate-900 text-base mb-1.5">
                  Playera Dry-Fit Staff
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Confección de alta visibilidad, transpirable y antimicrobiana exclusiva para staff. Tallas CH a XXL.
                </p>
              </div>

              {/* Beneficio 2 */}
              <div className="group rounded-3xl border border-amber-100 bg-linear-to-b from-amber-50/60 to-white p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 mb-3.5 group-hover:scale-105 transition-transform">
                  <Coffee className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                  Abastecimiento
                </span>
                <h3 className="font-display font-black text-slate-900 text-base mb-1.5">
                  Kit de Alimentación
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Box lunch energético completo (baguette, fruta, barra de proteína) e hidratación continua durante toda la jornada.
                </p>
              </div>

              {/* Beneficio 3 */}
              <div className="group rounded-3xl border border-violet-100 bg-linear-to-b from-violet-50/60 to-white p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20 mb-3.5 group-hover:scale-105 transition-transform">
                  <Medal className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700 block mb-1">
                  Reconocimiento
                </span>
                <h3 className="font-display font-black text-slate-900 text-base mb-1.5">
                  Medalla de Staff Oficial
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Presea metálica conmemorativa de fundición especial con listón sublimado exclusivo Crew Finisher 2026.
                </p>
              </div>

              {/* Beneficio 4 */}
              <div className="group rounded-3xl border border-emerald-100 bg-linear-to-b from-emerald-50/60 to-white p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 mb-3.5 group-hover:scale-105 transition-transform">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                  Validez Curricular
                </span>
                <h3 className="font-display font-black text-slate-900 text-base mb-1.5">
                  Constancia Digital con QR
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Acreditación digital avalada por el comité de Písale con folio QR, válida para liberación de horas de servicio social.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================================
            ALERT/BANNER DE VOLUNTARIO REGISTRADO SI YA TIENE GAFETE
           ========================================================================= */}
        {volunteer && (
          <div className="mb-8 rounded-3xl border-2 border-emerald-300 bg-linear-to-r from-emerald-50 via-teal-50 to-white p-6 shadow-md print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-900">
                      ¡Postulación Aprobada!
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">Folio: {volunteer.folio}</span>
                  </div>
                  <h3 className="font-display text-xl font-black text-slate-900">
                    Hola {volunteer.fullName.split(" ")[0]}, tu Gafete Oficial está listo
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Área asignada: <strong>{volunteer.areaTitle}</strong> · {volunteer.shiftLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-violet-400" />
                  <span>Imprimir Gafete / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("¿Deseas registrar a otro voluntario o modificar tu postulación?")) {
                      setVolunteer(null);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Registrar a otro</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑAS: NUEVA POSTULACIÓN vs CONSULTAR GAFETE (print:hidden) */}
        {!volunteer && (
          <div className="mb-8 flex items-center justify-center gap-2 print:hidden">
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("registro");
                  setSearchError(null);
                }}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black transition-all cursor-pointer ${
                  activeTab === "registro"
                    ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Formulario de Postulación</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("consulta");
                  setFormError(null);
                }}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black transition-all cursor-pointer ${
                  activeTab === "consulta"
                    ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>Ya me postulé (Consultar Gafete)</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECCIÓN C: GAFETE DIGITAL OFICIAL (ACREDITACIÓN CON QR)
            Si el voluntario está registrado, mostramos el Gafete Digital Vertical
           ========================================================================= */}
        {volunteer && (
          <div className="my-8">
            <div className="mx-auto max-w-md">
              {/* Controles sobre el gafete en pantalla */}
              <div className="mb-4 flex items-center justify-between print:hidden">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BadgeAlert className="h-4 w-4 text-emerald-600" />
                  Gafete Oficial de Acreditación
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:underline"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{copiedLink ? "¡Enlace copiado!" : "Compartir"}</span>
                  </button>
                </div>
              </div>

              {/* =============================================================
                  CREDENCIAL COLGANTE VERTICAL (LANYARD PASS)
                  Optimizado para impresión y pantalla
                 ============================================================= */}
              <div
                id="gafete-staff-oficial"
                className="print-break-inside-avoid relative mx-auto w-full max-w-[390px] rounded-3xl bg-white text-slate-900 border-2 border-slate-900 shadow-2xl overflow-hidden print:border-2 print:border-black print:shadow-none print:m-0 print:max-w-none print:w-[360px]"
              >
                {/* Ranura simulación de colgante / lanyard (perforación de gafete) */}
                <div className="relative pt-4 pb-2 text-center bg-slate-950 text-white">
                  <div className="mx-auto h-3 w-14 rounded-full bg-slate-800 border-2 border-slate-700 shadow-inner mb-2" />
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-amber-400">
                    <Zap className="h-3 w-3 fill-amber-400" />
                    <span>Písale Official Crew · Staff Pass 2026</span>
                  </div>
                </div>

                {/* Encabezado del Gafete con Branding y Nombre de Carrera */}
                <div className="relative bg-linear-to-r from-violet-700 via-purple-700 to-fuchsia-700 px-6 py-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white p-0.5 shadow-sm">
                        <Image
                          src="/assets/Logo_Pisale.png"
                          alt="Logo Písale"
                          width={32}
                          height={32}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="font-display font-extrabold text-lg tracking-tight text-white">
                        písale<span className="text-amber-400">.</span>
                      </span>
                    </div>

                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-mono text-[10px] font-black tracking-wider text-white uppercase backdrop-blur-sm">
                      {volunteer.folio}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-black leading-tight text-white line-clamp-2">
                    {race.title}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-purple-100 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {race.day} {race.month} {race.year}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="h-3 w-3" />
                      {race.location}
                    </span>
                  </div>
                </div>

                {/* Cuerpo Central del Gafete: Identidad del Voluntario */}
                <div className="p-6 text-center bg-linear-to-b from-white to-slate-50/80">
                  {/* Foto de perfil / Avatar con inicial */}
                  <div className="relative mx-auto mb-3 h-20 w-20 rounded-full bg-linear-to-tr from-violet-600 via-fuchsia-600 to-amber-500 p-1 shadow-lg shadow-violet-500/20">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-white font-display text-2xl font-black">
                      {volunteer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Nombre del voluntario */}
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
                    Voluntario Acreditado
                  </span>
                  <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                    {volunteer.fullName}
                  </h3>

                  {/* Área asignada destacada */}
                  <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-black text-white shadow-sm">
                    <span>{volunteer.areaEmoji}</span>
                    <span>{volunteer.areaTitle}</span>
                  </div>

                  {/* Datos del Turno y Talla */}
                  <div className="grid grid-cols-2 gap-2 mb-4 rounded-2xl bg-white p-3 border border-slate-200 text-left text-xs">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Horario Asignado
                      </span>
                      <span className="font-bold text-slate-800 text-[11px] block mt-0.5">
                        {volunteer.shift === "matutino" ? "05:30 - 11:00 hrs" : "05:30 - 14:00 hrs"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Talla Dry-Fit
                      </span>
                      <span className="font-bold text-violet-700 text-xs block mt-0.5">
                        Talla {volunteer.shirtSize}
                      </span>
                    </div>
                  </div>

                  {/* Código QR de Validación Oficial */}
                  <div className="my-2 rounded-2xl bg-white p-4 border-2 border-dashed border-slate-300 inline-block">
                    <RealQRCode
                      value={`https://pisale.mx/validar/staff?folio=${volunteer.folio}&race=${encodeURIComponent(
                        race.id
                      )}&name=${encodeURIComponent(volunteer.fullName)}&area=${encodeURIComponent(
                        volunteer.areaId
                      )}`}
                      size={130}
                      className="mx-auto"
                    />
                    <span className="mt-2 block font-mono text-[10px] font-black tracking-widest text-slate-800">
                      CÓDIGO DE ACCESO OPERATIVO
                    </span>
                  </div>

                  {/* Datos de Emergencia al pie del Gafete */}
                  <div className="mt-3 rounded-xl bg-slate-100 p-2.5 text-left text-[10px] text-slate-600 border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                      <span>Contacto SOS:</span>
                      <span className="font-mono text-slate-900">{volunteer.emergencyPhone}</span>
                    </div>
                    <div className="truncate text-slate-500">{volunteer.emergencyName}</div>
                  </div>
                </div>

                {/* Pie del Gafete tipo Banda Magnética y Microtexto */}
                <div className="border-t border-slate-200 bg-slate-950 px-6 py-3 text-center text-[9px] text-slate-400 leading-tight">
                  <div className="flex items-center justify-center gap-2 font-mono text-[10px] font-bold text-amber-400 mb-1">
                    <span>* ACCESO A ZONA TÉCNICA Y CIRCUITO *</span>
                  </div>
                  <p>
                    Acreditación personal e intransferible. Portar en todo momento con la playera oficial de staff.
                    Emitido por Písale Timing Systems.
                  </p>
                </div>
              </div>

              {/* Botón flotante de impresión debajo del gafete en pantalla */}
              <div className="mt-6 flex flex-col gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-shine relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-sm font-black text-white shadow-xl shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Printer className="h-5 w-5" />
                  <span>Imprimir / Descargar Gafete PDF</span>
                  <Sparkles className="h-4 w-4 opacity-80" />
                </button>

                <p className="text-center text-xs text-slate-500">
                  💡 <strong>Tip de impresión:</strong> En el menú de tu navegador selecciona "Guardar como PDF" y tamaño
                  estándar. El gafete está optimizado automáticamente con tamaño credencial.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PESTAÑA DE CONSULTA DE GAFETE (Si no tiene registro cargado)
           ========================================================================= */}
        {!volunteer && activeTab === "consulta" && (
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5 print:hidden">
            <div className="text-center mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900">
                Consulta tu Gafete de Staff
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Ingresa tu folio de voluntario (ej. VOL-7401) o el correo con el que te postulaste.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Folio o Correo Electrónico
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="VOL-7401 o tu@correo.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all outline-hidden"
                  />
                </div>
              </div>

              {searchError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Buscar mi Acreditación</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            SECCIÓN B: FORMULARIO DE POSTULACIÓN (print:hidden)
           ========================================================================= */}
        {!volunteer && activeTab === "registro" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5 print:hidden">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700 block mb-1">
                Paso Único · Registro Oficial
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                Formulario de Postulación de Voluntariado
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Completa tus datos personales, talla de playera y selecciona tu área preferida para recibir tu gafete digital inmediato.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. DATOS PERSONALES */}
              <div>
                <h3 className="font-display text-base font-black text-slate-900 flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-violet-600" />
                  1. Datos Personales
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nombre Completo <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. María Fernanda Morales"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Correo Electrónico <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Teléfono / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="55 1234 5678 (10 dígitos)"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all outline-hidden font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. TALLA DE PLAYERA OFICIAL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-base font-black text-slate-900 flex items-center gap-2">
                    <Shirt className="h-4 w-4 text-fuchsia-600" />
                    2. Talla de Playera Dry-Fit Oficial
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Corte deportivo atlético</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {SHIRT_SIZES.map((item) => (
                    <button
                      key={item.size}
                      type="button"
                      onClick={() => setShirtSize(item.size)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        shirtSize === item.size
                          ? "border-violet-600 bg-violet-50/80 text-violet-950 ring-2 ring-violet-500/30 shadow-xs"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="font-display font-black text-lg">{item.size}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{item.chest}</span>
                      {shirtSize === item.size && (
                        <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. ÁREA DE INTERÉS */}
              <div>
                <h3 className="font-display text-base font-black text-slate-900 flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  3. Área de Interés / Asignación
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Selecciona la posición donde más te gustaría colaborar durante el evento:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {VOLUNTEER_AREAS.map((area) => {
                    const isSelected = selectedAreaId === area.id;
                    const IconComponent = area.icon;
                    return (
                      <div
                        key={area.id}
                        onClick={() => setSelectedAreaId(area.id)}
                        className={`group relative rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-violet-600 bg-linear-to-br from-violet-50/80 via-fuchsia-50/40 to-white ring-2 ring-violet-500/30 shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{area.emoji}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                                isSelected ? "bg-violet-600 text-white border-violet-600" : area.badgeColor
                              }`}
                            >
                              {area.badge}
                            </span>
                          </div>

                          <h4 className="font-display font-black text-slate-900 text-sm mb-1">
                            {area.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {area.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {area.schedule}
                          </span>
                          <span className="font-bold text-emerald-700">
                            {area.spotsAvailable} cupos
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. DISPONIBILIDAD Y TURNO */}
              <div>
                <h3 className="font-display text-base font-black text-slate-900 flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-sky-600" />
                  4. Disponibilidad de Horario
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      shift === "matutino"
                        ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shift"
                      checked={shift === "matutino"}
                      onChange={() => setShift("matutino")}
                      className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        🌅 Turno Matutino (05:30 - 11:00 hrs)
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Operación principal de carrera, hidratación y bienvenida a corredores en meta.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      shift === "completo"
                        ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shift"
                      checked={shift === "completo"}
                      onChange={() => setShift("completo")}
                      className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        ⚡ Jornada Completa (05:30 - 14:00 hrs)
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Montaje inicial, carrera, meta, apoyo en ceremonia de premiación y cierre.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 5. CONTACTO DE EMERGENCIA */}
              <div>
                <h3 className="font-display text-base font-black text-slate-900 flex items-center gap-2 mb-3">
                  <Phone className="h-4 w-4 text-rose-500" />
                  5. Contacto de Emergencia
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nombre de Familiar o Amigo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="Ej. Roberto Sánchez (Padre)"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Teléfono de Emergencia <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="55 9876 5432"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* COMPROMISO */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="text-xs text-amber-900 leading-relaxed font-medium">
                    Me comprometo a asistir puntualmente a las <strong>05:30 hrs</strong> a la sede de la carrera, portar
                    con orgullo la playera y acreditación oficial de staff y brindar una atención respetuosa y entusiasta
                    a los atletas.
                  </div>
                </label>
              </div>

              {/* MENSAJE DE ERROR */}
              {formError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* BOTÓN SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-shine relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-base font-black text-white shadow-xl shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Generando Acreditación y Gafete...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Completar Postulación y Recibir Gafete Oficial</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
