import { NextResponse } from "next/server";
import {
  formatClaimOrderApiResponse,
  getClaimOrderByAccess,
  getClaimOrderBySessionId,
  markClaimOrderPaid,
} from "@/lib/claim-orders";
import { getStripeServerClient } from "@/lib/stripe";

export const runtime = "nodejs";

function getSiteUrl(request: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
}

async function syncPaidStripeSession(sessionId: string) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!stripeSecretKey) {
    return;
  }

  const stripe = getStripeServerClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.claim_order_id;

  if (
    typeof orderId === "string" &&
    orderId &&
    session.payment_status === "paid"
  ) {
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id")?.trim();
    const orderId = url.searchParams.get("order")?.trim();
    const token = url.searchParams.get("token")?.trim();

    if (!sessionId && (!orderId || !token)) {
      return NextResponse.json({ error: "session_id oder order/token fehlt." }, { status: 400 });
    }

    let order = sessionId
      ? await getClaimOrderBySessionId(sessionId)
      : await getClaimOrderByAccess(orderId!, token!);

    if (sessionId && order && order.status !== "paid") {
      await syncPaidStripeSession(sessionId);
      order = await getClaimOrderBySessionId(sessionId);
    }

    if (!order) {
      return NextResponse.json({ error: "Keine Claim-Order gefunden." }, { status: 404 });
    }

    return NextResponse.json(formatClaimOrderApiResponse(order, getSiteUrl(request)));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Claim-Order konnte nicht geladen werden.",
      },
      { status: 500 },
    );
  }
}
