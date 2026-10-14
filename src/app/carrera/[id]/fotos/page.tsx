import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRaceById } from "@/lib/races";
import {
  GaleriaFotosClient,
  type RacePhoto,
} from "@/components/fotos/GaleriaFotosClient";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    bib?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return {
      title: "Galería Oficial de Fotos | Písale",
      description: "Fotos de carrera en alta resolución con búsqueda por número de dorsal.",
    };
  }

  return {
    title: `Fotos Oficiales de Carrera - ${race.title} | Písale`,
    description: `Galería fotográfica oficial de ${race.title}. Busca y descarga tus fotos en ruta, meta y podio filtrando por número de dorsal.`,
    openGraph: {
      title: `Fotos Oficiales - ${race.title}`,
      description: `Busca tus fotos de carrera en ${race.title} por dorsal.`,
      images: [race.imageUrl],
    },
  };
}

export default async function CarreraFotosPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { bib } = await searchParams;

  const race = await getRaceById(id);
  if (!race) {
    notFound();
  }

  // Colección de fotos oficiales de alta calidad para el evento
  const photos: RacePhoto[] = [
    {
      id: "f1",
      url: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1200&auto=format&fit=crop",
      zone: "Salida",
      bibs: ["1042", "2085", "3190"],
      runnerNames: ["Carlos Mendoza", "Valeria Domínguez"],
      photographer: "Equipo FotoRun Pro",
      timeTaken: "07:31 AM",
      likes: 42,
    },
    {
      id: "f2",
      url: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?q=80&w=1200&auto=format&fit=crop",
      zone: "Meta",
      bibs: ["1042"],
      runnerNames: ["Carlos Mendoza"],
      photographer: "Lente Deportivo MX",
      timeTaken: "08:24 AM",
      likes: 89,
    },
    {
      id: "f3",
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
      zone: "Ruta",
      bibs: ["2085"],
      runnerNames: ["Valeria Domínguez"],
      photographer: "Track & Field Media",
      timeTaken: "07:55 AM",
      likes: 67,
    },
    {
      id: "f4",
      url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1200&auto=format&fit=crop",
      zone: "Medallas",
      bibs: ["1042", "4012"],
      runnerNames: ["Carlos Mendoza"],
      photographer: "Staff Oficial Písale",
      timeTaken: "08:30 AM",
      likes: 54,
    },
    {
      id: "f5",
      url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1200&auto=format&fit=crop",
      zone: "Ruta",
      bibs: ["3190", "1105"],
      runnerNames: ["Rodrigo Alarcón"],
      photographer: "Equipo FotoRun Pro",
      timeTaken: "07:42 AM",
      likes: 31,
    },
    {
      id: "f6",
      url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop",
      zone: "Meta",
      bibs: ["2085"],
      runnerNames: ["Valeria Domínguez"],
      photographer: "Lente Deportivo MX",
      timeTaken: "08:18 AM",
      likes: 95,
    },
    {
      id: "f7",
      url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop",
      zone: "Salida",
      bibs: ["1105", "4012"],
      photographer: "Track & Field Media",
      timeTaken: "07:30 AM",
      likes: 28,
    },
    {
      id: "f8",
      url: "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?q=80&w=1200&auto=format&fit=crop",
      zone: "Podio",
      bibs: ["1042", "2085"],
      photographer: "Comité de Premiación",
      timeTaken: "09:15 AM",
      likes: 120,
    },
  ];

  return (
    <GaleriaFotosClient
      race={race}
      initialBib={bib}
      photos={photos}
    />
  );
}
