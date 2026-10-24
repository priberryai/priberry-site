import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CONTACT_EMAIL, site } from "@/content/site";
import "./globals.css";

const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

// One family, two optical cuts (provisional choice from docs/type-specimen).
// next/font downloads these at build time and serves them from our own origin.
// To change the typeface, change these two imports only.
const display = Funnel_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-funnel-display",
  display: "swap",
});
const sans = Funnel_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-funnel-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  // Icons and social images come from app/icon.svg, app/apple-icon.tsx,
  // app/opengraph-image.tsx and app/twitter-image.tsx.
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/priberry-app-icon.svg`,
  email: CONTACT_EMAIL,
  description: site.description,
  parentOrganization: {
    "@type": "Organization",
    name: site.operator,
    address: { "@type": "PostalAddress", addressCountry: "IN" },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available before first paint, so reveal styles never hide content without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <RevealObserver />
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Cloudflare Web Analytics: cookie-free, so no consent banner. Set the token at build time. */}
        {CF_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
