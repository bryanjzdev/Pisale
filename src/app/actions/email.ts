"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { enviarCorreoConfirmacionBoleto } from "@/lib/resend";
import { getRaceById } from "@/lib/races";

export async function enviarBoletoPorCorreo(registrationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Debes iniciar sesión." };
    }

    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { user: true },
    });

    if (!reg) {
      return { success: false, error: "Inscripción no encontrada." };
    }

    const recipientEmail = reg.user?.email || session.user.email;
    const recipientName = reg.user?.name || session.user.name || "Corredor Oficial";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const race = reg.raceId ? await getRaceById(reg.raceId) : null;
    const raceTitle = reg.raceTitle || race?.title || "Carrera Písale";
    const raceDate = race ? `${race.day} ${race.month} ${race.year}` : "Fecha por confirmar";
    const raceLocation = race?.location || "Sede oficial del evento";
    const ticketUrl = `${appUrl}/carrera/${reg.raceId || "evento"}/exito?session_id=${reg.stripeSessionId || `demo_${reg.id}`}`;
    const pdfUrl = `${appUrl}/carrera/${reg.raceId || "evento"}/boleto?registration_id=${reg.id}`;

    const res = await enviarCorreoConfirmacionBoleto({
      runnerEmail: recipientEmail,
      runnerName: recipientName,
      raceTitle,
      distanceName: reg.distanceName || "General",
      bibNumber: reg.bibNumber || `PSL-${reg.id.slice(0, 5)}`,
      shirtSize: reg.shirtSize || "M",
      raceDate,
      raceLocation,
      ticketUrl,
      pdfUrl,
    });

    return res;
  } catch (err: any) {
    console.error("Error al enviar boleto por correo:", err);
    return { success: false, error: err?.message || "Error al procesar envío." };
  }
}

/**
 * Acción rápida para enviar un correo de prueba directo al usuario conectado
 */
export async function enviarCorreoPrueba() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Inicia sesión primero para recibir el correo." };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await enviarCorreoConfirmacionBoleto({
      runnerEmail: session.user.email,
      runnerName: session.user.name || "Atleta Písale",
      raceTitle: "Maratón de Prueba 2026",
      distanceName: "21K Medio Maratón",
      bibNumber: "PSL-DEMO-2026",
      shirtSize: "M",
      raceDate: "29 Nov 2026",
      raceLocation: "Ciudad de México / Teotihuacán",
      ticketUrl: `${appUrl}/dashboard`,
    });

    return res;
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al enviar correo de prueba." };
  }
}
