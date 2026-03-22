import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Preloader from "./_components/Preloader";
import CustomCursor from "./_components/CustomCursor";
import ParticlesBackground from "./_components/ParticlesBackground";
import { Github, Linkedin, MessageCircle, Mail, MapPin, Zap } from "lucide-react";
import Link from "next/link";

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
  manifest: "/manifest.json",
  verification: {
    google: "ADD_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },
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

        {/* Sophisticated Footer */}
        <footer style={{ 
          padding: '80px 24px 40px', position: 'relative', zIndex: 10,
          background: '#fff0f3', borderTop: '1px solid rgba(0,0,0,0.05)',
          marginTop: 100
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64, textAlign: 'left' }}>
              
              {/* Brand Col */}
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <img src="/Logo.png" alt="QuickPassportPhoto" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>QuickPassportPhoto</span>
                </div>
                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, maxWidth: 320, marginBottom: 24 }}>
                  Say goodbye to studio visits. Create perfect passport, visa, and ID photos from your phone in seconds.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <a href="https://github.com/Dev-Krishan-Kumar-Awasthi" target="_blank" rel="noreferrer" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', transition: '0.2s' }}>
                    <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/kkawasthi/" target="_blank" rel="noreferrer" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a66c2', transition: '0.2s' }}>
                    <Linkedin size={18} />
                  </a>
                  <a href="https://wa.me/917089881219" target="_blank" rel="noreferrer" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25d366', transition: '0.2s' }}>
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>

              {/* Product Col */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: 24, letterSpacing: '1px' }}>Product</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Features', 'How it works', 'Pricing', 'Create Photo', 'B2B API'].map(item => (
                    <li key={item}><Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{item}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Company Col */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: 24, letterSpacing: '1px' }}>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['About Us', 'Privacy Policy', 'Terms of Service', 'Refund Policy'].map(item => (
                    <li key={item}><Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{item}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Contact Col */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: 24, letterSpacing: '1px' }}>Get in touch</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <a href="mailto:awasthikrishnaa92@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                    <Mail size={16} /> awasthikrishnaa92@gmail.com
                  </a>
                  <div style={{ padding: 20, background: 'rgba(255,255,255,0.4)', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 13, color: '#673AB7', fontWeight: 700, marginBottom: 4 }}>🚀 Launching soon</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Be first to know when we go live</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div style={{ paddingTop: 32, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>
                &copy; {new Date().getFullYear()} QuickPassportPhoto. All rights reserved.
              </p>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                Designed & Developed by{' '}
                <a href="https://kkawasthi.vercel.app/" target="_blank" rel="noreferrer" style={{ color: '#673AB7', textDecoration: 'none', borderBottom: '1px solid rgba(103, 58, 183, 0.2)' }}>
                  Krishan Kumar Awasthi
                </a>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700 }}>
                Made with <Zap size={10} style={{ display: 'inline', margin: '0 2px' }} fill="#673AB7" color="#673AB7" /> in India
              </div>
            </div>
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
