"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import liftpicturesLogo from "@/assets/Liftpicutures Logo alt.jpg";

const benefits = [
  {
    title: "Mehr Sichtbarkeit im Park",
    body: "EasyTerminal verkauft nicht nur an einem Ort. Mehrere Screens entlang von Laufwegen, am Ausgang oder im Shop schaffen mehr Beruehrungspunkte und mehr Kaufchancen.",
  },
  {
    title: "Weniger Platz, mehr Wirkung",
    body: "Statt eines grossen Automaten setzt EasyTerminal auf eine schlanke, moderne Hardware, die sich dezent in bestehende Flachen einfuegt.",
  },
  {
    title: "Smartphone-first Checkout",
    body: "Gaeste kaufen auf dem eigenen Handy. Kein Anstehen, kein Bedienlernen, kein Bargeld, keine zusaetzliche Reibung.",
  },
  {
    title: "Einfach installiert",
    body: "Die Hardware ist reduziert gedacht. Das senkt den Aufwand in Betrieb, Aufstellung und Erweiterung.",
  },
  {
    title: "Skalierbar im ganzen Park",
    body: "Ein weiterer Screen ist kein Sonderfall, sondern ein Hebel fuer mehr Umsatz an genau den Stellen, an denen Aufmerksamkeit entsteht.",
  },
  {
    title: "Mehr Transparenz im Dashboard",
    body: "Verkaeufe, Platzierungen und Performance werden messbar. Betreiber sehen, was funktioniert und wo weiteres Potenzial liegt.",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Bild sehen",
    body: "Die Bilder laufen direkt auf dem Screen durch und erzeugen Aufmerksamkeit genau im richtigen Moment.",
  },
  {
    number: "02",
    title: "QR-Code scannen",
    body: "Der Gast scannt den Code in Sekunden mit dem Smartphone. Kein Umweg, kein zusaetzliches Geraet.",
  },
  {
    number: "03",
    title: "Am Handy kaufen",
    body: "Der Kauf findet auf dem eigenen Smartphone statt. Das fuehlt sich vertraut an und senkt Abbrueche.",
  },
  {
    number: "04",
    title: "Erinnerung sichern und teilen",
    body: "Das Bild ist direkt verfuegbar und kann sofort heruntergeladen oder mit Freunden geteilt werden.",
  },
] as const;

const comparisonRows = [
  ["Platzbedarf", "Gross, dominant, stationaer", "Schlank, dezent, flexibel platzierbar"],
  ["Kaufprozess", "Bedienlogik am Automaten", "Kauf direkt auf dem Smartphone"],
  ["Bargeld / Muenzeneinwurf", "Oft notwendig oder erwartet", "Nicht erforderlich"],
  ["Skalierbarkeit", "Ein Standort, hoher Aufwand", "Mehrere Screens im ganzen Park moeglich"],
  ["Wartungsaufwand", "Hoeher durch klassische Hardware", "Reduzierte, moderne Hardware"],
  ["Kaufgeschwindigkeit", "Mehr Schritte, mehr Reibung", "Scannen, kaufen, sichern"],
  ["Teilen / Social Sharing", "Umstaendlich", "Direkt vom eigenen Geraet"],
  ["Modernitaet", "Klassischer Automatenprozess", "Smartphone-first und zukunftsfaehig"],
] as const;

const placements = [
  "Ausgang",
  "Shop",
  "Wartebereich",
  "Gastro",
  "Laufwege",
  "Attraktionsumfeld",
] as const;

