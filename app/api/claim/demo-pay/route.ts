import { NextResponse } from "next/server";
import { getClaimOrderByAccess, markClaimOrderPaid } from "@/lib/claim-orders";
import { isMockCheckoutEnabled } from "@/lib/checkout-mode";

export const runtime = "nodejs";

type DemoPayPayload = {
  orderId: string;
  token: string;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

function getSiteUrl(request: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
}

function readPayload(payload: unknown): DemoPayPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const source = payload as Record<string, unknown>;

  if (
    typeof source.orderId !== "string" ||
    typeof source.token !== "string" ||
    typeof source.cardholderName !== "string" ||
    typeof source.cardNumber !== "string" ||
    typeof source.expiry !== "string" ||
    typeof source.cvc !== "string"
  ) {
    return null;
  }

  return {
    orderId: source.orderId,
    token: source.token,
    cardholderName: source.cardholderName,
    cardNumber: source.cardNumber,
    expiry: source.expiry,
    cvc: source.cvc,
  };
}

export async function POST(request: Request) {
  try {
    if (!isMockCheckoutEnabled()) {
      return NextResponse.json(
        { error: "Demo-Checkout ist nicht aktiviert." },
        { status: 403 },
      );
    }

    const payload = readPayload(await request.json());

    if (!payload) {
      return NextResponse.json({ error: "Ungueltige Anfrage." }, { status: 400 });
    }

    if (
      !payload.cardholderName.trim() ||
      !payload.cardNumber.trim() ||
      !payload.expiry.trim() ||
      !payload.cvc.trim()
    ) {
      return NextResponse.json(
        { error: "Bitte fuelle alle Zahlungsfelder aus." },
        { status: 400 },
      );
    }

    const order = await getClaimOrderByAccess(payload.orderId.trim(), payload.token.trim());

    if (!order) {
      return NextResponse.json({ error: "Keine Claim-Order gefunden." }, { status: 404 });
    }

    if (order.status !== "paid") {
      const amount =
        typeof order.photo.price_cents === "number" && order.photo.price_cents > 0
          ? order.photo.price_cents
          : 300;
      const currency =
        typeof order.photo.currency === "string" && order.photo.currency.trim()
          ? order.photo.currency.trim().toLowerCase()
          : "eur";

      await markClaimOrderPaid({
        orderId: order.id,
        sessionId: `demo_cs_${crypto.randomUUID().replace(/-/g, "")}`,
        paymentIntentId: `demo_pi_${crypto.randomUUID().replace(/-/g, "")}`,
        amountCents: amount,
        currency,
      });
    }

    const siteUrl = getSiteUrl(request);

    return NextResponse.json({
      url: `${siteUrl}/claim/success?order=${encodeURIComponent(payload.orderId.trim())}&token=${encodeURIComponent(payload.token.trim())}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Demo-Zahlung konnte nicht verarbeitet werden.",
      },
      { status: 500 },
    );
  }
}
