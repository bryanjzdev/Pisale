"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generarDemo3Dias } from "@/app/actions/admin";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  X,
  QrCode,
  Users,
  DollarSign,
  Share2,
} from "lucide-react";
import Link from "next/link";

export function BotonGenerarDemo3Dias() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [demoData, setDemoData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const res = await generarDemo3Dias();
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.success) {
      setDemoData(res);
      setModalOpen(true);
      router.refresh();
    }
  };

  const handleCopyWhatsapp = () => {
    if (!demoData) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://pisale.mx";
    const text = `¡Hola! Te generé un acceso Demo exclusivo de 3 días en Písale con 10 corredores de prueba ya registrados y cobros simulados para que pruebes el sistema con tu equipo:

🏃‍♂️ Convocatoria Demo: ${origin}${demoData.raceUrl}
📊 Panel de Control: ${origin}${demoData.dashboardUrl}
📱 Escáner Check-In QR: ${origin}${demoData.checkinUrl}

Tienes 72 horas para probarlo completo en tu celular y computadora. ¡Cualquier duda me avisas!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 px-5 text-xs font-black text-white shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generando Demo 72h...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Crear Demo de 3 Días para Organizador</span>
          </>
        )}
      </button>

      {error && (
        <div className="text-xs text-rose-600 font-bold mt-1">
          {error}
        </div>
      )}

      {/* Modal interactivo de Demo Generada */}
      {modalOpen && demoData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/80 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 mb-2">
              <Sparkles className="h-4 w-4" /> Entorno de Prueba Generado
            </div>

            <h3 className="font-display text-2xl font-black text-slate-900 leading-tight">
              ¡Demo de 3 Días Lista para Enviar!
            </h3>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
              Se ha creado una carrera sandbox precargada con atletas, boletos digitales y métricas financieras de prueba para que tu prospecto viva la experiencia completa.
            </p>

            {/* Contador de Vigencia */}
            <div className="mt-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-xs">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                    Vigencia de la Prueba
                  </span>
                  <span className="font-display text-sm font-extrabold text-slate-900">
                    72 horas activas (3 días)
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-amber-200/80 text-amber-900 px-3 py-1 text-xs font-black">
                Expira: {new Date(demoData.expiresAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Detalles de la Demo */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <Users className="h-4 w-4 text-violet-600 mx-auto mb-1" />
                <span className="block text-base font-black text-slate-900">{demoData.runnersCount}</span>
                <span className="text-[10px] font-bold text-slate-400">Atletas cargados</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <DollarSign className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                <span className="block text-base font-black text-slate-900">${demoData.simulatedGMV}</span>
                <span className="text-[10px] font-bold text-slate-400">Ventas simuladas</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <QrCode className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                <span className="block text-base font-black text-slate-900">10 QRs</span>
                <span className="text-[10px] font-bold text-slate-400">Listos para escanear</span>
              </div>
            </div>

            {/* Acciones para compartir */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleCopyWhatsapp}
                className="btn-shine w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3.5 text-xs font-black text-white shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    ¡Mensaje de WhatsApp Copiado al Portapapeles!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Copiar Mensaje Completo para WhatsApp / Correo
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={demoData.raceUrl}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition-colors"
                >
                  <span>Ver Convocatoria Demo</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href={demoData.checkinUrl}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-violet-200 bg-violet-50 hover:bg-violet-100 px-3 py-2.5 text-xs font-bold text-violet-700 transition-colors"
                >
                  <QrCode className="h-3.5 w-3.5 text-violet-600" />
                  <span>Probar Escáner Check-In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
