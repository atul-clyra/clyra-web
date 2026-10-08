import type { ReactNode } from "react";

import { Icon } from "@/components/icons";

/* ------------------------------------------------------------------ */
/* Links                                                               */
/* ------------------------------------------------------------------ */
// The Clyra app. Production by default; set NEXT_PUBLIC_APP_URL at build time to preview
// against another environment (e.g. http://localhost:3000 for a local dashboard).
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://app.heyclyra.com").replace(/\/$/, "");

export const LINKS = {
  demo: "/book-a-demo/",
  talk: "mailto:hi@heyclyra.com?subject=Clyra%20for%20our%20school",
  login: `${APP_URL}/login`,
  register: `${APP_URL}/register`,
  contact: "mailto:hi@heyclyra.com",
};

export const STAGES = [
  { id: "plan", label: "Plan" },
  { id: "teach", label: "Teach" },
  { id: "practise", label: "Practise" },
  { id: "mark", label: "Mark" },
  { id: "understand", label: "Understand" },
  { id: "personalise", label: "Personalise" },
] as const;

function Arrow() {
  return (
    <svg aria-hidden="true" className="c-arrow" viewBox="0 0 20 20" width="18" height="18">
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */
export function Wordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="c-wordmark">
      <img
        alt=""
        height={28}
        src={tone === "light" ? "/assets/brand/clyra-mark-light.svg" : "/assets/brand/clyra-mark.svg"}
        width={22}
      />
      <span>CLYRA</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Nav + CTAs (each CTA owns its own component and interaction)        */
/* ------------------------------------------------------------------ */
function NavDemo() {
  return (
    <a className="c-navdemo js-mag" href={LINKS.demo}>
      Book a demo
    </a>
  );
}

/** `home` = on the homepage, anchors stay in-page; elsewhere they lead back to "/". */
export function SiteNav({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  return (
    <header className="c-nav" data-nav="" data-solid={home ? undefined : "true"}>
      <a aria-label="Clyra home" className="c-nav__brand" href={home ? "#top" : "/"}>
        <Wordmark />
      </a>
      <nav aria-label="Primary" className="c-nav__links">
        <a href={`${base}#for-teachers`}>For Teachers</a>
        <a href={`${base}#for-students`}>For Students</a>
        <a href={`${base}#for-schools`}>For Schools</a>
        <a href={`${base}#plan`}>How it works</a>
      </nav>
      <div className="c-nav__end">
        <a className="c-navlogin" href={LINKS.login}>
          Log in
        </a>
        <NavDemo />
      </div>
    </header>
  );
}

export function HeroActions() {
  return (
    <>
      <a className="c-herodemo js-mag" href={LINKS.demo}>
        <span>Book a demo</span>
        <Arrow />
      </a>
      <a className="c-herohow" href="#plan">
        <svg aria-hidden="true" className="c-herohow__ring" viewBox="0 0 20 20" width="16" height="16">
          <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeDasharray="8 3" strokeWidth="1.5" />
        </svg>
        <span>See how it works</span>
      </a>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Loop spine                                                          */
/* ------------------------------------------------------------------ */
export function LoopSpine() {
  const r = 34;
  return (
    <aside aria-label="Where you are in the loop" className="c-spine" data-spine="" data-active="-1">
      <svg aria-hidden="true" className="c-spine__ring" viewBox="0 0 100 100">
        <circle className="c-spine__track" cx="50" cy="50" r={r} />
        <circle className="c-spine__fill" cx="50" cy="50" r={r} pathLength={6} />
        {STAGES.map((s, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              className="c-spine__node"
              cx={50 + r * Math.cos(a)}
              cy={50 + r * Math.sin(a)}
              data-i={i}
              key={s.id}
              r="4.2"
            />
          );
        })}
      </svg>
      <ol className="c-spine__list">
        {STAGES.map((s, i) => (
          <li data-i={i} key={s.id}>
            <a href={`#${s.id}`}>
              <span className="c-spine__num">0{i + 1}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="c-spine__bar">
        {STAGES.map((s, i) => (
          <span data-i={i} key={s.id} />
        ))}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="c-eyebrow">{children}</p>;
}

function Shot({ src, alt, className = "", w, h }: { src: string; alt: string; className?: string; w: number; h: number }) {
  return <img alt={alt} className={className} decoding="async" height={h} loading="lazy" src={src} width={w} />;
}

/* ------------------------------------------------------------------ */
/* 01 PLAN                                                             */
/* ------------------------------------------------------------------ */
export function PlanSection() {
  return (
    <section className="c-sec c-plan c-dark c-grain" data-stage="0" id="plan">
      <div className="c-plan__copy">
        <Icon className="c-sec__icon" name="plan" />
        <Eyebrow>01 · Plan</Eyebrow>
        <h2 className="c-h2 js-rise">
          Your week, <em>planned</em> in minutes.
        </h2>
        <p className="c-body">
          Pick the chapter. Clyra lists the topics your class is weakest on and builds the lesson from your own
          material.
        </p>
        <p className="c-note">Your pacing per class, so you can see who's falling behind.</p>
        <ul className="c-monolist">
          <li>Pre-read</li>
          <li>In-room</li>
          <li>Homework</li>
        </ul>
      </div>
      <div className="c-plan__media js-par">
        <Shot
          alt="Clyra Schedule week view with a Science lesson opened into pre-read, in-room and homework moments, topics listed weakest first"
          h={1018}
          src="/assets/ui/plan-laptop.webp"
          w={1800}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 PRACTISE                                                         */
/* ------------------------------------------------------------------ */
const PRACTISE = [
  ["Upload anything", "Notes, a PDF, a lecture recording, a YouTube link."],
  [
    "Study material, made for you",
    "Golden notes, a summary, flashcards, mind maps, structured lessons, a podcast and a video.",
  ],
  [
    "15 question formats",
    "From MCQ and fill-in-the-blank to numerical, multi-step and diagram questions, plus mock exams.",
  ],
  ["Gap by gap", "Personalised practice on their weak topics, and a step-by-step plan to close each gap."],
];

export function PractiseSection() {
  return (
    <section className="c-sec c-practise c-bone" data-stage="2" id="practise">
      <div className="c-practise__head">
        <Eyebrow>03 · Practise</Eyebrow>
        <h2 className="c-h2 js-rise">
          Every student gets a <em>study space</em>.
        </h2>
        <p className="c-body">Homework from their teacher. Practice that adapts to them. One place.</p>
      </div>
      <div className="c-practise__media js-par">
        <Shot
          alt="Student phone showing the week, due homework and an Impact card, with a tablet showing a Photosynthesis mind map and flashcard"
          h={1344}
          src="/assets/ui/practise-devices.webp"
          w={1800}
        />
      </div>
      <dl className="c-practise__grid">
        {PRACTISE.map(([t, d]) => (
          <div key={t}>
            <dt>{t}</dt>
            <dd>{d}</dd>
          </div>
        ))}
      </dl>
      <p className="c-strip" aria-label="Student capabilities">
        Study material from your notes <i>·</i> 15 practice formats <i>·</i> Mock exams <i>·</i> Gap-by-gap study steps{" "}
        <i>·</i> Rewards and leaderboard
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ask Clyra                                                           */
/* ------------------------------------------------------------------ */
export function AskSection() {
  return (
    <section className="c-sec c-ask c-dark c-grain" id="ask">
      <Icon className="c-sec__icon" name="ask" />
      <h2 className="c-h2 c-h2--xl c-ask__title js-rise">
        Just <em>ask</em>.
      </h2>
      <div className="c-ask__media js-par">
        <Shot
          alt="Two phones: a teacher asking who is at risk in Science, and a student asking to be quizzed on their weakest topic"
          h={1018}
          src="/assets/ui/ask-chat.webp"
          w={1800}
        />
      </div>
      <div className="c-ask__cols">
        <div>
          <p className="c-ask__who">Teacher</p>
          <p className="c-ask__q">"Who is at risk in Science this week?"</p>
          <p className="c-ask__q">"Homework status for 8th A"</p>
        </div>
        <div>
          <p className="c-ask__who">Student</p>
          <p className="c-ask__q">"Quiz me on my weakest topic"</p>
          <p className="c-ask__q">"Make me a study plan for Friday's test"</p>
        </div>
      </div>
      <p className="c-body c-ask__line">
        Clyra knows your classes, your homework and your results, and answers with reports, not paragraphs.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust                                                               */
/* ------------------------------------------------------------------ */
const TRUST = [
  {
    icon: "material" as const,
    h: (
      <>
        Grounded in <em>your</em> material.
      </>
    ),
    b: "Everything is built from your school's content. Clyra doesn't invent.",
  },
  {
    icon: "decide" as const,
    h: (
      <>
        The teacher <em>decides</em>.
      </>
    ),
    b: "Clyra suggests marks, plans and next steps. Nothing reaches students until you send it.",
  },
  {
    icon: "fair" as const,
    h: (
      <>
        Fair by <em>design</em>.
      </>
    ),
    b: "A unique paper per student, plagiarism and AI-writing checks, and essays marked on structure and argument, not keywords.",
  },
];

export function TrustSection() {
  return (
    <section className="c-sec c-trust c-bone" id="trust">
      <p className="c-trust__label">Built for schools</p>
      {TRUST.map((t) => (
        <div className="c-trust__item" key={t.icon}>
          <Icon className="c-trust__icon" name={t.icon} size={72} />
          <h2 className="c-h2 js-rise">{t.h}</h2>
          <p className="c-body">{t.b}</p>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Three doors                                                         */
/* ------------------------------------------------------------------ */
function DoorLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="c-doorlink" href={href}>
      <span>{children}</span>
      <i aria-hidden="true" />
    </a>
  );
}

export function DoorsSection() {
  return (
    <section className="c-doors" id="doors">
      <div className="c-doors__row">
        <article className="c-door c-door--teachers" id="for-teachers">
          <Icon className="c-door__icon" name="teachers" size={56} />
          <h3 className="c-door__who">For Teachers</h3>
          <p className="c-door__line">Plan, teach, mark and personalise in one place.</p>
          <ul className="c-door__list">
            <li>Schedule</li>
            <li>Homework & marking</li>
            <li>Learning Gaps</li>
            <li>Class Pulse</li>
            <li>Ask Clyra</li>
          </ul>
          <DoorLink href={LINKS.demo}>Book a demo</DoorLink>
        </article>
        <article className="c-door c-door--students" id="for-students">
          <Icon className="c-door__icon" name="students" size={56} />
          <h3 className="c-door__who">For Students</h3>
          <p className="c-door__line">Your notes, your practice, your tutor.</p>
          <ul className="c-door__list">
            <li>Study material from any upload</li>
            <li>15 practice formats</li>
            <li>Mock exams</li>
            <li>Gap-by-gap study steps</li>
            <li>Ask Clyra</li>
          </ul>
          <DoorLink href={LINKS.register}>Start free</DoorLink>
        </article>
        <article className="c-door c-door--schools" id="for-schools">
          <Icon className="c-door__icon" name="schools" size={56} />
          <h3 className="c-door__who">For Schools</h3>
          <p className="c-door__line">One system across every class.</p>
          <ul className="c-door__list">
            <li>Cohort analytics</li>
            <li>Course materials</li>
            <li>Curriculum-aligned</li>
            <li>Fast deployment</li>
          </ul>
          <DoorLink href={LINKS.talk}>Talk to us</DoorLink>
        </article>
      </div>
      <p className="c-curricula" aria-label="Supported curricula">
        IB <i>·</i> A-Level <i>·</i> AP <i>·</i> CBSE <i>·</i> GCSE <i>·</i> IGCSE <i>·</i> SAT <i>·</i> ACT <i>·</i>{" "}
        University
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing + footer                                                    */
/* ------------------------------------------------------------------ */
export function ClosingSection() {
  return (
    <section className="c-closing c-grain" id="close">
      <img alt="" className="c-closing__bg js-zoom" decoding="async" loading="lazy" src="/assets/world/closing.webp" />
      <div className="c-closing__copy">
        <Icon className="c-closing__loop" name="loop" size={56} />
        <h2 className="c-h2 c-h2--xl js-rise">
          Close the <em>loop</em>.
        </h2>
        <p className="c-body">Every lesson, every student, every step.</p>
        <div className="c-closing__ctas">
          <a className="c-closestart js-mag" href={LINKS.register}>
            Get started <Arrow />
          </a>
          <a className="c-closedemo" href={LINKS.demo}>
            Book a demo
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  return (
    <footer className="c-footer">
      <div className="c-footer__brand">
        <Wordmark />
        <p>The teaching and learning loop for modern schools.</p>
      </div>
      <nav aria-label="Product" className="c-footer__col">
        <p>Product</p>
        <a href={`${base}#for-teachers`}>For Teachers</a>
        <a href={`${base}#for-students`}>For Students</a>
        <a href={`${base}#for-schools`}>For Schools</a>
        <a href={`${base}#plan`}>How it works</a>
      </nav>
      <nav aria-label="Company" className="c-footer__col">
        <p>Company</p>
        <a href="/terms-conditions/">Terms & Conditions</a>
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href={LINKS.contact}>Contact (hi@heyclyra.com)</a>
        <a href="/careers/">Careers</a>
        <a href="/security/">Security</a>
      </nav>
      <nav aria-label="Social" className="c-footer__col">
        <p>Social</p>
        <a href="https://www.instagram.com/heyclyra">Instagram</a>
        <a href="https://www.tiktok.com/@heyclyra">TikTok</a>
        <a href="https://www.linkedin.com/company/heyclyra">LinkedIn</a>
        <a href="https://x.com/heyclyra">X</a>
        <a href="https://www.youtube.com/@heyclyra">YouTube</a>
      </nav>
      <p className="c-footer__copy">© 2026 Clyra</p>
    </footer>
  );
}

export function CursorDot() {
  return <div aria-hidden="true" className="c-cursor" data-cursor="" />;
}
