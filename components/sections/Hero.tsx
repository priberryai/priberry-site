import { ButtonLink } from "@/components/Button";
import { HeroField } from "@/components/hero/HeroField";
import { hero } from "@/content/hero";

// Seven-circle mark geometry (public/brand/priberry-icon.svg).
const CIRCLES = [
  [-40, -69, "berry"],
  [40, -69, "blush"],
  [-80, 0, "berry"],
  [0, 0, "deep"],
  [80, 0, "berry"],
  [-40, 69, "deep"],
  [40, 69, "berry"],
] as const;
const FILL = { berry: "#B3265F", blush: "#F29AB9", deep: "#8A1B49" } as const;

/*
 * Hero: "From noise to judgement". The headline paints first and is the LCP.
 * The WebGL field (components/hero) starts when the browser is idle and takes
 * over the mark box below; until then, and for reduced motion or no WebGL, the
 * same mark is drawn as a static halftone SVG in the same box.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero relative isolate flex min-h-[max(100svh,640px)] flex-col overflow-hidden"
    >
      <HeroField markId="hero-mark" quietId="hero-copy" />

      {/* The mark box: shared by the SVG fallback and the WebGL targets. */}
      <div
        id="hero-mark"
        aria-hidden="true"
        className="absolute left-1/2 top-[92px] aspect-[236/214] w-[min(74vw,340px)] -translate-x-1/2 lg:left-auto lg:right-[max(3vw,calc((100vw-1264px)/2))] lg:top-1/2 lg:w-[min(39vw,560px)] lg:-translate-y-[54%] lg:translate-x-0"
      >
        <svg viewBox="-118 -107 236 214" className="hero-static h-full w-full">
          <defs>
            {Object.entries(FILL).map(([name, color]) => (
              // Same hex spacing as the WebGL dots (~11px at desktop size), so the hand-over is seamless.
              <pattern key={name} id={`halftone-${name}`} width="4.6" height="7.967" patternUnits="userSpaceOnUse">
                <circle cx="1.15" cy="1.15" r="0.9" fill={color} />
                <circle cx="3.45" cy="5.134" r="0.9" fill={color} />
              </pattern>
            ))}
          </defs>
          {CIRCLES.map(([cx, cy, tone]) => (
            <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={37} fill={`url(#halftone-${tone})`} />
          ))}
        </svg>
        <p className="absolute -bottom-10 left-0 right-0 hidden text-center text-[0.8125rem] text-muted lg:block">
          {hero.caption}
        </p>
      </div>

      <div className="container-page relative mt-auto pb-14 pt-[calc(92px+min(74vw,340px)*0.907+40px)] lg:pb-[clamp(56px,9vh,112px)] lg:pt-40">
        <div id="hero-copy" className="max-w-[40rem] lg:max-w-[min(48vw,40rem)]">
          <h1 id="hero-title" className="font-display text-hero text-ink">
            {hero.headline}
          </h1>
          <p
            className="reveal-fade mt-6 max-w-[34rem] text-[clamp(1.1875rem,1.05rem+0.5vw,1.5rem)] font-medium leading-[1.35] tracking-[-0.012em] text-body"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            {hero.subhead}
          </p>
          <div className="reveal-fade mt-9 flex flex-wrap gap-2.5 sm:gap-3" style={{ "--d": "240ms" } as React.CSSProperties}>
            <ButtonLink href={hero.primary.href} arrow>
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </ButtonLink>
          </div>
          <p className="mt-8 text-[0.8125rem] text-muted lg:hidden">{hero.caption}</p>
        </div>
      </div>
    </section>
  );
}
