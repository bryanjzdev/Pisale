import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getRaceById } from "@/lib/races";
import { CalculadoraEstrategiaClient } from "@/components/estrategia/CalculadoraEstrategiaClient";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    session_id?: string;
    registration_id?: string;
    distancia?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return {
      title: "Calculadora de Ritmos y Estrategia | Písale",
      description: "Planifica tu estrategia de carrera y genera tu pulsera de ritmos para imprimir.",
    };
  }

  return {
    title: `Estrategia de Carrera y Pulsera de Ritmos - ${race.title} | Písale`,
    description: `Calcula tus parciales km a km, splits de ritmo, puntos de hidratación y genera tu brazalete de muñeca para imprimir en ${race.title}.`,
    openGraph: {
      title: `Estrategia de Carrera y Pulsera de Ritmos - ${race.title}`,
      description: `Planifica tu ritmo objetivo y descarga tu pulsera de muñeca con estrategia de splits negativos.`,
      images: [race.imageUrl],
    },
  };
}

export default async function CarreraEstrategiaPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { session_id, registration_id, distancia } = await searchParams;

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

  const runnerName = registration?.user?.name || session?.user?.name || "Atleta Písale";
  const bibNumber = registration?.bibNumber || "PSL-ESTRATEGIA";
  const initialDistance = distancia || registration?.distanceName || race.distances[0] || "10K";

  return (
    <CalculadoraEstrategiaClient
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
        elevationProfile: race.elevationProfile,
        routeDetails: race.routeDetails,
      }}
      runner={{
        name: runnerName,
        bibNumber,
        distance: initialDistance,
        registrationId: registration?.id,
      }}
    />
  );
}
