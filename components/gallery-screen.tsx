"use client";

import Link from "next/link";
import { useState } from "react";
import { ScrollingPhotoRow } from "@/components/scrolling-photo-row";
import type { GalleryPhoto } from "@/types/photo";

type GalleryScreenProps = {
  photos?: GalleryPhoto[];
  skippedCount?: number;
  error?: string;
};

function renderStateCard(title: string, body: string) {
  return (
    <div className="flex min-h-[48vh] items-center justify-center border border-line bg-white px-6 py-10 sm:px-10">
      <div className="max-w-2xl text-center">
        <h2 className="font-display text-4xl leading-none text-ink sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">{body}</p>
      </div>
    </div>
  );
}

export function GalleryScreen({
  photos = [],
  skippedCount = 0,
  error,
}: GalleryScreenProps) {
  const [showIntroModal, setShowIntroModal] = useState(true);
  const hasPhotos = photos.length > 0;
  const topRowPhotos = photos.filter((_, index) => index % 2 === 0);
  const bottomRowPhotos = photos.filter((_, index) => index % 2 === 1);
  const stateCard = error
    ? renderStateCard("Die Galerie konnte nicht geladen werden.", error)
    : !hasPhotos
      ? renderStateCard(
          "Keine Bilder gefunden.",
          skippedCount > 0
            ? `${skippedCount} Eintrage wurden geladen, hatten aber keine auflosbare Bild-URL. Prufe image_url, thumbnail_url oder storage_path.`
            : "Aktuell liefert die Tabelle photos keine Bilder fur diese Abfrage.",
        )
      : null;

  return (
    <main className="screen-shell min-h-screen bg-page text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[2800px] flex-col px-1 py-1 sm:px-2 sm:py-2 lg:px-3">
        <section className="relative flex min-h-[calc(100vh-0.5rem)] flex-1 flex-col border-y border-line py-1 sm:min-h-[calc(100vh-1rem)] sm:py-2">
          {stateCard ? (
            stateCard
          ) : (
            <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white via-white/92 to-transparent sm:w-16" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white via-white/92 to-transparent sm:w-16" />
              <header className="px-5 pb-3 pt-4 text-center sm:px-8 sm:pb-4 sm:pt-5">
                <h1 className="font-sans text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl lg:text-3xl">
                  Scanne QR-Code und kaufe dein Bild und teile es mit Freunden
                </h1>
              </header>
              <div className="grid min-h-0 flex-1 grid-rows-2 gap-1 sm:gap-2">
                <div className="flex min-h-0 items-center">
                  <ScrollingPhotoRow photos={topRowPhotos} direction="left" />
                </div>
                <div className="flex min-h-0 items-center">
                  <ScrollingPhotoRow
                    photos={bottomRowPhotos.length > 0 ? bottomRowPhotos : topRowPhotos}
                    direction="right"
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {showIntroModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/55 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl border border-line bg-white p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Demo Hinweis</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              Scanne mit QR-Code, wie der Parkbesucher.
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-ink-soft sm:text-base">
              <p>
                Fuer den Zahlungstest nutze bitte die Demo-Karte
                <span className="font-semibold text-ink"> 4242 4242 4242 4242</span>.
              </p>
              <p>
                Ablaufdatum:
                <span className="font-semibold text-ink"> 12/27</span>
                {" "}CVC:
                <span className="font-semibold text-ink"> 123</span>
                {" "}Name beliebig.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowIntroModal(false)}
                className="inline-flex w-full items-center justify-center bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-ink/90"
              >
                Weiter
              </button>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center border border-line bg-white px-5 py-4 text-sm font-semibold text-ink transition hover:border-ink"
              >
                Zurueck zur Hauptseite
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
