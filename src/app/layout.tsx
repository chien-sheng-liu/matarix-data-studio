import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mentarix Data Studio — Turning Data into Decisions",
  description:
    "We transform complex data into actionable intelligence. Big Data architecture, AI/ML solutions, and data-driven strategies for forward-thinking enterprises.",
  keywords: [
    "big data",
    "AI",
    "machine learning",
    "data analytics",
    "data visualization",
    "data strategy",
  ],
  openGraph: {
    title: "Mentarix Data Studio",
    description:
      "Turning Data into Decisions — Big Data, AI, and Data-Driven Strategy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="relative">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
