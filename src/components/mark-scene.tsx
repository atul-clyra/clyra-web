"use client";

import { useRef } from "react";

import { SendButton, counter, setActive, useScene } from "@/components/scenes";
import type { Gsap, ST } from "@/components/scenes";

/*
 * 04 MARK. One submission is marked by Clyra, the teacher takes every
 * suggestion, approves, and releases marks to the class. The finished state is
 * the static render (mobile / reduced motion); desktop scrubs it from the start.
 */

const MARK_STEPS = [
  {
    k: "Clyra suggests · why",
    t: "Every answer, marked.",
    b: "Clyra marks every answer against the rubric and explains why.",
  },
  {
    k: "Use all · Approve",
    t: "You stay in charge.",
    b: "Approve, adjust, or return it for a redo. Nothing is final until you say so.",
  },
  {
    k: "Hold · Release",
    t: "Release in one go.",
    b: "Hold marks until you're ready, then release them to the class together.",
  },
];

const ANSWERS: { q: string; a: string; m: number; why?: string }[] = [
  { q: "What is the unit of electric current?", a: "Ampere", m: 5 },
  { q: "What does a resistor do in a circuit?", a: "Limits the current that flows", m: 5 },
  {
    q: "Why do bulbs in parallel stay bright?",
    a: "Each one gets the full voltage",
    m: 4,
    why: "Right idea. Doesn't mention that the current splits between branches.",
  },
  { q: "What happens when the switch is opened?", a: "The current keeps flowing", m: 1 },
  { q: "Name a good conductor.", a: "Copper", m: 5 },
];
const TOTAL = ANSWERS.reduce((sum, r) => sum + r.m, 0);

