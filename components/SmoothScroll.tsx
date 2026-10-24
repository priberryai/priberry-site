"use client";

import { useEffect } from "react";

// Lenis smooth scroll for mouse and trackpad only. Skipped under reduced motion
// and on touch devices, where native momentum scrolling is already right.
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    let destroyed = false;
    let lenis: { destroy: () => void } | undefined;
    // Loaded after hydration so it never sits on the critical path.
    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      lenis = new Lenis({ autoRaf: true, anchors: { offset: -80 }, lerp: 0.11 });
    });
    return () => {
      destroyed = true;
      lenis?.destroy();
    };
  }, []);

  return null;
}
