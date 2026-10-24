# Priberry design direction: from "well built" to "obviously made by people"

Research date: 24 October 2026. Status: **proposal, awaiting approval.** Nothing here is built yet.

## 1. The honest verdict on the current site

The current build is fast (desktop Lighthouse 100/100/100/100), accessible (0 axe violations at 5 widths) and correct. But measured against what designers now list as tells of AI-generated sites, it carries **seven of them**. Most come straight from the original brief, which itself followed the category's current look:

| Tell (from designer write-ups) | Where it is on our site |
| --- | --- |
| The Instrument Serif + Geist + Geist Mono pairing, "the recurring AI font pairing" | Whole site |
| An italic serif accent line in the hero | "We teach it how experts decide." |
| A tiny uppercase letter-spaced label above every heading | Every section ("THE PROBLEM", "HOW IT WORKS", …) |
| Decorative 01 / 02 / 03 numbering | Steps, product cards, principles |
| Identical rounded cards with an icon on top | "What we build", Notes |
| Coloured glows and soft gradients for "polish" | Hero, Principles, Pilot backgrounds |
| Fade-and-rise on every block as it scrolls in | Every section |

Also on the list: *numbers with no source* (ours is sourced, good) and *people with no face* (we have no team, no names, no photos — a real gap, see section 6).

None of these is wrong on its own. Together they make the page read like the average of 2026 SaaS sites, which is exactly what a model produces and exactly what a sharp buyer recognises in five seconds.

## 2. What Apple actually does (principles, then measurements)

From the Human Interface Guidelines (paraphrased):

- **Motion must have a purpose.** Don't animate for its own sake; excessive animation distracts and can make people physically uncomfortable. Keep feedback motion brief and precise. Let people cancel or skip motion. Never make motion the only carrier of information.
- **Typography conveys hierarchy with as few typefaces as possible.** Mixing faces "obscures hierarchy" and makes an interface feel inconsistent. Avoid light weights; prefer Regular to Bold. Hierarchy comes from size, weight and colour.
- **Layout:** align to make things scannable; group with negative space rather than boxes and lines; use consistent spacing.
- **Colour:** one meaning per colour; never rely on colour alone; keep contrast high in the resting state.
- **Writing:** be clear, cut every word that isn't needed, plain language, one capitalisation style applied consistently.

Measured on apple.com/macbook-pro (24 Oct 2026):

- **One type family** (SF Pro Display/Text). No serif, no mono, **zero uppercase labels** on the page.
- Headlines: **semibold (600), 40–64px**, line-height ≈1.07, tracking slightly negative. Short declarative sentences with a full stop: "Fast runs in the family."
- Even supporting copy is often **24px semibold**: confident, not whispered grey.
- Colour: #f5f5f7 text on pure black / #1d1d1f sections; flat fills, no gradients on type.
- Rhythm: section padding a steady **120px**; sticky local nav; **sticky containers** that pin a visual while the story scrolls past.
- The product carries the page: 14 videos and 278 images. Copy is a caption to the product, not the other way round.

What this means for Priberry: Apple's look is not "minimal". It is **one idea per screen, the product as the hero, one typeface used with total confidence, and motion the visitor controls by scrolling.**

> We will design *like* Apple, not *as* Apple: no SF Pro font files (their licence restricts them to Apple platforms), no Apple imagery or layout copies. The principles are free to use; the brand is not.

## 3. Skills and tools

- Already enabled: Anthropic **design** plugin (design critique, design system, UX copy, accessibility review). I will run its critique on every section.
- Recommended for you to add (install card shown in chat): **frontend-design** (official Anthropic, built specifically to avoid generic AI aesthetics) and **audit-suite** (web-animation-design, web-design-guidelines, make-interfaces-feel-better, design-engineering lens).
- Not recommended: community packs that request privileged access (hooks) for this work.
- No new npm dependency is needed. `motion` (already approved) covers scroll-linked choreography; CSS scroll-driven animations cover the rest with no JavaScript.

## 4. Proposed direction

