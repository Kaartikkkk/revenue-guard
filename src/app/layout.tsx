import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RevenueGuard — Intelligent Payment Recovery",
  description: "AI-powered payment recovery agent that detects failed payments, diagnoses failures, and orchestrates smart recovery strategies with full audit trails.",
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
      <body className={`${fontSans.className} bg-[#070a12] text-slate-100 antialiased selection:bg-blue-600 selection:text-white`}>
        <div className="flex h-screen overflow-hidden bg-[#070a12] font-sans">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto bg-[#070a12]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
