"use client";

import { useSearchParams } from "next/navigation";
import { ClaimSuccessExperience } from "@/components/claim-success-experience";

function readSearchParam(value: string | null) {
  return value?.trim() ?? "";
}

export default function ClaimSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = readSearchParam(searchParams.get("session_id"));
  const orderId = readSearchParam(searchParams.get("order"));
  const token = readSearchParam(searchParams.get("token"));

  if (!sessionId && (!orderId || !token)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
        <div className="w-full max-w-lg border border-line bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Keine Freischaltung gefunden.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            Oeffne diese Seite ueber den Kauf- oder Demo-Checkout-Redirect, damit dein Kauf
            geladen werden kann.
          </p>
        </div>
      </main>
    );
  }

  return (
    <ClaimSuccessExperience
      sessionId={sessionId || undefined}
      orderId={orderId || undefined}
      token={token || undefined}
    />
  );
}
