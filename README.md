# LiftPictures QR Screen

Schlanke, produktionsreife Next.js-App mit App Router, TypeScript, Tailwind CSS, Supabase und einem additiven Claim-Flow fuer QR-Code-Kaeufe.

## Features

- Vollflaechiger Galerie-Screen mit zwei horizontalen Reihen
- Bilder direkt aus `photos` in Supabase
- QR-Code pro Bild mit Link auf `/claim?code=...`
- Mobile Claim-Landingpage mit Blur-Preview
- Name-/E-Mail-Erfassung vor dem Checkout
- Additiver Checkout-Flow mit optionalem Stripe oder Demo-Zahlungsmaske
- Success-Seite mit Download und Teilen

## Schnellstart

1. Dependencies installieren

```bash
npm install
```

2. Environment anlegen

```bash
cp .env.example .env.local
```

3. Werte in `.env.local` setzen

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
ALLOW_MOCK_CHECKOUT=false
NEXT_PUBLIC_GALLERY_LIMIT=180
NEXT_PUBLIC_GALLERY_PARK_ID=
NEXT_PUBLIC_GALLERY_BUCKET=test
NEXT_PUBLIC_GALLERY_ONLY_TODAY=true
GALLERY_TIMEZONE=Europe/Berlin
```

4. SQL-Migration in Supabase ausfuehren

Die Datei [supabase/migrations/20260313_create_claim_orders.sql](./supabase/migrations/20260313_create_claim_orders.sql) legt die additive Tabelle `claim_orders` an. Sie beruehrt keine vorhandenen Kauf- oder Auth-Flows anderer Projekte.

5. Development starten

```bash
npm run dev
```

6. Production Build pruefen

```bash
npm run build
```

## Stripe-Testsetup

1. In Stripe einen Test-Webhook auf `https://deine-domain/api/stripe/webhook` anlegen
2. Das erzeugte Secret als `STRIPE_WEBHOOK_SECRET` setzen
3. `STRIPE_SECRET_KEY` als Test-Key hinterlegen
4. Fuer lokale Tests entweder eine oeffentliche Tunnel-URL nutzen oder nach Bolt/Vercel deployen

Wichtig:
- Ein echter Handy-QR-Scan braucht eine oeffentliche URL
- `localhost` funktioniert beim Scannen mit der Kamera-App normalerweise nicht direkt

## Schneller Test ohne Stripe-Zugang

Wenn du den Flow sofort testen willst, kannst du in einer Testumgebung voruebergehend Mock-Checkout aktivieren:

```env
ALLOW_MOCK_CHECKOUT=true
```

Dann wird nach Name/E-Mail keine Stripe-Seite geoeffnet, sondern eine eigene Demo-Zahlungsmaske mit Kartenfeldern. Beliebige Kartendaten funktionieren, es wird nichts belastet und nach Klick auf `Kaufen` wird das Bild freigeschaltet. Das ist nur fuer schnelle interne Tests gedacht und sollte vor einem echten Livegang wieder auf `false` stehen.

## Projektstruktur

- `app/`: App Router, Galerie, Claim-Strecke, API-Routen, Loading- und Error-UI
- `components/`: Galerie-Komponenten, QR-Badge, Claim- und Success-Erlebnis
- `lib/`: Supabase-Clients, Stripe-Client, Datenzugriff, Bild- und QR-Helper
- `supabase/migrations/`: additive SQL-Migrationen
- `types/`: Typen fuer `photos` und `claim_orders`

## Technische Hinweise

- Galeriebilder werden aus `photos` geladen und nach `created_at DESC` sortiert
- Standardmaessig werden nur heutige Eintraege aus `storage_bucket = test` gezeigt
- Claim-Code-Lookup prueft `external_code`, dann `claim_code`, danach `photo.id`
- Bild-URLs werden robust aufgeloest:
  - zuerst `image_url`
  - dann `thumbnail_url`
  - dann `storage_bucket + storage_path`
  - volle URLs in `storage_path` werden direkt verwendet
- Download-Links erzeugen wenn moeglich eine Signed URL fuer Supabase Storage
- Der Kauf-Flow ist additiv und nutzt die neue Tabelle `claim_orders`
