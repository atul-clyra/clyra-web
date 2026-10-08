/**
 * Scene data for the hero scroll-scrub journey.
 *
 * One continuous 15s film of the loop ring, cut at exact frame boundaries into
 * three contiguous segments so each chapter owns its own stretch of the take.
 * Every poster is the first frame of the encoded clip beside it.
 *
 * Keep this array a module constant.
 */
import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub";

/** Brand tokens for the journey layer (Ink ground, Bone ink, Sage muted, Signal accent). */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#C8DFA0",
  background: "#0C120F",
  ink: "#F5F3EE",
  muted: "#9DB3A7",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Clyra connects the lesson, the homework and the result, then builds the next step for every student.",
    clip: "/assets/world/scene-01.mp4",
    id: "top",
    kicker: "One system for teaching and learning",
    label: "Clyra",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobilePoster: "/assets/world/scene-01-mobile-poster.webp",
    poster: "/assets/world/scene-01-poster.webp",
    scroll: 1.5,
    title: (
      <>
        Plan it. Teach it. <em>Know</em> who got it.
      </>
    ),
  },
  {
    align: "right",
    body: "The lesson plan lives in one place, the reading in another, homework in a third, marks in a spreadsheet. By the time you know who didn't get it, the class has moved on.",
    clip: "/assets/world/scene-02.mp4",
    id: "problem",
    label: "The problem",
    mobileClip: "/assets/world/scene-02-mobile.mp4",
    mobilePoster: "/assets/world/scene-02-mobile-poster.webp",
    poster: "/assets/world/scene-02-poster.webp",
    scroll: 1.7,
    tags: ["Calendar", "Docs", "LMS", "Spreadsheet", "Chat"],
    title: (
      <>
        Teaching runs in a loop. Your tools <em>don&apos;t</em>.
      </>
    ),
  },
  {
    body: "Most schools run this loop across five tools and lose the thread at every step. Clyra runs it in one, with the teacher in control at every step.",
    clip: "/assets/world/scene-03.mp4",
    id: "loop-closed",
    label: "The loop",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    mobilePoster: "/assets/world/scene-03-mobile-poster.webp",
    poster: "/assets/world/scene-03-poster.webp",
    scroll: 1.8,
    tags: ["Plan", "Teach", "Practise", "Mark", "Understand", "Personalise"],
    title: (
      <>
        The loop, <em>closed</em>.
      </>
    ),
  },
];