### Type: one family, used like Apple uses SF
- Replace the three-font pairing with **one grotesk family** for everything: headlines semibold, body regular, labels in sentence case. No serif accent, no mono labels.
- Headlines: short, declarative, sentence case, ending in a full stop. Desktop 56–72px semibold, tracking −0.015em. Supporting lines at 21–24px medium.
- The single biggest "made by a studio" signal is a **licensed commercial typeface** (for example Söhne from Klim, or Neue Haas Unica). A web licence is a few hundred US dollars. Free alternative: I render a side-by-side specimen page of 3–4 less over-used open-source grotesks and we choose from real renders, not names.

### Colour: flat and decisive
- Paper and ink; **berry as the one accent**, used only for action and for the grade. Remove lilac washes, glows and gradients.
- One full-bleed ink section where the story peaks (the grade), Apple-style.

### Layout: one idea per screen, no templates
- No repeated icon-card grids. No 01/02/03 numbering. No eyebrow labels.
- Each section gets its own composition, driven by its content.

### The signature: a scroll-driven "grade", not a looping demo
Replace the auto-looping panel with an Apple-style **pinned story** (sticky stage, ~350vh of scroll):

1. A real-looking professional task arrives.
2. The model's answer writes in.
3. An expert's rubric slides alongside: weights, then the shortcut penalty.
4. Criteria resolve one by one as you scroll; the score counts as you go; the seven-circle mark fills.
5. The verdict lands on full ink: "4 / 10. Not sendable." Then the page releases.

The visitor controls the pace (HIG: let people control motion). It plays backwards if they scroll back. Under reduced motion it becomes five still frames. This one sequence replaces "How it works", "Anatomy" and the hero loop, and becomes the thing people remember.

### Graphics: bespoke, from our own geometry
- An illustration system built from the hexagonal seven-circle grid: rubric visualisations, a field map, the pipeline. Drawn as precise SVG, not glows or stock.
- No stock photography, ever. Real photography only (see section 6).

### Motion rules (written into the code as tokens)
- UI feedback 150–250ms; section transitions 350–500ms; one spring for physical moves.
- Scroll-linked motion only where it tells the story. **No fade-up on every block**: most content simply sits there, confidently.
- Everything interruptible; full reduced-motion path; no loops.

### Copy
- Shorter. Every headline is a claim we can stand behind, in sentence case.
- Specifics over adjectives, which we already mostly do.

## 5. What stays
The stack, the performance and accessibility work, the form and its backend, the sourced 16% figure, the content in `/content`, the article, the legal pages.

## 6. What I need from you (cannot be invented)
1. **Approval of this direction.**
2. **Typeface:** buy a commercial licence (I'll give two options with prices) or choose from free specimens.
3. **Human evidence**, the strongest anti-AI signal there is: founder and team names, roles, real photos (a short professional shoot beats any illustration), LinkedIn links, AURIST's CIN or registered address for the footer. Without these the site will always feel faceless. I will not fabricate people or use stock faces.
4. Optional: a real (anonymised) task you have actually built, to replace the invented example once you have one.

## Sources
- Apple Human Interface Guidelines: Motion, Typography, Layout, Color, Writing (developer.apple.com/design/human-interface-guidelines), read 24 Oct 2026.
- apple.com/macbook-pro, computed styles measured 24 Oct 2026.
- [AI Design Slop: 16 Patterns That Mark a Site as Vibe-Coded](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it)
- [AI slop: 8 signs a website was generated by AI (TeneX Studio)](https://tenex.studio/en/blog/ai-slop-8-signs/)
- [Vibe-Coded Website Examples (2026)](https://www.ohhwells.com/blog/vibe-coded-website)
- [How to tell if a website is AI-generated: 10 signs](https://slopdar.com/guide/how-to-tell-if-a-website-is-ai-generated)
- [Why Your AI Keeps Building the Same Purple Gradient Website](https://scour.ing/@emschwartz/p/https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)
- [Anti AI slop ban list](https://github.com/Laith0003/ux-skill/wiki/Anti-AI-slop-ban-list)
- [Scrollytelling mechanics](https://theplusaddons.com/blog/scrollytelling/)

These write-ups are designer and agency opinion, not research; they are used as a checklist, not as proof.
