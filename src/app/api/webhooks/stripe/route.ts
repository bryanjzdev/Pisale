import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && !webhookSecret.includes("placeholder") && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else if (process.env.NODE_ENV !== "production") {
      // Solo en desarrollo local permitimos simular webhook sin secret estricto
      event = JSON.parse(body) as Stripe.Event;
    } else {
      console.error("⚠️ Webhook signature missing in production environment");
      return NextResponse.json(
        { error: "Webhook Error: Firma de webhook obligatoria en producción." },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Manejar evento de pago completado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const registrationId = session.metadata?.registrationId;

    if (registrationId) {
      const bibNumber = `PSL-${Math.floor(1000 + Math.random() * 9000)}`;

      await prisma.registration.update({
        where: { id: registrationId },
        data: {
          status: "CONFIRMED",
          bibNumber: bibNumber,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : undefined,
        },
      });
      console.log(`✅ Registro ${registrationId} confirmado con folio ${bibNumber}`);
    }
  }

  return NextResponse.json({ received: true });
}
