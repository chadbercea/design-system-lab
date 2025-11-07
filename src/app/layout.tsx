import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import { PWARegister } from "@/components/PWARegister";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Docker Desktop Reimagined",
  description: "A modern, 3D-first reimagining of Docker Desktop's UI/UX with glassmorphic design",
  manifest: "/design-system-lab/docker-image-runner/manifest.json",
  themeColor: "#000000",
  icons: {
    icon: [
      { url: "/design-system-lab/docker-image-runner/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/design-system-lab/docker-image-runner/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/design-system-lab/docker-image-runner/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Docker Desktop Reimagined",
    description: "A modern, 3D-first reimagining of Docker Desktop's UI/UX with glassmorphic design",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Docker Desktop Reimagined - 3D Container Visualization",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docker Desktop Reimagined",
    description: "A modern, 3D-first reimagining of Docker Desktop's UI/UX with glassmorphic design",
    images: ["/twitter-image.png"],
  },
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
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${firaCode.variable} antialiased font-mono`}
        suppressHydrationWarning
      >
        <PWARegister />
        <DemoAuthProvider>
          {children}
        </DemoAuthProvider>
      </body>
    </html>
  );
}
