"use client";

import { ArrowUp } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";

export function BackToTop() {
  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Magnetic strength={0.45}>
      <button
        type="button"
        onClick={toTop}
        className="group grid h-16 w-16 place-items-center rounded-full border border-line-strong transition-colors hover:border-fg hover:bg-fg hover:text-ink"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
      </button>
    </Magnetic>
  );
}
