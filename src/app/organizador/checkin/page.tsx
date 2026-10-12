import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  QrCode,
  ArrowLeft,
  ShieldCheck,
  Building2,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { CheckInScannerClient } from "@/components/organizador/CheckInScannerClient";

export const instant = false;

export const metadata = {
  title: "Escáner de Check-In y Entrega de Kits | Písale",
  description: "Valida boletos oficiales con la cámara de tu celular en segundos y registra la entrega de kits de corredor.",
};

export default async function CheckInPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/organizador/checkin");
  }

  // Verificar que sea organizador o admin
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { organizations: true },
  });

  const isOwnerOrAdmin =
    session.user.email.toLowerCase() === "bjm.dev.soft@gmail.com" ||
    (session.user as any).role === "ADMIN" ||
    dbUser?.role === "ADMIN";

  const isOrganizer = dbUser?.role === "ORGANIZADOR" || (dbUser?.organizations && dbUser.organizations.length > 0);

  if (!isOwnerOrAdmin && !isOrganizer) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-28 pt-32 sm:pt-36">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-violet-400/20 blur-[140px]" />
        <div className="absolute top-1/2 -left-20 h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/organizador/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Panel del Organizador
          </Link>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
            <PackageCheck className="h-4 w-4 text-emerald-600" />
            Módulo Oficial de Entrega de Kits
          </div>
        </div>

        {/* Title Card */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-bold text-violet-700 backdrop-blur-md mb-3">
            <QrCode className="h-3.5 w-3.5" /> Check-In Rápido
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Escáner y Validación de Boletos
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl font-medium">
            Usa la cámara de tu smartphone o laptop para escanear el código QR del boleto del corredor. El sistema valida el pago, la talla de playera y registra la entrega al instante.
          </p>
        </div>

        {/* Client Scanner */}
        <CheckInScannerClient />
      </div>
    </div>
  );
}
