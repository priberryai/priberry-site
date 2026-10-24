import { ButtonLink } from "@/components/Button";
import { GradingPanel } from "@/components/grading-panel/GradingPanel";
import { hero } from "@/content/hero";

// Splits a sentence into masked words that rise in sequence (pure CSS, so it
// plays from first paint, before any JavaScript loads).
function RevealWords({ text, offset }: { text: string; offset: number }) {
  return text.split(" ").map((word, i) => (
    <span key={i}>
      <span className="reveal-word">
        <span style={{ "--i": offset + i } as React.CSSProperties}>{word}</span>
      </span>{" "}
    </span>
  ));
}

export function Hero() {
  const [first, second] = hero.headline;
  const firstCount = first.split(" ").length;

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-32 md:pt-44">
      <HexDots />

      <div className="container-page">
        <p className="label-mono reveal-fade text-berry" style={{ "--d": "40ms" } as React.CSSProperties}>
          {hero.eyebrow}
        </p>

        <h1 id="hero-title" className="mt-6 font-serif text-hero text-ink md:max-w-[24ch] lg:max-w-[30ch]">
          <span className="block">
            <RevealWords text={first} offset={0} />
          </span>
          <span className="block italic text-berry">
            <RevealWords text={second} offset={firstCount} />
          </span>
        </h1>

        <div className="mt-8 grid items-end gap-8 md:mt-10 lg:grid-cols-[minmax(0,40rem)_auto] lg:justify-between">
          <p className="reveal-fade max-w-[40rem] text-lead text-body" style={{ "--d": "520ms" } as React.CSSProperties}>
            {hero.subhead}
          </p>
          <div className="reveal-fade flex flex-wrap gap-2.5 sm:gap-3" style={{ "--d": "640ms" } as React.CSSProperties}>
            <ButtonLink href={hero.primary.href} arrow>
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="container-page mt-14 pb-24 md:mt-20 md:pb-32">
        <div className="reveal-fade relative" style={{ "--d": "760ms" } as React.CSSProperties}>
          {/* Soft berry glow behind the panel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-10 -top-16 bottom-10 -z-10 rounded-[48px] opacity-70"
            style={{
              background:
                "radial-gradient(60% 55% at 70% 40%, rgb(242 154 185 / 0.35), transparent 70%), radial-gradient(50% 60% at 20% 70%, rgb(90 45 130 / 0.14), transparent 70%)",
            }}
          />
          <GradingPanel />
        </div>
      </div>
    </section>
  );
}

// Static hexagonal dot field echoing the seven-circle mark. The fade is a paper
// gradient layered on top in the same element (cheaper to paint than mask-image).
function HexDots() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px]"
      style={{
        backgroundImage:
          "radial-gradient(70% 60% at 75% 20%, transparent 10%, var(--color-paper) 75%), " +
          "radial-gradient(circle, rgb(30 21 48 / 0.10) 1.1px, transparent 1.6px), " +
          "radial-gradient(circle, rgb(30 21 48 / 0.10) 1.1px, transparent 1.6px)",
        backgroundSize: "100% 100%, 28px 48.5px, 28px 48.5px",
        backgroundPosition: "0 0, 0 0, 14px 24.25px",
      }}
    />
  );
}
