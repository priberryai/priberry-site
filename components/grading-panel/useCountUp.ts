"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tweens a displayed integer toward `target` (up or down).
 * Text only changes, so there is no layout work beyond the digits.
 */
export function useCountUp(target: number, { duration = 520, instant = false } = {}) {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (instant) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(origin + (target - origin) * eased);
      setValue(v);
      from.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, instant]);

  return value;
}
