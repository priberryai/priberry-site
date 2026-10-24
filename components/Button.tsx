import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "secondary" | "on-ink";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 sm:px-6 text-[0.9375rem] font-medium tracking-[-0.005em] " +
  "transition-[transform,box-shadow,background-color,color] duration-300 ease-(--ease-brand) will-change-transform";

const variants: Record<Variant, string> = {
  primary:
    "bg-berry text-white hover:bg-berry-deep hover:-translate-y-px hover:shadow-(--shadow-lift) active:translate-y-0",
  secondary:
    "bg-transparent text-ink ring-1 ring-inset ring-line-strong hover:ring-ink hover:-translate-y-px active:translate-y-0",
  "on-ink":
    "bg-paper text-ink hover:bg-white hover:-translate-y-px active:translate-y-0",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** Show the small arrow that slides on hover. */
  arrow?: boolean;
  className?: string;
};

/** Pill link styled as a button. Primary buttons get the magnetic hover. */
export function ButtonLink({ href, children, variant = "primary", arrow, className = "" }: ButtonLinkProps) {
  const link = (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </a>
  );
  return variant === "primary" ? <Magnetic>{link}</Magnetic> : link;
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-3.5 transition-transform duration-300 ease-(--ease-brand) group-hover:translate-x-0.5"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
