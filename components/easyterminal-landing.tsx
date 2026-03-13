"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import dashboardShot from "@/assets/Bildschirmfoto 2026-03-13 um 16.24.46.png";
import liftpicturesLogo from "@/assets/Liftpicutures Logo alt.jpg";
import visitorsScanning from "@/assets/bild.png";
import terminalDevice from "@/assets/bild12.png";
import parkTerminals from "@/assets/bilder.png";

const metrics = [
  {
    value: "Smartphone-first",
    label: "Kauf direkt auf dem eigenen Gerät statt am klassischen Automaten.",
  },
  {
    value: "Mehr Touchpoints",
    label: "Mehrere Screens im Park schaffen mehr Sichtbarkeit und mehr Verkäufe.",
  },
  {
    value: "Dashboard",
    label: "Umsatz, Käufe und Performance bleiben für Betreiber jederzeit transparent.",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Bild auf dem Screen sehen",
    body: "Die Aufnahmen laufen groß und aufmerksamkeitsstark über das Display und holen den Gast genau im richtigen Moment ab.",
  },
  {
    number: "02",
    title: "QR-Code scannen",
    body: "Der Kauf startet ohne App und ohne Umweg direkt mit der Kamera des Smartphones.",
  },
  {
    number: "03",
    title: "Am Handy kaufen",
    body: "Checkout und Bezahlung finden auf dem vertrauten Gerät des Gastes statt. Das reduziert Reibung und Abbrüche.",
  },
  {
    number: "04",
    title: "Erinnerung sichern und teilen",
    body: "Das Bild ist sofort verfügbar, kann heruntergeladen und direkt mit Freunden geteilt werden.",
  },
] as const;

const benefits = [
  {
    title: "Weniger Automat. Mehr Fläche für den Park.",
    body: "EasyTerminal ersetzt klobige Verkaufslogik durch eine schlanke, moderne Präsenz. Das spart Platz und wirkt deutlich hochwertiger.",
  },
  {
    title: "Mehr Berührungspunkte im Alltag des Gastes.",
    body: "Ein klassischer Automat verkauft an einem Ort. EasyTerminal kann entlang von Laufwegen, am Ausgang, im Shop oder in der Gastronomie präsent sein.",
  },
  {
    title: "Kaufen dort, wo der Gast ohnehin schon ist.",
    body: "Portemonnaie oder Bargeld hat nicht jeder griffbereit. Das Smartphone praktisch immer. Genau dort sollte auch der Kauf stattfinden.",
  },
  {
    title: "Einfacher installieren und leichter erweitern.",
    body: "Die reduzierte Hardware macht Rollout und Erweiterung deutlich flexibler als klassische Verkaufsautomaten.",
  },
  {
    title: "Schnellerer Kaufprozess mit weniger Hürden.",
    body: "Kein Anstehen, kein Münzeinwurf, keine Bedienlogik am Gerät. Stattdessen scannen, kaufen, sichern.",
  },
  {
    title: "Transparenz statt Blackbox.",
    body: "Ein modernes Dashboard zeigt, wo Verkäufe entstehen, welche Standorte performen und wie sich Umsätze entwickeln.",
  },
] as const;

const comparisonRows = [
  {
    topic: "Platzbedarf",
    classic: "Großes Gerät, dominant im Raum, schwer elegant zu integrieren.",
    terminal: "Schlankes Terminal, dezent und flexibel im Park platzierbar.",
  },
  {
    topic: "Kaufprozess",
    classic: "Bedienung am Automaten mit mehr Reibung.",
    terminal: "QR-Code scannen und auf dem eigenen Smartphone kaufen.",
  },
  {
    topic: "Bargeld",
    classic: "Oft Teil des Denkmodells oder tatsächliche Hürde.",
    terminal: "Kein Bargeld, kein Münzeinwurf, kein zusätzlicher Umweg.",
  },
  {
    topic: "Skalierbarkeit",
    classic: "Ein Standort, hoher Aufwand bei Erweiterungen.",
    terminal: "Mehrere Screens an mehreren Stellen im Park möglich.",
  },
  {
    topic: "Wartung",
    classic: "Mehr klassische Hardware, mehr Aufwand im Betrieb.",
    terminal: "Reduzierte, moderne Hardware mit schlankerem Setup.",
  },
  {
    topic: "Social Sharing",
    classic: "Teilen ist nachgelagert oder umständlich.",
    terminal: "Das Bild liegt direkt auf dem Smartphone und kann sofort geteilt werden.",
  },
] as const;

