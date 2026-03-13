import { redirect } from "next/navigation";
import { DemoCheckoutExperience } from "@/components/demo-checkout-experience";
import { isMockCheckoutEnabled } from "@/lib/checkout-mode";
import { getClaimOrderByAccess } from "@/lib/claim-orders";

type DemoCheckoutPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function readPriceCents(value: unknown) {
  return typeof value === "number" && value > 0 ? value : 300;
}

function readCurrency(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "eur";
}

export default async function DemoCheckoutPage({ searchParams }: DemoCheckoutPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const orderId = readSearchParam(resolvedSearchParams.order).trim();
  const token = readSearchParam(resolvedSearchParams.token).trim();

  if (!isMockCheckoutEnabled()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
        <div className="w-full max-w-lg border border-line bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Demo-Checkout ist nicht aktiv.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            Setze `ALLOW_MOCK_CHECKOUT=true`, damit diese Test-Zahlungsseite verfuegbar ist.
          </p>
        </div>
      </main>
    );
  }

  if (!orderId || !token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
        <div className="w-full max-w-lg border border-line bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Keine Bestellung gefunden.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            Oeffne diese Seite direkt ueber den Claim-Flow, damit die Demo-Zahlung geladen werden
            kann.
          </p>
        </div>
      </main>
    );
  }

  const order = await getClaimOrderByAccess(orderId, token);

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
        <div className="w-full max-w-lg border border-line bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Bestellung konnte nicht geladen werden.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            Die Demo-Zahlung braucht eine gueltige Claim-Order mit Zugriffstoken.
          </p>
        </div>
      </main>
    );
  }

  if (order.status === "paid") {
    redirect(
      `/claim/success?order=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.access_token)}`,
    );
  }

  return (
    <DemoCheckoutExperience
      orderId={order.id}
      token={order.access_token}
      photoUrl={order.photo.resolvedImageUrl}
      claimCode={order.photo.resolvedClaimCode}
      defaultName={order.full_name}
      priceCents={readPriceCents(order.photo.price_cents)}
      currency={readCurrency(order.photo.currency)}
    />
  );
}
