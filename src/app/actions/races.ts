"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type DistanceInput = {
  name: string;
  price: number;
  maxParticipants: number;
};

export type CreateRaceInput = {
  title: string;
  category: "RUTA" | "TRAIL" | "NOCTURNA";
  date: string;
  location: string;
  imageUrl?: string;
  description?: string;
  startTime?: string;
  deadline?: string;
  organizationName?: string;
  startPoint?: string;
  endPoint?: string;
  surface?: string;
  distances: DistanceInput[];
};

export async function createRace(input: CreateRaceInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Debes iniciar sesión para publicar una carrera." };
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) userId = dbUser.id;
    }

    if (!userId) {
      return { error: "No se pudo verificar tu cuenta de usuario." };
    }

    if (!input.title || input.title.trim().length < 4) {
      return { error: "El título de la carrera debe tener al menos 4 caracteres." };
    }

    if (!input.location || input.location.trim().length < 3) {
      return { error: "La ubicación o ciudad es obligatoria." };
    }

    if (!input.date) {
      return { error: "La fecha de la carrera es obligatoria." };
    }

    if (!input.distances || input.distances.length === 0) {
      return { error: "Debes configurar al menos una distancia para la carrera." };
    }

    // 1. Obtener o crear una organización para el usuario
    let organization = await prisma.organization.findFirst({
      where: { ownerId: userId },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: input.organizationName || session.user.name || "Club Organizador",
          ownerId: userId,
          status: "VERIFIED",
        },
      });
    }

    // 2. Imagen por defecto según categoría si no se proporciona
    const defaultImages = {
      RUTA: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
      TRAIL: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1200",
      NOCTURNA: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=1200",
    };

    const finalImage = input.imageUrl && input.imageUrl.trim().length > 10
      ? input.imageUrl
      : defaultImages[input.category] || defaultImages.RUTA;

    // 3. Crear carrera en base de datos
    const raceDate = new Date(input.date);

    const race = await prisma.race.create({
      data: {
        title: input.title.trim(),
        category: input.category,
        date: raceDate,
        location: input.location.trim(),
        imageUrl: finalImage,
        status: "PUBLISHED",
        organizationId: organization.id,
        startPoint: input.startPoint?.trim() || null,
        endPoint: input.endPoint?.trim() || null,
        surface: input.surface?.trim() || null,
        distances: {
          create: input.distances.map((d) => ({
            name: d.name,
            distanceMeters: parseInt(d.name) ? parseInt(d.name) * 1000 : 10000,
            price: Number(d.price) || 500,
            maxParticipants: Number(d.maxParticipants) || 1000,
            currentParticipants: 0,
          })),
        },
      },
      include: {
        distances: true,
      },
    });

    // Revalidar páginas principales
    revalidatePath("/");
    revalidatePath("/carreras");
    revalidatePath("/dashboard");

    return { success: true, raceId: race.id };
  } catch (error: any) {
    console.error("Error creating race:", error);
    return {
      error: error?.message || "Ocurrió un error al guardar la carrera.",
    };
  }
}
