import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import SimpleDemoFirstLaunch from "@/components/auth/SimpleDemoFirstLaunch";
import { PWARegister } from "@/components/PWARegister";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Docker Desktop Reimagined",
  description: "A modern, 3D-first reimagining of Docker Desktop's UI/UX with glassmorphic design",
  manifest: "/design-system-lab/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Docker 3D",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${firaCode.variable} antialiased font-mono`}
        suppressHydrationWarning
      >
        <PWARegister />
        <DemoAuthProvider>
          <SimpleDemoFirstLaunch />
          {children}
        </DemoAuthProvider>
      </body>
    </html>
  );
}
