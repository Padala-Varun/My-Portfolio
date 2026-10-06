"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const W = 400;
const H = 260;
const CX = W / 2;
const CY = H / 2;
const DURATION = 7;

/** Animated pipeline diagram: stages on a ring, a pulse visiting each stage in order. */
export function AgentGraph({ nodes, accent, core, title }: { nodes: string[]; accent: string; core: string; title: string }) {
  const reduce = usePrefersReducedMotion();
  const id = useId().replace(/:/g, "");

  const points = nodes.map((label, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return { label, x: CX + 150 * Math.cos(angle), y: CY + 92 * Math.sin(angle) };
  });
  const ring = `${points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} Z`;

  // Equal time per hop, so each stage lights up exactly when the pulse arrives.
  const lengths = points.map((p, i) => {
    const q = points[(i + 1) % points.length];
    return Math.hypot(q.x - p.x, q.y - p.y);
  });
  const total = lengths.reduce((a, b) => a + b, 0);
  let acc = 0;
  const keyPoints = [0, ...lengths.map((l) => (acc += l) / total)].map((v) => Math.min(v, 1).toFixed(4)).join(";");
  const keyTimes = points.map((_, i) => (i / points.length).toFixed(4)).concat("1").join(";");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`${title} pipeline: ${nodes.join(" → ")}`}>
      <defs>
        <radialGradient id={`glow-${id}`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={95} fill={`url(#glow-${id})`} opacity={0.5} />

      {points.map((p) => (
        <line key={`spoke-${p.label}`} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={accent} strokeOpacity={0.16} />
      ))}

      <path d={ring} fill="none" stroke={accent} strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="4 8" className="animate-dash" />

      {!reduce && (
        <circle r={4.5} fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${accent})` }}>
          <animateMotion dur={`${DURATION}s`} repeatCount="indefinite" path={ring} keyPoints={keyPoints} keyTimes={keyTimes} calcMode="linear" />
        </circle>
      )}

      <g>
        {!reduce && (
          <circle cx={CX} cy={CY} r={28} fill="none" stroke={accent} strokeOpacity={0.6}>
            <animate attributeName="r" values="28;44" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle cx={CX} cy={CY} r={28} fill="#0b0b11" stroke={accent} strokeWidth={1.5} />
        <text x={CX} y={CY + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff" fontFamily="var(--font-syne)">
          {core}
        </text>
      </g>

      {points.map((p, i) => {
        const w = p.label.length * 6.7 + 20;
        return (
          <motion.g
            key={p.label}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect x={p.x - w / 2} y={p.y - 12} width={w} height={24} rx={12} fill="#0b0b11" stroke={accent} strokeOpacity={0.45}>
              {!reduce && (
                <animate
                  attributeName="stroke-opacity"
                  values="1;1;0.45;0.45"
                  keyTimes="0;0.06;0.2;1"
                  dur={`${DURATION}s`}
                  begin={`${(i * DURATION) / points.length}s`}
                  repeatCount="indefinite"
                />
              )}
            </rect>
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11} fill="#ededf2" fontFamily="var(--font-geist-mono)">
              {p.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
