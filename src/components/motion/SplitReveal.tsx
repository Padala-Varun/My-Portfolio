"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";

type Props = {
  text: string;
  as?: "span" | "div" | "p" | "h2" | "h3";
  className?: string;
  by?: "chars" | "words" | "lines";
  /** "scroll" plays when scrolled into view; "intro" plays as the preloader lifts. */
  trigger?: "scroll" | "intro";
  delay?: number;
  stagger?: number;
  /** Paint a continuous violet→cyan gradient across split characters. */
  gradient?: boolean;
};

const GRADIENT = "linear-gradient(100deg, #c4b5fd 0%, #8b5cf6 35%, #22d3ee 100%)";

// background-clip:text on a parent breaks once children are transformed, so each
// character gets its own slice of one shared gradient instead.
function paintGradient(root: HTMLElement, chars: Element[]) {
  const box = root.getBoundingClientRect();
  chars.forEach((node) => {
    const el = node as HTMLElement;
    const rect = el.getBoundingClientRect();
    Object.assign(el.style, {
      backgroundImage: GRADIENT,
      backgroundSize: `${box.width}px 100%`,
      backgroundPosition: `${box.left - rect.left}px 0`,
      backgroundRepeat: "no-repeat",
      webkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    });
  });
}

/** Masked text reveal powered by GSAP SplitText. Re-splits on resize and font load. */
export function SplitReveal({ text, as: Tag = "span", className, by = "chars", trigger = "scroll", delay = 0, stagger, gradient }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const introDone = useIntroDone();
  const ready = trigger === "scroll" || introDone;

  useGSAP(
    () => {
      if (!ref.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, {
          type: by === "lines" ? "lines" : by === "words" ? "words,lines" : "chars,words,lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets = self[by];
            if (gradient && ref.current) {
              ref.current.style.backgroundImage = "none";
              paintGradient(ref.current, self.chars);
            }
            if (!ready) {
              gsap.set(targets, { yPercent: 115 });
              return;
            }
            return gsap.from(targets, {
              yPercent: 115,
              rotate: by === "chars" ? 6 : 0,
              duration: by === "chars" ? 1.1 : 1,
              ease: "expo.out",
              stagger: stagger ?? (by === "chars" ? 0.025 : by === "words" ? 0.04 : 0.1),
              delay,
              scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
            });
          },
        });
        return () => {
          split.revert();
          if (ref.current) ref.current.style.backgroundImage = "";
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready, text], revertOnUpdate: true },
  );

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={`block ${gradient ? "text-gradient" : ""}`}>
        {text}
      </span>
    </Tag>
  );
}
