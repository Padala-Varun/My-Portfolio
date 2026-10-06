"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isIntroDone, subscribeIntro } from "@/lib/intro";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lenis falls back to native 1:1 scrolling when the user prefers reduced motion.
    const lenis = new Lenis({ duration: 1.15, anchors: true, autoRaf: false, stopInertiaOnNavigate: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold the page still while the preloader plays.
    let unsubscribe = () => {};
    if (!isIntroDone()) {
      lenis.stop();
      unsubscribe = subscribeIntro(() => {
        lenis.start();
        ScrollTrigger.refresh();
      });
    }

    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
