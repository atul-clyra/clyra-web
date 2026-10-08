# BLUEPRINT — Polish the Higgsfield heyclyra.com build

Source: `51a7e938-…zip` (Higgsfield export), extracted to `Clyra/Homepage/`.
Content spec: `Website/docs/website/higgsfield-prompt.md` (the master prompt).
Goal: a standalone, buildable, accurate repo ready to push to the homepage repository.

---

## 1. Audit findings (what is wrong today)

### A. Cannot build outside Higgsfield (blocker)
1. `package.json` depends on `@higgsfield/app-landing|fnf|fnf-react|quanta` as `workspace:*`; the packages are not in the zip → `npm install` fails.
2. Build scripts require `bun`; `vite.config.ts` loads the Higgsfield design-inspector; `wrangler.jsonc` targets their Workers-for-Platforms deploy.
3. ~90% of `src/` is unused template code (gallery, prompt-box, generation cards, `/app` route, `landing-content.ts`, quanta shims, tests asserting template recipes).
4. `app-meta.json` OG image + favicon point at a Higgsfield user CloudFront bucket (external, may expire).

### B. Wrong links / content bugs
5. Every "Book a demo" is `mailto:`; the live site uses `https://calendly.com/heyclyra/demo`. "Talk to us" stays mailto.
6. Nav "For Teachers / Students / Schools" all jump to the same `#doors` anchor; each should land on its own door.
7. Hero, Problem and Loop headlines lack the spec's one serif-italic word ("*Know* who got it.", "Your tools *don't*.", "The loop, *closed*.") because scene titles are plain strings.
8. Understand → Learning Gaps "Science 8A" lists **Quadratics** (a maths topic). → Magnetism.
9. Plan render shows **Quadratics** under "Science 8A · Electricity" topics. → pixel-patch to "Circuits".
10. Mark render is wrong: every row says "Clyra suggests 4/5" regardless of the mark (5/5 rows too); off-palette magenta dot; and spec wants an animated sequence (Use all → Approve → tracker fills → Hold/Release). → Replace the static image with a coded, pinned scene like Teach/Understand.
11. Understand chart: Maya's line is drawn at 45% opacity while the class average is bold — the emphasis is inverted.

