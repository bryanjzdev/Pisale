"use client";

import { Download } from "lucide-react";

export function ExportCsvButton({
  registrations,
}: {
  registrations: any[];
}) {
  const handleExport = () => {
    if (!registrations || registrations.length === 0) return;

    // Encabezados del CSV
    const headers = ["Folio / Numero", "Nombre", "Email", "Carrera", "Distancia", "Talla Playera", "Monto Pagado", "Fecha Registro"];

    // Filas
    const rows = registrations.map((r) => [
      `"${r.bibNumber || "N/A"}"`,
      `"${r.user?.name || "Corredor"}"`,
      `"${r.user?.email || ""}"`,
      `"${r.raceTitle || ""}"`,
      `"${r.distanceName || ""}"`,
      `"${r.shirtSize || "M"}"`,
      `"${r.amountPaid || 0}"`,
      `"${new Date(r.registeredAt).toLocaleDateString("es-MX")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `padron_corredores_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs"
    >
      <Download className="h-3.5 w-3.5 text-slate-500" />
      Exportar CSV (Cronometraje)
    </button>
  );
}
