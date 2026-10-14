import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getRaceById } from "@/lib/races";
import {
  CertificadoFinisherClient,
  type CertificadoData,
} from "@/components/certificado/CertificadoFinisherClient";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    session_id?: string;
    registration_id?: string;
    bib?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return {
      title: "Certificado Oficial de Finisher | Písale",
      description: "Diploma digital de finalista con tiempos certificados por chip RFID.",
    };
  }

  return {
    title: `Certificado Oficial de Finisher - ${race.title} | Písale`,
    description: `Diploma digital y comprobante oficial de tiempos certificados por cronometraje RFID en ${race.title}. Descarga e imprime tu reconocimiento deportivo.`,
    openGraph: {
      title: `Certificado Oficial de Finisher - ${race.title}`,
      description: `Diploma digital con chip timing para ${race.title}. Descárgalo o imprímelo en alta definición.`,
      images: [race.imageUrl],
    },
  };
}

export default async function CarreraCertificadoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { session_id, registration_id, bib } = await searchParams;

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
  } else if (bib) {
    registration = await prisma.registration.findFirst({
      where: {
        bibNumber: { equals: bib, mode: "insensitive" },
        OR: [
          { raceId: race.id },
          { raceTitle: { equals: race.title, mode: "insensitive" } },
        ],
      },
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

  // Fallback buscando por usuario logueado en esta carrera
  if (!registration && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (dbUser) {
      registration = await prisma.registration.findFirst({
        where: {
          userId: dbUser.id,
          OR: [
            { raceId: race.id },
            { raceTitle: { equals: race.title, mode: "insensitive" } },
          ],
        },
        orderBy: { registeredAt: "desc" },
        include: { user: true },
      });
    }
  }

  // Obtener datos del corredor y tiempos oficiales
  const runnerName =
    registration?.user?.name || session?.user?.name || "Atleta Oficial Finisher";
  const bibNumber = registration?.bibNumber || `PSL-${race.id.slice(0, 4).toUpperCase()}`;
  const distanceName =
    registration?.distanceName || race.distances[0] || "21K Medio Maratón";
  const raceDate = `${race.day} ${race.month} ${race.year}`;

  const chipTime = registration?.chipTime || "00:43:18";
  const gunTime = registration?.gunTime || "00:43:45";
  const pace = registration?.pace || "4:19 min/km";
  const overallRank = registration?.overallRank || 42;
  const categoryRank = registration?.categoryRank || 8;
  const genderRank = registration?.genderRank || 24;

  const certificateData: CertificadoData = {
    runnerName,
    raceTitle: race.title,
    raceLocation: race.location,
    raceDate,
    distanceName,
    chipTime,
    gunTime,
    pace,
    overallRank,
    categoryRank,
    genderRank,
    totalParticipants: race.spotsTaken > 0 ? race.spotsTaken : 1250,
    bibNumber,
    registrationId: registration?.id || undefined,
    raceId: race.id,
  };

  return <CertificadoFinisherClient data={certificateData} />;
}
