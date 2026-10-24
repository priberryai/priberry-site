import { SectionHeader } from "@/components/SectionHeader";
import { who } from "@/content/who";

export function Who() {
  return (
    <section aria-labelledby="who-title" className="section-y">
      <div className="container-page">
        <SectionHeader id="who-title" label={who.label} title={who.title} />
        <ul className="mt-14 grid border-t border-line-strong md:mt-20 md:grid-cols-3">
          {who.groups.map((g, i) => (
            <li
              key={g.name}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
              className="border-b border-line py-8 md:border-b-0 md:py-10 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10"
            >
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.015em] text-ink">{g.name}</h3>
              <p className="mt-3 text-body">{g.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
