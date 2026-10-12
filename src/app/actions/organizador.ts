"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type RegistroOrganizadorInput = {
  name: string;
  type: "PERSONA" | "EMPRESA" | "CLUB";
  phone: string;
  city: string;
  description?: string;
  rfc?: string;
};

export async function registrarOrganizador(input: RegistroOrganizadorInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Debes iniciar sesión para registrarte como organizador." };
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) userId = dbUser.id;
    }

    if (!userId) {
      return { error: "No se pudo identificar tu cuenta de usuario." };
    }

    if (!input.name || input.name.trim().length < 3) {
      return { error: "El nombre de la organización o promotora debe tener al menos 3 caracteres." };
    }

    if (!input.phone || input.phone.trim().length < 8) {
      return { error: "Proporciona un número de teléfono o WhatsApp de atención válido." };
    }

    const isOwnerOrAdmin =
      session.user.email?.toLowerCase() === "bjm.dev.soft@gmail.com" ||
      (session.user as any).role === "ADMIN";

    const initialStatus = isOwnerOrAdmin ? "VERIFIED" : "PENDING";

    // 1. Si es el dueño, aseguramos rol ADMIN, si es organizador validado se asigna ORGANIZADOR
    if (isOwnerOrAdmin) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "ADMIN" },
      });
    }

    // 2. Crear o actualizar la Organización
    let existingOrg = await prisma.organization.findFirst({
      where: { ownerId: userId },
    });

    if (existingOrg) {
      await prisma.organization.update({
        where: { id: existingOrg.id },
        data: {
          name: input.name.trim(),
          type: input.type,
          phone: input.phone.trim(),
          description: input.description?.trim() || null,
          rfc: input.rfc?.trim() || null,
          status: initialStatus,
        },
      });
    } else {
      await prisma.organization.create({
        data: {
          name: input.name.trim(),
          ownerId: userId,
          type: input.type,
          phone: input.phone.trim(),
          description: input.description?.trim() || null,
          rfc: input.rfc?.trim() || null,
          status: initialStatus,
        },
      });
    }

    revalidatePath("/organizador/crear");
    revalidatePath("/organizador/dashboard");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Error al registrar organizador:", error);
    return {
      error: error?.message || "Ocurrió un error al registrar el perfil de organizador.",
    };
  }
}