const faqItems = [
  {
    question: "Wie funktioniert EasyTerminal genau?",
    answer:
      "EasyTerminal zeigt Bilder auf einem Screen, versieht jede Aufnahme mit einem QR-Code und verlagert den Kaufprozess direkt auf das Smartphone des Gastes.",
  },
  {
    question: "Brauchen Besucher eine App?",
    answer:
      "Nein. Der Kauf startet ueber den Browser des Smartphones. Das senkt die Huerde und macht den Ablauf deutlich schneller.",
  },
  {
    question: "Wo kann EasyTerminal installiert werden?",
    answer:
      "Ueberall dort, wo Sichtbarkeit Kaufimpulse erzeugt: am Ausgang, im Shop, im Wartebereich, in der Gastro oder entlang der Laufwege.",
  },
  {
    question: "Wie schnell ist die Installation?",
    answer:
      "Die Idee hinter EasyTerminal ist eine deutlich reduzierte Hardware- und Prozesslogik. Dadurch ist die Einfuehrung einfacher als bei klassischen Automatenloesungen.",
  },
  {
    question: "Kann ich mehrere Geraete im Park nutzen?",
    answer:
      "Ja. Genau das ist einer der zentralen Vorteile: Statt eines einzelnen Verkaufsortes koennen mehrere Screens im Park parallel Umsatz erzeugen.",
  },
  {
    question: "Wie kaufen Gaeste ihr Bild?",
    answer:
      "Sie sehen ihr Bild auf dem Screen, scannen den QR-Code, kaufen auf dem eigenen Smartphone und sichern die Erinnerung direkt digital.",
  },
  {
    question: "Wie sehe ich meine Umsaetze?",
    answer:
      "Ueber das Dashboard erhalten Betreiber einen klaren Blick auf Verkaeufe, Performance und Platzierungen. So wird aus Sichtbarkeit messbarer Umsatz.",
  },
  {
    question: "Ist die Loesung auch fuer kleinere Attraktionen geeignet?",
    answer:
      "Ja. Gerade kleinere oder mittlere Betreiber profitieren davon, dass EasyTerminal weniger Platz beansprucht und flexibler aufgestellt werden kann.",
  },
  {
    question: "Kann EasyTerminal klassische Automaten ergaenzen oder ersetzen?",
    answer:
      "Beides ist moeglich. EasyTerminal kann bestehende Systeme intelligent ergaenzen oder als modernere Alternative den klassischen Automatenprozess abloesen.",
  },
  {
    question: "Gibt es eine Live-Demo?",
    answer:
      "Ja. Die Demo zeigt bereits den Ablauf mit laufenden Bildern, QR-Code und Kaufprozess aus Sicht Ihrer Besucher.",
  },
] as const;

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function PlaceholderVisual({
  label,
  title,
  detail,
  tone = "warm",
  className,
}: {
  label: string;
  title: string;
  detail: string;
  tone?: "warm" | "cool" | "neutral";
  className?: string;
}) {
  const toneClass =
    tone === "warm"
      ? "from-[#fff7ef] via-white to-[#fff1e6]"
      : tone === "cool"
        ? "from-[#eef5ff] via-white to-[#f4f7fb]"
        : "from-[#f8f8f6] via-white to-[#f2f2ef]";

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-white shadow-[0_30px_90px_-60px_rgba(15,23,42,0.35)]",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", toneClass)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,137,54,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(17,24,39,0.08),transparent_34%)]" />
      <div className="relative flex h-full min-h-[18rem] flex-col justify-between p-6 sm:p-8">
        <div>
          <span className="inline-flex border border-line bg-white/92 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-ink-soft backdrop-blur">
            {label}
          </span>
          <h3 className="mt-6 max-w-sm text-2xl font-semibold tracking-[-0.04em] text-ink sm:text-3xl">
            {title}
          </h3>
        </div>
        <p className="max-w-md text-sm leading-7 text-ink-soft sm:text-base">{detail}</p>
      </div>
    </div>
  );
}

