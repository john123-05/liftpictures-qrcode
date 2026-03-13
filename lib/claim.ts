import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { resolvePhotoImageUrl } from "@/lib/images";
import { resolvePhotoClaimCode } from "@/lib/qr";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { GalleryPhoto, PhotoRecord } from "@/types/photo";

const CLAIM_LOOKUP_FIELDS = ["external_code", "claim_code"] as const;

function isPhotoRecord(value: unknown): value is PhotoRecord {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      typeof (value as { id?: unknown }).id === "string",
  );
}

function looksLikeUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function normalizeClaimCode(value: string) {
  return value.trim();
}

async function fetchPhotoByExternalCode(code: string) {
  const supabase = getSupabaseServerClient();
  const result = await supabase
    .from("photos")
    .select("*")
    .eq("external_code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return result;
}

function isMissingColumnError(message: string) {
  return /column .* does not exist/i.test(message);
}

async function fetchPhotoByClaimField(
  field: (typeof CLAIM_LOOKUP_FIELDS)[number],
  code: string,
) {
  const supabase = getSupabaseServerClient();
  const result = await supabase
    .from("photos")
    .select("*")
    .eq(field, code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return result;
}

async function fetchPhotoById(id: string) {
  const supabase = getSupabaseServerClient();
  const result = await supabase.from("photos").select("*").eq("id", id).maybeSingle();
  return result;
}

export async function getClaimPhotoById(id: string): Promise<GalleryPhoto | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("photos").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Supabase-Query fuer die Foto-ID fehlgeschlagen: ${error.message}`);
  }

  if (!isPhotoRecord(data)) {
    return null;
  }

  const resolvedImageUrl = resolvePhotoImageUrl(data, supabase);

  if (!resolvedImageUrl) {
    return null;
  }

  return {
    ...data,
    resolvedImageUrl,
    resolvedClaimCode: resolvePhotoClaimCode(data),
  };
}

export async function getClaimPhotoByCode(code: string): Promise<GalleryPhoto | null> {
  const normalizedCode = normalizeClaimCode(code);

  if (!normalizedCode) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  let data: unknown = null;

  for (const field of CLAIM_LOOKUP_FIELDS) {
    const result =
      field === "external_code"
        ? await fetchPhotoByExternalCode(normalizedCode)
        : await fetchPhotoByClaimField(field, normalizedCode);

    if (result.error) {
      if (isMissingColumnError(result.error.message)) {
        continue;
      }

      throw new Error(
        `Supabase-Query fuer den Claim-Code fehlgeschlagen: ${result.error.message}`,
      );
    }

    if (result.data) {
      data = result.data;
      break;
    }
  }

  if (!data && looksLikeUuid(normalizedCode)) {
    const byId = await fetchPhotoById(normalizedCode);

    if (byId.error) {
      throw new Error(`Supabase-Query fuer die Foto-ID fehlgeschlagen: ${byId.error.message}`);
    }

    data = byId.data;
  }

  if (!isPhotoRecord(data)) {
    return null;
  }

  const resolvedImageUrl = resolvePhotoImageUrl(data, supabase);

  if (!resolvedImageUrl) {
    return null;
  }

  return {
    ...data,
    resolvedImageUrl,
    resolvedClaimCode: resolvePhotoClaimCode(data),
  };
}
