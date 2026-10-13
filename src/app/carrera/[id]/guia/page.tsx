import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getRaceById } from "@/lib/races";
import { GuiaAtletaClient } from "@/components/guia/GuiaAtletaClient";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    session_id?: string;
    registration_id?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return {
      title: "Guía Oficial del Atleta | Písale",
      description: "Logística oficial y manual de operaciones para corredores.",
    };
  }

  return {
    title: `Guía Oficial del Atleta - ${race.title} | Písale`,
    description: `Manual de logística para corredores en ${race.title}: bloques y corrales de salida, guardarropa, hidratación, accesos, transporte y reglamento de chip RFID.`,
    openGraph: {
      title: `Guía Oficial del Atleta - ${race.title}`,
      description: `Consulta la logística clave antes del día de la carrera: bloques, guardarropa, abastecimiento y vialidades.`,
      images: [race.imageUrl],
    },
  };
}

export default async function CarreraGuiaPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { session_id, registration_id } = await searchParams;

  const race = await getRaceById(id);
  if (!race) {
    notFound();
  }

  const session = await auth();

  // Buscar inscripción si existe
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

  // Fallback buscando por usuario autenticado
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
  const runnerEmail =
    registration?.user?.email || session?.user?.email || undefined;
  const bibNumber = registration?.bibNumber || "PSL-2026-VIP";
  const distance =
    registration?.distanceName || race.distances[0] || "10K";
  const registrationId = registration?.id || undefined;

  return (
    <GuiaAtletaClient
      race={{
        id: race.id,
        title: race.title,
        day: race.day,
        month: race.month,
        year: race.year,
        location: race.location,
        category: race.category,
        startTime: race.startTime,
        distances: race.distances,
        startPoint: race.startPoint,
        endPoint: race.endPoint,
        expo: race.expo,
        routeDetails: race.routeDetails,
      }}
      runner={{
        name: runnerName,
        email: runnerEmail,
        bibNumber,
        distance,
        registrationId,
      }}
    />
  );
}
