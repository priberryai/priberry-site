import type { ReactNode } from "react";

type SectionHeaderProps = {
  id: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Use on dark plum sections. */
  onInk?: boolean;
  className?: string;
};

/** Mono label, serif heading and optional intro, shared by every section. */
export function SectionHeader({ id, label, title, intro, onInk, className = "" }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p data-reveal className={`label-mono ${onInk ? "text-blush" : "text-berry"}`}>
        {label}
      </p>
      <h2
        id={id}
        data-reveal
        style={{ "--i": 1 } as React.CSSProperties}
        className={`mt-5 font-serif text-display ${onInk ? "text-on-ink" : "text-ink"}`}
      >
        {title}
      </h2>
      {intro && (
        <p
          data-reveal
          style={{ "--i": 2 } as React.CSSProperties}
          className={`mt-6 max-w-2xl text-lead ${onInk ? "text-on-ink-muted" : "text-body"}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
