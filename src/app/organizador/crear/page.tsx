import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CrearCarreraForm } from "@/components/organizador/CrearCarreraForm";
import { RegistroOrganizadorForm } from "@/components/organizador/RegistroOrganizadorForm";
import { Sparkles, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export const instant = false;

export const metadata = {
  title: "Publicar Carrera | Písale para Organizadores",
  description: "Crea y publica tu carrera atlética en cuestión de minutos. Gestiona inscripciones, boletos y cronometraje sin fricción.",
};

export default async function CrearCarreraPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/organizador/crear");
  }

  // Resolver ID de usuario y comprobar si ya tiene perfil de organizador
  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (dbUser) userId = dbUser.id;
  }

  const organization = userId
    ? await prisma.organization.findFirst({
        where: { ownerId: userId },
      })
    : null;

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-24 pt-32 sm:pt-36">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-violet-400/20 blur-[140px]" />
        <div className="absolute top-1/2 -left-20 h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-violet-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al Inicio
        </Link>

        {/* Header */}
        <div className="mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-bold text-violet-700 backdrop-blur-md mb-3">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> Centro de Organizadores
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              {organization ? "Publica tu próxima carrera" : "Alta de Organizador Oficial"}
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl">
              {organization
                ? "Configura las distancias, recorrido y precios. En segundos tu evento estará listo para recibir pagos por Stripe, tarjetas y OXXO."
                : "Antes de lanzar tu primera carrera, completa la ficha oficial de tu club, empresa o promotora para garantizar pagos y confianza a los corredores."}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 px-4 py-2 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {organization ? "Promotor Verificado" : "Registro Seguro"}
          </div>
        </div>

        {/* Formulario Dinámico: Onboarding o Creación de Carrera */}
        {organization ? (
          <CrearCarreraForm defaultOrganizerName={organization.name} />
        ) : (
          <RegistroOrganizadorForm
            defaultName={session.user.name || "Club Organizador"}
            defaultEmail={session.user.email || undefined}
          />
        )}
      </div>
    </div>
  );
}
