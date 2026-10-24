"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

const PULL = 0.22; // share of the cursor offset the element follows
const MAX = 6; // px

// Gently pulls its child toward the cursor. Mouse only; the CSS transition
// does the easing. Reduced motion collapses the transition (globals.css).
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
    const x = clamp((e.clientX - (r.left + r.width / 2)) * PULL);
    const y = clamp((e.clientY - (r.top + r.height / 2)) * PULL);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <span
      ref={ref}
      className="inline-flex transition-transform duration-500 ease-(--ease-brand)"
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </span>
  );
}
