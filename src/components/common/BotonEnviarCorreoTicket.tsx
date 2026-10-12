"use client";

import { useState } from "react";
import { enviarBoletoPorCorreo } from "@/app/actions/email";
import { Mail, Check, Loader2, AlertCircle } from "lucide-react";

export function BotonEnviarCorreoTicket({
  registrationId,
  runnerEmail,
  compact = false,
}: {
  registrationId: string;
  runnerEmail?: string;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setSent(false);

    try {
      const res = await enviarBoletoPorCorreo(registrationId);
      if (res?.success) {
        setSent(true);
      } else {
        setError(res?.error || "No se pudo enviar.");
      }
    } catch (err: any) {
      setError(err?.message || "Error al conectar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleSend}
        disabled={loading || sent}
        className={`inline-flex items-center gap-1.5 rounded-full transition-all shadow-sm cursor-pointer ${
          compact ? "px-3 py-1.5 text-[11px] font-semibold" : "px-5 py-3 text-xs font-bold"
        } ${
          sent
            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
            : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
        } disabled:opacity-75`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-fuchsia-400" />
            Enviando a tu correo...
          </>
        ) : sent ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            Boleto enviado a tu bandeja
          </>
        ) : (
          <>
            <Mail className="h-4 w-4 text-violet-400" />
            Enviar boleto a mi correo
          </>
        )}
      </button>

      {sent && runnerEmail && (
        <span className="text-[11px] text-emerald-600 font-medium pl-2">
          ✓ Enviado a {runnerEmail}
        </span>
      )}

      {error && (
        <span className="text-[11px] text-rose-600 font-semibold pl-2 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </span>
      )}
    </div>
  );
}
