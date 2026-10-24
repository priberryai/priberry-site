import { footer, site } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-ink bg-ink text-on-ink-muted">
      <div className="container-page pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="/" aria-label="Priberry home" className="inline-block rounded-lg text-on-ink">
              <Logo className="h-8 w-auto" />
            </a>
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed">{footer.blurb}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {footer.groups.map((g) => (
              <nav key={g.title} aria-label={g.title}>
                <h2 className="label text-on-ink-muted">{g.title}</h2>
                <ul className="mt-5 space-y-3">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-[0.9375rem] text-on-ink transition-colors hover:text-blush">
                        <span className="link-underline break-all sm:break-normal">{l.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-line-on-ink pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.operatorLine}</p>
          <p>
            © {year} {site.operator}
          </p>
        </div>
      </div>
    </footer>
  );
}
