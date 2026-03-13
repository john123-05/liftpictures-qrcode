"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryPhoto } from "@/types/photo";

type ClaimExperienceProps = {
  photo: GalleryPhoto;
};

type FormState = {
  fullName: string;
  email: string;
};

function formatPrice(photo: GalleryPhoto) {
  const amount = typeof photo.price_cents === "number" ? photo.price_cents : 300;
  const currency = typeof photo.currency === "string" && photo.currency ? photo.currency : "eur";

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ClaimExperience({ photo }: ClaimExperienceProps) {
  const [showForm, setShowForm] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceLabel = useMemo(() => formatPrice(photo), [photo]);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  const submitCheckout = async () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formState.fullName.trim()) {
      nextErrors.fullName = "Bitte gib deinen Namen ein.";
    }

    if (!formState.email.trim()) {
      nextErrors.email = "Bitte gib deine E-Mail ein.";
    } else if (!isValidEmail(formState.email)) {
      nextErrors.email = "Bitte gib eine gueltige E-Mail ein.";
    }

    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/claim/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoId: photo.id,
          claimCode: photo.resolvedClaimCode,
          fullName: formState.fullName,
          email: formState.email,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? ((await response.json()) as { error?: string; url?: string })
        : null;

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Checkout konnte nicht gestartet werden.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Checkout konnte nicht gestartet werden.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-page px-4 py-6 text-ink sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-between">
        <section className="overflow-hidden border border-line bg-white">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f2ee]">
            <img
              src={photo.resolvedImageUrl}
              alt="Foto-Vorschau"
              className="absolute inset-0 h-full w-full scale-105 object-cover blur-2xl opacity-55"
            />
            <div className="absolute inset-0 bg-white/30" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between">
              <div className="border border-white/80 bg-white/82 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-ink-soft backdrop-blur">
                Deine Erinnerung
              </div>
              <div className="border border-white/80 bg-white/82 px-3 py-2 text-sm font-semibold text-ink backdrop-blur">
                {priceLabel}
              </div>
            </div>

            <div className="absolute inset-x-5 bottom-5 overflow-hidden border border-white/75 bg-white/76 p-3 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-md">
              <img
                src={photo.resolvedImageUrl}
                alt="Geblurrte Foto-Vorschau"
                className="h-[16.5rem] w-full object-contain blur-[4px] sm:h-[18rem]"
              />
            </div>
          </div>
        </section>

        <section className="mt-5 border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Dein Bild</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">
                Sichere dir deine Erinnerung.
              </h1>
            </div>

            <div className="border border-line bg-page px-3 py-2 text-sm font-medium text-ink">
              {priceLabel}
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-ink-soft">
            Oeffne dein Bild auf dem Handy, gib kurz deinen Namen und deine E-Mail an und wechsle
            danach direkt in den sicheren Stripe-Checkout.
          </p>

          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex w-full items-center justify-center bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              Erinnerung sichern
            </button>
          ) : null}

          {showForm ? (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink" htmlFor="fullName">
                  Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formState.fullName}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void submitCheckout();
                    }
                  }}
                  className="w-full border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink"
                  placeholder="Vorname Nachname"
                />
                {errors.fullName ? (
                  <p className="text-sm text-[#c2410c]">{errors.fullName}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink" htmlFor="email">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void submitCheckout();
                    }
                  }}
                  className="w-full border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink"
                  placeholder="dein.name@email.com"
                />
                {errors.email ? <p className="text-sm text-[#c2410c]">{errors.email}</p> : null}
              </div>

              <button
                type="button"
                disabled={isSubmitting || !isClientReady}
                onClick={() => {
                  void submitCheckout();
                }}
                className={`inline-flex w-full items-center justify-center px-5 py-4 text-sm font-semibold ${
                  isSubmitting || !isClientReady
                    ? "bg-ink/60 text-white"
                    : "bg-ink text-white transition hover:bg-ink/90"
                }`}
              >
                {!isClientReady
                  ? "Checkout wird geladen..."
                  : isSubmitting
                    ? "Checkout wird vorbereitet..."
                    : "Weiter zum Checkout"}
              </button>

              <p className="text-xs leading-6 text-ink-soft">
                Der Checkout laeuft additiv ueber eine eigene Claim-Strecke und veraendert keine
                bestehende Stripe- oder Supabase-Logik der anderen Projekte.
              </p>
            </div>
          ) : null}

          {submitError ? (
            <div className="mt-5 border border-[#fed7aa] bg-[#fff7ed] p-4">
              <p className="text-sm font-semibold text-[#9a3412]">Checkout konnte nicht starten.</p>
              <p className="mt-2 text-sm leading-6 text-[#9a3412]">{submitError}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
