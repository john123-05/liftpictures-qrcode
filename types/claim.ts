import type { GalleryPhoto, PhotoRecord } from "@/types/photo";

export type ClaimOrderStatus = "pending" | "paid" | "failed" | "expired";

export type ClaimOrderRecord = {
  id: string;
  photo_id: string;
  claim_code: string;
  full_name: string;
  email: string;
  status: ClaimOrderStatus;
  access_token: string;
  stripe_checkout_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  amount_cents?: number | null;
  currency?: string | null;
  paid_at?: string | null;
  created_at?: string | null;
};

export type ClaimOrderWithPhoto = ClaimOrderRecord & {
  photo: GalleryPhoto;
};

export type ClaimCheckoutPayload = {
  photoId: string;
  claimCode: string;
  fullName: string;
  email: string;
};

export type ClaimOrderApiResponse = {
  orderId: string;
  status: ClaimOrderStatus;
  photo: Pick<GalleryPhoto, "id" | "resolvedImageUrl" | "resolvedClaimCode">;
  downloadHref: string | null;
  shareUrl: string;
};

export function isClaimOrderRecord(value: unknown): value is ClaimOrderRecord {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      typeof (value as { id?: unknown }).id === "string" &&
      "photo_id" in value &&
      typeof (value as { photo_id?: unknown }).photo_id === "string",
  );
}

export function isPhotoRecord(value: unknown): value is PhotoRecord {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      typeof (value as { id?: unknown }).id === "string",
  );
}
