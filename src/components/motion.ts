"use client";

import { useEffect } from "react";

/**
 * Site-wide motion: Lenis smooth scroll bridged to GSAP ScrollTrigger, plus the
 * loop spine, nav state, scroll-scrubbed reveals, the Teach horizontal track,
 * the Understand three-beat sequence, magnetic CTAs and the cursor dot.
 *
 * Everything starts in its visible state (transform-only offsets), so a static
 * render shows every section. Reduced motion keeps the spine and nav state but
 * skips smoothing, scrubs, pins and the cursor.
 */
export function useSiteMotion() {
  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Nav: frosted bar after 80px (plain listener, no library needed).
    const nav = document.querySelector<HTMLElement>("[data-nav]");
    const onScrollNav = () => {
      if (nav) nav.dataset.solid = window.scrollY > 80 ? "true" : "false";
    };
    onScrollNav();
    window.addEventListener("scroll", onScrollNav, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScrollNav));

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Lenis bridge (autoRaf off, driven by the GSAP ticker).
      if (!reduce) {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const onAnchor = (e: MouseEvent) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!a) return;
          const id = a.getAttribute("href");
          if (!id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
        };
        document.addEventListener("click", onAnchor);
        cleanups.push(() => {
          document.removeEventListener("click", onAnchor);
          gsap.ticker.remove(tick);
          lenis.destroy();
        });
      }

      const ctx = gsap.context(() => {
        // Loop spine: on while inside the six stage sections; lights stages.
        const spine = document.querySelector<HTMLElement>("[data-spine]");
        const stages = gsap.utils.toArray<HTMLElement>("[data-stage]");
        const setStage = (n: number) => {
          if (!spine) return;
          spine.dataset.active = String(n);
          spine.dataset.tone = stages[n]?.matches(".c-bone, .c-mist") ? "light" : "dark";
          spine.style.setProperty("--spine-p", String(n + 1));
          spine.querySelectorAll<SVGElement | HTMLElement>("[data-i]").forEach((el) => {
            const i = Number(el.getAttribute("data-i"));
            el.setAttribute("data-lit", String(i <= n));
            el.setAttribute("data-current", String(i === n));
          });
        };
        if (spine && stages.length) {
          ScrollTrigger.create({
            trigger: stages[0],
            endTrigger: stages[stages.length - 1],
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              spine.dataset.on = String(self.isActive);
            },
          });
          stages.forEach((el, i) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 55%",
              end: "bottom 55%",
              onEnter: () => setStage(i),
              onEnterBack: () => setStage(i),
            });
          });
        }

        if (reduce) return;

        // Headline rise: transform-only, scrubbed, never hidden.
        gsap.utils.toArray<HTMLElement>(".js-rise").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 22 },
            { yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 55%", scrub: true } },
          );
        });

        // Parallax on product renders.
        gsap.utils.toArray<HTMLElement>(".js-par").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 60 },
            { y: -60, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        // Scale-through zoom on full-bleed images.
        gsap.utils.toArray<HTMLElement>(".js-zoom").forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.18 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        // Magnetic CTAs.
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          gsap.utils.toArray<HTMLElement>(".js-mag").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "expo.out" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" });
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          });

          // Signal cursor dot that grows on links.
          const dot = document.querySelector<HTMLElement>("[data-cursor]");
          if (dot) {
            const dx = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
            const dy = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });
            const onMove = (e: PointerEvent) => {
              dx(e.clientX);
              dy(e.clientY);
              const link = (e.target as HTMLElement | null)?.closest?.("a, button");
              dot.dataset.big = link ? "true" : "false";
            };
            window.addEventListener("pointermove", onMove, { passive: true });
            cleanups.push(() => window.removeEventListener("pointermove", onMove));
          }
        }
      });

      cleanups.push(() => ctx.revert());
      // Images and the journey can shift layout once they load.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      cleanups.push(() => window.removeEventListener("load", refresh));
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      cleanups.reverse().forEach((fn) => fn());
    };
  }, []);
}
