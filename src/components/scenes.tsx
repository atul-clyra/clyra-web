"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";

/*
 * Animated product scenes for 02 Teach, 05 Understand and 06 Personalise
 * (04 Mark lives in mark-scene.tsx and reuses these helpers).
 *
 * Every element renders in its finished, readable state. On desktop with motion
 * allowed, a pinned GSAP timeline scrubbed by scroll plays each scene from its
 * start state; on mobile or with reduced motion the finished states simply
 * stack, so nothing ever depends on JavaScript to be readable.
 */

export type Gsap = typeof import("gsap").gsap;
export type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;

const MOTION_QUERY = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";

export function useScene(ref: RefObject<HTMLElement | null>, build: (gsap: Gsap, st: ST, root: HTMLElement) => void) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let dead = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERY, () => {
        root.dataset.motion = "true";
        build(gsap, ScrollTrigger, root);
        return () => {
          root.dataset.motion = "false";
        };
      });
      revert = () => mm.revert();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => {
      dead = true;
      revert?.();
    };
    // build is a stable module-level function per scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function counter(gsap: Gsap, el: Element, from: number, duration = 1) {
  const node = el as HTMLElement;
  const to = Number(node.dataset.count ?? "0");
  const state = { v: from };
  return gsap.fromTo(
    state,
    { v: from },
    {
      v: to,
      duration,
      ease: "none",
      onUpdate: () => {
        node.textContent = String(Math.round(state.v));
      },
    },
  );
}

export function setActive(nodes: Element[], n: number) {
  nodes.forEach((el, i) => el.setAttribute("data-on", String(i === n)));
}

/* ------------------------------------------------------------------ */
/* 02 TEACH                                                            */
/* ------------------------------------------------------------------ */
const TEACH_STEPS = [
  {
    k: "Pre-read · the day before",
    t: "Arrive ready.",
    b: "Golden notes, a summary, a podcast or a video, sent the day before so students arrive ready. You see who has read it.",
  },
  {
    k: "In-room · during class",
    t: "Teach from it.",
    b: "Teach mode puts the lesson on the projector: flashcards, structured content, video.",
  },
  {
    k: "Homework · after class",
    t: "Check it stuck.",
    b: "A quick quiz written by Clyra from today's topics, or your own worksheet. It unlocks once they've done the reading.",
  },
];

