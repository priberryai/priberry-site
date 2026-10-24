"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { ButtonLink } from "./Button";
import { Logo } from "./Logo";

// Sticky header. Transparent at the top of the page; paper with a blur and a
// hairline once the page scrolls. Below 900px the links collapse into a menu.
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className={`nav-bg absolute inset-0 border-b border-line bg-paper/80 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500 ease-(--ease-brand) ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav aria-label="Main" className="container-page relative flex h-[72px] items-center justify-between gap-6">
        <a href="/" aria-label="Priberry home" className="-m-2 rounded-lg p-2 text-ink">
          <Logo className="h-[26px] w-auto" title="Priberry" />
        </a>

        <ul className="hidden items-center gap-1 min-[900px]:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[0.9375rem] text-body transition-colors duration-300 hover:text-ink"
              >
                <span className="link-underline">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden min-[420px]:block">
            <ButtonLink href={nav.cta.href} className="min-h-11 px-5">
              {nav.cta.label}
            </ButtonLink>
          </div>
          <button
            ref={menuButton}
            type="button"
            className="relative inline-flex size-11 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-line-strong min-[900px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ease-(--ease-brand) ${
                  open ? "translate-y-[5.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ease-(--ease-brand) ${
                  open ? "-translate-y-[5.25px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="relative border-b border-line bg-paper/95 backdrop-blur-xl min-[900px]:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line text-lg text-ink last:border-0"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pb-2 pt-4 min-[420px]:hidden">
            <a
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-center rounded-full bg-berry font-medium text-white"
            >
              {nav.cta.label}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
