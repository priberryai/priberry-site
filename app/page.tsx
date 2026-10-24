import { GradingPanel } from "@/components/grading-panel/GradingPanel";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Notes } from "@/components/sections/Notes";
import { Pilot } from "@/components/sections/Pilot";
import { Principles } from "@/components/sections/Principles";
import { Problem } from "@/components/sections/Problem";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { Who } from "@/components/sections/Who";

// Section order follows docs/design-direction.md. Copy for each lives in /content.
// The grading panel below is interim: the scroll-driven grade story replaces it
// (and the old "Anatomy" section, now removed) in the next step.
export default function Home() {
  return (
    <>
      <Hero />
      <section aria-label="An illustrative grade" className="container-page pb-28 pt-8 md:pb-36">
        <GradingPanel />
      </section>
      <Problem />
      <HowItWorks />
      <WhatWeBuild />
      <Principles />
      <Who />
      <Notes />
      <Faq />
      <Pilot />
    </>
  );
}
