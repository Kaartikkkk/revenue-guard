import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RevenueGuard AI — Autonomous Payment Recovery Agent",
  description: "AI-powered payment recovery agent that detects failed payments, diagnoses failures, and orchestrates smart recovery strategies with full audit trails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.className} bg-gray-950 text-gray-100 antialiased selection:bg-indigo-500 selection:text-white`}>
        {/* Background Mesh & Glow Orbs */}
        <div className="fixed inset-0 bg-cyber-grid opacity-30 pointer-events-none z-0" />
        <div className="bg-glow-orb-1" />
        <div className="bg-glow-orb-2" />

        <div className="relative z-10 flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
