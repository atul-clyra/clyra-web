# BLUEPRINT — Bring the old heyclyra.com pages into the premium site

User request (2026-10-08): the footer links point at old-design pages on the live heyclyra.com. Bring
every old page into this repo, restyled in the premium scheme, so nothing breaks when this site
replaces the domain. (The dashboard's login and other pre-login screens are covered separately in
`Website/design-review/BLUEPRINT-auth-reskin.md`.)

## 1. Inventory of the live site (crawled 2026-10-08)

| Old URL | What it is | Plan |
|---|---|---|
| `/` | old homepage | replaced by the new homepage |
| `/students` | old marketing page | **redirect** → `/#for-students` (content now lives in the homepage) |
| `/institutions` | old marketing page (Calendly CTA) | **redirect** → `/#for-schools` |
| `/how-it-works` | old marketing page | **redirect** → `/#plan` |
| `/terms-conditions` | legal, ~1,850 words, 21 sections, eff. 2 Mar 2025, upd. 4 Jun 2025 | **port verbatim** |
| `/privacy-policy` | legal, ~1,100 words, sections A–J, nested lists + retention table, eff. 15 Dec 2023 | **port verbatim** |
| `/careers` | hero, "Why join", email fallback, application form → `POST https://api.clyralabs.com/v1/career/` | **port, same API contract** |
| `/security` | hero + Security Principles (3) + Compliance Posture (3) | **port verbatim** |

Legal text is extracted programmatically from the live HTML into `src/content/{terms,privacy}.json`
(headings, paragraphs, nested lists, table, bold and links preserved). Nobody retypes legal copy.

### Careers form contract (from the live JS bundle, must not change)
`POST https://api.clyralabs.com/v1/career/`, JSON:
`{ full_name, email, country_code (dial code e.g. "+971"), phone, role, linkedin, portfolio, note, resume (base64 PDF, no data: prefix), profile_image: "" }`
Response `{ success, message }`. Validation: full name, email, role, PDF resume required. Roles:
Engineering, Product, Design, Operations, Education, Business Development, General Application.
Default dial code: UAE +971. Country list: `src/content/countries.json` (213 entries, from the bundle).
Errors: show `message` or "Failed to submit application. Please try again."; success: confirmation state.

## 2. Design

One shared "document room" layout so every subpage matches the homepage:
- **Nav:** the same `SiteNav`, with links made absolute (`/#for-teachers` …) and the frosted Ink bar always solid.
- **Header band (Ink + grain):** mono eyebrow, display headline with one serif-italic word, mono meta line (e.g. EFFECTIVE 2 MAR 2025 · UPDATED 4 JUN 2025).
- **Body (Bone, faint graph-paper grid):**
  - Legal pages: sticky mono table of contents on the left (≥1024px), and text on the right at max 68ch, Inter Tight 17px/1.7. h2 is numbered display 600; h3 is mono uppercase Moss. Lists use hairline bullets, and the table gets hairline rules.
  - Security: two cards (Security principles / Compliance posture) using the line-icon set, plus links to Privacy and Terms.
  - Careers: three "why" cards, then a two-column apply block (form on the left, email fallback card on the right). Inputs are 12px radius with hairline borders, the focus ring is Pine, errors are Alert, and the submit button is the Pine block with a sliding arrow.
- **Footer:** the same `SiteFooter`, with Company links made relative (`/terms-conditions` …).
- **Redirect stubs:** a minimal Ink page ("Taking you to …"), a `<meta http-equiv="refresh">`, a JS `location.replace`, a canonical link to the target, and `noindex`.

## 3. Build steps
1. `next.config.mjs`: `trailingSlash: true`, so the export writes `/terms-conditions/index.html` and works on any static host.
2. `site.tsx`: `SiteNav({ home })` handles anchor bases. Footer Company links go relative, and Product links go to `/#…`.
3. `src/components/doc.tsx`: `DocShell`, `DocHeader`, `RichText` (renders `**bold**` and `[t](href)`), `LegalBody` (TOC + blocks).
4. Pages: `src/app/{terms-conditions,privacy-policy,security,careers}/page.tsx` with per-page metadata and canonical.
5. `src/components/careers-form.tsx` ("use client"): the same validation, base64 encoding and endpoint as live.
6. `src/app/{students,institutions,how-it-works}/page.tsx`: redirect stubs.
7. `sitemap.xml`: add the four real pages.
8. Verify: build; Playwright screenshots of each page (desktop + mobile); console clean; link audit across all pages; careers validation states (submit empty → errors). **Do not** send a real application to the API.

## 4. Execution log (2026-10-08)
All 8 steps done. Fixes found in verification:
- Heading ids starting with a digit broke CSS selectors, so they're now prefixed with `s-`.
- The document-link colour rule leaked onto the nav and footer, so it's now scoped to `.c-docbody`.
- The phone-code select cut off the dial code. It now reads `+971 United Arab Emirates`.
- "Log in" was hidden on phones, leaving no route into the app. It's now visible at all widths.
- Source-content notes, ported verbatim and not edited:
  - The live Terms jump from section 6 to 9; 7 and 8 exist only as subheadings under 6.
  - The privacy page's trailing "Contact Support / Back to Home" UI was replaced with a CTA card (mailto privacy@heyclyra.com).

Verified: build green (9 routes); desktop and mobile with no console errors, no 4xx, and no horizontal scroll; every internal link resolves; the 3 redirects land on the right anchors; careers empty submit shows all 4 validation messages. No real application was sent to the API.
