import type { Metadata, Viewport } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUMI — Sun protection that goes wherever you go",
  description:
    "LUMI is a concept-stage, refillable clip-on sunscreen with a collectible charm and a give-back model. Proposed product — not yet available.",
  openGraph: {
    title: "LUMI — Carry your sunshine",
    description:
      "A concept-stage, refillable clip-on sunscreen. Glow on. Give back.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF7ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-plum">
        {children}
      </body>
    </html>
  );
}
