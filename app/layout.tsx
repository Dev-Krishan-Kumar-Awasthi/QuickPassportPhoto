import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Preloader from "./_components/Preloader";
import CustomCursor from "./_components/CustomCursor";
import ParticlesBackground from "./_components/ParticlesBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://quick-passport-photo.vercel.app'),
  title: {
    default: "QuickPassportPhoto | Best AI Passport Photo Maker by Krishan Kumar Awasthi",
    template: "%s | QuickPassportPhoto KKA"
  },
  description: "Create official passport & ID photos in 15 seconds. Top-rated AI photo studio tool by Krishan Kumar Awasthi (KKA). Perfect for UPSC, SSC, Visa, and Exam cards with automated background removal and biometric cropping.",
  keywords: [
    "passport photo maker", "online passport photo", "passport size photo online", 
    "automatic background remover", "biometric photo maker", "visa photo maker",
    "upsc photo generator", "ssc photo with date maker", "exam photo editor",
    "krishan kumar awasthi", "kka shivpuri", "kka developer", "kka photo tool",
    "id photo maker free", "passport photo print sheet", "4x6 photo sheet maker",
    "passport photo maker india", "best passport photo tool", "ai background removal"
  ].join(", "),
  authors: [{ name: "Krishan Kumar Awasthi", url: "https://kkawasthi.vercel.app/" }],
  creator: "Krishan Kumar Awasthi (KKA)",
  publisher: "QuickPassportPhoto",
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
        
        {/* Simple Footer */}
        <footer style={{ 
          padding: '40px 24px', textAlign: 'center', position: 'relative', zIndex: 10,
          background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)',
          marginTop: 60
        }}>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>
            {new Date().getFullYear()} QuickPassportPhoto &copy; All Rights Reserved.
          </p>
          <div style={{ marginTop: 8, color: '#475569', fontSize: 15, fontWeight: 700 }}>
            Designed & Developed by{' '}
            <a 
              href="https://kkawasthi.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#673AB7', textDecoration: 'none', borderBottom: '2px solid rgba(103, 58, 183, 0.2)' }}
            >
              Krishan Kumar Awasthi
            </a>
          </div>
        </footer>

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
