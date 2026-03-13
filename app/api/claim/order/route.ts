import { NextResponse } from "next/server";
import {
  formatClaimOrderApiResponse,
  getClaimOrderByAccess,
  getClaimOrderBySessionId,
} from "@/lib/claim-orders";

export const runtime = "nodejs";

function getSiteUrl(request: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
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

    const order = sessionId
      ? await getClaimOrderBySessionId(sessionId)
      : await getClaimOrderByAccess(orderId!, token!);

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
