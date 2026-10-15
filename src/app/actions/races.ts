"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sanitizeKitItems, type KitItem } from "@/lib/kits";

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
  kitItems?: KitItem[];
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

    // 1. Exigir organización verificada (o rol Admin) para publicar
    const dbUserForRole = await prisma.user.findUnique({ where: { id: userId } });
    const isAdminUser =
      dbUserForRole?.role === "ADMIN" ||
      session.user.email?.toLowerCase() === "bjm.dev.soft@gmail.com";

    let organization = await prisma.organization.findFirst({
      where: { ownerId: userId },
    });

    if (!organization) {
      if (!isAdminUser) {
        return { error: "Primero registra tu organización para poder publicar carreras." };
      }
      organization = await prisma.organization.create({
        data: {
          name: input.organizationName || session.user.name || "Club Organizador",
          ownerId: userId,
          status: "VERIFIED",
        },
      });
    }

    if (organization.status !== "VERIFIED" && !isAdminUser) {
      return { error: "Tu organización aún está en revisión. Podrás publicar en cuanto sea aprobada." };
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
        kitItems: sanitizeKitItems(input.kitItems),
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
    revalidatePath("/organizador/dashboard");
    revalidatePath("/admin");

    return { success: true, raceId: race.id };
  } catch (error: any) {
    console.error("Error creating race:", error);
    return {
      error: error?.message || "Ocurrió un error al guardar la carrera.",
    };
  }
}

export type UpdateRaceInput = {
  title: string;
  category: "RUTA" | "TRAIL" | "NOCTURNA";
  date: string;
  location: string;
  imageUrl?: string;
  startPoint?: string;
  endPoint?: string;
  surface?: string;
  distances: DistanceInput[];
  kitItems?: KitItem[];
};

export async function actualizarCarrera(raceId: string, input: UpdateRaceInput) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Debes iniciar sesión para editar un evento." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const isOwnerEmail = session.user.email.toLowerCase() === "bjm.dev.soft@gmail.com";
    const isAdmin = dbUser?.role === "ADMIN" || isOwnerEmail;

    // Buscar carrera existente
    const existingRace = await prisma.race.findUnique({
      where: { id: raceId },
      include: { organization: true },
    });

    if (!existingRace) {
      return { error: "Carrera no encontrada." };
    }

    // Verificar si es dueño de la organización o SuperAdmin
    const isOrgOwner = dbUser && existingRace.organization.ownerId === dbUser.id;
    if (!isAdmin && !isOrgOwner) {
      return { error: "No tienes permisos para modificar este evento." };
    }

    if (!input.title || input.title.trim().length < 4) {
      return { error: "El título de la carrera debe tener al menos 4 caracteres." };
    }

    if (!input.location || input.location.trim().length < 3) {
      return { error: "La ubicación es obligatoria." };
    }

    const raceDate = new Date(input.date);

    // Actualizar carrera
    await prisma.race.update({
      where: { id: raceId },
      data: {
        title: input.title.trim(),
        category: input.category,
        date: raceDate,
        location: input.location.trim(),
        imageUrl: input.imageUrl?.trim() || existingRace.imageUrl,
        startPoint: input.startPoint?.trim() || null,
        endPoint: input.endPoint?.trim() || null,
        surface: input.surface?.trim() || null,
        ...(input.kitItems !== undefined ? { kitItems: sanitizeKitItems(input.kitItems) } : {}),
      },
    });

    // Sincronizar distancias sin duplicar las que ya tienen inscritos
    if (input.distances && input.distances.length > 0) {
      const existing = await prisma.raceDistance.findMany({ where: { raceId } });
      const normalize = (s: string) => s.trim().toLowerCase();
      const incomingNames = new Set(input.distances.map((d) => normalize(d.name)));

      // Eliminar solo las distancias que ya no vienen y que no tienen corredores
      const removable = existing.filter(
        (e) => !incomingNames.has(normalize(e.name)) && e.currentParticipants === 0
      );
      if (removable.length > 0) {
        await prisma.raceDistance.deleteMany({ where: { id: { in: removable.map((r) => r.id) } } });
      }

      for (const d of input.distances) {
        const match = existing.find((e) => normalize(e.name) === normalize(d.name));
        const price = Number(d.price) || 500;
        const requestedMax = Number(d.maxParticipants) || 1000;

        if (match) {
          await prisma.raceDistance.update({
            where: { id: match.id },
            data: {
              price,
              // Nunca dejar el cupo por debajo de los ya inscritos
              maxParticipants: Math.max(requestedMax, match.currentParticipants),
            },
          });
        } else {
          await prisma.raceDistance.create({
            data: {
              raceId,
              name: d.name.trim(),
              distanceMeters: parseInt(d.name) ? parseInt(d.name) * 1000 : 10000,
              price,
              maxParticipants: requestedMax,
              currentParticipants: 0,
            },
          });
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/carreras");
    revalidatePath(`/carrera/${raceId}`);
    revalidatePath("/organizador/dashboard");
    revalidatePath("/admin");

    return { success: true, raceId };
  } catch (error: any) {
    console.error("Error updating race:", error);
    return {
      error: error?.message || "Ocurrió un error al actualizar la información de la carrera.",
    };
  }
}

