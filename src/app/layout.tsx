import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RevenueGuard AI — Intelligent Payment Recovery Agent",
  description: "AI-powered payment recovery agent that detects failed payments, diagnoses failures with Google Gemini, and orchestrates smart recovery strategies with full audit trails.",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.className} bg-[#070a12] text-slate-100 antialiased selection:bg-blue-600 selection:text-white relative min-h-screen`}>
        {/* Ambient Background Artwork & Lighting Layer */}
        <div className="app-bg-container">
          <div className="app-bg-image" />
          <div className="app-bg-overlay" />
          <div className="bg-cyber-grid absolute inset-0 opacity-40" />
        </div>

        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
