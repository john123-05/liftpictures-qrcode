import { ClaimSuccessExperience } from "@/components/claim-success-experience";

type ClaimSuccessPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function ClaimSuccessPage({ searchParams }: ClaimSuccessPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const orderId = readSearchParam(resolvedSearchParams.order).trim();
  const token = readSearchParam(resolvedSearchParams.token).trim();

  if (!orderId || !token) {
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

  return <ClaimSuccessExperience orderId={orderId} token={token} />;
}
