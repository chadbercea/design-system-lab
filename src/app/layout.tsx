import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import SimpleDemoFirstLaunch from "@/components/auth/SimpleDemoFirstLaunch";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${firaCode.variable} antialiased font-mono`}
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
