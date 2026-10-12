"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarOrganizador, type RegistroOrganizadorInput } from "@/app/actions/organizador";
import {
  Building2,
  User,
  Users,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function RegistroOrganizadorForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail?: string;
}) {
  const router = useRouter();

  const [type, setType] = useState<"PERSONA" | "EMPRESA" | "CLUB">("CLUB");
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [rfc, setRfc] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await registrarOrganizador({
        name,
        type,
        phone,
        city,
        description,
        rfc,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message || "Error al registrar el perfil.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(91,33,182,0.12)] backdrop-blur-2xl">
      {/* Banner de Verificación */}
      <div className="mb-8 rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 p-[1px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[15px] bg-slate-950 p-5 text-white">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Paso Previo Requerido
                </span>
                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                  Seguridad Pisale
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                Registro y Verificación de Promotor Deportivo
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Valida los datos de tu club o empresa para activar la publicación de eventos con pagos protegidos.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Activación Inmediata
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de Tipo */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2.5">
            1. Tipo de Organizador
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setType("CLUB")}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                type === "CLUB"
                  ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-600/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${type === "CLUB" ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Club Deportivo</p>
                <p className="text-[11px] text-slate-500 font-medium">Equipo, grupo o asociación</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType("EMPRESA")}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                type === "EMPRESA"
                  ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-600/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${type === "EMPRESA" ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Empresa / Promotora</p>
                <p className="text-[11px] text-slate-500 font-medium">Agencia de eventos o marca</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType("PERSONA")}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                type === "PERSONA"
                  ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-600/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${type === "PERSONA" ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Persona Física</p>
                <p className="text-[11px] text-slate-500 font-medium">Organizador independiente</p>
              </div>
            </button>
          </div>
        </div>

        {/* Nombre de la Organización */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              2. Nombre Oficial o Comercial *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Club Atlético Teotihuacán / ChronoSport MX"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Este nombre aparecerá en todas tus carreras y boletos.</p>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              3. WhatsApp / Teléfono de Soporte *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ej. 55 1234 5678"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Para dudas de corredores y notificaciones de logística.</p>
          </div>
        </div>

        {/* Ciudad y RFC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              4. Ciudad y Estado Base
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="ej. CDMX / Estado de México"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              RFC o Razón Fiscal <span className="text-slate-400 lowercase font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={rfc}
                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                placeholder="ej. XAXX010101000"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none uppercase transition-all"
              />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
            5. Breve Reseña o Trayectoria del Club / Marca
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ej. Promotora especializada en carreras de ruta y maratones certificados desde 2020 con más de 10 eventos realizados..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-shine flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 font-extrabold text-sm text-white shadow-xl shadow-fuchsia-500/25 transition-all hover:scale-[1.01] hover:shadow-fuchsia-500/40 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Validando perfil oficial...</span>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                Verificar y Activar Perfil de Organizador
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-3 flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3 text-slate-400" />
            Tus datos están protegidos bajo cifrado SSL de extremo a extremo.
          </p>
        </div>
      </form>
    </div>
  );
}
