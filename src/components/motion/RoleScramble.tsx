"use client";

import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

/** Cycles through roles, decoding each new one with a glitchy scramble. */
export function RoleScramble({ roles, interval = 2800, start = true }: { roles: string[]; interval?: number; start?: boolean }) {
  const [text, setText] = useState(roles[0]);
  const reduce = usePrefersReducedMotion();
  const index = useRef(0);
  const current = useRef(roles[0]);

  useEffect(() => {
    if (!start) return;
    let frame = 0;
    let raf = 0;

    const scrambleTo = (next: string) => {
      const from = current.current;
      current.current = next;
      cancelAnimationFrame(raf);
      const length = Math.max(from.length, next.length);
      const queue = Array.from({ length }, (_, i) => {
        const begin = Math.floor(Math.random() * 18);
        return { from: from[i] ?? "", to: next[i] ?? "", begin, end: begin + 10 + Math.floor(Math.random() * 18) };
      });
      frame = 0;
      const step = () => {
        let done = 0;
        const out = queue
          .map(({ from, to, begin, end }) => {
            if (frame >= end) {
              done++;
              return to;
            }
            if (frame >= begin) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return from;
          })
          .join("");
        setText(out);
        if (done < queue.length) {
          frame++;
          raf = requestAnimationFrame(step);
        }
      };
      step();
    };

    const id = window.setInterval(() => {
      index.current = (index.current + 1) % roles.length;
      const next = roles[index.current];
      if (reduce) {
        current.current = next;
        setText(next);
      } else scrambleTo(next);
    }, interval);

    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [start, reduce, roles, interval]);

  return (
    <span aria-live="off">
      {text}
      <span className="ml-0.5 inline-block animate-blink text-cyan">_</span>
    </span>
  );
}
