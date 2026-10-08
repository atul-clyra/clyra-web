import type { Metadata } from "next";

import { DocHeader, DocShell } from "@/components/doc";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Security | Clyra",
  description:
    "Clyra is designed to protect institutional data, respect curriculum boundaries, and support responsible deployment in education environments.",
  alternates: { canonical: "/security/" },
};

const GROUPS = [
  {
    icon: "fair" as const,
    title: "Security principles",
    items: [
      "Data encrypted at rest and in transit.",
      "Access controls designed around institutional roles and responsibilities.",
      "Content handling grounded in school-owned curriculum and uploaded materials.",
    ],
  },
  {
    icon: "schools" as const,
    title: "Compliance posture",
    items: [
      "SOC 2 aligned processes.",
      "GDPR compliant data practices.",
      "Operational safeguards designed for institutional review and deployment planning.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <DocShell>
      <DocHeader
        eyebrow="Security"
        lead="Clyra is designed to protect institutional data, respect curriculum boundaries, and support responsible deployment in education environments."
        title={
          <>
            Security and compliance for <em>modern</em> schools.
          </>
        }
      />
      <section className="c-docbody c-bone">
        <div className="c-cards">
          {GROUPS.map((g) => (
            <article className="c-card" key={g.title}>
              <Icon className="c-card__icon" name={g.icon} size={44} />
              <h2 className="c-card__title">{g.title}</h2>
              <ul className="c-card__list">
                {g.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="c-docnote">
          Read more in our <a href="/privacy-policy/">Privacy Policy</a> and{" "}
          <a href="/terms-conditions/">Terms &amp; Conditions</a>, or write to{" "}
          <a href="mailto:hi@heyclyra.com">hi@heyclyra.com</a>.
        </p>
      </section>
    </DocShell>
  );
}
