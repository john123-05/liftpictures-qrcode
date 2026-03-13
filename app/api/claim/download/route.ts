import { NextResponse } from "next/server";
import { getClaimOrderByAccess, resolveClaimOrderDownloadUrl } from "@/lib/claim-orders";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("order")?.trim();
    const token = url.searchParams.get("token")?.trim();

    if (!orderId || !token) {
      return NextResponse.json({ error: "order oder token fehlt." }, { status: 400 });
    }

    const order = await getClaimOrderByAccess(orderId, token);

    if (!order || order.status !== "paid") {
      return NextResponse.json({ error: "Download ist nicht verfuegbar." }, { status: 403 });
    }

    const downloadUrl = await resolveClaimOrderDownloadUrl(order);

    if (!downloadUrl) {
      return NextResponse.json({ error: "Bild konnte nicht geladen werden." }, { status: 404 });
    }

    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Download konnte nicht gestartet werden.",
      },
      { status: 500 },
    );
  }
}