function buildTeach(gsap: Gsap, _st: ST, root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const steps = q("[data-step]");
  const screens = q("[data-screen]");
  const [a, b, c] = screens;

  gsap.set([b, c], { clipPath: "inset(100% 0% 0% 0%)" });
  setActive(steps, 0);

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "+=320%",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => setActive(steps, self.progress < 0.34 ? 0 : self.progress < 0.66 ? 1 : 2),
    },
  });

  // Rail fill follows the whole scene.
  tl.fromTo(q("[data-rail]"), { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 9.4 }, 0);

  // A: the pre-read assembles, is sent, and students read it.
  tl.fromTo(a.querySelectorAll("[data-row]"), { y: 22, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, stagger: 0.18, duration: 0.5 }, 0.1)
    .fromTo(a.querySelector("[data-btn]"), { scale: 1 }, { scale: 0.95, duration: 0.15, yoyo: true, repeat: 1 }, 1.0)
    .fromTo(a.querySelector("[data-l1]"), { yPercent: 0 }, { yPercent: -110, duration: 0.3 }, 1.15)
    .fromTo(a.querySelector("[data-l2]"), { yPercent: 110 }, { yPercent: 0, duration: 0.3 }, 1.15)
    .fromTo(a.querySelectorAll("[data-fill]"), { scale: 0 }, { scale: 1, stagger: 0.05, duration: 0.2, ease: "back.out(2)" }, 1.5)
    .add(counter(gsap, a.querySelector("[data-count]")!, 0, 1.1), 1.5);

  // B: the projector takes over, the card flips, the deck advances.
  tl.fromTo(b, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" }, 3.0)
    .to(a, { scale: 0.94, y: -24, duration: 0.7, ease: "power3.inOut" }, 3.0)
    .fromTo(b.querySelector("[data-flip]"), { rotationY: 0 }, { rotationY: 180, duration: 0.8, ease: "power2.inOut" }, 4.0)
    .fromTo(b.querySelector("[data-prog]"), { scaleX: 0.25 }, { scaleX: 0.5, duration: 0.6, ease: "none" }, 4.9)
    .add(counter(gsap, b.querySelector("[data-count]")!, 3, 0.6), 4.9);

  // C: homework is written, unlocks after the reading, and is set.
  tl.fromTo(c, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" }, 6.0)
    .to(b, { scale: 0.94, y: -24, duration: 0.7, ease: "power3.inOut" }, 6.0)
    .fromTo(c.querySelectorAll("[data-q]"), { scale: 0.6, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, stagger: 0.12, duration: 0.3, ease: "back.out(2)" }, 6.8)
    .fromTo(c.querySelector("[data-shackle]"), { y: 0 }, { y: -5, duration: 0.3 }, 7.6)
    .fromTo(c.querySelector("[data-lock]"), { "--lock-on": 0 }, { "--lock-on": 1, duration: 0.3 }, 7.6)
    .fromTo(c.querySelector("[data-btn]"), { scale: 1 }, { scale: 0.95, duration: 0.15, yoyo: true, repeat: 1 }, 8.2)
    .fromTo(c.querySelector("[data-l1]"), { yPercent: 0 }, { yPercent: -110, duration: 0.3 }, 8.35)
    .fromTo(c.querySelector("[data-l2]"), { yPercent: 110 }, { yPercent: 0, duration: 0.3 }, 8.35)
    .to({}, { duration: 0.8 });
}

export function SendButton({ a, b }: { a: string; b: string }) {
  return (
    <span className="c-sbtn" data-btn="">
      <span className="c-sbtn__l c-sbtn__l1" data-l1="">
        {a}
      </span>
      <span className="c-sbtn__l c-sbtn__l2" data-l2="">
        {b}
      </span>
    </span>
  );
}

export function TeachScene() {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, buildTeach);
  return (
    <section className="c-sec c-scn c-forest c-grain" data-stage="1" id="teach" ref={ref}>
      <div className="c-scn__copy">
        <p className="c-eyebrow">02 · Teach</p>
        <h2 className="c-h2">
          Before, during, <em>after</em>.
        </h2>
        <ol className="c-steps">
          <span aria-hidden="true" className="c-steps__rail">
            <i data-rail="" />
          </span>
          {TEACH_STEPS.map((s) => (
            <li data-on="true" data-step="" key={s.k}>
              <span className="c-steps__k">{s.k}</span>
              <span className="c-steps__t">{s.t}</span>
              <span className="c-steps__b">{s.b}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="c-scn__stage" aria-label="Clyra lesson flow: pre-read, teach mode, homework" role="img">
        <div className="c-dev">
          <div className="c-dev__screens">
            {/* A: Pre-read */}
            <div className="c-scr" data-screen="">
              <p className="c-scr__meta">Pre-read · Science 8A · Electricity</p>
              <p className="c-scr__title">Tomorrow's reading</p>
              <ul className="c-files">
                {[
                  ["N", "Golden notes", "Electricity"],
                  ["S", "Summary", "2 min read"],
                  ["P", "Podcast", "6 min"],
                ].map(([g, t, d]) => (
                  <li data-row="" key={t}>
                    <span className="c-files__g">{g}</span>
                    <span className="c-files__t">{t}</span>
                    <span className="c-files__d">{d}</span>
                  </li>
                ))}
              </ul>
              <SendButton a="Send to 24 students" b="Sent to 24 students" />
              <div className="c-readers">
                <p className="c-scr__meta">
                  Read so far <b data-count="19">19</b> of 24
                </p>
                <div className="c-dots">
                  {Array.from({ length: 24 }, (_, i) => (
                    <span key={i}>{i < 19 ? <i data-fill="" /> : null}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* B: Teach mode */}
            <div className="c-scr c-scr--dark" data-screen="">
              <p className="c-scr__meta">Teach mode · Science 8A</p>
              <div className="c-flash">
                <div className="c-flash__in" data-flip="">
                  <div className="c-flash__face">
                    <span className="c-scr__meta">Question</span>
                    <span className="c-flash__q">What does a resistor do?</span>
                  </div>
                  <div className="c-flash__face c-flash__back">
                    <span className="c-scr__meta">Answer</span>
                    <span className="c-flash__q">It limits how much current flows through a circuit.</span>
                  </div>
                </div>
              </div>
              <div className="c-prog">
                <span className="c-prog__bar">
                  <i data-prog="" />
                </span>
                <span className="c-scr__meta">
                  <b data-count="6">6</b> / 12 cards
                </span>
              </div>
            </div>

            {/* C: Homework */}
            <div className="c-scr" data-screen="">
              <p className="c-scr__meta">Homework · written by Clyra from today's topics</p>
              <p className="c-scr__title">Electricity quiz</p>
              <div className="c-qs">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span data-q="" key={n}>
                    {n}
                  </span>
                ))}
              </div>
              <div className="c-lock" data-lock="">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" data-shackle="" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="5" y="11" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span>Unlocks once the pre-read is done</span>
              </div>
              <p className="c-flow">
                <span className="c-scr__meta">Students will do</span>
                <b>pre-read → 5-question quiz</b>
              </p>
              <SendButton a="Set homework" b="Set for Thursday" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 UNDERSTAND                                                       */
/* ------------------------------------------------------------------ */
const U_BEATS = [
  { k: "Command Center", t: "The whole class at a glance: who's active, who's behind, what's due." },
  { k: "Learning Gaps", t: "Every answer becomes evidence, down to the topic: the gap, the cause, the fix." },
  { k: "Student impact", t: "Know which assignment actually moved each student." },
];

const ROSTER = [
  ["Aarav", 92],
  ["Maya", 81],
  ["Leo", 67],
  ["Priya", 54],
  ["Omar", 88],
] as const;

const MAYA = [55, 60, 63, 70, 74, 88, 86, 91, 94, 97];

function buildUnderstand(gsap: Gsap, _st: ST, root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const beats = q("[data-beat]");
  const [s1, s2, s3] = q("[data-screen]");

  gsap.set([s2, s3], { clipPath: "inset(100% 0% 0% 0%)" });
  setActive(beats, 0);

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => setActive(beats, self.progress < 0.33 ? 0 : self.progress < 0.66 ? 1 : 2),
    },
  });

  // 1: stats count up, rings draw, completion bars grow.
  tl.fromTo(s1.querySelectorAll("[data-tile]"), { y: 18, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.4 }, 0.1);
  s1.querySelectorAll("[data-count]").forEach((el) => tl.add(counter(gsap, el, 0, 1.2), 0.3));
  s1.querySelectorAll<SVGCircleElement>("[data-ring]").forEach((el, i) => {
    tl.fromTo(el, { strokeDashoffset: 100 }, { strokeDashoffset: Number(el.dataset.ring), duration: 0.9 }, 0.6 + i * 0.1);
  });
  tl.fromTo(s1.querySelectorAll("[data-bar]"), { scaleX: 0 }, { scaleX: 1, stagger: 0.1, duration: 0.9 }, 0.6);

  // 2: Electricity is flagged, the cause appears, students sort themselves.
  tl.fromTo(s2, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" }, 2.7)
    .to(s1, { scale: 0.94, y: -24, duration: 0.7, ease: "power3.inOut" }, 2.7)
    .fromTo(s2.querySelectorAll("[data-topic]"), { scaleX: 0 }, { scaleX: 1, stagger: 0.08, duration: 0.6 }, 3.3)
    .fromTo(s2.querySelector("[data-crit]"), { scale: 0.4, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2.4)" }, 3.9)
    .fromTo(s2.querySelector("[data-why]"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "none" }, 4.2)
    .fromTo(s2.querySelectorAll("[data-chip]"), { y: -36, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.4, ease: "back.out(1.6)" }, 4.7)
    .fromTo(s2.querySelector("[data-next]"), { scale: 0.85, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, duration: 0.3 }, 5.3);

  // 3: Maya's chart plots itself; the reteach quiz is called out.
  tl.fromTo(s3, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" }, 5.9)
    .to(s2, { scale: 0.94, y: -24, duration: 0.7, ease: "power3.inOut" }, 5.9)
    .fromTo(s3.querySelector("[data-classline]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "none" }, 6.5)
    .fromTo(s3.querySelector("[data-mayaline]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "none" }, 6.5)
    .fromTo(s3.querySelectorAll("[data-pt]"), { scale: 0 }, { scale: 1, stagger: 0.1, duration: 0.2, ease: "back.out(3)", transformOrigin: "50% 50%" }, 6.5)
    .fromTo(s3.querySelector("[data-callout]"), { y: 10, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, duration: 0.35 }, 7.7)
    .to({}, { duration: 0.8 });
}

export function UnderstandScene() {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, buildUnderstand);
  const W = 400;
  const H = 180;
  const px = (i: number) => 24 + (i * (W - 48)) / (MAYA.length - 1);
  const py = (v: number) => H - 16 - ((v - 40) / 60) * (H - 36);
  const classPts = MAYA.map((_, i) => `${px(i)},${py(48 + i * 4)}`).join(" ");
  const mayaPts = MAYA.map((v, i) => `${px(i)},${py(v)}`).join(" ");

  return (
    <section className="c-sec c-scn c-mist" data-stage="4" id="understand" ref={ref}>
      <div className="c-scn__copy">
        <p className="c-eyebrow">05 · Understand</p>
        <h2 className="c-h2">
          See the gap, the <em>cause</em>, the fix.
        </h2>
        <ol className="c-steps c-steps--light">
          {U_BEATS.map((b) => (
            <li data-beat="" data-on="true" key={b.k}>
              <span className="c-steps__k">{b.k}</span>
              <span className="c-steps__b">{b.t}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="c-scn__stage" aria-label="Clyra analytics: command center, learning gaps and student impact" role="img">
        <div className="c-dev c-dev--light">
          <div className="c-dev__screens">
            {/* 1: Command Center */}
            <div className="c-scr" data-screen="">
              <p className="c-scr__meta">Command Center · Science 8A</p>
              <div className="c-tiles">
                {[
                  ["Active students", 24, ""],
                  ["Assigned", 104, ""],
                  ["Need attention", 3, "alert"],
                  ["Avg completion", 78, "%"],
                ].map(([l, v, s]) => (
                  <div className={s === "alert" ? "c-tile c-tile--alert" : "c-tile"} data-tile="" key={String(l)}>
                    <span className="c-scr__meta">{l}</span>
                    <span className="c-tile__v">
                      <b data-count={v}>{v}</b>
                      {s === "%" ? "%" : ""}
                    </span>
                  </div>
                ))}
              </div>
              <ul className="c-roster">
                {ROSTER.map(([n, v]) => (
                  <li key={n}>
                    <svg aria-hidden="true" viewBox="0 0 36 36" width="30" height="30">
                      <circle cx="18" cy="18" r="14" className="c-ring__t" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        className={v < 60 ? "c-ring__f c-ring__f--alert" : "c-ring__f"}
                        data-ring={100 - v}
                        pathLength={100}
                        style={{ strokeDashoffset: 100 - v }}
                      />
                    </svg>
                    <span className="c-roster__n">{n}</span>
                    <span className="c-roster__bar">
                      <i data-bar="" style={{ width: `${v}%` }} className={v < 60 ? "is-alert" : undefined} />
                    </span>
                    <span className="c-roster__v">{v}%</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2: Learning Gaps */}
            <div className="c-scr" data-screen="">
              <p className="c-scr__meta">Learning Gaps · Science 8A</p>
              <ul className="c-topics">
                {[
                  ["Electricity", 38, true],
                  ["Forces", 64, false],
                  ["Magnetism", 71, false],
                  ["Photosynthesis", 83, false],
                ].map(([t, v, crit]) => (
                  <li key={String(t)}>
                    <span className="c-topics__t">{t}</span>
                    <span className="c-topics__bar">
                      <i data-topic="" className={crit ? "is-alert" : undefined} style={{ width: `${v}%` }} />
                    </span>
                    {crit ? (
                      <span className="c-crit" data-crit="">
                        Critical · 9 of 24
                      </span>
                    ) : (
                      <span className="c-topics__v">{v}%</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="c-why" data-why="">
                <span className="c-scr__meta">Why it's happening</span>
                <span>Students are mixing up how current flows in series and parallel circuits.</span>
              </div>
              <div className="c-cols">
                {[
                  ["Needs help", ["Aarav", "Leo"], "alert"],
                  ["Watch", ["Omar"], "watch"],
                  ["On track", ["Priya", "Maya"], "ok"],
                ].map(([h, names, tone]) => (
                  <div className="c-cols__c" key={String(h)}>
                    <span className="c-scr__meta">{h}</span>
                    {(names as string[]).map((n) => (
                      <span className={`c-chip c-chip--${String(tone)}`} data-chip="" key={n}>
                        {n}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <span className="c-next" data-next="">
                What to do next: Reteach pack
              </span>
            </div>

            {/* 3: Student impact */}
            <div className="c-scr" data-screen="">
              <p className="c-scr__meta">Student impact · Maya</p>
              <p className="c-scr__title">Maya's scores over time</p>
              <svg className="c-chart" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
                {[0, 1, 2, 3].map((g) => (
                  <line className="c-chart__grid" key={g} x1="16" x2={W - 8} y1={20 + g * 44} y2={20 + g * 44} />
                ))}
                <polyline className="c-chart__class" data-classline="" pathLength={1} points={classPts} />
                <polyline className="c-chart__maya" data-mayaline="" pathLength={1} points={mayaPts} />
                {MAYA.map((v, i) => (
                  <circle
                    className={i === 5 ? "c-chart__pt c-chart__pt--hi" : "c-chart__pt"}
                    cx={px(i)}
                    cy={py(v)}
                    data-pt=""
                    key={i}
                    r={i === 5 ? 6 : 4}
                  />
                ))}
              </svg>
              <div className="c-chart__legend">
                <span>
                  <i className="c-lg c-lg--maya" /> Maya
                </span>
                <span>
                  <i className="c-lg c-lg--class" /> Class average
                </span>
              </div>
              <p className="c-callout" data-callout="">
                <b>Reteach quiz · +14</b> The assignment that closed her Electricity gap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 06 PERSONALISE                                                      */
/* ------------------------------------------------------------------ */
const NAMES = [
  "Aarav", "Maya", "Leo", "Priya", "Omar", "Zara", "Noah", "Ana", "Ravi", "Ella", "Sami", "Ines",
  "Kai", "Lena", "Theo", "Amir", "Nia", "Jonah", "Mei", "Yusuf", "Lucia", "Ben", "Tara", "Ivo",
];
const TOPICS = ["Electricity", "Forces", "Circuits", "Energy", "Waves", "Magnets"];
const N = 24;

function fanPos(i: number) {
  const t = (-64 + (i * 128) / (N - 1)) * (Math.PI / 180);
  return { x: 290 * Math.sin(t), y: 190 - 290 * Math.cos(t), r: (t * 180) / Math.PI };
}
function ringPos(i: number) {
  const p = ((i * 360) / N) * (Math.PI / 180);
  return { x: 178 * Math.sin(p), y: -178 * Math.cos(p), r: (i * 360) / N };
}

function buildPersonalise(gsap: Gsap, _st: ST, root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const sheets = q("[data-sheet]");
  const master = q("[data-master]")[0];

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: { trigger: root, start: "top top", end: "+=280%", pin: true, scrub: 0.6 },
  });

  // Start: one paper, stacked.
  sheets.forEach((el, i) => gsap.set(el, { "--x": i * 0.3, "--y": -i * 0.3, "--r": 0, "--s": 1 }));
  gsap.set(master, { autoAlpha: 1 });

  tl.to(master, { scale: 0.9, autoAlpha: 0, duration: 0.5 }, 0.9);
  // Fan out: one paper per student.
  sheets.forEach((el, i) => {
    const f = fanPos(i);
    tl.to(el, { "--x": f.x, "--y": f.y, "--r": f.r, duration: 1.6 }, 0.9 + i * 0.02);
  });
  // Fold back into the loop.
  sheets.forEach((el, i) => {
    const r = ringPos(i);
    tl.to(el, { "--x": r.x, "--y": r.y, "--r": r.r, "--s": 0.62, duration: 1.6 }, 3.6 + i * 0.015);
  });
  tl.fromTo(q("[data-loopring]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "none" }, 5.2)
    .fromTo(q("[data-loopcenter]"), { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 5.6)
    .to({}, { duration: 0.8 });
}

export function PersonaliseScene() {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, buildPersonalise);
  return (
    <section className="c-sec c-scn c-forest c-grain" data-stage="5" id="personalise" ref={ref}>
      <div className="c-scn__copy">
        <p className="c-eyebrow">06 · Personalise</p>
        <h2 className="c-h2">
          One class. <em>Twenty-four</em> papers.
        </h2>
        <p className="c-body">
          Start from your class's gaps and Clyra writes a paper for every student, aimed at their own weak topics, with
          difficulty tuned to them.
        </p>
        <p className="c-note">Or use Smart Assign: reteach, stretch, catch-up or an exam-prep pack in one click.</p>
        <ul className="c-monolist">
          <li>Reteach</li>
          <li>Stretch</li>
          <li>Catch-up</li>
          <li>Exam prep</li>
        </ul>
      </div>

      <div className="c-scn__stage c-fan" aria-label="One paper splitting into 24 personalised papers, then closing into the loop" role="img">
        <svg aria-hidden="true" className="c-fan__ring" viewBox="-250 -250 500 500">
          <circle cx="0" cy="0" data-loopring="" pathLength={1} r="178" />
        </svg>
        {Array.from({ length: N }, (_, i) => {
          const f = fanPos(i);
          const style = { "--x": f.x, "--y": f.y, "--r": f.r, "--s": 1 } as CSSProperties;
          return (
            <div className="c-sheet" data-sheet="" key={i} style={style}>
              <span className="c-sheet__tab" data-hi={i === 7 ? "true" : undefined} />
              <span className="c-sheet__n">{NAMES[i]}</span>
              <span className="c-sheet__t">{TOPICS[i % TOPICS.length]}</span>
              <span className="c-sheet__l" />
              <span className="c-sheet__l" />
              <span className="c-sheet__l c-sheet__l--s" />
            </div>
          );
        })}
        <div className="c-sheet c-sheet--master" data-master="">
          <span className="c-sheet__n">Science 8A</span>
          <span className="c-sheet__t">Electricity paper</span>
          <span className="c-sheet__l" />
          <span className="c-sheet__l" />
          <span className="c-sheet__l c-sheet__l--s" />
        </div>
        <p className="c-fan__center" data-loopcenter="">
          <b>24</b>
          <span>papers, one loop</span>
        </p>
      </div>
    </section>
  );
}
