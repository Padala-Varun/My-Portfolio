import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function SectionHeading({ index, label, title, children }: { index: string; label: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-14 flex flex-col gap-8 md:mb-20 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="text-cyan">({index})</span>
          <span className="h-px w-10 bg-line-strong" />
          {label}
        </p>
        <SplitReveal
          as="h2"
          text={title}
          by="words"
          className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6.25rem)] leading-[0.95] font-bold tracking-tight"
        />
      </div>
      {children && <div className="max-w-sm text-base leading-relaxed text-muted lg:pb-3">{children}</div>}
    </div>
  );
}
