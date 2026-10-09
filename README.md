# Clyra website (heyclyra.com)

The public marketing site for Clyra: the homepage ("The loop, closed."), Book a demo, Careers,
Security, Terms and Privacy. It is built with Next.js as a **fully static export**: `npm run build`
writes plain HTML, CSS, JS and media to `out/`, and any static host can serve that folder.

The logged-in product at `app.heyclyra.com` is a different codebase and is not part of this repo.

---

## Deployment team: what to do from here

### 1. Build

- Requirements: Node.js 20 LTS or newer, and npm.

```bash
npm ci
npm run build          # output: out/
```

- **Build settings:**

| Setting | Value |
|---|---|
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output / publish directory | `out` |
| Node version | 20 |

- **Environment variables.** Both are read at build time and both are optional:

| Variable | Production value | What it does |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | leave unset, or `https://app.heyclyra.com` | Where "Log in" and "Get started" point. When unset it defaults to `https://app.heyclyra.com`. |
| `NEXT_PUBLIC_DEMO_ENDPOINT` | the demo-request API URL, once it exists (see step 4) | Where the Book a demo form posts. When unset, the form opens the visitor's email app addressed to aditya@ and rohit@heyclyra.com instead. |

> **Never deploy a build made with `NEXT_PUBLIC_APP_URL=http://localhost:3000`.** That setting is
> only for previewing locally. Its "Log in" links would point at localhost.

### 2. Host

- Any static host works: Vercel, Netlify, Cloudflare Pages, or S3 + CloudFront. Point it at `out/`.
- The site uses trailing slashes. For example, `/careers/` is served from `out/careers/index.html`. All of the hosts above do this by default.
  - On S3 + CloudFront, you need an index-document rule (or a CloudFront function) so that `/careers/` resolves to `/careers/index.html`.
- **Caching:**
  - `/_next/static/*` is content-hashed, so cache it for a year (`Cache-Control: public, max-age=31536000, immutable`).
  - The HTML files should be revalidated on every request (`no-cache`).
- **Size:** the hero films in `public/assets/world/` are 0.3–3 MB each. Serve them through the CDN with compression off, because MP4 is already compressed.

### 3. Domain, redirects and SEO

- **Domain:** point `heyclyra.com` and `www.heyclyra.com` at the host. Redirect `www` → `https://heyclyra.com` with a 301. The canonical URLs, sitemap and Open Graph tags all use `https://heyclyra.com`.
- **Old page URLs:**
  - The old site had `/students`, `/institutions` and `/how-it-works`. These are kept as small pages that forward to the matching section of the new homepage.
  - If your host supports redirect rules, also add real 301s:

```
/students       → /#for-students   301
/institutions   → /#for-schools    301
/how-it-works   → /#plan           301
```

  - `/terms-conditions`, `/privacy-policy`, `/careers` and `/security` keep their old URLs, so existing links keep working.
- **SEO files:** `robots.txt` and `sitemap.xml` are in `public/`. After launch, submit the sitemap in Google Search Console.

### 4. Backend work this site depends on

Neither item blocks launch, but both need doing.

- **Book a demo endpoint (new)**
  - The full spec is in [`docs/DEMO-REQUESTS.md`](docs/DEMO-REQUESTS.md).
  - In short: build `POST /v1/demo-request/` so that it emails each request **from `no-reply@heyclyra.com` to `aditya@heyclyra.com` and `rohit@heyclyra.com`**. Then rebuild the site with `NEXT_PUBLIC_DEMO_ENDPOINT` set.
  - The heyclyra.com domain needs SPF/DKIM records for the email provider, or the mail will land in spam.
  - Until the endpoint exists, the form still works: it hands the request to the visitor's own email app.
- **Careers endpoint (existing)**
  - The careers form posts to `https://api.clyralabs.com/v1/career/`, the same endpoint the old site used.
  - Confirm its CORS settings allow `https://heyclyra.com` (and `www`) once the new site is live.

### 5. Checks after each deploy

- [ ] `/`: the hero film scrubs as you scroll; the left-hand progress tracker lights up its six stages; no console errors.
- [ ] Every "Book a demo" button opens `/book-a-demo/`. The form shows validation errors, and a submission reaches the inbox (or opens a pre-filled email until the endpoint exists).
- [ ] "Log in" goes to `https://app.heyclyra.com/login` and "Get started" goes to `/register`.
- [ ] `/careers/`: submitting an empty form shows four errors. Send one real test application and confirm it arrives.
- [ ] `/terms-conditions/`, `/privacy-policy/`, `/security/` load, and their table-of-contents links jump to the right sections.
- [ ] `/students`, `/institutions`, `/how-it-works` forward to the homepage sections.
- [ ] Mobile (around 390px wide): no sideways scrolling; the progress tracker becomes a thin bar at the top.
- [ ] Share preview: paste `https://heyclyra.com` into a LinkedIn/Slack/WhatsApp message and check the Clyra card (`public/og.png`) appears.

### 6. Open content items (owners: product / legal)

- **Terms & Conditions:** the published text jumps from section 6 to section 9. Sections 7 and 8 exist only as subheadings inside section 6. The text was copied verbatim from the old site; legal should fix the numbering.
- **Hero film:** the ring breaks into 4 pieces, but the copy says "five tools". Either change the copy or regenerate the film.
- **Practise image** (`public/assets/ui/practise-devices.webp`): the "English" dot is purple, which isn't in the palette. This is minor and needs the image regenerated.

---

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site written to out/
npm start          # serve out/ locally on http://localhost:3000
```

**Previewing against a local copy of the app:** build with
`NEXT_PUBLIC_APP_URL=http://localhost:3000 npm run build`, then serve `out/` on a different port,
e.g. `npx serve out -l 4321`.

## Where things live

| What | Where |
|---|---|
| Page order (homepage) | `src/app/page.tsx` |
| SEO, Open Graph, fonts, JSON-LD | `src/app/layout.tsx` |
| Design tokens (colours, fonts, spacing) | `:root` in `src/app/globals.css` |
| Hero film chapters (copy, clips) | `src/components/scenes-data.tsx` |
| Static sections, nav, footer, **all outbound links** (`LINKS`) | `src/components/site.tsx` |
| Animated scenes: Teach, Understand, Personalise | `src/components/scenes.tsx` |
| Animated scene: Mark | `src/components/mark-scene.tsx` |
| Line icons | `src/components/icons.tsx` |
| Site-wide motion (smooth scroll, progress tracker, reveals) | `src/components/motion.ts` |
| Book a demo form | `src/app/book-a-demo/page.tsx`, `src/components/demo-form.tsx` |
| Careers form | `src/app/careers/page.tsx`, `src/components/careers-form.tsx` |
| Terms / Privacy text (extracted from the old site) | `src/content/terms.json`, `src/content/privacy.json` |
| Shared layout for inner pages | `src/components/doc.tsx` |
| Film, posters, product images | `public/assets/` |
| Design brief, storyboard | `design/` |
| Change history and decisions | `docs/BLUEPRINT-*.md` |

## Motion and accessibility

- Every section renders in its finished, readable state.
- The pinned, scroll-driven animations only run on desktop (861px and wider), and only when the visitor hasn't asked their system to reduce motion.
- On mobile, or with reduced motion on, the scenes simply stack and the progress tracker becomes a thin bar at the top.
