/**
 * Builds demo ZIPs under public/downloads/ for local preview and compliance demos.
 * Requires `tar` (Windows 10+) or falls back to PowerShell Compress-Archive.
 */
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'downloads');
const buildRoot = join(__dirname, '.demo-build');

/** Minimal valid single-page PDF (Hello). */
const DEMO_PDF_BYTES = Buffer.from(
  'JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCAyMDAgMjAwXS9Db250ZW50cyA0IDAgUj4+CmVuZG9iago0IDAgb2JqCjw8L0xlbmd0aCA0ND4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDEwMCBUZAooSGVsbG8pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNzQgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTc5IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA1L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMjYzCiUlRU9GCg==',
  'base64',
);

function writeTree(staging, entries) {
  for (const [rel, content] of entries) {
    const dest = join(staging, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content);
  }
}

function zipTo(zipPath, stagingDir) {
  try {
    execFileSync('tar', ['-a', '-cf', zipPath, '-C', stagingDir, '.'], { stdio: 'inherit' });
  } catch {
    const cmd = `Compress-Archive -Path '${stagingDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`;
    execFileSync('powershell.exe', ['-NoProfile', '-Command', cmd], { stdio: 'inherit' });
  }
}

const kits = {
  'starter-website-kit': [
    [
      'README.txt',
      `DigiScaler — Starter Website Kit (demo bundle)
© ${new Date().getFullYear()} DigiScaler LLC. This is a non-commercial demo archive with placeholder materials.

What this demo contains
• Plain-text guides and checklists you can adapt for your own workflows.
• Template snippets for homepage messaging structure.
• A tiny sample PDF to verify your unzip tool handles mixed file types.

Purchasing customers receive the full digital kit described on the Pricing page. This archive is intentionally reduced so you can preview file organization before checkout.`,
    ],
    [
      'guides/Homepage-Clarity-Guide.txt',
      `Homepage clarity guide (demo)

Goal
Help visitors answer three questions in seconds: What is this? Who is it for? What should I do next?

Outline
1. Above-the-fold headline: outcome-led, specific, no jargon stack.
2. Subhead: constraint or audience (“for solo founders”, “for Shopify operators”).
3. Primary action: one dominant button; secondary links stay minimal.
4. Proof row: short credibility markers (reviews snippet, press, certifications) — only if verifiable.
5. Risk reducers: shipping/returns/support expectations near the action zone.

Editing checklist
□ Headline ≤ 12 words and implies a benefit.
□ Subhead clarifies scope or prerequisite.
□ Navigation exposes only top journeys; hide edge cases in footer.`,
    ],
    [
      'checklists/Website-Trust-Checklist.txt',
      `Website trust checklist (demo)

Identity & policy
□ Business name and jurisdiction visible in header or footer.
□ Contact path that matches your storefront host (email or ticket — avoid dead ends).

Payments & privacy
□ Policies linked within one click of checkout.
□ Card badges shown only if accurate for your processor setup.

Content hygiene
□ Pricing currency consistent sitewide.
□ No placeholder “lorem” or stock labels in production paths.`,
    ],
    [
      'templates/Homepage-Hero-Copy-Blocks.txt',
      `Hero copy blocks (demo — fill in bracketed fields)

Version A — outcome
Headline: [Measurable outcome] without [common pain].
Subhead: For [audience] who need [job-to-be-done].
CTA: [Start — primary verb]

Version B — specificity
Headline: [Product category] built for [workflow].
Subhead: Ships with [artifact list: templates, trackers, etc.].
CTA: [See kits / Browse pricing]

Version C — proof-led
Headline: Trusted by [segment] to [result type].
Subhead: Includes [concrete deliverable types].
CTA: [Get instant access]`,
    ],
    [
      'notes/Release-Notes.txt',
      `Demo bundle release notes
Build: demo-placeholder
Files: text resources + sample PDF
Reminder: digital delivery only — no physical items.`,
    ],
    ['samples/DigiScaler-Demo-Overview.pdf', DEMO_PDF_BYTES],
  ],
  'growth-optimization-kit': [
    [
      'README.txt',
      `DigiScaler — Growth Optimization Kit (demo bundle)
Placeholder kit demonstrating folders for guides, checklists, spreadsheet templates, and notes.

Use this bundle to validate unzip behavior and internal naming. Paid kits expand depth per the Pricing page.`,
    ],
    [
      'guides/Conversion-Signals-Overview.txt',
      `Conversion signals overview (demo)

Macro signals
• Message match between ad → landing → cart.
• Cognitive load: fewer competing CTAs above the fold.
• Price transparency before cart walls.

Microcopy prompts
• Reinforce what happens after submit (“instant digital access”).
• Clarify digital-only fulfillment where applicable.`,
    ],
    [
      'checklists/Product-Page-Review.txt',
      `Product page quick audit (demo)

□ Primary image matches variant.
□ Variant selector tested on mobile.
□ Stock / fulfillment expectations stated for digital vs physical (you sell digital — say so).
□ Guarantees match actual policy text.`,
    ],
    [
      'templates/Email-Receipt-Snippets.txt',
      `Transactional email snippets (demo)

Subject: Your DigiScaler download is ready
Body opener: Thanks for your purchase — your files are attached below as secure links.

Reminder block: All products are digital downloads. No physical shipping.`,
    ],
    ['notes/Implementation-Notes.txt', `Roll out changes in small batches — measure one funnel step per sprint.`],
    ['samples/DigiScaler-Demo-Overview.pdf', DEMO_PDF_BYTES],
  ],
  'pro-conversion-toolkit': [
    [
      'README.txt',
      `DigiScaler — Pro Conversion Toolkit (demo bundle)
Includes demo audit worksheets, messaging templates, and tracker stubs. Replace placeholders with your brand voice.`,
    ],
    [
      'guides/Checkout-Clarity-Playbook.txt',
      `Checkout clarity playbook (demo)

Stages
1. Cart summary accuracy (tax/shipping messaging for digital carts: show “no shipping — digital product”).
2. Error recovery copy that explains fix paths.
3. Post-purchase reassurance (“access emailed”, “download portal”).`,
    ],
    [
      'checklists/Business-Audit-Worksheet.txt',
      `Business audit worksheet (demo)

Offer & positioning
□ Single sentence value proposition.
□ Proof assets mapped to claims.

Delivery
□ Digital fulfillment steps documented internally.
□ Support mailbox monitored within stated SLA.`,
    ],
    [
      'templates/Notion-Outline-Import.txt',
      `Notion outline import (demo markdown)

# Weekly optimization cadence
## Review metrics
## Pick one bottleneck
## Ship copy/layout tweak
## Log hypothesis & outcome`,
    ],
    ['trackers/Sheet-Column-Stubs.txt', `Date | Change | Expected signal | Result | Next step`],
    ['samples/DigiScaler-Demo-Overview.pdf', DEMO_PDF_BYTES],
  ],
  'scale-business-bundle': [
    [
      'README.txt',
      `DigiScaler — Scale Business Bundle (demo bundle)
Broad library placeholder: playbook skeleton, 90-day plan outline, automation prep sheet, and bundle manifest.`,
    ],
    [
      'guides/Website-Optimization-Playbook-Skeleton.txt',
      `Optimization playbook skeleton (demo)

Pillar 1 — Discovery: analytics + session replay hypotheses.
Pillar 2 — UX fixes: navigation, forms, speed budgets.
Pillar 3 — Messaging: proof, objections, guarantees aligned with policy.`,
    ],
    [
      'plans/90-Day-Action-Outline.txt',
      `90-day action outline (demo)

Days 1–30: baseline instrumentation & top leaks.
Days 31–60: iterative tests on PDP/checkout copy.
Days 61–90: consolidate winners; document reusable templates.`,
    ],
    [
      'checklists/Automation-Prep.txt',
      `Automation prep checklist (demo)

□ Trigger events defined (purchase, refund, support ticket).
□ Owner per workflow.
□ Plain-language customer notices for automated messages.`,
    ],
    ['templates/ZIP-Bundle-Manifest.txt', `manifest-version: 1\nkits: starter, growth, pro, scale (demo listing)`],
    ['notes/Operator-Notes.txt', `Maintain a changelog of template edits — digital operators iterate weekly.`],
    ['samples/DigiScaler-Demo-Overview.pdf', DEMO_PDF_BYTES],
  ],
};

rmSync(buildRoot, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const folder of Object.keys(kits)) {
  const staging = join(buildRoot, folder);
  mkdirSync(staging, { recursive: true });
  writeTree(staging, kits[folder]);
  const zipPath = join(outDir, `${folder}.zip`);
  zipTo(zipPath, staging);
}

rmSync(buildRoot, { recursive: true, force: true });
console.log('Demo downloads written to public/downloads/');
