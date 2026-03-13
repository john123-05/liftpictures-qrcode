import "server-only";
import { getTodayRangeForTimeZone } from "@/lib/date-range";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { resolvePhotoImageUrl } from "@/lib/images";
import { resolvePhotoClaimCode } from "@/lib/qr";
import type { GalleryConfig } from "@/lib/gallery-config";
import type { GalleryPhoto, PhotoRecord } from "@/types/photo";

type GalleryPhotoResult = {
  photos: GalleryPhoto[];
  skippedCount: number;
};

function hasPhotoId(value: unknown): value is PhotoRecord {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      typeof (value as { id?: unknown }).id === "string",
  );
}

export async function getLatestGalleryPhotos(
  config: GalleryConfig,
): Promise<GalleryPhotoResult> {
  const supabase = getSupabaseServerClient();
  const todayRange = config.onlyToday ? getTodayRangeForTimeZone(config.timeZone) : null;

  let query = supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(config.limit);

  if (config.parkId) {
    query = query.eq("park_id", config.parkId);
  }

  if (config.storageBucket) {
    query = query.eq("storage_bucket", config.storageBucket);
  }

  if (todayRange) {
    query = query.gte("created_at", todayRange.startIso).lt("created_at", todayRange.endIso);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase-Query auf \`photos\` fehlgeschlagen: ${error.message}`);
  }

  const rows = (data ?? []).filter(hasPhotoId);
  const photos = rows.reduce<GalleryPhoto[]>((collection, row) => {
    const resolvedImageUrl = resolvePhotoImageUrl(row, supabase);

    if (!resolvedImageUrl) {
      return collection;
    }

    collection.push({
      ...row,
      resolvedImageUrl,
      resolvedClaimCode: resolvePhotoClaimCode(row),
    });

    return collection;
  }, []);

  return {
    photos,
    skippedCount: rows.length - photos.length,
  };
}
