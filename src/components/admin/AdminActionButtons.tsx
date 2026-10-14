"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  aprobarOrganizacion,
  rechazarOrganizacion,
  cambiarEstadoCarrera,
  cambiarRolUsuario,
} from "@/app/actions/admin";
import { Check, X, ShieldAlert, Sparkles, Loader2 } from "lucide-react";

export function BotonAprobarOrganizacion({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm("¿Deseas aprobar este organizador y activar sus permisos de publicación?")) return;
    setLoading(true);
    await aprobarOrganizacion(orgId);
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-sm disabled:opacity-50 cursor-pointer"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
      Aprobar y Verificar
    </button>
  );
}

export function BotonRechazarOrganizacion({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!confirm("¿Deseas rechazar o suspender esta organización?")) return;
    setLoading(true);
    await rechazarOrganizacion(orgId);
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleReject}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
      Rechazar
    </button>
  );
}

export function BotonToggleCarrera({
  raceId,
  currentStatus,
}: {
  raceId: string;
  currentStatus: "PUBLISHED" | "DRAFT" | "COMPLETED";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  const handleToggle = async () => {
    setLoading(true);
    await cambiarEstadoCarrera(raceId, newStatus);
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
        currentStatus === "PUBLISHED"
          ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
      }`}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : currentStatus === "PUBLISHED" ? (
        "Pausar Evento"
      ) : (
        "Publicar"
      )}
    </button>
  );
}
