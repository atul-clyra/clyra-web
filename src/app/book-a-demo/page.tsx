import type { Metadata } from "next";

import { DemoForm } from "@/components/demo-form";
import { DocHeader, DocShell } from "@/components/doc";

export const metadata: Metadata = {
  title: "Book a demo | Clyra",
  description:
    "See how Clyra connects the lesson, the homework and the result for your school. Tell us about your classes and we'll set up a 30-minute walkthrough.",
  alternates: { canonical: "/book-a-demo/" },
};

const STEPS = [
  ["We reply within one working day", "A real person from the Clyra team, not an automated sequence."],
  ["A 30-minute walkthrough", "Built around your subjects, your curriculum and the classes you'd start with."],
  ["A pilot plan for your school", "Which classes to begin with and what you'll see in the first weeks."],
];

export default function BookADemoPage() {
  return (
    <DocShell>
      <DocHeader
        eyebrow="Book a demo"
        lead="Tell us a little about your school and what you'd like to see. We'll set up a short walkthrough of Clyra on your own subjects."
        title={
          <>
            See the loop, <em>closed</em>.
          </>
        }
      />
      <section className="c-docbody c-bone">
        <div className="c-apply c-demo">
          <div className="c-apply__form">
            <h2 className="c-apply__title">Request a demo</h2>
            <p className="c-apply__sub">It takes about a minute. Fields marked * are required.</p>
            <DemoForm />
          </div>
          <aside className="c-apply__aside c-demo__aside">
            <p className="c-eyebrow">What to expect</p>
            <ol className="c-demo__steps">
              {STEPS.map(([t, b], i) => (
                <li key={t}>
                  <span className="c-demo__n">0{i + 1}</span>
                  <span>
                    <b>{t}</b>
                    <span>{b}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="c-demo__mail">
              Prefer email? <a href="mailto:hi@heyclyra.com?subject=Clyra%20demo">hi@heyclyra.com</a>
            </p>
          </aside>
        </div>
      </section>
    </DocShell>
  );
}
