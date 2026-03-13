import { DemoSuccessExperience } from "@/components/demo-success-experience";
import { getClaimPhotoByCode } from "@/lib/claim";
import { isMockCheckoutEnabled } from "@/lib/checkout-mode";

type DemoSuccessPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function DemoSuccessPage({ searchParams }: DemoSuccessPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const code = readSearchParam(resolvedSearchParams.code).trim();

  if (!isMockCheckoutEnabled()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
        <div className="w-full max-w-lg border border-line bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Demo-Erfolg ist nicht aktiv.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            Setze `ALLOW_MOCK_CHECKOUT=true`, damit diese Test-Freischaltung verfuegbar ist.
          </p>
        </div>
      </main>
    );
  }

  if (!code) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
        <div className="w-full max-w-lg border border-line bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Kein Claim-Code gefunden.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            Oeffne diese Seite direkt ueber den Demo-Checkout, damit das Bild geladen werden kann.
          </p>
        </div>
      </main>
    );
  }

  const photo = await getClaimPhotoByCode(code);

  if (!photo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
        <div className="w-full max-w-lg border border-line bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Bild konnte nicht geladen werden.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            Fuer diese Demo-Freischaltung wurde kein passendes Bild gefunden.
          </p>
        </div>
      </main>
    );
  }

  return (
    <DemoSuccessExperience
      photoUrl={photo.resolvedImageUrl}
      claimCode={photo.resolvedClaimCode}
    />
  );
}
