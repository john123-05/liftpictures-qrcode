import { GalleryScreen } from "@/components/gallery-screen";
import { getGalleryConfig } from "@/lib/gallery-config";
import { getLatestGalleryPhotos } from "@/lib/photos";
import type { GalleryPhoto } from "@/types/photo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const config = getGalleryConfig();
  let photos: GalleryPhoto[] = [];
  let skippedCount = 0;
  let error: string | undefined;

  if (!config.isSupabaseConfigured) {
    error =
      "Die Supabase-Umgebungsvariablen fehlen noch. Hinterlege `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` oder in den Projekt-Settings von Bolt/Vercel.";
  } else {
    try {
      const result = await getLatestGalleryPhotos(config);
      photos = result.photos;
      skippedCount = result.skippedCount;
    } catch (caughtError) {
      error =
        caughtError instanceof Error
          ? caughtError.message
          : "Die Galerie konnte nicht aus Supabase geladen werden.";
    }
  }

  return (
    <GalleryScreen
      photos={photos}
      skippedCount={skippedCount}
      error={error}
    />
  );
}
