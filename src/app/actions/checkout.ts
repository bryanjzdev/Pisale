"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getRaceById } from "@/lib/races";

export type CheckoutInput = {
  raceId: string;
  distanceName: string;
  price: number;
  shirtSize: "S" | "M" | "L" | "XL";
};

export async function createCheckoutSession(input: CheckoutInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Debes iniciar sesión para inscribirte a esta carrera." };
    }

    // Resolver ID de usuario en base de datos
    let userId = session.user.id;
    if (!userId && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    if (!userId) {
      return { error: "Debes iniciar sesión para inscribirte a esta carrera." };
    }

    const race = await getRaceById(input.raceId);
    if (!race) {
      return { error: "La carrera especificada no fue encontrada." };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const isRealStripeKey =
      process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SECRET_KEY.startsWith("sk_") &&
      !process.env.STRIPE_SECRET_KEY.includes("placeholder");

    // 1. Reutilizar registro previo pendiente o crear uno nuevo para evitar registros duplicados
    let registration = await prisma.registration.findFirst({
      where: {
        userId: userId,
        raceId: race.id,
        status: "PENDING",
      },
    });

    if (registration) {
      registration = await prisma.registration.update({
        where: { id: registration.id },
        data: {
          raceTitle: race.title,
          distanceName: input.distanceName,
          amountPaid: input.price,
          shirtSize: input.shirtSize,
        },
      });
    } else {
      registration = await prisma.registration.create({
        data: {
          userId: userId,
          raceId: race.id,
          raceTitle: race.title,
          distanceName: input.distanceName,
          amountPaid: input.price,
          shirtSize: input.shirtSize,
          status: isRealStripeKey ? "PENDING" : "CONFIRMED",
          bibNumber: isRealStripeKey
            ? null
            : `PSL-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });
    }

    // 2. Si hay llaves reales de Stripe configuradas, crear sesión oficial
    if (isRealStripeKey) {
      // Validar si race.imageUrl es una URL HTTP(S) pública válida, ya que Stripe rechaza cadenas base64 ("Not a valid URL")
      const isValidHttpUrl = (str?: string | null) => {
        if (!str) return false;
        try {
          const url = new URL(str);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      };

      const stripeImages = isValidHttpUrl(race.imageUrl) ? [race.imageUrl!] : [];

      const stripeSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "mxn",
              product_data: {
                name: `${race.title} (${input.distanceName})`,
                description: `Talla: ${input.shirtSize} | Corredor: ${session.user.name || session.user.email}`,
                images: stripeImages,
              },
              unit_amount: Math.round(input.price * 100), // Stripe maneja centavos
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/carrera/${race.id}/exito?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/carrera/${race.id}?canceled=true`,
        customer_email: session.user.email || undefined,
        metadata: {
          registrationId: registration.id,
          userId: userId,
          raceId: race.id,
          distanceName: input.distanceName,
          shirtSize: input.shirtSize,
        },
      });

      // Guardar el id de sesión de Stripe
      await prisma.registration.update({
        where: { id: registration.id },
        data: { stripeSessionId: stripeSession.id },
      });

      return { url: stripeSession.url };
    }

    // 3. Modo Simulación / Demo (sin llaves reales de Stripe configuradas aún)
    return {
      url: `${appUrl}/carrera/${race.id}/exito?session_id=demo_${registration.id}`,
    };
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return {
      error:
        error?.message ||
        "Ocurrió un error al procesar el pago. Por favor intenta de nuevo.",
    };
  }
}

/**
 * Permite al usuario descartar un intento de compra incompleto o cancelado
 */
export async function descartarInscripcionPendiente(registrationId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autorizado" };
    }

    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!reg) {
      return { success: true };
    }

    // Solo permitir eliminar si sigue PENDING
    if (reg.status === "PENDING") {
      await prisma.registration.delete({
        where: { id: registrationId },
      });
      return { success: true };
    }

    return { success: false, error: "No se puede descartar una inscripción confirmada." };
  } catch (error: any) {
    console.error("Error descartando inscripcion pendiente:", error);
    return { success: false, error: error?.message || "Error al descartar." };
  }
}
