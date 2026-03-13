import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { markClaimOrderPaid, markClaimOrderStatus } from "@/lib/claim-orders";
import { getStripeServerClient, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

function readClaimOrderId(session: Stripe.Checkout.Session) {
  const value = session.metadata?.claim_order_id;
  return typeof value === "string" && value ? value : null;
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeServerClient();
    const webhookSecret = getStripeWebhookSecret();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "stripe-signature fehlt." }, { status: 400 });
    }

    const body = await request.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = readClaimOrderId(session);

      if (orderId && session.payment_status === "paid") {
        await markClaimOrderPaid({
          orderId,
          sessionId: session.id,
          paymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          amountCents: session.amount_total ?? null,
          currency: session.currency ?? null,
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await markClaimOrderStatus(session.id, "expired");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook konnte nicht verarbeitet werden.",
      },
      { status: 400 },
    );
  }
}
