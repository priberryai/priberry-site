"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page. Any element with `data-reveal`
 * gets `data-shown` the first time it enters the viewport; CSS decides what
 * that means for that element (today: the 16% dot strip lights up).
 * Without JavaScript the `js` class is never set, so content is in its final state.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