### C. Visual defects
12. All 9 icon PNGs are bad crops of a sprite sheet: fragments of neighbouring icons show at top and bottom (e.g. `teachers.png` shows a book and a calendar edge). They are dark Pine strokes, nearly invisible on Ink/Forest (`filter: brightness` doesn't fix it). → Replace with inline SVG line icons, `stroke="currentColor"`, Signal dot accent.
13. Posters are 450 KB–1 MB PNGs; the hero poster is preloaded → slow LCP. → Re-encode to WebP.

### D. SEO / meta gaps
14. No canonical, `og:url`, OG image hosted locally, Organization JSON-LD, robots/sitemap pointing at heyclyra.com.

## 2. Decisions

- **Re-platform to Next.js 15 (App Router) with `output: "export"`** — the same stack the team already uses (dashboard is Next.js). It outputs fully pre-rendered static HTML (good SEO, LCP), deployable to Vercel / Netlify / Cloudflare Pages / any CDN. All site code is plain React + CSS + GSAP + Lenis, so the port is mechanical.
- Fonts via `next/font/google` (Inter Tight, Instrument Serif, IBM Plex Mono), with CSS vars feeding the existing `--f-*` tokens.
- Keep the design tokens, motion system, film assets, and copy exactly as the spec says; change only what the audit lists.
- `refs/` (storyboard, retired renders) is design source, not site code → moved to `design/refs/`, `retired/` dropped.

## 3. Target structure

```
Homepage/
  package.json            next, react, react-dom, gsap, lenis, typescript, @types/*
  next.config.mjs         output: "export", images.unoptimized, trailingSlash false
  tsconfig.json
  public/                 assets/{brand,ui,world}, favicons, og.png, robots.txt, sitemap.xml, site.webmanifest
  src/app/layout.tsx      fonts, metadata (title, desc, canonical, OG, twitter, icons, manifest), JSON-LD
  src/app/page.tsx        composition (same order as index.tsx)
  src/app/not-found.tsx   "This page is not part of the loop."
  src/app/globals.css     = site.css + scenes.css + scroll-scrub.css (tokens unchanged)
  src/components/         site.tsx, scenes.tsx, mark-scene.tsx, icons.tsx, motion.ts, scroll-scrub.tsx, scenes-data.ts
  design/refs/            storyboard.png, icons-sheet.png, design-brief.md
  docs/BLUEPRINT-polish.md
  README.md               run / build / deploy, content map
  .gitignore
```

## 4. Steps

1. Scaffold `package.json`, `next.config.mjs`, `tsconfig.json`, `.gitignore`, `next-env.d.ts`.
2. Move `app/public/*` → `public/` (minus `presets/`, `assets/landing/`, `assets/icons/`). Download the OG image from `app-meta.json` → `public/og.png`.
3. Assets: re-encode the 6 posters to WebP (q≈82) with Pillow; patch the Plan render text; drop `mark-laptop.webp`.
4. Port `scroll-scrub.tsx` ("use client"); widen `title` to `ReactNode`; add italic words in `scenes-data.tsx`.
5. Port `site.tsx`: LINKS.demo → Calendly (new tab, rel noopener); doors get ids `for-teachers|for-students|for-schools`; nav anchors point at them; icon `<img>` → `<Icon name>`.
6. Write `icons.tsx`: plan, ask, material, decide, fair, teachers, students, schools, loop — 24px grid, 1.5 stroke, currentColor + Signal node.
7. Port `scenes.tsx` ("use client"); Quadratics → Magnetism; Maya line full opacity, class line dashed sage.
8. New `MarkScene` (coded, pinned 260%): submission card with 5 answers whose marks *match* the suggestions (with one adjusted row), "why" chip, Use all → Approve presses, tracker 12→17 of 24, Hold→Release toggle. Static finished state for mobile / reduced motion. Same `useScene` helper (exported from scenes.tsx).
9. `motion.ts` unchanged except SSR-safe import paths.
10. `layout.tsx` metadata + JSON-LD; `robots.txt`, `sitemap.xml`.
11. `npm install && npm run build` → must pass type-check and export to `out/`.
12. Verify: serve `out/`, Playwright screenshots at 1440×900 and 390×844 across every section (scrolling through pins) + console-error check + link audit (every href resolves to a real target). Fix and repeat until clean.
13. `git init` + first commit in `Homepage/` (no push — no remote yet).

## 5. Acceptance

- `npm run build` green; `out/index.html` contains every section's copy (pre-rendered).
- No console errors; no broken anchors; Book a demo → Calendly everywhere.
- Icons crisp on dark and light; no sprite fragments.
- Copy matches the spec; all data consistent (Science topics only, marks consistent).
- Mobile: no horizontal scroll, scenes stack, spine becomes top bar.

## 6. Execution log (2026-10-08)

All steps 1–13 done. Additional defects found during screenshot verification and fixed:
- Swap-label buttons ("Set homework", "Approve") rendered blank: GSAP inherited the CSS `translateY(-110%)` as a pixel offset. The offset now applies only to the static render.
- Closing "Get started" text was invisible (bone on bone; `.c-site a` reset beat `.c-closestart`).
- Loop spine overlapped the Practise grid, and turned muddy on light rooms. Practise now clears it, and the spine has a light-room variant.
- "Twenty-/four" hyphen break and the gap before full stops after italic words. Accent words are now `nowrap` with no right padding.
- Mark copy clipped on 900px-tall laptops. Pinned-scene type tightens on short viewports.
- Door headings misaligned across the three columns.
- The `og.png` from Higgsfield was their marketplace card with Higgsfield branding. Replaced it with a 1200×630 Clyra card.

Verified: `next build` green; desktop 1440×900 and mobile 390×844 have no console errors, no failed requests, no broken anchors, and no horizontal scroll.
