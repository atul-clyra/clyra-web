# Clyra marketing site: design brief

**Design read:** for school leaders and teachers evaluating a whole-school system; register is quiet confidence, a private-bank or luxury-watch launch that happens to be about learning.

**Concept spine:** "The loop, closed." A luminous ring is the object of the whole page. The hero film breaks the ring into five drifting arcs (five disconnected tools) and closes it again; a fixed loop spine then lights its six stages (Plan, Teach, Practise, Mark, Understand, Personalise) as the visitor moves through the product chapters, and the closing scene shows the ring complete.

**Delivery tier:** cinema (Lenis + GSAP ScrollTrigger bridge, scroll-scrubbed film hero, pinned/horizontal chapters).

**Locked palette (user's explicit brand tokens, overriding default bans):**
Ink #0C120F, Forest #16302A, Pine #24493D (primary), Moss #4F7A66, Sage #9DB3A7, Mist #E6ECE8, Bone #F5F3EE, Signal #C8DFA0 (one highlight per screen max), Alert #C2614F (gaps/at-risk data only). Defense: suppressed deep greens read as calm, adult and institutional; alternating Ink/Forest and Bone/Mist rooms give the scroll its rhythm. Signal is the single accent.

**Locked type (user-specified):** Display Inter Tight 600/700, tracking -0.04em. Editorial accent: Instrument Serif italic, one word per headline (user named it explicitly; it is the brand's editorial voice). Body Inter Tight 400. Data/labels IBM Plex Mono uppercase 11-12px.

Animation mode: animated-website

**Journey shape:** single-shot (one ~15s film of the ring; one subject seen ever closer).
**Journey (chapters over the film):**
1. Hero: "Plan it. Teach it. Know who got it." Ring floats in the dark, six faint nodes. CTAs Book a demo / See how it works.
2. Problem: "Teaching runs in a loop. Your tools don't." The ring splits into five arcs drifting apart. Tags: Calendar, Docs, LMS, Spreadsheet, Chat.
3. The loop, closed: "One loop. Teacher in control." Arcs lock back into one ring; camera pushes in; six nodes light. Tags: the six stages.
**World grammar:** seamless near-black green void #0C120F, 2% grain, soft Pine radial glow, frosted glass + brushed metal ring, one rim light, pale Signal inner glow, slow constant motion, locked exposure, no text.
**Mobile framing:** ring kept center-safe; 720p mobile encode; copy sits bottom over a gradient.
**Delivery budget:** desktop clips <= 32 MiB, mobile <= 16 MiB.

**Section plan (after the film):** (user-specified scene order; eyebrows per scene are the user's explicit copy and override the eyebrow ration)
- 01 PLAN (Ink): split, laptop render right, copy left.
- 02 TEACH (Forest): horizontal scroll track of three tall panels.
- 03 PRACTISE (Bone): centered device composition + mono capability list.
- 04 MARK (Ink): pinned full-bleed device with stepped captions.
- 05 UNDERSTAND (Mist): pinned three-beat tablet sequence (crossfade stack).
- 06 PERSONALISE (Forest): full-bleed fan image, headline overlay.
- Ask Clyra (Ink): wide split chat render with two captions.
- Trust (Bone): three full-width statements, one per screen.
- Three doors (Ink/Forest/Bone columns, hover expands) + curricula strip.
- Closing (Ink): film's final frame as background, "Close the loop."
- Footer (Ink).
A fixed side loop spine (SVG ring with six labelled nodes) is visible through 01-06; on mobile it becomes a thin top progress bar.

**Asset plan:** storyboard, single-shot film (+ mobile encode + posters), 11 product renders (plan laptop, three teach panels, practise phone+tablet, mark laptop, three understand tablets, personalise fan, ask chat), 9-icon line set, the client's own logo (upscaled + traced to SVG), head kit derived from the logo, launch cover/OG/favicon.

**CTA inventory:**
- Nav "Book a demo": Pine pill, magnetic hover.
- Nav "Log in": text link with Signal underline grow.
- Hero "Book a demo": large Pine block with arrow that slides on hover.
- Hero "See how it works": hairline outline, ring icon rotates a quarter on hover.
- Door CTAs (Book a demo / Start free / Talk to us): bottom-row text with expanding rule.
- Closing "Get started": Bone filled block on Ink, arrow nudge; "Book a demo" outline twin.
