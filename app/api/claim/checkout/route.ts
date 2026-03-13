import { NextResponse } from "next/server";
import {
  createClaimOrder,
  attachCheckoutSessionToClaimOrder,
} from "@/lib/claim-orders";
import { isMockCheckoutEnabled } from "@/lib/checkout-mode";
import { getClaimPhotoById } from "@/lib/claim";
import { getStripeServerClient } from "@/lib/stripe";
import type { ClaimCheckoutPayload } from "@/types/claim";

export const runtime = "nodejs";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getSiteUrl(request: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
}

function readPayload(payload: unknown): ClaimCheckoutPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const source = payload as Record<string, unknown>;

  if (
    typeof source.photoId !== "string" ||
    typeof source.claimCode !== "string" ||
    typeof source.fullName !== "string" ||
    typeof source.email !== "string"
  ) {
    return null;
  }

  return {
    photoId: source.photoId,
    claimCode: source.claimCode,
    fullName: source.fullName,
    email: source.email,
  };
}

export async function POST(request: Request) {
  try {
    const payload = readPayload(await request.json());

    if (!payload) {
      return NextResponse.json({ error: "Ungueltige Anfrage." }, { status: 400 });
    }

    if (!payload.fullName.trim()) {
      return NextResponse.json({ error: "Bitte gib deinen Namen ein." }, { status: 400 });
    }

    if (!payload.email.trim() || !isValidEmail(payload.email.trim())) {
      return NextResponse.json({ error: "Bitte gib eine gueltige E-Mail ein." }, { status: 400 });
    }

    const photo = await getClaimPhotoById(payload.photoId);

    if (!photo || photo.resolvedClaimCode !== payload.claimCode.trim()) {
      return NextResponse.json({ error: "Das Bild konnte nicht geladen werden." }, { status: 404 });
    }

    const siteUrl = getSiteUrl(request);
    const order = await createClaimOrder({
      photoId: photo.id,
      claimCode: payload.claimCode.trim(),
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
    });

    const amount = typeof photo.price_cents === "number" && photo.price_cents > 0 ? photo.price_cents : 300;
    const currency =
      typeof photo.currency === "string" && photo.currency.trim()
        ? photo.currency.trim().toLowerCase()
        : "eur";

    if (isMockCheckoutEnabled()) {
      await attachCheckoutSessionToClaimOrder(
        order.id,
        `mock_pending_${crypto.randomUUID().replace(/-/g, "")}`,
      );

      return NextResponse.json({
        url: `${siteUrl}/claim/demo-checkout?order=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.access_token)}`,
      });
    }

    const stripe = getStripeServerClient();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: payload.email.trim(),
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: "Foto-Erinnerung",
              description: `Claim-Code ${photo.resolvedClaimCode}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        claim_order_id: order.id,
        photo_id: photo.id,
        claim_code: photo.resolvedClaimCode,
      },
      success_url: `${siteUrl}/claim/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/claim?code=${encodeURIComponent(photo.resolvedClaimCode)}`,
    });

    await attachCheckoutSessionToClaimOrder(order.id, session.id);

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout konnte nicht gestartet werden.",
      },
      { status: 500 },
    );
  }
}
