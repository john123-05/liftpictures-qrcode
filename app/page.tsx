import type { Metadata } from "next";
import { EasyTerminalLanding } from "@/components/easyterminal-landing";

export const metadata: Metadata = {
  title: "EasyTerminal | Liftpictures",
  description:
    "EasyTerminal von Liftpictures modernisiert den Bildverkauf im Park: Bilder sehen, QR-Code scannen, am Smartphone kaufen und Umsaetze im Dashboard verstehen.",
};

export default function HomePage() {
  return <EasyTerminalLanding />;
}
