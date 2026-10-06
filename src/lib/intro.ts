"use client";

import { useSyncExternalStore } from "react";

// Tiny shared flag: the preloader flips it when the intro finishes so the hero
// can start its entrance animation exactly as the curtain lifts.
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

export const isIntroDone = () => done;

export function subscribeIntro(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroDone() {
  return useSyncExternalStore(subscribeIntro, isIntroDone, () => false);
}
