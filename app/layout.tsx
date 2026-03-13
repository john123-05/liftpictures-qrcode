import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function resolveMetadataBase(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(siteUrl),
  title: "LiftPictures QR Screen",
  description:
    "Minimalistische Galerie-Screen-App fur Supabase-Fotos mit langsamer horizontaler Bewegung und QR-Codes pro Bild.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