const placementLabels = [
  "Am Ausgang",
  "Im Shop",
  "Im Wartebereich",
  "In der Gastronomie",
  "Entlang von Laufwegen",
  "Direkt im Attraktionsumfeld",
] as const;

const faqs = [
  {
    question: "Wie funktioniert EasyTerminal genau?",
    answer:
      "EasyTerminal zeigt Bilder auf einem Screen, versieht jede Aufnahme mit einem QR-Code und verlagert den gesamten Kaufprozess direkt auf das Smartphone des Gastes.",
  },
  {
    question: "Brauchen Besucher eine App?",
    answer:
      "Nein. Der Einstieg funktioniert direkt über den Browser. Das hält die Hürde bewusst niedrig und beschleunigt den Kauf deutlich.",
  },
  {
    question: "Wo kann EasyTerminal installiert werden?",
    answer:
      "Überall dort, wo Aufmerksamkeit Kaufimpulse erzeugt: am Ausgang, im Shop, in Laufwegen, im Wartebereich oder in der Gastronomie.",
  },
  {
    question: "Kann ich mehrere Geräte im Park nutzen?",
    answer:
      "Ja. Genau darin liegt ein zentraler Vorteil. Mehrere Screens bedeuten mehr Sichtbarkeit und damit mehr Chancen auf zusätzliche Verkäufe.",
  },
  {
    question: "Wie sehen Betreiber ihre Umsätze?",
    answer:
      "Über das Dashboard lassen sich Umsatz, Käufe und Performance nachvollziehen. So wird sichtbar, welche Platzierung besonders gut funktioniert.",
  },
  {
    question: "Ist die Lösung auch für kleinere Attraktionen geeignet?",
    answer:
      "Ja. Gerade kleinere und mittlere Betreiber profitieren davon, dass EasyTerminal weniger Platz braucht und sich deutlich flexibler einsetzen lässt.",
  },
] as const;

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f08936] sm:text-[12px]">
      {children}
    </p>
  );
}

function ActionLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1e1e1e]"
      : variant === "secondary"
        ? "inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition hover:border-black/20 hover:bg-[#fafafa]"
        : "inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/14";

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

function ImageCard({
  image,
  alt,
  eyebrow,
  title,
  body,
  priority = false,
  className,
  imageClassName,
}: {
  image: StaticImageData;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_24px_80px_-56px_rgba(15,23,42,0.32)]",
        className,
      )}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-[#f5f5f7]">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn("object-cover", imageClassName)}
        />
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f08936]">
          {eyebrow}
        </p>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-8 text-black/60">{body}</p>
      </div>
    </div>
  );
}

