"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor={copied ? "Copied" : "Copy"}
      className="group relative flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-ink-2 px-5 py-5 text-left transition-colors hover:border-line-strong"
    >
      <span>
        <span className="eyebrow block">Email me</span>
        <span className="mt-1 block font-display text-[15px] font-semibold break-all sm:text-xl">{email}</span>
      </span>
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fg text-ink">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={copied ? "check" : "copy"} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
