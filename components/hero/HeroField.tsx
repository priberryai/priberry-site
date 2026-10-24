"use client";

import { useEffect, useRef } from "react";
import type { Field } from "./judgement-field";

type HeroFieldProps = {
  /** id of the element the mark fills (also holds the static SVG fallback). */
  markId: string;
  /** id of the headline block that should stay calm. */
  quietId: string;
};

/**
 * Mounts the WebGL hero after the headline has painted. The static SVG mark in
 * the same box stays as the fallback: no JavaScript, reduced motion, or no
 * WebGL2 all leave it in place. When the field starts, the SVG fades out and
 * the dots take over the exact same geometry.
 */
export function HeroField({ markId, quietId }: HeroFieldProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const section = el?.closest("section");
    const markBox = document.getElementById(markId);
    if (!el || !section || !markBox) return;
    // Static halftone mark for reduced motion (CSS keys off data-field).
    const showFallback = () => {
      section.dataset.field = "fallback";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showFallback();
      return;
    }

    let field: Field | null = null;
    let disposed = false;
    const cleanups: (() => void)[] = [];
    const weak =
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
    // Phones and weak devices: show the (identical) static mark now, and take
    // it over with the live field, already settled, on the first interaction.
    if (weak) showFallback();

    const start = async () => {
      let startField: typeof import("./judgement-field").startField;
      try {
        ({ startField } = await import("./judgement-field"));
      } catch {
        showFallback();
        return;
      }
      if (disposed) return;
      try {
        field = await startField({
          canvas: el,
          markBox,
          quietBox: document.getElementById(quietId),
          quality: weak ? "low" : "high",
          settled: weak,
          onSweep: (x) => {
            const s = sweep.current;
            if (!s) return;
            if (x === null) {
              s.style.opacity = "0";
            } else {
              s.style.opacity = "1";
              s.style.transform = `translate3d(${x}px,0,0)`;
            }
          },
        });
      } catch {
        field = null;
      }
      if (disposed) {
        field?.destroy();
        return;
      }
      if (!field) {
        showFallback();
        return;
      }
      section.dataset.field = "on"; // CSS fades the canvas in

      // Pointer: the expert's lens, mouse and pen only.
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const inside = y >= 0 && y <= r.height;
        field?.setPointer(x, y, inside);
        const l = lens.current;
        if (l) {
          l.style.transform = `translate3d(${x}px,${y}px,0)`;
          l.style.opacity = inside ? "1" : "0";
        }
      };
      const onLeave = () => {
        field?.setPointer(-9999, -9999, false);
        if (lens.current) lens.current.style.opacity = "0";
      };
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      });

      // Scroll: parallax and hand-off, as a share of the hero's height.
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const r = section.getBoundingClientRect();
          field?.setScroll(Math.min(1, Math.max(0, -r.top / r.height)));
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      // Only render while visible.
      let inView = true;
      const sync = () => field?.setRunning(inView && document.visibilityState === "visible");
      const io = new IntersectionObserver(([e]) => {
        inView = Boolean(e?.isIntersecting);
        sync();
      });
      io.observe(section);
      document.addEventListener("visibilitychange", sync);
      cleanups.push(() => {
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
      });
    };

    // Capable devices: start once the browser is idle, so the headline paints first.
    // Weak devices: start on the first touch, scroll, pointer or key press.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    let handle = 0;
    if (!weak) {
      handle = ric ? ric(() => void start(), { timeout: 900 }) : window.setTimeout(() => void start(), 300);
    } else {
      const events = ["pointerdown", "touchstart", "scroll", "keydown", "wheel"] as const;
      const onFirst = () => {
        events.forEach((e) => window.removeEventListener(e, onFirst));
        void start();
      };
      events.forEach((e) => window.addEventListener(e, onFirst, { passive: true, once: true }));
      cleanups.push(() => events.forEach((e) => window.removeEventListener(e, onFirst)));
    }

    return () => {
      disposed = true;
      if (!ric) window.clearTimeout(handle);
      cleanups.forEach((c) => c());
      field?.destroy();
      delete section.dataset.field;
    };
  }, [markId, quietId]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={canvas} className="hero-canvas absolute inset-0 h-full w-full" />
      {/* The expert's reading line: crisp, no glow. */}
      <div ref={sweep} className="absolute inset-y-0 left-0 w-px bg-berry opacity-0 will-change-transform">
        <span className="absolute left-2 top-28 whitespace-nowrap text-[0.8125rem] font-medium text-berry md:top-36">
          Expert review
        </span>
      </div>
      {/* The lens outline that follows the pointer. */}
      <div
        ref={lens}
        className="absolute left-0 top-0 -ml-[var(--lens)] -mt-[var(--lens)] size-[calc(var(--lens)*2)] rounded-full opacity-0 ring-1 ring-ink/20 transition-opacity duration-300 will-change-transform"
        style={{ "--lens": "clamp(80px, 8vw, 130px)" } as React.CSSProperties}
      />
    </div>
  );
}
