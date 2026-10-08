"use client";

import { useSiteMotion } from "@/components/motion";

/** Mounts the site-wide motion layer (Lenis, spine, reveals, magnetic CTAs). */
export function SiteMotion() {
  useSiteMotion();
  return null;
}
