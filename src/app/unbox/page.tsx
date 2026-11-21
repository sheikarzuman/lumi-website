import type { Metadata } from "next";
import { UnboxExperience } from "@/components/unbox/UnboxExperience";

export const metadata: Metadata = {
  title: "Pull a blind box | LUMI concept",
  description:
    "Open a virtual LUMI blind box in 3D and collect the ten proposed shell colourways. Concept, proposed odds, nothing is on sale.",
};

export default function UnboxPage() {
  return <UnboxExperience />;
}
