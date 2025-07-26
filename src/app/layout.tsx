import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/trpc/client";
import RedditMonitorInit from "@/components/reddit-monitor-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddit Monitor - Next.js Boilerplate",
  description: "Full-stack Next.js boilerplate with Reddit keyword monitoring, authentication, and tRPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RedditMonitorInit />
          {children}
        </body>
      </html>
    </Providers>
  );
}
