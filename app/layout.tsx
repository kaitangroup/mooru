import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/providers";
import InitialOverlay from '@/components/InitialOverlay'; 
import { Toaster } from "@/components/ui/toaster";
import { Playfair_Display } from "next/font/google";

import { Inter } from "next/font/google";
const zodiak = localFont({
  src: [
    { path: "./fonts/Zodiak-Regular.woff2", weight: "400" },

    { path: "./fonts/Zodiak-Bold.woff2", weight: "700" },
  ],
  variable: "--font-display",
  display: "swap",
});

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Regular.woff2", weight: "400" },
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500" },
    { path: "./fonts/GeneralSans-Semibold.woff2", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
});


const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Guroos - Read, Listen, Watch, Ask",
  description:
    "Connect with qualified authors for personalized learning. Browse subjects, book lessons, and achieve your academic goals.",
  keywords:
    "author, authoring, education, learning, online authoring, academic support",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${generalSans.variable} ${zodiak.variable} bg-[#f7f6f2] text-[#28251d]`}
        suppressHydrationWarning
      >
        <Providers>
          <InitialOverlay minMs={400} oncePerTab={true} />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
