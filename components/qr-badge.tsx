"use client";

import { useSyncExternalStore } from "react";
import { QRCodeSVG } from "qrcode.react";
import { buildClaimUrl, shortClaimCode } from "@/lib/qr";
import type { GalleryPhoto } from "@/types/photo";

type QrBadgeProps = {
  photo: GalleryPhoto;
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || null;
const subscribe = () => () => {};

export function QrBadge({ photo }: QrBadgeProps) {
  const browserOrigin = useSyncExternalStore(
    subscribe,
    () => configuredSiteUrl ?? window.location.origin,
    () => configuredSiteUrl,
  );
  const qrValue = buildClaimUrl(photo.resolvedClaimCode, {
    siteUrl: configuredSiteUrl,
    browserOrigin,
  });

  const qrReady = qrValue.startsWith("http://") || qrValue.startsWith("https://");

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] border-l border-line pl-3 sm:pl-4">
      <div>
        <div className="h-px w-8 bg-accent sm:w-10" />
        <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink-soft">
          Scan dein
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-ink-soft">Bild</p>
      </div>

      <div className="flex items-end py-3 sm:py-4">
        <div className="w-full overflow-hidden border border-line bg-white p-1.5 sm:p-2">
          {qrReady ? (
            <QRCodeSVG
              value={qrValue}
              size={88}
              marginSize={0}
              bgColor="#ffffff"
              fgColor="#111827"
              className="h-auto w-full"
            />
          ) : (
            <div className="aspect-square w-full bg-page-strong" />
          )}
        </div>
      </div>

      <div>
        <p className="truncate text-[10px] text-ink-soft">{shortClaimCode(photo.resolvedClaimCode)}</p>
      </div>
    </div>
  );
}
