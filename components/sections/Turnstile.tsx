"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile, rendered explicitly. The script loads only when the
// form comes near the viewport, so it never touches the first paint.

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __turnstileLoading?: Promise<void>;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (window.__turnstileLoading) return window.__turnstileLoading;
  window.__turnstileLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(s);
  });
  return window.__turnstileLoading;
}

type TurnstileProps = {
  siteKey: string;
  onToken: (token: string | null) => void;
  onError: () => void;
  /** Bump to force a fresh challenge (e.g. after a failed submit). */
  resetKey: number;
};

export function Turnstile({ siteKey, onToken, onError, resetKey }: TurnstileProps) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const handlers = useRef({ onToken, onError });
  handlers.current = { onToken, onError };

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        loadScript()
          .then(() => {
            if (cancelled || !window.turnstile || widgetId.current) return;
            widgetId.current = window.turnstile.render(el, {
              sitekey: siteKey,
              theme: "light",
              size: "flexible",
              callback: (t: string) => handlers.current.onToken(t),
              "expired-callback": () => handlers.current.onToken(null),
              "error-callback": () => handlers.current.onError(),
            });
          })
          .catch(() => handlers.current.onError());
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current) {
      handlers.current.onToken(null);
      window.turnstile?.reset(widgetId.current);
    }
  }, [resetKey]);

  // Fixed height reserves the widget's space, so nothing shifts when it appears.
  return <div ref={box} className="h-[65px] w-full max-w-[400px]" />;
}
