import type { Metadata } from "next";
import { Suspense } from "react";
import { ReminderApp } from "@/components/app/ReminderApp";

export const metadata: Metadata = {
  title: "LUMI Reapply Reminder",
  description: "Tap your LUMI to start a sunscreen reapply timer. Concept prototype.",
  robots: { index: false },
};

export default function AppPage() {
  return (
    <Suspense fallback={null}>
      <ReminderApp />
    </Suspense>
  );
}
