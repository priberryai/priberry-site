"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked rail for "How it works". Writes the reading progress through
 * the list into --progress (0..1) on the wrapper; CSS turns that into a
 * scaleY on the rail fill and lights each step once the fill reaches it.
 * Only transform and opacity change. Static (fully lit) under reduced motion.
 */
export function StepsProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--progress", "1");
      steps.forEach((s) => s.setAttribute("data-lit", ""));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // 0 when the list top reaches 70% of the viewport, 1 when its bottom does.
      const anchor = window.innerHeight * 0.7;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      el.style.setProperty("--progress", p.toFixed(4));
      for (const s of steps) {
        const lit = s.getBoundingClientRect().top < anchor;
        s.toggleAttribute("data-lit", lit);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="steps relative" style={{ "--progress": 1 } as React.CSSProperties}>
      {children}
    </div>
  );
}
