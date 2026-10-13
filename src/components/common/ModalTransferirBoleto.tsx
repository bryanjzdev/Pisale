"use client";

import { useState } from "react";
import { ArrowRightLeft, Check, AlertTriangle, X, Loader2, ShieldCheck, Mail, User, Shirt } from "lucide-react";
import { transferirBoleto } from "@/app/actions/transfer";
import { useRouter } from "next/navigation";

interface ModalTransferirBoletoProps {
  registrationId: string;
  raceTitle: string;
  distanceName?: string;
  bibNumber?: string;
  currentShirtSize?: string;
  runnerName?: string;
}

export function ModalTransferirBoleto({
  registrationId,
  raceTitle,
  distanceName,
  bibNumber,
  currentShirtSize,
  runnerName,
}: ModalTransferirBoletoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [shirtSize, setShirtSize] = useState(currentShirtSize || "M");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const router = useRouter();

  const handleOpen = () => {
    setStatus(null);
    setAcceptedTerms(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setStatus({ success: false, message: "Debes aceptar los términos de la cesión definitiva." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await transferirBoleto({
        registrationId,
        recipientEmail,
        recipientName,
        shirtSize,
      });

      if (res.success) {
        setStatus({ success: true, message: res.message });
        setTimeout(() => {
          setIsOpen(false);
          router.refresh();
        }, 2200);
      } else {
        setStatus({ success: false, message: res.error || "No se pudo transferir el boleto." });
      }
    } catch (err: any) {
      setStatus({ success: false, message: err?.message || "Error al procesar la cesión." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        className="inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full transition-colors border border-amber-200/80 cursor-pointer text-xs"
        title="Transferir o ceder este boleto a otro corredor"
      >
        <ArrowRightLeft className="h-3 w-3 text-amber-600" />
        <span>Ceder Boleto</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header decorativo */}
            <div className="flex items-start justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
                  <ArrowRightLeft className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black text-slate-900">
                    Cesión Oficial de Boleto
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Transferencia segura, legal y directa entre corredores
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Resumen del Boleto */}
            <div className="mb-5 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-slate-900">{raceTitle}</span>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 font-bold text-violet-700 text-[10px]">
                  {distanceName || "Distancia General"}
                </span>
              </div>
              <div className="text-slate-500 text-[11px] flex items-center justify-between">
                <span>Dorsal: <strong className="font-mono text-slate-800">{bibNumber || "PSL-OFICIAL"}</strong></span>
                {runnerName && <span>Titular actual: <strong className="text-slate-700">{runnerName}</strong></span>}
              </div>
            </div>

            {status && (
              <div
                className={`mb-5 rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2.5 ${
                  status.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {status.success ? (
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Nombre Completo del Nuevo Titular *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza Sánchez"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Correo Electrónico del Receptor *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="carlos.mendoza@gmail.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Le enviaremos un correo con su boleto oficial, código QR y carta responsiva lista para firmar.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Talla de Playera del Nuevo Corredor
                </label>
                <div className="relative">
                  <Shirt className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={shirtSize}
                    onChange={(e) => setShirtSize(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  >
                    <option value="XS">XS (Extra Chica)</option>
                    <option value="S">S (Chica)</option>
                    <option value="M">M (Mediana)</option>
                    <option value="L">L (Grande)</option>
                    <option value="XL">XL (Extra Grande)</option>
                    <option value="XXL">XXL (Doble Extra Grande)</option>
                  </select>
                </div>
              </div>

              {/* Advertencia Legal */}
              <div className="rounded-2xl bg-amber-50/70 p-3.5 border border-amber-200/70">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-[11px] leading-relaxed text-amber-900 font-medium">
                    Acepto que esta <strong>cesión es definitiva e irrevocable</strong>. Al completarse, mi titularidad sobre este boleto se anula automáticamente y no podré reclamar el kit ni dorsal.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="rounded-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-fuchsia-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Transfiriendo...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Confirmar Cesión</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
