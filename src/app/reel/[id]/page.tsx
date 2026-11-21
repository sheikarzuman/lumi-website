import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReelClient } from "@/components/reel/ReelClient";
import { REEL_IDS, isReelId } from "@/components/reel/reelIds";

export const metadata: Metadata = {
  title: "LUMI reel renderer",
  description: "Deterministic 9:16 render stage for LUMI concept reels. Internal tool.",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return REEL_IDS.map((id) => ({ id }));
}

export default async function ReelPage({ params }: PageProps<"/reel/[id]">) {
  const { id } = await params;
  if (!isReelId(id)) notFound();
  return <ReelClient id={id} />;
}
