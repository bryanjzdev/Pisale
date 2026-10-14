import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getRaceById } from "@/lib/races";
import { VoluntariadoClient } from "@/components/voluntarios/VoluntariadoClient";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return {
      title: "Convocatoria de Voluntariado & Staff | Písale",
      description: "Postúlate como voluntario oficial y recibe tu acreditación digital con código QR.",
    };
  }

  return {
    title: `Convocatoria de Voluntarios & Staff Oficial - ${race.title} | Písale`,
    description: `Sé parte del equipo operativo en ${race.title} (${race.location}). Convocatoria abierta para entrega de kits, hidratación en ruta, guardarropa y medallas. Incluye playera Dry-Fit, kit de alimentación y gafete digital oficial.`,
    openGraph: {
      title: `Voluntariado & Staff Oficial - ${race.title}`,
      description: `Postúlate como voluntario oficial y recibe tu acreditación digital con código QR de validación.`,
      images: [race.imageUrl],
    },
  };
}

export default async function CarreraVoluntariosPage({ params }: Props) {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    notFound();
  }

  const session = await auth();

  return (
    <VoluntariadoClient
      race={race}
      currentUser={
        session?.user
          ? {
              name: session.user.name || undefined,
              email: session.user.email || undefined,
            }
          : undefined
      }
    />
  );
}
