# DigiScaler — compliance & production readiness (May 2026)

This note captures the digital-product positioning pass (English, French, Arabic) and what still merits human QA before launch.

## Completed in this pass

- **Risk wording (customer-facing):** Removed consulting/session/agency-style positioning from visible UI strings; chat, services keys, pricing, order flow, footer, and thank-you copy emphasize **downloadable digital kits**, **self-service files**, and **electronic delivery**.
- **Package slugs:** Canonical DB/marketing slugs are now `starter-website-kit`, `growth-optimization-kit`, `pro-conversion-toolkit`, and `scale-business-bundle`. Prisma migration `20260516130000_package_slugs_marketing_names` renames legacy rows on deploy.
- **Legacy URLs:** `lib/packages/map-slug.ts` still resolves old `*-consultation` paths to the new slugs so bookmarks do not break (see “Residual technical tokens”).
- **Shipped product ZIPs:** Customer-facing kits are named `Starter_Website_Kit.zip`, `Growth_Optimization_Kit.zip`, `Pro_Conversion_Toolkit.zip`, and `Scale_Business_Bundle.zip` under `public/downloads/` (mapped in `lib/packages/map-slug.ts`). **Dev-only placeholders:** `npm run demo-downloads` writes slug-named archives under `public/downloads/_dev-generated-demos/` (gitignored).
- **Checkout UX:** Pricing (page + home cards) routes customers to **checkout** only (product ZIPs download from the thank-you page after the flow). Trust copy includes **“Secure digital checkout and automated delivery.”** (and FR/AR equivalents). Order form and thank-you pages add explicit **digital-only / no shipping** lines.
- **Metadata:** Root locale layout uses `messages/*/metadata` for default title, description, Open Graph, and Twitter fields.
- **Schema:** Pricing JSON-LD marks offers as digital-oriented (`OnlineOnly`).

## Residual risky / sensitive wording (technical, not marketing)

| Location | Notes |
|----------|--------|
| `lib/packages/map-slug.ts` | Legacy alias keys still contain the substring `consultation` so old slugs resolve. Not rendered to users; remove only if you drop backward compatibility. |
| `prisma/migrations/…/migration.sql` | One-time SQL references old slug values in `WHERE` clauses. |
| `prisma/seed.ts` | Deactivates packages `advanced-consultation` and `elite-launch-package` if present. |

## Possible compliance gaps (verify manually)

- **Payments:** Site copy does not claim Stripe/PayPal/processor “approval.” Confirm your live checkout provider and privacy policy match actual vendors.
- **Refunds:** Refund policy still uses ordinary words like “review” in a refund context — not positioned as a sold “manual review” service; legal counsel should still validate for your jurisdictions.
- **Email delivery:** Product emails (order/support) should repeat digital-only fulfillment if those templates live outside this repo.
- **Broken links:** Run a crawler or `next build` + manual click-through on `/en`, `/fr`, `/ar` routes (legal, FAQ, pricing, order, thank-you).
- **Untranslated UI:** Admin panel and some internal labels may remain English-only by design.

## Broken links / missing pages

- No automated link crawl was executed in this pass. Confirm production `siteUrl` / `NEXT_PUBLIC_*` origin helpers match Hostinger so JSON-LD URLs resolve.

## Multilingual parity

- New keys added for **metadata**, **footer.trustCheckout**, **pricingPage** (demo + compliance lines + trust block), **orderPage.deliveryCompliance**, **thankYouPage.digitalFulfillmentNote** across `en`, `fr`, and `ar`.
- If you add strings later, mirror keys in all three files before shipping.

## Commands

- Regenerate dev-only placeholder ZIPs (optional, gitignored output): `npm run demo-downloads`
- Apply DB slug rename on deployed MySQL: `npx prisma migrate deploy` (includes `20260516130000_package_slugs_marketing_names`).
