"use client";

import { useEffect, useState } from "react";
import type { ClaimOrderApiResponse } from "@/types/claim";

type ClaimSuccessExperienceProps = {
  sessionId?: string;
  orderId?: string;
  token?: string;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; payload: ClaimOrderApiResponse };

function buildShareText() {
  return "Ich habe gerade mein Bild gesichert.";
}

function buildOrderUrl(props: ClaimSuccessExperienceProps) {
  if (props.sessionId) {
    return `/api/claim/order?session_id=${encodeURIComponent(props.sessionId)}`;
  }

  if (props.orderId && props.token) {
    return `/api/claim/order?order=${encodeURIComponent(props.orderId)}&token=${encodeURIComponent(props.token)}`;
  }

  return null;
}

export function ClaimSuccessExperience(props: ClaimSuccessExperienceProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const order = state.kind === "ready" ? state.payload : null;
  const isPaid = order?.status === "paid";
  const orderUrl = buildOrderUrl(props);
  const shareUrl = order?.shareUrl ?? "";

  useEffect(() => {
    if (!orderUrl) {
      return;
    }

    let cancelled = false;

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const load = async () => {
      for (let attempt = 0; attempt < 16; attempt += 1) {
        const response = await fetch(orderUrl, {
          cache: "no-store",
        });

        const payload = (await response.json()) as
          | ClaimOrderApiResponse
          | { error?: string; status?: string };

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState({
            kind: "error",
            message: payload && typeof payload === "object" && "error" in payload && payload.error
              ? payload.error
              : "Freischaltung konnte nicht geladen werden.",
          });
          return;
        }

        const typedPayload = payload as ClaimOrderApiResponse;

        if (typedPayload.status === "paid") {
          setState({ kind: "ready", payload: typedPayload });
          return;
        }

        setState({ kind: "ready", payload: typedPayload });
        await wait(1800);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [orderUrl]);

  if (!orderUrl) {
    return (
      <main className="min-h-screen bg-page px-4 py-6 text-ink sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center">
          <div className="w-full border border-line bg-white p-6 sm:p-7">
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
              Freischaltung konnte nicht geladen werden.
            </h1>
            <p className="mt-4 text-sm leading-7 text-ink-soft">
              Die Success-Seite hat keine gueltigen Parameter erhalten.
            </p>
          </div>
        </div>
      </main>
    );
  }

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

  if (state.kind === "error") {
    return (
      <main className="min-h-screen bg-page px-4 py-6 text-ink sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center">
          <div className="w-full border border-line bg-white p-6 sm:p-7">
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
              Zahlung ist durch, aber die Freischaltung fehlt noch.
            </h1>
            <p className="mt-4 text-sm leading-7 text-ink-soft">{state.message}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page px-4 py-6 text-ink sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-between">
        <section className="overflow-hidden border border-line bg-white">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f2ee]">
            {order ? (
              <img
                src={order.photo.resolvedImageUrl}
                alt="Freigeschaltetes Bild"
                className={`h-full w-full object-contain transition duration-500 ${
                  isPaid ? "blur-0" : "blur-md"
                }`}
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-page-strong" />
            )}
          </div>
        </section>

        <section className="mt-5 border border-line bg-white p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Checkout</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">
            {isPaid ? "Dein Bild ist jetzt verfuegbar." : "Freischaltung wird geprueft."}
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft">
            {isPaid
              ? "Du kannst dein Bild jetzt herunterladen oder das Foto direkt mit Freunden teilen."
              : "Die Zahlung wird verarbeitet. Wir schalten dein Bild direkt danach frei."}
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={isPaid ? order?.downloadHref ?? "#" : "#"}
              className={`inline-flex w-full items-center justify-center px-5 py-4 text-sm font-semibold ${
                isPaid
                  ? "bg-ink text-white transition hover:bg-ink/90"
                  : "pointer-events-none border border-line bg-page text-ink-soft"
              }`}
            >
              Bild herunterladen
            </a>

            <button
              type="button"
              onClick={handleShare}
              disabled={!isPaid}
              className={`inline-flex w-full items-center justify-center border px-5 py-4 text-sm font-semibold ${
                isPaid
                  ? "border-line bg-white text-ink transition hover:border-ink"
                  : "pointer-events-none border-line bg-page text-ink-soft"
              }`}
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