export function EasyTerminalLanding() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIntroReady(true);
    });

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (elements.length === 0) {
      return () => {
        window.cancelAnimationFrame(frame);
      };
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
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <main className={cn("landing-shell min-h-screen text-[#111111]", introReady && "landing-intro-ready")}>
      <header className="sticky top-0 z-50 border-b border-black/6 bg-white/78 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-black/6 bg-white">
              <Image
                src={liftpicturesLogo}
                alt="Liftpictures Logo"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-black/40">Liftpictures</p>
              <p className="mt-1 text-sm font-semibold text-[#111111]">EasyTerminal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-black/55 lg:flex">
            <a href="#vorteile" className="transition hover:text-[#111111]">
              Vorteile
            </a>
            <a href="#ablauf" className="transition hover:text-[#111111]">
              Ablauf
            </a>
            <a href="#vergleich" className="transition hover:text-[#111111]">
              Vergleich
            </a>
            <a href="#dashboard" className="transition hover:text-[#111111]">
              Dashboard
            </a>
            <a href="#faq" className="transition hover:text-[#111111]">
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <ActionLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung" variant="secondary">
              Beratung anfragen
            </ActionLink>
            <ActionLink href="/demo" variant="primary">
              Demo testen
            </ActionLink>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_top,rgba(240,137,54,0.12),transparent_42%),linear-gradient(180deg,rgba(245,245,247,0.95),rgba(255,255,255,0))]" />
        <div className="mx-auto grid w-full max-w-[1280px] gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:px-10 lg:pb-36 lg:pt-24">
          <div data-reveal className="landing-reveal relative z-10">
            <SectionLabel>Liftpictures präsentiert</SectionLabel>

            <div className="mt-6">
              <span className="hero-easy text-[clamp(4.5rem,12vw,8.8rem)] font-semibold leading-[0.9] tracking-[-0.085em] text-[#111111]">
                Easy
              </span>
              <span className="hero-terminal mt-1 text-[clamp(4.5rem,12vw,8.8rem)] font-semibold leading-[0.9] tracking-[-0.085em] text-[#111111]">
                Terminal
              </span>
            </div>

            <p className="landing-terminal-code mt-5 text-[11px] uppercase tracking-[0.42em] text-black/42 sm:text-[12px]">
              Produktstatus: bereit für den nächsten Standard im Bildverkauf
            </p>

            <p className="mt-8 max-w-3xl text-2xl font-medium tracking-[-0.045em] text-[#111111] sm:text-3xl lg:text-[2rem]">
              Bilder verkaufen. Einfacher. Schneller. Sichtbarer.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/62 sm:text-xl sm:leading-9">
              EasyTerminal ist die minimalistische Hardware-Lösung für Freizeitparks,
              Sommerrodelbahnen und Erlebnisattraktionen, die Bildverkauf konsequent auf das
              Smartphone des Gastes verlagert. Weniger Automat. Mehr Umsatz.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/demo" variant="primary">
                Demo testen
              </ActionLink>
              <ActionLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung" variant="secondary">
                Beratung anfragen
              </ActionLink>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.value}
                  className="rounded-[1.6rem] border border-black/6 bg-white/78 p-5 shadow-[0_18px_50px_-44px_rgba(15,23,42,0.3)] backdrop-blur"
                >
                  <p className="text-sm font-semibold tracking-[-0.02em] text-[#111111]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/58">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="landing-reveal relative">
            <div className="absolute -left-6 top-10 h-36 w-36 rounded-full bg-[#f08936]/18 blur-3xl" />
            <div className="absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-[#111111]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.8rem] border border-black/6 bg-white p-3 shadow-[0_40px_130px_-72px_rgba(15,23,42,0.38)] sm:p-4">
              <div className="relative flex min-h-[34rem] items-center justify-center overflow-hidden rounded-[2.2rem] bg-[radial-gradient(circle_at_top,rgba(240,137,54,0.18),transparent_42%),linear-gradient(180deg,#f8f8f8,#ececef)] p-8 sm:min-h-[39rem] sm:p-12">
                <Image
                  src={terminalDevice}
                  alt="EasyTerminal Gerät"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="h-auto w-full max-w-[32rem] object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                  <div className="inline-flex rounded-full border border-black/10 bg-white/82 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-black/56 backdrop-blur">
                    EasyTerminal Hardware
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-[4.5rem] sm:px-8 sm:py-24 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <div>
            <SectionLabel>Das Problem</SectionLabel>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-6xl">
              Klassische Fotoautomaten kosten Zeit, Platz und Verkäufe.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/62 sm:text-xl sm:leading-9">
              Was für Betreiber wie ein Verkaufsgerät aussieht, fühlt sich für Gäste oft wie ein
              Umweg an. Münzeinwurf, Wartezeit und Bedienlogik bremsen den Impulskauf genau dort,
              wo er eigentlich am stärksten sein sollte.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                "Ein Automat mit Bargeld, Wartezeit und Bedienlogik kostet nicht nur Fläche. Er kostet Conversion.",
                "Ein einzelner Standort reicht oft nicht aus, um Aufmerksamkeit im ganzen Park in Umsatz zu übersetzen.",
                "Viele Gäste sehen ihr Bild, kaufen aber nicht, weil die Reibung zu hoch ist.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-black/6 bg-[#f7f7f8] px-5 py-5 text-base leading-7 text-[#111111] shadow-[0_14px_40px_-38px_rgba(15,23,42,0.24)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <ImageCard
            image={visitorsScanning}
            alt="Besucher scannen QR-Codes an einem großen Bilder-Screen"
            eyebrow="Blick auf die reale Nutzung"
            title="Wenn Gäste sofort verstehen, wie der Kauf funktioniert, sinkt die Hürde spürbar."
            body="EasyTerminal bringt den Kaufprozess an den Punkt, an dem Aufmerksamkeit entsteht: direkt vor den Bildern und direkt auf das Smartphone des Gastes."
            className="bg-[#f5f5f7]"
            imageClassName="object-cover"
          />
        </div>
      </section>

      <section id="ablauf" className="bg-[#f5f5f7] py-[4.5rem] sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <div data-reveal className="landing-reveal">
            <SectionLabel>So funktioniert EasyTerminal</SectionLabel>
            <h2 className="mt-5 max-w-[13ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-6xl">
              Vom Blick auf den Screen zum Kauf in Sekunden.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-black/62 sm:text-xl sm:leading-9">
              Keine App, kein Bargeld, kein komplizierter Zwischenstopp. Der Ablauf ist
              selbsterklärend, schnell und fühlt sich für Gäste sofort richtig an.
            </p>

            <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.24)]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f08936]">
                      {step.number}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-base leading-8 text-black/62">{step.body}</p>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_30px_90px_-66px_rgba(15,23,42,0.28)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(240,137,54,0.12),transparent_36%),linear-gradient(180deg,#ffffff,#f6f6f8)]" />
                <div className="relative flex h-full min-h-[38rem] flex-col justify-between p-8 sm:p-10">
                  <div className="max-w-md">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f08936]">
                      Produktlogik
                    </p>
                    <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#111111] sm:text-4xl">
                      Kein Umweg. Kein Bargeld. Kein Verkaufsverlust.
                    </h3>
                    <p className="mt-4 text-base leading-8 text-black/62">
                      Der QR-basierte Kaufprozess senkt Hürden und bringt die Erinnerung dorthin,
                      wo Gäste ohnehin schon sind: auf ihr Smartphone.
                    </p>
                  </div>

                  <div className="mx-auto flex w-full max-w-[26rem] justify-center">
                    <div className="landing-device-float relative aspect-[5/8] w-full max-w-[18rem]">
                      <Image
                        src={terminalDevice}
                        alt="EasyTerminal Produktbild"
                        fill
                        sizes="(max-width: 1024px) 70vw, 24vw"
                        className="object-contain drop-shadow-[0_30px_50px_rgba(15,23,42,0.18)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vorteile" className="mx-auto w-full max-w-[1280px] px-5 py-[4.5rem] sm:px-8 sm:py-24 lg:px-10">
        <div data-reveal className="landing-reveal">
          <SectionLabel>Vorteile für Betreiber</SectionLabel>
          <h2 className="mt-5 max-w-[13ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-6xl">
            Mehr Sichtbarkeit. Mehr Kaufanreize. Weniger Hürden.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/62 sm:text-xl sm:leading-9">
            EasyTerminal verbindet hochwertige Hardware, modernen Smartphone-Checkout und einen
            klaren Verkaufsprozess zu einer Lösung, die im Park sichtbar und im Ergebnis messbar
            wird.
          </p>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[1.8rem] border border-black/6 bg-white p-7 shadow-[0_22px_70px_-58px_rgba(15,23,42,0.24)]"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.05em] text-[#111111]">
                  {benefit.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-black/62">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-8 lg:px-10">
        <div data-reveal className="landing-reveal">
          <ImageCard
            image={parkTerminals}
            alt="Mehrere EasyTerminal-Displays in einem Freizeitpark"
            eyebrow="Mehrere Displays im Park"
            title="Ein klassischer Automat steht an einem Ort. EasyTerminal kann im ganzen Park verkaufen."
            body="Jede zusätzliche Platzierung erhöht die Chance auf einen Kauf. Sichtbarkeit ist kein Designfaktor. Sichtbarkeit ist Umsatz. Genau deshalb lässt sich EasyTerminal entlang der wirklichen Laufwege der Gäste verteilen."
            priority
          />

          <div className="mt-6 flex flex-wrap gap-3">
            {placementLabels.map((label) => (
              <span
                key={label}
                className="inline-flex rounded-full border border-black/8 bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#111111]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-[4.5rem] sm:px-8 sm:py-24 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <div className="rounded-[2rem] border border-black/6 bg-[#111111] p-8 text-white shadow-[0_36px_90px_-62px_rgba(15,23,42,0.64)] sm:p-10">
            <SectionLabel>Warum Smartphone-first überzeugt</SectionLabel>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
              Der Kauf sollte dort stattfinden, wo Gäste ohnehin schon sind.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/72">
              Portemonnaie oder Bargeld hat nicht jeder sofort dabei. Das Smartphone dagegen fast
              immer. Wer Erinnerungen teilen will, will nicht erst einen Automaten verstehen.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Vertrauter Checkout</p>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  Der Kauf auf dem eigenen Gerät fühlt sich schneller, moderner und sicherer an.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Einfacher teilen</p>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  Die Erinnerung landet direkt auf dem Smartphone und kann sofort geteilt werden.
                </p>
              </div>
            </div>
          </div>

          <ImageCard
            image={visitorsScanning}
            alt="Besucher scannen Bilder am großen Screen mit dem Smartphone"
            eyebrow="QR-Kauf in der Praxis"
            title="Weniger Schritte. Weniger Abbruch. Mehr Umsatz."
            body="Wenn der QR-Code direkt am Bild erscheint und der Kauf ohne weitere Hürden startet, wird aus Aufmerksamkeit deutlich häufiger ein Abschluss."
            className="bg-[#f5f5f7]"
          />
        </div>
      </section>

      <section id="vergleich" className="bg-[#f5f5f7] py-[4.5rem] sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <div data-reveal className="landing-reveal">
            <SectionLabel>Vergleich</SectionLabel>
            <h2 className="mt-5 max-w-[10ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-6xl">
              Weniger Automat. Mehr Umsatz.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-black/62 sm:text-xl sm:leading-9">
              EasyTerminal positioniert sich nicht durch laute Versprechen, sondern durch den
              sichtbar besseren Ablauf: weniger Hardware-Hürde, mehr Flexibilität und ein moderner
              Kaufprozess auf dem Smartphone.
            </p>

            <div className="mt-14 overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_28px_90px_-66px_rgba(15,23,42,0.24)]">
              <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-[1.05fr_1fr_1fr] border-b border-black/6 bg-[#fafafb]">
                    <div className="px-6 py-5 text-sm font-semibold text-[#111111]">Kategorie</div>
                    <div className="border-l border-black/6 px-6 py-5 text-sm font-semibold text-black/52">
                      Klassischer Automat
                    </div>
                    <div className="border-l border-black/6 px-6 py-5 text-sm font-semibold text-[#111111]">
                      EasyTerminal
                    </div>
                  </div>

                  {comparisonRows.map((row, index) => (
                    <div
                      key={row.topic}
                      className={cn(
                        "grid grid-cols-[1.05fr_1fr_1fr]",
                        index !== comparisonRows.length - 1 && "border-b border-black/6",
                      )}
                    >
                      <div className="px-6 py-5 text-sm font-semibold text-[#111111]">{row.topic}</div>
                      <div className="border-l border-black/6 px-6 py-5 text-sm leading-7 text-black/56">
                        {row.classic}
                      </div>
                      <div className="border-l border-black/6 px-6 py-5 text-sm leading-7 text-[#111111]">
                        {row.terminal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto w-full max-w-[1280px] px-5 py-[4.5rem] sm:px-8 sm:py-24 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <ImageCard
            image={dashboardShot}
            alt="Dashboard mit Umsatz, Käufen und Performance"
            eyebrow="Dashboard & Transparenz"
            title="Verkaufen ist gut. Verstehen, was verkauft, ist besser."
            body="EasyTerminal endet nicht beim Kauf. Das Dashboard schafft Transparenz über Umsatz, Käufe und Performance und macht den Bildverkauf im Park datenbasiert steuerbar."
            className="bg-[#f5f5f7]"
            imageClassName="object-cover object-top"
          />

          <div>
            <SectionLabel>Mehr Überblick</SectionLabel>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl">
              Kontrolle statt Blackbox.
            </h2>
            <p className="mt-6 text-lg leading-8 text-black/62 sm:text-xl sm:leading-9">
              Betreiber sehen auf einen Blick, wie sich Verkäufe entwickeln, welche Platzierungen
              besonders gut funktionieren und wo weiteres Potenzial liegt.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                "Wo entsteht mein Umsatz?",
                "Welche Platzierung funktioniert am besten?",
                "Wie entwickeln sich Käufe im Tagesverlauf?",
                "Welche Screens erzeugen die meisten Verkäufe?",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-black/6 bg-[#f7f7f8] px-5 py-5 text-base font-medium text-[#111111] shadow-[0_12px_36px_-34px_rgba(15,23,42,0.22)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-[4.5rem] sm:px-8 sm:py-24 lg:px-10">
        <div data-reveal className="landing-reveal grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <div className="rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)] p-8 shadow-[0_30px_90px_-66px_rgba(15,23,42,0.24)] sm:p-10">
            <SectionLabel>Hardware</SectionLabel>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl">
              Schlank. Hochwertig. Zukunftsfähig.
            </h2>
            <p className="mt-6 text-lg leading-8 text-black/62">
              EasyTerminal wirkt nicht wie ein klobiger Verkaufsautomat, sondern wie ein modernes,
              minimalistisches Display-System für eine zeitgemäße Attraktion.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {["Schlank", "Dezent", "Robust", "Modern", "Skalierbar", "Hochwertig"].map((word) => (
                <span
                  key={word}
                  className="inline-flex rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-medium text-[#111111]"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.4rem] border border-black/6 bg-[#f5f5f7] shadow-[0_36px_100px_-70px_rgba(15,23,42,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(240,137,54,0.14),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)]" />
            <div className="relative flex min-h-[34rem] items-center justify-center p-8 sm:min-h-[40rem] sm:p-12">
              <div className="landing-device-float relative aspect-[5/8] w-full max-w-[20rem]">
                <Image
                  src={terminalDevice}
                  alt="Freigestelltes EasyTerminal Produktbild"
                  fill
                  sizes="(max-width: 1024px) 70vw, 26vw"
                  className="object-contain drop-shadow-[0_38px_70px_rgba(15,23,42,0.18)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-8 lg:px-10">
        <div data-reveal className="landing-reveal overflow-hidden rounded-[2.4rem] border border-black/6 bg-[linear-gradient(135deg,#0d0d10_0%,#15171d_54%,#1d2028_100%)] px-8 py-10 text-white shadow-[0_40px_120px_-70px_rgba(15,23,42,0.76)] sm:px-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionLabel>Demo testen</SectionLabel>
              <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                Erleben Sie den Ablauf aus Sicht Ihrer Besucher.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl sm:leading-9">
                Sehen Sie, wie Bilder durchlaufen, wie der QR-basierte Kaufprozess funktioniert und
                wie schnell aus Aufmerksamkeit ein Kaufabschluss werden kann.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ActionLink href="/demo" variant="ghost">
                Demo testen
              </ActionLink>
              <ActionLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Live-Demo" variant="ghost">
                Live-Demo ansehen
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-[1280px] px-5 py-[4.5rem] sm:px-8 sm:py-24 lg:px-10">
        <div data-reveal className="landing-reveal">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-6xl">
            Häufige Fragen von Betreibern.
          </h2>

          <div className="mt-12 grid gap-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <button
                  key={faq.question}
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="rounded-[1.8rem] border border-black/6 bg-white px-6 py-6 text-left shadow-[0_20px_70px_-60px_rgba(15,23,42,0.24)] sm:px-8"
                >
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#111111]">
                      {faq.question}
                    </h3>
                    <span className="text-2xl font-medium text-[#f08936]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300",
                      isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-3xl text-base leading-8 text-black/62">{faq.answer}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 pb-[5.5rem] pt-2 sm:px-8 sm:pb-28 lg:px-10">
        <div data-reveal className="landing-reveal rounded-[2.4rem] border border-black/6 bg-[#f5f5f7] p-8 shadow-[0_28px_90px_-68px_rgba(15,23,42,0.24)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionLabel>Abschluss</SectionLabel>
              <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-6xl">
                Machen Sie es Ihren Gästen leicht, Erinnerungen mitzunehmen.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-black/62 sm:text-xl sm:leading-9">
                Modernisieren Sie den Bildverkauf mit einer Lösung, die weniger Platz braucht,
                sichtbarer verkauft und den gesamten Kaufprozess auf das Gerät des Gastes bringt.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ActionLink href="/demo" variant="primary">
                Demo testen
              </ActionLink>
              <ActionLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung" variant="secondary">
                Beratung anfragen
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/6 bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-black/6 bg-white">
              <Image
                src={liftpicturesLogo}
                alt="Liftpictures Logo"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111111]">Liftpictures EasyTerminal</p>
              <p className="mt-1 text-sm text-black/52">
                Moderner Bildverkauf für Freizeitparks und Erlebnisattraktionen.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionLink href="/demo" variant="secondary">
              Demo testen
            </ActionLink>
            <ActionLink href="mailto:hello@liftpictures.de?subject=EasyTerminal%20Beratung" variant="secondary">
              Beratung anfragen
            </ActionLink>
          </div>
        </div>
      </footer>
    </main>
  );
}
