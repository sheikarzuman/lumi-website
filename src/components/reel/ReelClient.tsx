"use client";

import dynamic from "next/dynamic";
import type { ReelId } from "./reelIds";

// WebGL + window-only code: never server-render the stage
const ReelById = dynamic(() => import("./ReelById"), { ssr: false });

export function ReelClient({ id }: { id: ReelId }) {
  return <ReelById id={id} />;
}
