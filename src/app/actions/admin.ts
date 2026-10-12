"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("No autenticado");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const isOwnerEmail = session.user.email.toLowerCase() === "bjm.dev.soft@gmail.com";
  const isAdmin = dbUser?.role === "ADMIN" || isOwnerEmail;

  if (!isAdmin) {
    throw new Error("No tienes permisos de Administrador.");
  }

  // Si es el correo del dueño y aún no es ADMIN en BD, promoverlo automáticamente
  if (isOwnerEmail && dbUser && dbUser.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: "ADMIN" },
    });
  }

  return { session, dbUser };
}

export async function aprobarOrganizacion(orgId: string) {
  try {
    await verifyAdmin();

    const org = await prisma.organization.update({
      where: { id: orgId },
      data: { status: "VERIFIED" },
    });

    // Asegurar que el dueño tenga el rol ORGANIZADOR
    await prisma.user.update({
      where: { id: org.ownerId },
      data: { role: "ORGANIZADOR" },
    });

    revalidatePath("/admin");
    revalidatePath("/organizador/dashboard");
    revalidatePath("/organizador/crear");

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al aprobar la organización." };
  }
}

export async function rechazarOrganizacion(orgId: string) {
  try {
    await verifyAdmin();

    await prisma.organization.update({
      where: { id: orgId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al rechazar la organización." };
  }
}

export async function cambiarEstadoCarrera(raceId: string, status: "PUBLISHED" | "DRAFT" | "COMPLETED") {
  try {
    await verifyAdmin();

    await prisma.race.update({
      where: { id: raceId },
      data: { status },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/carreras");
    revalidatePath(`/carrera/${raceId}`);

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al actualizar la carrera." };
  }
}

export async function cambiarRolUsuario(userId: string, role: "CORREDOR" | "ORGANIZADOR" | "ADMIN") {
  try {
    await verifyAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al cambiar el rol del usuario." };
  }
}
