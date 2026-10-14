"use client";

import { useState } from "react";
import { descartarInscripcionPendiente } from "@/app/actions/checkout";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function BotonDescartarPendiente({
  registrationId,
}: {
  registrationId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDiscard = async () => {
    if (!confirm("¿Deseas descartar este intento de inscripción pendiente?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await descartarInscripcionPendiente(registrationId);
      if (res?.success) {
        router.refresh();
      } else {
        alert(res?.error || "No se pudo descartar.");
      }
    } catch {
      alert("Error al descartar el intento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDiscard}
      disabled={loading}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50 cursor-pointer disabled:opacity-50"
      title="Descartar intento de compra"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin text-rose-500" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
      <span>Descartar</span>
    </button>
  );
}
