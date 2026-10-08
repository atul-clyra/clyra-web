import type { Metadata } from "next";

import { Redirect } from "@/components/redirect";

// Retired heyclyra.com URL: kept so existing links land on the right part of the new homepage.
export const metadata: Metadata = {
  title: "How it works | Clyra",
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

export default function Page() {
  return <Redirect label="How it works" to="/#plan" />;
}
