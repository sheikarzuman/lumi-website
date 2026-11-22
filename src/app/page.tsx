import { ClientShell } from "@/components/layout/ClientShell";
import { Footer } from "@/components/layout/Footer";
import { Collection } from "@/components/sections/Collection";
import { Experience } from "@/components/sections/Experience";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Innovation } from "@/components/sections/Innovation";
import { InvestorTeaser } from "@/components/sections/InvestorTeaser";
import { Loop } from "@/components/sections/Loop";
import { Waitlist } from "@/components/sections/Waitlist";
import { MeetLumi } from "@/components/sections/MeetLumi";
import { Problem } from "@/components/sections/Problem";
import { Reels } from "@/components/sections/Reels";
import { TapReminder } from "@/components/sections/TapReminder";

export default function Home() {
  return (
    <ClientShell>
      <main>
        <Hero />
        <Problem />
        <MeetLumi />
        <Collection />
        <Innovation />
        <TapReminder />
        <Reels />
        <Loop />
        <Experience />
        <Waitlist />
        <InvestorTeaser />
        <FinalCta />
      </main>
      <Footer />
    </ClientShell>
  );
}
