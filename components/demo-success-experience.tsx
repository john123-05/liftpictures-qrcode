"use client";

import { useMemo, useState } from "react";

type DemoSuccessExperienceProps = {
  photoUrl: string;
  claimCode: string;
};

function buildShareText() {
  return "Ich habe gerade mein Bild gesichert.";
}

export function DemoSuccessExperience({
  photoUrl,
  claimCode,
}: DemoSuccessExperienceProps) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = useMemo(() => photoUrl, [photoUrl]);

  async function loadDownloadAsset() {
    const response = await fetch(photoUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Das Bild konnte nicht geladen werden.");
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") ?? blob.type ?? "image/jpeg";
    const fileName = `${claimCode || "liftpictures-demo"}.jpg`;
    const file = new File([blob], fileName, {
      type: contentType,
    });

    return {
      blob,
      file,
      fileName,
    };
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadMessage(null);

      const { blob, fileName } = await loadDownloadAsset();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const supportsDownloadAttribute = typeof link.download === "string";

      link.href = objectUrl;
      link.download = fileName;
      link.rel = "noopener";
      link.target = supportsDownloadAttribute ? "_self" : "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (!supportsDownloadAttribute) {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
        setDownloadMessage("Bild im neuen Tab geoeffnet.");
      } else {
        setDownloadMessage("Download gestartet.");
      }

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1500);
    } catch (error) {
      setDownloadMessage(
        error instanceof Error ? error.message : "Download konnte nicht gestartet werden.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      setIsSharing(true);
      setShareMessage(null);

      const { file } = await loadDownloadAsset();

      if (navigator.share && "canShare" in navigator && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Meine Erinnerung",
          text: buildShareText(),
          files: [file],
        });
        setShareMessage(null);
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: "Meine Erinnerung",
          text: buildShareText(),
          url: shareUrl,
        });
        setShareMessage(null);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Link kopiert.");
        return;
      }

      setShareMessage("Teilen ist auf diesem Geraet gerade nicht verfuegbar.");
    } catch (error) {
      setShareMessage(
        error instanceof Error ? error.message : "Teilen wurde abgebrochen.",
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <main className="min-h-screen bg-page px-4 py-6 text-ink sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-between">
        <section className="overflow-hidden border border-line bg-white">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f2ee]">
            <img
              src={photoUrl}
              alt="Freigeschaltetes Bild"
              className="h-full w-full object-contain"
            />
          </div>
        </section>

        <section className="mt-5 border border-line bg-white p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Demo Erfolg</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">
            Dein Bild ist jetzt freigeschaltet.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft">
            Die Demo-Zahlung war erfolgreich. Du kannst das Bild jetzt herunterladen oder direkt
            teilen.
          </p>

          <div className="mt-6 border border-line bg-page px-4 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">Claim Code</p>
            <p className="mt-2 break-all text-sm font-medium text-ink">{claimCode}</p>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => {
                void handleDownload();
              }}
              disabled={isDownloading}
              className="inline-flex w-full items-center justify-center bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              {isDownloading ? "Download wird vorbereitet..." : "Bild herunterladen"}
            </button>

            <button
              type="button"
              onClick={() => {
                void handleShare();
              }}
              disabled={isSharing}
              className="inline-flex w-full items-center justify-center border border-line bg-white px-5 py-4 text-sm font-semibold text-ink transition hover:border-ink"
            >
              {isSharing ? "Teilen wird vorbereitet..." : "Bild teilen"}
            </button>
          </div>

          {downloadMessage ? <p className="mt-4 text-sm text-ink-soft">{downloadMessage}</p> : null}
          {shareMessage ? <p className="mt-4 text-sm text-ink-soft">{shareMessage}</p> : null}
        </section>
      </div>
    </main>
  );
}
