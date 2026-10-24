import { Anatomy } from "@/components/sections/Anatomy";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Notes } from "@/components/sections/Notes";
import { Pilot } from "@/components/sections/Pilot";
import { Principles } from "@/components/sections/Principles";
import { Problem } from "@/components/sections/Problem";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { Who } from "@/components/sections/Who";

// Section order follows the brief. Copy for each lives in /content.
export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <WhatWeBuild />
      <Anatomy />
      <Principles />
      <Who />
      <Notes />
      <Faq />
      <Pilot />
    </>
  );
}
