"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CheckInResult = {
  success: boolean;
  message: string;
  alreadyDelivered?: boolean;
  registration?: {
    id: string;
    bibNumber: string | null;
    runnerName: string | null;
    runnerEmail: string | null;
    raceTitle: string | null;
    distanceName: string | null;
    shirtSize: string | null;
    amountPaid: number;
    status: string;
    kitDelivered: boolean;
    kitDeliveredAt: string | null;
  };
};

/**
 * Valida un código QR o número de folio (ej. PSL-1234)
 * Verifica que pertenezca a una carrera del organizador o que el usuario sea Admin
 */
export async function verificarYEntregarKit(folioOrCode: string): Promise<CheckInResult> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Debes iniciar sesión para realizar el check-in." };
    }

    const cleanCode = folioOrCode.trim();
    if (!cleanCode) {
      return { success: false, message: "El código o folio no es válido." };
    }

    // 1. Obtener usuario de sesión y organizaciones
    let userId = session.user.id;
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organizations: true },
    });

    if (dbUser) userId = dbUser.id;

    const isOwnerOrAdmin =
      session.user.email.toLowerCase() === "bjm.dev.soft@gmail.com" ||
      (session.user as any).role === "ADMIN" ||
      dbUser?.role === "ADMIN";

    const userOrgIds = dbUser?.organizations.map((o) => o.id) || [];

    // 2. Buscar la inscripción por bibNumber o por id directo
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { bibNumber: { equals: cleanCode, mode: "insensitive" } },
          { id: cleanCode },
        ],
      },
      include: {
        user: true,
      },
    });

    if (!registration) {
      return {
        success: false,
        message: `No se encontró ningún boleto con el folio o código: ${cleanCode}`,
      };
    }

    // 3. Verificar que esté pagada
    if (registration.status !== "CONFIRMED") {
      return {
        success: false,
        message: `El boleto ${cleanCode} está en estatus ${registration.status} (No pagado). No se puede entregar kit.`,
      };
    }

    // 4. Si la carrera pertenece a una organización, validar que el usuario tenga permiso
    if (registration.raceId && !isOwnerOrAdmin) {
      const race = await prisma.race.findUnique({
        where: { id: registration.raceId },
      });
      if (race && !userOrgIds.includes(race.organizationId)) {
        return {
          success: false,
          message: "Este boleto pertenece a un evento de otro organizador.",
        };
      }
    }

    // 5. Verificar si ya fue entregado previamente (detección de fraude/doble reclamo)
    const wasAlreadyDelivered = registration.kitDelivered;
    const deliveredTime = registration.kitDeliveredAt
      ? new Date(registration.kitDeliveredAt).toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

    if (wasAlreadyDelivered) {
      return {
        success: false,
        alreadyDelivered: true,
        message: `⚠️ ATENCIÓN: El kit para el folio ${registration.bibNumber} ya fue entregado anteriormente (${deliveredTime || "Registro previo"}).`,
        registration: {
          id: registration.id,
          bibNumber: registration.bibNumber,
          runnerName: registration.user?.name || "Sin nombre",
          runnerEmail: registration.user?.email || null,
          raceTitle: registration.raceTitle,
          distanceName: registration.distanceName,
          shirtSize: registration.shirtSize,
          amountPaid: registration.amountPaid,
          status: registration.status,
          kitDelivered: true,
          kitDeliveredAt: registration.kitDeliveredAt?.toISOString() || null,
        },
      };
    }

    // 6. Marcar kit como entregado con timestamp
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        kitDelivered: true,
        kitDeliveredAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/organizador/dashboard");
    revalidatePath("/organizador/checkin");
    revalidatePath("/admin");

    return {
      success: true,
      message: `¡Kit entregado con éxito a ${updated.user.name || "Corredor"}!`,
      registration: {
        id: updated.id,
        bibNumber: updated.bibNumber,
        runnerName: updated.user?.name || "Sin nombre",
        runnerEmail: updated.user?.email || null,
        raceTitle: updated.raceTitle,
        distanceName: updated.distanceName,
        shirtSize: updated.shirtSize,
        amountPaid: updated.amountPaid,
        status: updated.status,
        kitDelivered: true,
        kitDeliveredAt: updated.kitDeliveredAt?.toISOString() || null,
      },
    };
  } catch (err: any) {
    console.error("Error en check-in:", err);
    return {
      success: false,
      message: err?.message || "Ocurrió un error inesperado al validar el boleto.",
    };
  }
}

/**
 * Consulta el estado de un folio sin marcarlo aún como entregado (Modo consulta)
 */
export async function consultarBoleto(folioOrCode: string): Promise<CheckInResult> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "No autenticado." };
    }

    const cleanCode = folioOrCode.trim();
    if (!cleanCode) {
      return { success: false, message: "Folio vacío." };
    }

    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { bibNumber: { equals: cleanCode, mode: "insensitive" } },
          { id: cleanCode },
        ],
      },
      include: { user: true },
    });

    if (!registration) {
      return { success: false, message: `Boleto ${cleanCode} no encontrado.` };
    }

    return {
      success: true,
      message: "Boleto localizado",
      registration: {
        id: registration.id,
        bibNumber: registration.bibNumber,
        runnerName: registration.user?.name || "Sin nombre",
        runnerEmail: registration.user?.email || null,
        raceTitle: registration.raceTitle,
        distanceName: registration.distanceName,
        shirtSize: registration.shirtSize,
        amountPaid: registration.amountPaid,
        status: registration.status,
        kitDelivered: registration.kitDelivered,
        kitDeliveredAt: registration.kitDeliveredAt?.toISOString() || null,
      },
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Error al consultar boleto." };
  }
}
