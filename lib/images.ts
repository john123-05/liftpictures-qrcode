import type { SupabaseClient } from "@supabase/supabase-js";
import type { PhotoRecord } from "@/types/photo";

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isFullUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isRenderableUrl(value: string) {
  return isFullUrl(value) || value.startsWith("/");
}

export function resolvePhotoImageUrl(
  photo: PhotoRecord,
  supabase: SupabaseClient,
): string | null {
  const imageUrl = readString(photo.image_url);
  if (imageUrl && isRenderableUrl(imageUrl)) {
    return imageUrl;
  }

  const thumbnailUrl = readString(photo.thumbnail_url);
  if (thumbnailUrl && isRenderableUrl(thumbnailUrl)) {
    return thumbnailUrl;
  }

  const storagePath = readString(photo.storage_path);
  if (!storagePath) {
    return null;
  }

  if (isFullUrl(storagePath)) {
    return storagePath;
  }

  const storageBucket = readString(photo.storage_bucket);
  if (!storageBucket) {
    return null;
  }

  const { data } = supabase.storage.from(storageBucket).getPublicUrl(storagePath);
  return data.publicUrl || null;
}

export async function resolvePhotoDownloadUrl(
  photo: PhotoRecord,
  supabase: SupabaseClient,
): Promise<string | null> {
  const imageUrl = readString(photo.image_url);
  if (imageUrl && isRenderableUrl(imageUrl)) {
    return imageUrl;
  }

  const storagePath = readString(photo.storage_path);
  const storageBucket = readString(photo.storage_bucket);

  if (storagePath) {
    if (isFullUrl(storagePath)) {
      return storagePath;
    }

    if (storageBucket) {
      const signedResult = await supabase.storage
        .from(storageBucket)
        .createSignedUrl(storagePath, 60 * 15, {
          download: true,
        });

      if (signedResult.data?.signedUrl) {
        return signedResult.data.signedUrl;
      }

      const { data } = supabase.storage.from(storageBucket).getPublicUrl(storagePath);

      if (data.publicUrl) {
        return data.publicUrl;
      }
    }
  }

  const thumbnailUrl = readString(photo.thumbnail_url);
  if (thumbnailUrl && isRenderableUrl(thumbnailUrl)) {
    return thumbnailUrl;
  }

  return null;
}
