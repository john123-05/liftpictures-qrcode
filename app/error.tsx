"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="screen-shell flex min-h-screen items-center justify-center bg-page px-4 py-8 text-ink sm:px-8">
      <div className="glass-panel subtle-ring w-full max-w-2xl rounded-[2.4rem] border border-line p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-accent">LiftPictures Screen</p>
        <h1 className="font-display mt-4 text-4xl leading-none text-ink sm:text-5xl">
          Etwas ist beim Rendern schiefgelaufen.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">
          {error.message || "Die Seite konnte nicht aufgebaut werden."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
        >
          Erneut versuchen
        </button>
      </div>
    </main>
  );
}
