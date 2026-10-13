import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getRaceById } from "@/lib/races";
import { ResponsivaDocumentoClient } from "@/components/responsiva/ResponsivaDocumentoClient";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const race = await getRaceById(id);
  return {
    title: race
      ? `Carta Responsiva y Deslinde Médico - ${race.title} | Písale`
      : "Carta Responsiva Oficial | Písale",
    description:
      "Formato oficial de deslinde de responsabilidad médica y aceptación de reglamento para entrega de kits de corredor.",
  };
}

export default async function ResponsivaPage({
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
    registration?.user?.name || session?.user?.name || "Corredor Oficial";
  const runnerEmail =
    registration?.user?.email || session?.user?.email || "atleta@pisale.mx";
  const bibNumber = registration?.bibNumber || "PSL-2026-VIP";
  const distance =
    registration?.distanceName || race.distances[0] || "21K Medio Maratón";
  const shirtSize = registration?.shirtSize || "M";
  const registrationId = registration?.id || "REG-PISALE-OFFICIAL";
  const registeredDate = registration?.registeredAt
    ? new Date(registration.registeredAt).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : `${race.day} ${race.month} ${race.year}`;

  return (
    <ResponsivaDocumentoClient
      race={{
        id: race.id,
        title: race.title,
        day: race.day,
        month: race.month,
        year: race.year,
        location: race.location,
        category: race.category,
        startTime: race.startTime,
      }}
      runner={{
        name: runnerName,
        email: runnerEmail,
        bibNumber,
        distance,
        registrationId,
        registeredDate,
        shirtSize,
      }}
    />
  );
}
