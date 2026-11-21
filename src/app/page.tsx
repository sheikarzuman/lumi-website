import { ClientShell } from "@/components/layout/ClientShell";
import { Footer } from "@/components/layout/Footer";
import { Cares } from "@/components/sections/Cares";
import { Collection } from "@/components/sections/Collection";
import { Experience } from "@/components/sections/Experience";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Innovation } from "@/components/sections/Innovation";
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
        <Cares />
        <Experience />
        <FinalCta />
      </main>
      <Footer />
    </ClientShell>
  );
}
