"use client";

import { Printer, Download, Sparkles } from "lucide-react";

export function BotonImprimirBoleto({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "compact";
}) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handlePrint}
        className={`inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-95 transition-all cursor-pointer ${className}`}
        title="Imprimir o guardar como PDF"
      >
        <Printer className="h-3.5 w-3.5 text-violet-400" />
        Imprimir / PDF
      </button>
    );
  }

  return (
    <button
      onClick={handlePrint}
      className={`inline-flex items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${className}`}
    >
      <Printer className="h-4 w-4" />
      <span>Imprimir / Descargar Boleto PDF</span>
      <Sparkles className="h-3.5 w-3.5 opacity-80" />
    </button>
  );
}
