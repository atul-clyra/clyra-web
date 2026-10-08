# BLUEPRINT — Book a demo page (replaces the Calendly link)

User request (2026-10-08): a good-looking Book a Demo form instead of the Calendly link. The team
will build the backend themselves; the page must be ready for it.

## Page: `/book-a-demo/`
- `DocShell` (same nav and footer). Ink header: eyebrow "BOOK A DEMO", title "See the loop, *closed*.", lead copy.
- Body (Bone grid), two columns:
  - **Form card (left, 7fr)**
    - Full name\*, work email\*, role\* (select), school / institution\*
    - Country (select, from countries.json), phone (optional, dial code + number)
    - School size (segmented chips: Under 250 · 250–1,000 · 1,000–3,000 · 3,000+)
    - Curricula (multi-select chips: IB · A-Level · AP · CBSE · GCSE · IGCSE · SAT/ACT · University · Other)
    - What they'd like to see (multi-select chips: Planning & teaching · Homework & marking · Learning gaps & analytics · Personalised practice · Ask Clyra · Whole-school rollout)
    - Preferred time (chips: Morning · Afternoon · Evening, plus the visitor's detected time zone)
    - Anything else (textarea)
    - Hidden honeypot field `website`
    - Consent line, then the submit button "Request my demo"
  - **Aside (right, 4fr, sticky):** "What to expect" with 3 steps:
    1. We reply within one working day.
    2. A 30-minute walkthrough on your own subjects.
    3. A pilot plan for your classes.
    
    Below the steps: "Prefer email? hi@heyclyra.com".
- **Validation:** client side. The required fields must be filled, the email must look valid, and at least one interest must be chosen. Errors show inline in Alert, and focus moves to the first error.
- **Success state:** the card is replaced by a confirmation: "Thanks, {first name}. We'll be in touch within one working day." plus a "Back to the homepage" link.

## Submission (backend owned by the team)
- `NEXT_PUBLIC_DEMO_ENDPOINT` (build-time env) is the URL to POST JSON to. The contract is documented in `docs/DEMO-REQUESTS.md`: the backend emails the details **from no-reply@heyclyra.com to aditya@heyclyra.com and rohit@heyclyra.com**.
- **Until it's set**, leads must not be lost. On submit, the page opens the visitor's email app with a pre-filled message addressed to aditya@heyclyra.com and rohit@heyclyra.com containing every field, then shows the success state with a note to press send.

## Wiring
- `LINKS.demo` → `/book-a-demo/`. Drop `target=_blank` from the nav, hero and closing demo CTAs; the teachers door follows `LINKS.demo`.
- Sitemap: add `/book-a-demo/`. `.env.example`: document `NEXT_PUBLIC_DEMO_ENDPOINT`.

## Verify
- Build. Screenshots at desktop and mobile: empty state, validation errors, filled state.
- Fallback path: a submit with no endpoint builds the right `mailto:` (intercepted in the test, not opened).
- Endpoint path: a stubbed endpoint (Playwright route) gets the exact JSON contract, and the success state shows.
- Every "Book a demo" across the site resolves to `/book-a-demo/`. No console errors.
