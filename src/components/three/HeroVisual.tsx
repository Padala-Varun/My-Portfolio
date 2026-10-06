"use client";

import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** The 3D particle core, or a static glow when motion is reduced / WebGL is unavailable. */
export function HeroVisual() {
  const reduce = usePrefersReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    // Detect once on the client; the server can't know.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(supportsWebGL());
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Static glow — always present underneath, so there's no flash while the scene loads */}
      <div className="absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.35),rgba(34,211,238,0.12)_45%,transparent_70%)] blur-2xl lg:left-[70%]" />
      {webgl && !reduce && (
        <div className="absolute inset-0 opacity-55 md:opacity-100">
          <HeroScene />
        </div>
      )}
    </div>
  );
}
