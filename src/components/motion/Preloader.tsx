"use client";

import { useRef } from "react";
import { profile } from "@/data/profile";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";

const SEEN_KEY = "intro-seen";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (seen || reduce) {
        gsap.to(el, { autoAlpha: 0, duration: reduce ? 0.3 : 0.4, onComplete: markIntroDone });
        if (seen) markIntroDone();
        return;
      }

      const progress = { value: 0 };
      const letters = el.querySelectorAll("[data-letter]");
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(letters, { yPercent: 120, duration: 0.9, stagger: 0.045 }, 0.1)
        .to(
          progress,
          {
            value: 100,
            duration: 1.7,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
            },
          },
          0,
        )
        .to("[data-bar]", { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0)
        .to(letters, { yPercent: -120, duration: 0.55, stagger: 0.025, ease: "expo.in" }, ">-0.1")
        .to("[data-meta]", { autoAlpha: 0, duration: 0.3 }, "<")
        .to("[data-panel='front']", { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, ">-0.15")
        .to("[data-panel='back']", { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, "<0.12")
        .add(markIntroDone, "<0.25")
        .set(el, { display: "none" });
    },
    { scope: root },
  );

  const word = profile.firstName.toUpperCase();

  return (
    <div ref={root} className="preloader-failsafe fixed inset-0 z-[100]" aria-hidden="true">
      <div data-panel="back" className="absolute inset-0 bg-gradient-to-br from-violet to-cyan" style={{ clipPath: "inset(0% 0% 0% 0%)" }} />
      <div data-panel="front" className="absolute inset-0 flex flex-col items-center justify-center bg-ink" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
        <div className="flex overflow-hidden font-display text-[clamp(3.5rem,14vw,10rem)] leading-none font-extrabold tracking-tight">
          {word.split("").map((letter, i) => (
            <span key={i} data-letter className="inline-block">
              {letter}
            </span>
          ))}
        </div>
        <div data-meta className="container-x absolute inset-x-0 bottom-10 flex items-end justify-between">
          <span className="eyebrow">{profile.role}</span>
          <span ref={count} className="font-mono text-5xl text-fg tabular-nums md:text-7xl">
            000
          </span>
        </div>
        <div data-bar className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-cyan" />
      </div>
    </div>
  );
}
