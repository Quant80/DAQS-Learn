import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DAQS Learn — AI-Powered Cloud Learning",
  description: "The AI-powered cloud learning platform by DAQS. Notebooks, Studio, Live Classes, and more.",
  openGraph: {
    title: "DAQS Learn",
    description: "Learn with AI. Built for Africa.",
    url: "https://learn.daqstech.com",
    siteName: "DAQS Learn",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#060d1a] text-white">{children}</body>
    </html>
  );
}
