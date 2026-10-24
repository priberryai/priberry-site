import { principles } from "@/content/principles";

export function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="on-ink section-y relative overflow-hidden bg-ink">
      {/* Faint berry light from the top right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgb(179 38 95 / 0.55), transparent 65%)" }}
      />
      <div className="container-page relative">
        <p data-reveal className="label text-blush">
          {principles.label}
        </p>
        <h2
          id="principles-title"
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-5 max-w-3xl font-display text-display text-on-ink"
        >
          {principles.title}
        </h2>

        <ol className="mt-14 grid overflow-hidden rounded-(--radius-card) ring-1 ring-inset ring-line-on-ink md:mt-20 md:grid-cols-2">
          {principles.items.map((p, i) => (
            <li
              key={p.name}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
              className="border-line-on-ink p-8 md:p-10 lg:p-12 [&:not(:first-child)]:border-t md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(even)]:border-l"
            >
              <p aria-hidden="true" className="font-mono text-[0.8125rem] text-blush">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-8 font-display text-[2.25rem] leading-[1.05] text-on-ink">{p.name}</h3>
              <p className="mt-4 max-w-md text-on-ink-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
