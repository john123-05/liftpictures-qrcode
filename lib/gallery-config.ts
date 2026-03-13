const DEFAULT_LIMIT = 180;
const MIN_LIMIT = 24;
const MAX_LIMIT = 300;

function readString(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function clampLimit(value?: string) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (Number.isNaN(parsed)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, parsed));
}

export type GalleryConfig = {
  limit: number;
  parkId: string | null;
  siteUrl: string | null;
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  isSupabaseConfigured: boolean;
};

export function getGalleryConfig(): GalleryConfig {
  const supabaseUrl = readString(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = readString(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return {
    limit: clampLimit(process.env.NEXT_PUBLIC_GALLERY_LIMIT),
    parkId: readString(process.env.NEXT_PUBLIC_GALLERY_PARK_ID),
    siteUrl: readString(process.env.NEXT_PUBLIC_SITE_URL),
    supabaseUrl,
    supabaseAnonKey,
    isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}
