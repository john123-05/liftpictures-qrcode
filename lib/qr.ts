import type { PhotoRecord } from "@/types/photo";

const CLAIM_CODE_KEYS = [
  "external_code",
  "claim_code",
  "externalCode",
  "claimCode",
  "qr_code",
  "qrCode",
  "code",
] as const;

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeBaseUrl(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, "");
}

export function resolvePhotoClaimCode(photo: PhotoRecord) {
  for (const key of CLAIM_CODE_KEYS) {
    const candidate = readString(photo[key]);

    if (candidate) {
      return candidate;
    }
  }

  return photo.id;
}

export function buildClaimUrl(
  code: string,
  options: {
    siteUrl?: string | null;
    browserOrigin?: string | null;
  } = {},
) {
  const encodedCode = encodeURIComponent(code);
  const baseUrl = normalizeBaseUrl(options.siteUrl) ?? normalizeBaseUrl(options.browserOrigin);
  const path = `/claim?code=${encodedCode}`;

  return baseUrl ? `${baseUrl}${path}` : path;
}

export function shortClaimCode(code: string) {
  if (code.length <= 14) {
    return code;
  }

  return `${code.slice(0, 10)}...`;
}
