import type { Metadata } from "next";
import { ClientShell } from "@/components/layout/ClientShell";
import { Footer } from "@/components/layout/Footer";
import { FounderCard } from "@/components/investors/FounderCard";
import { InquiryForm } from "@/components/investors/InquiryForm";
import { InvestorHero } from "@/components/investors/InvestorHero";
import { UnitEconomics } from "@/components/investors/UnitEconomics";
import { UseOfFunds } from "@/components/investors/UseOfFunds";
import { THESIS } from "@/lib/investor";

export const metadata: Metadata = {
  title: "For Investors | LUMI concept",
  description: `${THESIS.headline} Pre-seed thesis, unit economics, use of funds and founder profile for LUMI, a concept-stage refillable clip-on sunscreen.`,
};

export default function InvestorsPage() {
  return (
    <ClientShell intro={false}>
      <main>
        <InvestorHero />
        <UnitEconomics />
        <UseOfFunds />
        <FounderCard />
        <InquiryForm />
      </main>
      <Footer />
    </ClientShell>
  );
}
