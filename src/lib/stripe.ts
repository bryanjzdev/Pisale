import Stripe from "stripe";

// Si la variable no está presente durante el build estático en Vercel, usamos un placeholder para evitar que falle la compilación
const apiKey = process.env.STRIPE_SECRET_KEY || "sk_test_build_placeholder_key";

export const stripe = new Stripe(apiKey, {
  apiVersion: "2025-02-24.acacia" as any,
  appInfo: {
    name: "Pisale Athletic Platform",
    version: "1.0.0",
  },
});
