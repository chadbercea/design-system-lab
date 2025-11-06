import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import SimpleDemoFirstLaunch from "@/components/auth/SimpleDemoFirstLaunch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docker Hub Authentication",
  description: "Docker Hub authentication and container management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <DemoAuthProvider>
          <SimpleDemoFirstLaunch />
          {children}
        </DemoAuthProvider>
      </body>
    </html>
  );
}
