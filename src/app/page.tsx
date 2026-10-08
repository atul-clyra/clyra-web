import { MarkScene } from "@/components/mark-scene";
import { ScrollScrub } from "@/components/scroll-scrub";
import type { ScrollScrubScene } from "@/components/scroll-scrub";
import { PersonaliseScene, TeachScene, UnderstandScene } from "@/components/scenes";
import { scrollScrubScenes, scrollScrubTheme } from "@/components/scenes-data";
import {
  AskSection,
  ClosingSection,
  CursorDot,
  DoorsSection,
  HeroActions,
  LoopSpine,
  PlanSection,
  PractiseSection,
  SiteFooter,
  SiteNav,
  TrustSection,
} from "@/components/site";
import { SiteMotion } from "@/components/site-motion";

// The hero chapter carries its CTAs; identity never changes.
const scenes: ScrollScrubScene[] = scrollScrubScenes.map((scene, i) =>
  i === 0 ? { ...scene, actions: <HeroActions /> } : scene,
);

export default function Home() {
  return (
    <div className="c-site">
      <SiteMotion />
      <SiteNav />
      <main>
        <ScrollScrub scenes={scenes} theme={scrollScrubTheme} />
        <LoopSpine />
        <PlanSection />
        <TeachScene />
        <PractiseSection />
        <MarkScene />
        <UnderstandScene />
        <PersonaliseScene />
        <AskSection />
        <TrustSection />
        <DoorsSection />
        <ClosingSection />
      </main>
      <SiteFooter />
      <CursorDot />
    </div>
  );
}
