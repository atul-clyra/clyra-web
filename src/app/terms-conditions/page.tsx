import type { Metadata } from "next";

import terms from "@/content/terms.json";
import { DocHeader, DocShell, LegalBody } from "@/components/doc";
import type { Block } from "@/components/doc";

export const metadata: Metadata = {
  title: "Terms & Conditions | Clyra",
  description: "The terms that govern your use of Clyra.",
  alternates: { canonical: "/terms-conditions/" },
};

export default function TermsPage() {
  return (
    <DocShell>
      <DocHeader
        eyebrow="Legal"
        meta="Effective 2 March 2025 · Last updated 4 June 2025"
        title={
          <>
            Terms &amp; <em>Conditions</em>.
          </>
        }
      />
      <LegalBody blocks={terms as Block[]} />
    </DocShell>
  );
}
