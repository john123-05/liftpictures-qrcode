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

  const shareUrl = useMemo(() => photoUrl, [photoUrl]);

  const handleShare = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Meine Erinnerung",
          text: buildShareText(),
          url: shareUrl,
        });
        setShareMessage(null);
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Link kopiert.");
    } catch {
      setShareMessage("Teilen wurde abgebrochen.");
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
            <a
              href={photoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              Bild herunterladen
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex w-full items-center justify-center border border-line bg-white px-5 py-4 text-sm font-semibold text-ink transition hover:border-ink"
            >
              Bild teilen
            </button>
          </div>

          {shareMessage ? <p className="mt-4 text-sm text-ink-soft">{shareMessage}</p> : null}
        </section>
      </div>
    </main>
  );
}
