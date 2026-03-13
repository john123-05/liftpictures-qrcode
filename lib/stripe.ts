import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe ist nicht konfiguriert. Bitte setze STRIPE_SECRET_KEY.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-08-27.basil",
      appInfo: {
        name: "liftpictures-qrcode-screen",
      },
    });
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Stripe Webhook ist nicht konfiguriert. Bitte setze STRIPE_WEBHOOK_SECRET.");
  }

  return webhookSecret;
}
