"use client";

import type { ReactNode } from "react";

/** Card with a soft glow that follows the pointer. */
export function Spotlight({ children, className, color = "rgba(139,92,246,0.16)" }: { children: ReactNode; className?: string; color?: string }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div onPointerMove={onMove} className={`group relative overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-500 hover:border-line-strong ${className ?? ""}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 45%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
