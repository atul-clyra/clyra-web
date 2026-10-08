import type { Metadata } from "next";

import privacy from "@/content/privacy.json";
import { DocHeader, DocShell, LegalBody } from "@/components/doc";
import type { Block } from "@/components/doc";

export const metadata: Metadata = {
  title: "Privacy Policy | Clyra",
  description: "How Clyra collects, uses and protects your data.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  return (
    <DocShell>
      <DocHeader
        eyebrow="Legal"
        meta="Effective 15 Dec 2023 · Last updated 27 Jan 2026"
        title={
          <>
            Privacy <em>Policy</em>.
          </>
        }
      />
      <LegalBody blocks={privacy as Block[]} />
      <section className="c-docbody c-bone c-doccta">
        <div className="c-doccta__card">
          <p className="c-eyebrow">Questions about privacy?</p>
          <p className="c-doccta__line">
            We&apos;re here to help. Contact our support team for any privacy-related questions or concerns.
          </p>
          <a className="c-docbtn" href="mailto:privacy@heyclyra.com">
            Contact support
          </a>
        </div>
      </section>
    </DocShell>
  );
}
