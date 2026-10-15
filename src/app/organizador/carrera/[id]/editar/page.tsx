import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { connection } from "next/server";
import { EditarCarreraForm } from "@/components/organizador/EditarCarreraForm";
import Link from "next/link";
import { ArrowLeft, Edit3, ShieldCheck } from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Editar Evento Deportivo | Písale",
  description: "Modifica información oficial, fecha, horarios, distancias y precios de tu carrera.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarCarreraPage({ params }: Props) {
  await connection();
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/organizador/carrera/${id}/editar`);
  }

  const race = await prisma.race.findUnique({
    where: { id },
    include: {
      distances: true,
      organization: true,
    },
  });

  if (!race) {
    notFound();
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const isOwnerEmail = session.user.email.toLowerCase() === "bjm.dev.soft@gmail.com";
  const isAdmin = dbUser?.role === "ADMIN" || isOwnerEmail;
  const isOrgOwner = dbUser && race.organization.ownerId === dbUser.id;

  if (!isAdmin && !isOrgOwner) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-[#fcfbfe] text-slate-900 pb-28 pt-28 sm:pt-32">
      {/* Halos de fondo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-violet-400/20 blur-[140px]" />
        <div className="absolute top-1/2 -left-20 h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/carrera/${race.id}`}
            className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver a la carrera</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 mb-2">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edición de Evento Oficial</span>
                {isAdmin && (
                  <span className="ml-1 rounded-md bg-amber-100 text-amber-900 px-1.5 py-0.2 text-[10px] font-black">
                    SuperAdmin
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Editar {race.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Actualiza fechas, precios de boletos o logística. Los cambios se sincronizarán al instante en Písale.
              </p>
            </div>
          </div>
        </div>

        <EditarCarreraForm race={race} />
      </div>
    </div>
  );
}
