"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = { value: number; suffix?: string; duration?: number; className?: string };

/**
 * Counts from 0 to `value` once, when first visible. Server-renders the final
 * value, so it reads correctly without JavaScript or with reduced motion.
 */
export function CountUp({ value, suffix = "", duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only animate if it starts below the fold; otherwise leave the final value.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setShown(0);

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">{shown}</span>
      {suffix}
    </span>
  );
}