function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center justify-center border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink";

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center justify-center bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/92";

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function EasyTerminalLanding() {
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.18,
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="landing-shell min-h-screen bg-page text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(240,137,54,0.14),transparent_52%),linear-gradient(180deg,rgba(15,23,42,0.035),transparent_48%)]" />
      <header className="sticky top-0 z-40 border-b border-line/80 bg-white/86 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden border border-line bg-white">
              <Image src={liftpicturesLogo} alt="Liftpictures Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Liftpictures</p>
              <p className="mt-1 text-sm font-semibold text-ink">EasyTerminal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-ink-soft lg:flex">
            <a href="#problem" className="transition hover:text-ink">
              Problem
            </a>
            <a href="#loesung" className="transition hover:text-ink">
              Loesung
            </a>
            <a href="#vorteile" className="transition hover:text-ink">
              Vorteile
            </a>
            <a href="#vergleich" className="transition hover:text-ink">
              Vergleich
            </a>
            <a href="#faq" className="transition hover:text-ink">
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <SecondaryLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung">
              Beratung anfragen
            </SecondaryLink>
            <PrimaryLink href="/demo">Demo testen</PrimaryLink>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
          <div data-reveal className="landing-reveal">
            <p className="text-[12px] font-medium uppercase tracking-[0.34em] text-accent">
              EasyTerminal fuer Freizeitattraktionen
            </p>
            <h1 className="mt-6 max-w-[11ch] text-5xl font-semibold tracking-[-0.055em] text-ink sm:text-6xl lg:text-7xl">
              Bilder verkaufen. Einfacher denn je.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft sm:text-xl sm:leading-9">
              EasyTerminal macht aus Aufmerksamkeit einen modernen Kaufprozess. Bilder laufen auf
              einem Screen, Gaeste scannen den QR-Code, kaufen auf dem Smartphone und sichern ihre
              Erinnerung in Sekunden.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/demo">Demo testen</PrimaryLink>
              <SecondaryLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung">
                Beratung anfragen
              </SecondaryLink>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Weniger Automat", "Mehr Flexibilitaet im Park"],
                ["Smartphone-first", "Kaufprozess ohne Bargeld"],
                ["Mehr Sichtbarkeit", "Mehr Screens, mehr Umsatz"],
              ].map(([title, body]) => (
                <div key={title} className="border border-line bg-white/88 p-4 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.28)] backdrop-blur">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="landing-reveal relative">
            <div className="landing-orb absolute -left-14 top-6 h-32 w-32 rounded-full bg-accent/16 blur-3xl" />
            <div className="landing-orb absolute -right-10 bottom-8 h-40 w-40 rounded-full bg-[#0f172a]/10 blur-3xl" />

            <div className="relative border border-line bg-white p-4 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.35)] sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <PlaceholderVisual
                  label="Hero Produktbild"
                  title="Schlanke Hardware statt klassischer Automatenwucht."
                  detail="Bildslot fuer EasyTerminal im Premium-Hero, spaeter mit weissem QR-Terminal und Screen in echter Freizeitszene."
                  tone="warm"
                  className="min-h-[28rem]"
                />

                <div className="grid gap-4">
                  <PlaceholderVisual
                    label="Besucher-Szene"
                    title="Gaeste scannen direkt mit dem Handy."
                    detail="Bildslot fuer Szene mit QR-Scan aus Besuchersicht."
                    tone="cool"
                    className="min-h-[13rem]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-line bg-[#0f172a] p-5 text-white shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)]">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/64">CTA</p>
                      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                        Demo direkt erleben
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/74">
                        Sehen, wie der Ablauf fuer Ihre Gaeste wirklich aussieht.
                      </p>
                    </div>
                    <div className="border border-line bg-white p-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-accent">
                        Umsatzhebel
                      </p>
                      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-ink">
                        Mehr Screens
                      </p>
                      <p className="mt-3 text-sm leading-6 text-ink-soft">
                        Mehr Beruehrungspunkte im Park. Mehr Chancen auf Kaufabschluesse.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
              Das Problem
            </p>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Ein klassischer Automat kostet mehr als nur Platz.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
              Muenzeinwurf, Wartezeit und Bedienlogik bremsen den Kaufprozess genau dort, wo
              Impulskauf staerker wirken sollte. Was fuer Betreiber wie ein Verkaufsgeraet aussieht,
              fuehlt sich fuer Gaeste oft wie ein Umweg an.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Ein Automat mit Bargeld, Wartezeit und Bedienlogik kostet nicht nur Flaeche. Er kostet Verkaeufe.",
              "Zeit ist im Park kein Nebenthema. Jede zusaetzliche Huerde senkt die Kaufwahrscheinlichkeit.",
              "Viele Gaeste sehen ihr Bild, kaufen aber nicht, weil der Prozess zu viel Reibung erzeugt.",
              "Ein einzelner Verkaufsautomat reicht oft nicht aus, um Aufmerksamkeit im ganzen Park in Umsatz zu verwandeln.",
            ].map((item) => (
              <div key={item} className="border border-line bg-white p-5 shadow-[0_20px_70px_-58px_rgba(15,23,42,0.28)]">
                <p className="text-sm leading-7 text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="loesung" className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal">
          <div className="max-w-3xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
              Die Loesung
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Vom Blick auf den Screen zum Kauf in Sekunden.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-soft">
              Bilder laufen durch, QR-Code wird gescannt, Checkout passiert auf dem eigenen
              Smartphone und die Erinnerung ist direkt gesichert. Kein Umweg. Kein Bargeld. Kein
              Verkaufsverlust.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step) => (
                <div key={step.number} className="border border-line bg-white p-6 shadow-[0_24px_70px_-60px_rgba(15,23,42,0.28)]">
                  <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent">
                    {step.number}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.04em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">{step.body}</p>
                </div>
              ))}
            </div>

            <PlaceholderVisual
              label="Produktablauf"
              title="Bild sehen. QR scannen. Am Handy kaufen. Erinnerung direkt sichern."
              detail="Bildslot fuer Screen mit durchlaufenden Bildern, Smartphone-Checkout und finalem Bildkauf."
              tone="cool"
              className="min-h-[30rem]"
            />
          </div>
        </div>
      </section>

      <section id="vorteile" className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal">
          <div className="max-w-3xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
              Vorteile fuer Betreiber
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Mehr Sichtbarkeit. Mehr Kaufanreize. Weniger Huerden.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-soft">
              EasyTerminal ist nicht nur ein Screen. Es ist eine moderne Verkaufslogik fuer Parks,
              Sommerrodelbahnen und Erlebnisattraktionen, die Aufmerksamkeit in Umsatz uebersetzt.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="border border-line bg-white p-6 shadow-[0_24px_70px_-60px_rgba(15,23,42,0.28)]">
                <h3 className="text-xl font-semibold tracking-[-0.04em] text-ink">{benefit.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink-soft">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vergleich" className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
              Vergleich
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Weniger Automat. Mehr Umsatz.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-soft">
              EasyTerminal wirkt nicht dadurch ueberlegen, dass klassische Systeme schlecht sind,
              sondern dadurch, dass der moderne Kaufprozess einfacher, schlanker und fuer den Park
              strategisch nutzbarer wird.
            </p>
            <div className="mt-8">
              <SecondaryLink href="/demo">Live-Demo ansehen</SecondaryLink>
            </div>
          </div>

          <div className="overflow-hidden border border-line bg-white shadow-[0_30px_90px_-70px_rgba(15,23,42,0.32)]">
            <div className="grid grid-cols-[1.05fr_0.95fr_0.95fr] border-b border-line bg-page-strong">
              <div className="px-5 py-4 text-sm font-semibold text-ink">Kategorie</div>
              <div className="border-l border-line px-5 py-4 text-sm font-semibold text-ink-soft">
                Klassischer Automat
              </div>
              <div className="border-l border-line px-5 py-4 text-sm font-semibold text-ink">
                EasyTerminal
              </div>
            </div>
            {comparisonRows.map(([topic, classic, terminal], index) => (
              <div
                key={topic}
                className={cn(
                  "grid grid-cols-[1.05fr_0.95fr_0.95fr]",
                  index !== comparisonRows.length - 1 && "border-b border-line",
                )}
              >
                <div className="px-5 py-4 text-sm font-medium text-ink">{topic}</div>
                <div className="border-l border-line px-5 py-4 text-sm leading-6 text-ink-soft">
                  {classic}
                </div>
                <div className="border-l border-line px-5 py-4 text-sm leading-6 text-ink">
                  {terminal}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="border border-line bg-white p-8 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.32)]">
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
              Smartphone-Kaufverhalten
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Das Smartphone hat jeder Gast in der Hand.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-soft">
              Portemonnaie oder Bargeld hat nicht jeder sofort griffbereit, das Handy dagegen fast
              immer. Genau dort sollte auch der Checkout stattfinden. Weniger Schritte bedeuten
              weniger Abbruch und mehr Umsatz.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="border border-line bg-page p-5">
                <p className="text-sm font-semibold text-ink">Vertrauter Prozess</p>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  Kauf am eigenen Geraet fuehlt sich sicherer, schneller und intuitiver an als ein
                  klassischer Automat.
                </p>
              </div>
              <div className="border border-line bg-page p-5">
                <p className="text-sm font-semibold text-ink">Einfacher teilen</p>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  Wer Erinnerungen teilen will, will nicht erst einen Automaten verstehen. Social
                  Sharing wird auf dem Smartphone zur natuerlichen Verlaengerung des Kaufs.
                </p>
              </div>
            </div>
          </div>

          <PlaceholderVisual
            label="Szene Besucher mit QR"
            title="Weniger Reibung. Hoehere Conversion."
            detail="Bildslot fuer Besucher, die den QR-Code auf dem eigenen Smartphone scannen und direkt kaufen."
            tone="warm"
            className="min-h-[32rem]"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
              Mehrere Displays im Park
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Ein klassischer Automat steht an einem Ort. EasyTerminal kann im ganzen Park verkaufen.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-soft">
              Jede zusaetzliche Platzierung erhoeht die Chance auf einen Kauf. Sichtbarkeit ist kein
              Designfaktor. Sichtbarkeit ist Umsatz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {placements.map((placement) => (
                <span
                  key={placement}
                  className="inline-flex border border-line bg-white px-4 py-2 text-sm font-medium text-ink"
                >
                  {placement}
                </span>
              ))}
            </div>
          </div>

          <PlaceholderVisual
            label="Mehrere Geraete im Park"
            title="Mehr Screens bedeuten mehr Sichtbarkeit."
            detail="Bildslot fuer Szene mit mehreren EasyTerminal-Positionen im Park: Ausgang, Shop, Gastro, Laufwege und Wartebereiche."
            tone="cool"
            className="min-h-[30rem]"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <PlaceholderVisual
            label="Dashboard Mockup"
            title="Verkaufen ist gut. Verstehen, was verkauft, ist besser."
            detail="Bildslot fuer Dashboard mit Umsatz, Performance, Screens und Standortvergleich."
            tone="neutral"
            className="min-h-[34rem]"
          />

          <div className="border border-line bg-white p-8 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.32)]">
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
              Dashboard & Transparenz
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Mehr Ueberblick ueber das, was wirklich Umsatz bringt.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-soft">
              Betreiber sehen ihren Umsatz, erkennen starke Platzierungen und verstehen, welche
              Touchpoints im Park besser performen. Das schafft Kontrolle statt Blackbox.
            </p>
            <div className="mt-10 grid gap-4">
              {[
                "Wo sehe ich meinen Umsatz?",
                "Welche Platzierung funktioniert?",
                "Wie entwickeln sich Verkaeufe?",
                "Welche Standorte performen besser?",
              ].map((question) => (
                <div key={question} className="border border-line bg-page px-5 py-4">
                  <p className="text-sm font-medium text-ink">{question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="border border-line bg-[#0f172a] p-8 text-white shadow-[0_34px_100px_-74px_rgba(15,23,42,0.72)]">
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-[#f8a665]">
              Hardware
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              Schlank. Robust. Dezent. Modern.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/74">
              EasyTerminal ist als hochwertige, minimalistische Hardware gedacht. Kein klobiger
              Automat, sondern ein elegantes Display-System, das sich modern in den Park einfuegt.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {["schlank", "robust", "dezent", "hochwertig", "modern", "zukunftsfaehig"].map(
                (word) => (
                  <span
                    key={word}
                    className="inline-flex border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white"
                  >
                    {word}
                  </span>
                ),
              )}
            </div>
          </div>

          <PlaceholderVisual
            label="Produktinszenierung"
            title="Eine Hardware, die professionell wirkt und sich professionell verkauft."
            detail="Bildslot fuer weisses EasyTerminal, Screen am Ausgang und cleanes Hardware-Setup in Parkumgebung."
            tone="neutral"
            className="min-h-[32rem]"
          />
        </div>
      </section>

      <section id="cta" className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal overflow-hidden border border-line bg-[linear-gradient(135deg,#0f172a_0%,#162136_52%,#1d2a42_100%)] p-8 text-white shadow-[0_36px_120px_-80px_rgba(15,23,42,0.8)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-[#f8a665]">
                Demo testen
              </p>
              <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Erleben Sie den Ablauf aus Sicht Ihrer Besucher.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74">
                Sehen Sie, wie Bilder praesentiert werden, wie der QR-basierte Kaufprozess
                funktioniert und warum EasyTerminal weniger Reibung in mehr Umsatz uebersetzt.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white/94"
              >
                Demo testen
              </Link>
              <a
                href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Live-Demo"
                className="inline-flex items-center justify-center border border-white/16 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                Live-Demo ansehen
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div data-reveal className="landing-reveal">
          <div className="max-w-3xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">FAQ</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              Haeufige Fragen von Betreibern.
            </h2>
          </div>

          <div className="mt-12 grid gap-4">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;

              return (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? -1 : index)}
                  className="border border-line bg-white p-6 text-left shadow-[0_22px_70px_-62px_rgba(15,23,42,0.28)]"
                >
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-ink">
                      {item.question}
                    </h3>
                    <span className="text-xl font-medium text-accent">{isOpen ? "−" : "+"}</span>
                  </div>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity,margin] duration-300",
                      isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-3xl text-sm leading-7 text-ink-soft">{item.answer}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 pb-20 pt-6 sm:px-8 sm:pb-24 lg:px-10">
        <div data-reveal className="landing-reveal border border-line bg-white p-8 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.32)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-accent">
                Abschluss
              </p>
              <h2 className="mt-5 max-w-[14ch] text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                Weniger Reibung. Mehr Verkaeufe.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
                Machen Sie es Ihren Gaesten leicht, Erinnerungen mitzunehmen, und modernisieren Sie
                den Bildverkauf im Park mit einer Loesung, die schlank, sichtbar und zukunftsfaehig
                ist.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <PrimaryLink href="/demo">Demo testen</PrimaryLink>
              <SecondaryLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung">
                Beratung anfragen
              </SecondaryLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white/82">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden border border-line bg-white">
              <Image src={liftpicturesLogo} alt="Liftpictures Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Liftpictures EasyTerminal</p>
              <p className="mt-1 text-sm text-ink-soft">
                Moderner Bildverkauf fuer Freizeitparks und Erlebnisattraktionen.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <PrimaryLink href="/demo">Demo testen</PrimaryLink>
            <SecondaryLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung">
              Beratung anfragen
            </SecondaryLink>
          </div>
        </div>
      </footer>
    </main>
  );
}
