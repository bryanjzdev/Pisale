import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getRaceById } from "@/lib/races";
import { ArrowLeft, Sparkles, QrCode } from "lucide-react";
import { RunnerStoryGenerator } from "@/components/common/RunnerStoryGenerator";

export const instant = false;

export default async function CarreraStoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    session_id?: string;
    registration_id?: string;
  }>;
}) {
  const { id } = await params;
  const { session_id, registration_id } = await searchParams;

  const race = await getRaceById(id);
  if (!race) {
    notFound();
  }

  const session = await auth();

  // Buscar inscripción
  let registration = null;

  if (registration_id) {
    registration = await prisma.registration.findUnique({
      where: { id: registration_id },
      include: { user: true },
    });
  } else if (session_id) {
    if (session_id.startsWith("demo_")) {
      const regId = session_id.replace("demo_", "");
      registration = await prisma.registration.findUnique({
        where: { id: regId },
        include: { user: true },
      });
    } else {
      registration = await prisma.registration.findUnique({
        where: { stripeSessionId: session_id },
        include: { user: true },
      });
    }
  }

  // Fallback buscando por usuario logueado
  if (!registration && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (dbUser) {
      registration = await prisma.registration.findFirst({
        where: { userId: dbUser.id, raceId: race.id },
        orderBy: { registeredAt: "desc" },
        include: { user: true },
      });
    }
  }

  const runnerName =
    registration?.user?.name || session?.user?.name || "Atleta Oficial";
  const bibNumber = registration?.bibNumber || "PSL-2026-VIP";
  const distanceName =
    registration?.distanceName || race.distances[0] || "21K Medio Maratón";
  const raceDate = `${race.day} ${race.month} ${race.year}`;

  const storyData = {
    runnerName,
    bibNumber,
    raceTitle: race.title,
    distanceName,
    raceDate,
    raceLocation: race.location,
    category: race.category,
  };

  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-20 pt-28 sm:pt-32">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-32 right-1/4 h-[450px] w-[450px] rounded-full bg-violet-400/20 blur-[130px]" />
        <div className="absolute top-1/2 -left-20 h-[400px] w-[400px] rounded-full bg-fuchsia-400/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Barra Superior de Navegación */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <Link
            href={`/carrera/${race.id}/exito${session_id ? `?session_id=${session_id}` : ""}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mi Boleto
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/carrera/${race.id}/boleto?${registration ? `registration_id=${registration.id}` : session_id ? `session_id=${session_id}` : ""}`}
              className="text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
            >
              Ver Pase Imprimible
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Mi Dashboard
            </Link>
          </div>
        </div>

        {/* Generador Interactivo */}
        <RunnerStoryGenerator data={storyData} />
      </div>
    </div>
  );
}
