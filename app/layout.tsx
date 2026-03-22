import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Preloader from "./_components/Preloader";
import CustomCursor from "./_components/CustomCursor";
import ParticlesBackground from "./_components/ParticlesBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://quickpassportphoto.com'),
  title: {
    default: "QuickPassportPhoto | Shivpuri's Best Photo Maker by Krishan Kumar Awasthi",
    template: "%s | QuickPassportPhoto KKA Shivpuri"
  },
  description: "Create instant passport & ID photos in 15 seconds. Top-rated AI photo studio tool in Shivpuri by Krishan Kumar Awasthi (KKA). Perfect background removal, biometric cropping, and print-ready sheets.",
  keywords: [
    "photo", "shivpuri", "krishan kumar awasthi", "kka", 
    "photo shivpuri", "shivpuri photo studio", "best photo shivpuri",
    "krishan kumar awasthi photo", "kka shivpuri", "kka photo",
    "passport photo shivpuri", "urgent photo shivpuri", "online photo maker",
    "passport size photo", "ID photo generator", "AI photo", 
    "background remover shivpuri", "krishan kumar awasthi photography",
    "quick passport photo", "instant photo sheet", "print ready photo shivpuri"
  ].join(", "),
  authors: [{ name: "Krishan Kumar Awasthi", url: "https://quickpassportphoto.com" }],
  creator: "Krishan Kumar Awasthi (KKA)",
  publisher: "QuickPassportPhoto Shivpuri",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "QuickPassportPhoto by Krishan Kumar Awasthi | Shivpuri",
    description: "Get print-ready passport photos instantly. Created by KKA in Shivpuri. 100% automated background removal and cropping.",
    url: "https://quickpassportphoto.com",
    siteName: "QuickPassportPhoto Shivpuri",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 600,
        alt: "QuickPassportPhoto by Krishan Kumar Awasthi (KKA)"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickPassportPhoto | Krishan Kumar Awasthi | Shivpuri",
    description: "Instant passport photo maker in Shivpuri by KKA. Zero editing skills needed.",
    images: ["/Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Photography",
  manifest: "/manifest.json"
};

export const viewport = {
  themeColor: "#673AB7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Preloader />
        <CustomCursor />
        <ParticlesBackground />
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
