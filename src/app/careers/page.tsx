import type { Metadata } from "next";

import { CareersForm } from "@/components/careers-form";
import { DocHeader, DocShell } from "@/components/doc";

export const metadata: Metadata = {
  title: "Careers | Join the team building modern school infrastructure",
  description:
    "We're building tools that help schools spot every knowledge gap, support every learner, and give staff time back for the work that matters.",
  alternates: { canonical: "/careers/" },
};

const WHY = [
  "Work on products used by students, educators, and school leaders every day.",
  "Help shape a platform grounded in curriculum, ethics, and measurable outcomes.",
  "Build alongside a small team moving quickly on meaningful education problems.",
];

export default function CareersPage() {
  return (
    <DocShell>
      <DocHeader
        eyebrow="Careers"
        lead="We're building tools that help schools spot every knowledge gap, support every learner, and give staff time back for the work that matters."
        title={
          <>
            Join the team building modern <em>school</em> infrastructure.
          </>
        }
      />
      <section className="c-docbody c-bone">
        <p className="c-eyebrow">Why join Clyra</p>
        <ol className="c-why3">
          {WHY.map((t, i) => (
            <li key={t}>
              <span className="c-why3__n">0{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>

        <div className="c-apply" id="apply">
          <div className="c-apply__form">
            <h2 className="c-apply__title">Apply now</h2>
            <p className="c-apply__sub">Fill in your details and upload your resume as a PDF.</p>
            <CareersForm />
          </div>
          <aside className="c-apply__aside">
            <p className="c-eyebrow">Direct contact</p>
            <h2 className="c-apply__title">Prefer to email us?</h2>
            <p className="c-apply__sub">
              You can still send your application directly if you prefer. Include your role of interest and your
              resume PDF.
            </p>
            <a className="c-docbtn c-docbtn--ghost" href="mailto:hi@heyclyra.com?subject=Careers%20Application%20-%20Clyra">
              hi@heyclyra.com
            </a>
          </aside>
        </div>
      </section>
    </DocShell>
  );
}