function buildMark(gsap: Gsap, _st: ST, root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const steps = q("[data-step]");
  const screen = q("[data-screen]")[0] as HTMLElement;
  const cursor = q("[data-pointer]")[0] as HTMLElement;
  const useAll = q("[data-useall]")[0];
  const approve = q("[data-approve]")[0];
  const toggle = q("[data-toggle]")[0];

  // Cursor targets are measured from the live layout, so they survive resizes.
  const at = (el: Element, axis: "x" | "y") => () => {
    const s = screen.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return axis === "x" ? r.left - s.left + r.width * 0.55 : r.top - s.top + r.height * 0.6;
  };

  setActive(steps, 0);

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "+=260%",
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => setActive(steps, self.progress < 0.38 ? 0 : self.progress < 0.7 ? 1 : 2),
    },
  });

  tl.fromTo(q("[data-rail]"), { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 8.6 }, 0);

  // 1: the answers arrive, Clyra's suggestions land, the "why" opens.
  tl.fromTo(q("[data-row]"), { y: 16, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.4 }, 0.1)
    .fromTo(q("[data-sug]"), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.14, duration: 0.3, ease: "back.out(2)" }, 0.8)
    .fromTo(q("[data-why]"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "none" }, 1.8);

  // 2: the cursor takes every suggestion, then approves.
  tl.fromTo(
    cursor,
    { x: () => screen.clientWidth * 0.5, y: () => screen.clientHeight + 20, autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.2 },
    2.9,
  )
    .to(cursor, { x: at(useAll, "x"), y: at(useAll, "y"), duration: 0.7, ease: "power3.inOut" }, 2.9)
    .fromTo(useAll, { scale: 1 }, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1 }, 3.65)
    .fromTo(q("[data-mk]"), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.25 }, 3.8)
    .fromTo(q("[data-total]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 4.3)
    .to(cursor, { x: at(approve, "x"), y: at(approve, "y"), duration: 0.6, ease: "power3.inOut" }, 4.6)
    .fromTo(approve, { scale: 1 }, { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1 }, 5.25)
    .fromTo(approve.querySelector("[data-l1]"), { yPercent: 0 }, { yPercent: -110, duration: 0.3 }, 5.4)
    .fromTo(approve.querySelector("[data-l2]"), { yPercent: 110 }, { yPercent: 0, duration: 0.3 }, 5.4)
    .add(counter(gsap, q("[data-count]")[0], 5, 0.4), 5.5);

  // 3: hold becomes release.
  tl.to(cursor, { x: at(toggle, "x"), y: at(toggle, "y"), duration: 0.6, ease: "power3.inOut" }, 6.2)
    .fromTo(toggle, { "--on": 0 }, { "--on": 1, duration: 0.3 }, 6.9)
    .fromTo(q("[data-released]"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 7.1)
    .to(cursor, { autoAlpha: 0, duration: 0.3 }, 7.8)
    .to({}, { duration: 0.8 });
}

export function MarkScene() {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, buildMark);
  return (
    <section className="c-sec c-scn c-dark c-grain" data-stage="3" id="mark" ref={ref}>
      <div className="c-scn__copy">
        <p className="c-eyebrow">04 · Mark</p>
        <h2 className="c-h2">
          Marked in seconds. <em>Approved</em> by you.
        </h2>
        <ol className="c-steps">
          <span aria-hidden="true" className="c-steps__rail">
            <i data-rail="" />
          </span>
          {MARK_STEPS.map((s) => (
            <li data-on="true" data-step="" key={s.k}>
              <span className="c-steps__k">{s.k}</span>
              <span className="c-steps__t">{s.t}</span>
              <span className="c-steps__b">{s.b}</span>
            </li>
          ))}
        </ol>
        <p className="c-note">No two students get the same paper, so copying stops working.</p>
      </div>

      <div className="c-scn__stage" aria-label="Clyra marking view: suggested marks, Use all, Approve, release marks" role="img">
        <div className="c-dev">
          <div className="c-dev__screens">
            <div className="c-scr c-mk-scr" data-screen="">
              <div className="c-mtrack">
                <p className="c-scr__meta">
                  17 of 24 handed in · <b data-count="4">4</b> to review
                </p>
                <span className="c-mtrack__bar">
                  <i style={{ transform: `scaleX(${17 / 24})` }} />
                </span>
              </div>

              <div className="c-sub">
                <div className="c-sub__head">
                  <p className="c-scr__title">Aarav · Electricity quiz</p>
                  <span className="c-scr__meta c-sub__total" data-total="">
                    {TOTAL} / {ANSWERS.length * 5}
                  </span>
                </div>
                <ol className="c-sub__rows">
                  {ANSWERS.map((r, i) => (
                    <li className="c-sub__row" data-row="" key={r.q}>
                      <span className="c-sub__n">{i + 1}</span>
                      <span className="c-sub__qa">
                        <span className="c-sub__q">{r.q}</span>
                        <span className="c-sub__a">{r.a}</span>
                        {r.why ? (
                          <span className="c-sub__why" data-why="">
                            <b>Why {r.m}/5</b> {r.why}
                          </span>
                        ) : null}
                      </span>
                      <span className={r.m <= 2 ? "c-sug c-sug--low" : "c-sug"} data-sug="">
                        Suggests {r.m}/5
                      </span>
                      <span className={r.m <= 2 ? "c-mk c-mk--low" : "c-mk"} data-mk="">
                        {r.m}/5
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="c-mbar">
                <span className="c-mbtn" data-useall="">
                  Use all
                </span>
                <span className="c-mbar__approve" data-approve="">
                  <SendButton a="Approve" b="Approved" />
                </span>
                <span className="c-tog" data-toggle="">
                  <span className="c-scr__meta">Hold</span>
                  <span className="c-tog__sw">
                    <i />
                  </span>
                  <span className="c-scr__meta">Release marks</span>
                </span>
              </div>
              <p className="c-scr__meta c-released" data-released="">
                Marks released to Science 8A
              </p>

              <svg aria-hidden="true" className="c-pointer" data-pointer="" viewBox="0 0 24 24" width="22" height="22">
                <path d="M5 3l14 8-6.2 1.4L10 19z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
