import "server-only";
import { resolvePhotoDownloadUrl } from "@/lib/images";
import { getClaimPhotoById } from "@/lib/claim";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  ClaimCheckoutPayload,
  ClaimOrderApiResponse,
  ClaimOrderRecord,
  ClaimOrderWithPhoto,
} from "@/types/claim";
import { isClaimOrderRecord } from "@/types/claim";

function normalizeText(value: string) {
  return value.trim();
}

function createAccessToken() {
  return `${crypto.randomUUID().replace(/-/g, "")}${crypto.randomUUID().replace(/-/g, "")}`;
}

function toAbsoluteUrl(value: string, siteUrl: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${siteUrl}${value}`;
  }

  return value;
}

export async function createClaimOrder(
  input: ClaimCheckoutPayload,
): Promise<ClaimOrderRecord> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("claim_orders")
    .insert({
      photo_id: input.photoId,
      claim_code: normalizeText(input.claimCode),
      full_name: normalizeText(input.fullName),
      email: normalizeText(input.email).toLowerCase(),
      status: "pending",
      access_token: createAccessToken(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Claim-Order konnte nicht erstellt werden: ${error.message}`);
  }

  if (!isClaimOrderRecord(data)) {
    throw new Error("Claim-Order wurde erstellt, aber ungueltig zurueckgegeben.");
  }

  return data;
}

export async function attachCheckoutSessionToClaimOrder(orderId: string, sessionId: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("claim_orders")
    .update({
      stripe_checkout_session_id: sessionId,
    })
    .eq("id", orderId);

  if (error) {
    throw new Error(`Checkout-Session konnte nicht gespeichert werden: ${error.message}`);
  }
}

export async function markClaimOrderPaid(params: {
  orderId: string;
  sessionId: string;
  paymentIntentId: string | null;
  amountCents: number | null;
  currency: string | null;
}) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("claim_orders")
    .update({
      status: "paid",
      stripe_checkout_session_id: params.sessionId,
      stripe_payment_intent_id: params.paymentIntentId,
      amount_cents: params.amountCents,
      currency: params.currency,
      paid_at: new Date().toISOString(),
    })
    .eq("id", params.orderId);

  if (error) {
    throw new Error(`Claim-Order konnte nicht auf bezahlt gesetzt werden: ${error.message}`);
  }
}

export async function markClaimOrderStatus(
  sessionId: string,
  status: ClaimOrderRecord["status"],
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("claim_orders")
    .update({ status })
    .eq("stripe_checkout_session_id", sessionId);

  if (error) {
    throw new Error(`Claim-Order-Status konnte nicht aktualisiert werden: ${error.message}`);
  }
}

export async function getClaimOrderBySessionId(
  sessionId: string,
): Promise<ClaimOrderWithPhoto | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("claim_orders")
    .select("*")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(`Claim-Order konnte nicht geladen werden: ${error.message}`);
  }

  if (!isClaimOrderRecord(data)) {
    return null;
  }

  const photo = await getClaimPhotoById(data.photo_id);

  if (!photo) {
    return null;
  }

  return {
    ...data,
    photo,
  };
}

export async function getClaimOrderByAccess(
  orderId: string,
  token: string,
): Promise<ClaimOrderWithPhoto | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("claim_orders")
    .select("*")
    .eq("id", orderId)
    .eq("access_token", token)
    .maybeSingle();

  if (error) {
    throw new Error(`Claim-Order konnte nicht geladen werden: ${error.message}`);
  }

  if (!isClaimOrderRecord(data)) {
    return null;
  }

  const photo = await getClaimPhotoById(data.photo_id);

  if (!photo) {
    return null;
  }

  return {
    ...data,
    photo,
  };
}

export function formatClaimOrderApiResponse(
  order: ClaimOrderWithPhoto,
  siteUrl: string,
): ClaimOrderApiResponse {
  return {
    orderId: order.id,
    status: order.status,
    photo: {
      id: order.photo.id,
      resolvedImageUrl: order.photo.resolvedImageUrl,
      resolvedClaimCode: order.photo.resolvedClaimCode,
    },
    downloadHref:
      order.status === "paid"
        ? `${siteUrl}/api/claim/download?order=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.access_token)}`
        : null,
    shareUrl: toAbsoluteUrl(order.photo.resolvedImageUrl, siteUrl),
  };
}

export async function resolveClaimOrderDownloadUrl(order: ClaimOrderWithPhoto) {
  const supabase = getSupabaseAdminClient();
  return resolvePhotoDownloadUrl(order.photo, supabase);
}
