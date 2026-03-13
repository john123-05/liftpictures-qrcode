export type PhotoRecord = {
  id: string;
  park_id?: string | null;
  ride_id?: string | null;
  owner_user_id?: string | null;
  storage_bucket?: string | null;
  storage_path?: string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  created_at?: string | null;
  captured_at?: string | null;
  price_cents?: number | null;
  currency?: string | null;
  is_paid?: boolean | null;
  external_code?: string | null;
  claim_code?: string | null;
  [key: string]: unknown;
};

export type GalleryPhoto = PhotoRecord & {
  resolvedImageUrl: string;
  resolvedClaimCode: string;
};
