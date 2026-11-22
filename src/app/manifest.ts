import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LUMI Reapply Reminder",
    short_name: "LUMI",
    description: "Tap your LUMI for reapply guidance that adapts to live UV Index and weather.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#FFF7ED",
    theme_color: "#FFF7ED",
  };
}
