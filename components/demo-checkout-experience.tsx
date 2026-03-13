"use client";

import { useMemo, useState } from "react";

type DemoCheckoutExperienceProps = {
  orderId: string;
  token: string;
  photoUrl: string;
  claimCode: string;
  defaultName: string;
  priceCents: number;
  currency: string;
};

type DemoPaymentFormState = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);
}

function normalizeCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function normalizeExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function normalizeCvc(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function DemoCheckoutExperience({
  orderId,
  token,
  photoUrl,
  claimCode,
  defaultName,
  priceCents,
  currency,
}: DemoCheckoutExperienceProps) {
  const [formState, setFormState] = useState<DemoPaymentFormState>({
    cardholderName: defaultName,
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceLabel = useMemo(() => formatPrice(priceCents, currency), [currency, priceCents]);

  const handleSubmit = async () => {
    setSubmitError(null);

    if (
      !formState.cardholderName.trim() ||
      !formState.cardNumber.trim() ||
      !formState.expiry.trim() ||
      !formState.cvc.trim()
    ) {
      setSubmitError("Bitte fuelle alle Kartenfelder fuer die Demo aus.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/claim/demo-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          token,
          cardholderName: formState.cardholderName,
          cardNumber: formState.cardNumber,
          expiry: formState.expiry,
          cvc: formState.cvc,
        }),
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Demo-Zahlung konnte nicht gestartet werden.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Demo-Zahlung konnte nicht gestartet werden.",
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
              src={photoUrl}
              alt="Bildvorschau"
              className="absolute inset-0 h-full w-full scale-105 object-cover blur-2xl opacity-55"
            />
            <div className="absolute inset-0 bg-white/35" />

            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <div className="border border-white/80 bg-white/85 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-ink-soft backdrop-blur">
                Demo Checkout
              </div>
              <div className="border border-white/80 bg-white/85 px-3 py-2 text-sm font-semibold text-ink backdrop-blur">
                {priceLabel}
              </div>
            </div>

            <div className="absolute inset-x-5 bottom-5 overflow-hidden border border-white/75 bg-white/78 p-3 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-md">
              <img
                src={photoUrl}
                alt="Foto-Vorschau"
                className="h-[16.5rem] w-full object-contain blur-[1.5px] sm:h-[18rem]"
              />
            </div>
          </div>
        </section>

        <section className="mt-5 border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Zahlung</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">
                Demo-Kauf abschliessen.
              </h1>
            </div>

            <div className="border border-line bg-page px-3 py-2 text-sm font-medium text-ink">
              {priceLabel}
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-ink-soft">
            Diese Zahlungsmaske ist nur fuer die Vorfuehrung. Beliebige Kartendaten funktionieren,
            es wird nichts belastet und das Bild wird danach direkt freigeschaltet.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink" htmlFor="cardholderName">
                Name auf der Karte
              </label>
              <input
                id="cardholderName"
                type="text"
                value={formState.cardholderName}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    cardholderName: event.target.value,
                  }))
                }
                className="w-full border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink"
                placeholder="Max Mustermann"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink" htmlFor="cardNumber">
                Kartennummer
              </label>
              <input
                id="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                value={formState.cardNumber}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    cardNumber: normalizeCardNumber(event.target.value),
                  }))
                }
                className="w-full border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink"
                placeholder="4242 4242 4242 4242"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink" htmlFor="expiry">
                  Ablaufdatum
                </label>
                <input
                  id="expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={formState.expiry}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      expiry: normalizeExpiry(event.target.value),
                    }))
                  }
                  className="w-full border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink"
                  placeholder="12/29"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink" htmlFor="cvc">
                  CVC
                </label>
                <input
                  id="cvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={formState.cvc}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      cvc: normalizeCvc(event.target.value),
                    }))
                  }
                  className="w-full border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink"
                  placeholder="123"
                />
              </div>
            </div>

            <div className="border border-line bg-page px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">Claim Code</p>
              <p className="mt-2 break-all text-sm font-medium text-ink">{claimCode}</p>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void handleSubmit();
              }}
              className={`inline-flex w-full items-center justify-center px-5 py-4 text-sm font-semibold ${
                isSubmitting
                  ? "bg-ink/60 text-white"
                  : "bg-ink text-white transition hover:bg-ink/90"
              }`}
            >
              {isSubmitting ? "Zahlung wird verarbeitet..." : `Jetzt kaufen ${priceLabel}`}
            </button>

            <p className="text-xs leading-6 text-ink-soft">
              Demo-Modus aktiv. Jede eingegebene Karte fuehrt direkt zur Freischaltung des Bildes.
            </p>
          </div>

          {submitError ? (
            <div className="mt-5 border border-[#fed7aa] bg-[#fff7ed] p-4">
              <p className="text-sm font-semibold text-[#9a3412]">Demo-Zahlung fehlgeschlagen.</p>
              <p className="mt-2 text-sm leading-6 text-[#9a3412]">{submitError}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
