"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { enviarCorreoTransferenciaBoleto } from "@/lib/resend";
import { getRaceById } from "@/lib/races";

export type TransferirBoletoInput = {
  registrationId: string;
  recipientEmail: string;
  recipientName: string;
  shirtSize?: string;
};

export async function transferirBoleto(input: TransferirBoletoInput) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Debes iniciar sesión para realizar la cesión." };
    }

    const { registrationId, recipientEmail, recipientName, shirtSize } = input;

    if (!registrationId) {
      return { success: false, error: "ID de inscripción no proporcionado." };
    }

    const cleanEmail = recipientEmail?.trim().toLowerCase();
    const cleanName = recipientName?.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: "Por favor introduce un correo electrónico válido para el receptor." };
    }

    if (!cleanName || cleanName.length < 3) {
      return { success: false, error: "Introduce el nombre y apellidos completos del nuevo corredor." };
    }

    const currentEmail = session.user.email.toLowerCase();
    if (cleanEmail === currentEmail) {
      return { success: false, error: "No puedes transferirte el boleto a ti mismo. Indica el correo de otro corredor." };
    }

    // Buscar inscripción
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { user: true },
    });

    if (!registration) {
      return { success: false, error: "No se encontró el boleto solicitado." };
    }

    if (registration.status !== "CONFIRMED") {
      return { success: false, error: "Solo se pueden transferir boletos con pago confirmado." };
    }

    // Verificar propiedad
    const isOwner =
      registration.userId === session.user.id ||
      registration.user?.email?.toLowerCase() === currentEmail;
    const isAdmin =
      currentEmail === "bjm.dev.soft@gmail.com" ||
      (session.user as any).role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return { success: false, error: "No tienes permiso para ceder este boleto." };
    }

    const originalOwnerName = registration.user?.name || session.user.name || "Corredor Titular";

    // Buscar o registrar al nuevo titular
    let recipientUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!recipientUser) {
      recipientUser = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: cleanName,
          role: "CORREDOR",
        },
      });
    } else if (!recipientUser.name) {
      recipientUser = await prisma.user.update({
        where: { id: recipientUser.id },
        data: { name: cleanName },
      });
    }

    // Reasignar el boleto de forma definitiva e irrevocable
    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        userId: recipientUser.id,
        shirtSize: shirtSize || registration.shirtSize,
      },
    });

    // Enviar notificación por correo con Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const race = registration.raceId ? await getRaceById(registration.raceId) : null;
    const raceTitle = registration.raceTitle || race?.title || "Carrera Písale";
    const raceDate = race ? `${race.day} ${race.month} ${race.year}` : "Fecha oficial por confirmar";
    const raceLocation = race?.location || "Sede del evento";
    const ticketUrl = `${appUrl}/carrera/${registration.raceId || "evento"}/exito?session_id=${registration.stripeSessionId || `demo_${registration.id}`}`;

    try {
      await enviarCorreoTransferenciaBoleto({
        originalOwnerName,
        originalOwnerEmail: currentEmail,
        recipientName: cleanName,
        recipientEmail: cleanEmail,
        raceTitle,
        distanceName: registration.distanceName || "Distancia Oficial",
        bibNumber: registration.bibNumber || `PSL-${registration.id.slice(0, 5)}`,
        shirtSize: shirtSize || registration.shirtSize || "M",
        raceDate,
        raceLocation,
        ticketUrl,
      });
    } catch (mailErr) {
      console.error("Error al despachar correo de transferencia:", mailErr);
    }

    revalidatePath("/dashboard");
    if (registration.raceId) {
      revalidatePath(`/carrera/${registration.raceId}`);
    }

    return {
      success: true,
      message: `¡Cesión completada con éxito! El boleto ha sido transferido a ${cleanName} (${cleanEmail}).`,
    };
  } catch (error: any) {
    console.error("Error en transferirBoleto:", error);
    return { success: false, error: error?.message || "Ocurrió un error inesperado al procesar la transferencia." };
  }
}
