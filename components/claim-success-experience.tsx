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
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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

  async function loadDownloadAsset() {
    if (!order?.downloadHref) {
      throw new Error("Das Bild steht noch nicht zum Download bereit.");
    }

    const response = await fetch(order.downloadHref, {
      cache: "no-store",
    });

    let serverError: string | null = null;

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as { error?: string };
        serverError = payload.error ?? null;
      }

      throw new Error(serverError || "Das Bild konnte nicht geladen werden.");
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") ?? blob.type ?? "image/jpeg";
    const disposition = response.headers.get("content-disposition") ?? "";
    const fileNameMatch =
      disposition.match(/filename\*=UTF-8''([^;]+)/i) ??
      disposition.match(/filename=\"?([^\";]+)\"?/i);
    const fileName = fileNameMatch?.[1]
      ? decodeURIComponent(fileNameMatch[1])
      : `${order.photo.resolvedClaimCode}.jpg`;

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
    if (!isPaid) {
      return;
    }

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
    if (!isPaid) {
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

      if (navigator.share && shareUrl) {
        await navigator.share({
          title: "Meine Erinnerung",
          text: buildShareText(),
          url: shareUrl,
        });
        setShareMessage(null);
        return;
      }

      if (shareUrl && navigator.clipboard?.writeText) {
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
            <button
              type="button"
              onClick={() => {
                void handleDownload();
              }}
              disabled={!isPaid || isDownloading}
              className={`inline-flex w-full items-center justify-center px-5 py-4 text-sm font-semibold ${
                isPaid && !isDownloading
                  ? "bg-ink text-white transition hover:bg-ink/90"
                  : "pointer-events-none border border-line bg-page text-ink-soft"
              }`}
            >
              {isDownloading ? "Download wird vorbereitet..." : "Bild herunterladen"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={!isPaid || isSharing}
              className={`inline-flex w-full items-center justify-center border px-5 py-4 text-sm font-semibold ${
                isPaid && !isSharing
                  ? "border-line bg-white text-ink transition hover:border-ink"
                  : "pointer-events-none border-line bg-page text-ink-soft"
              }`}
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
