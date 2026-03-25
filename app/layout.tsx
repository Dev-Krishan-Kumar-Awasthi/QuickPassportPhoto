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
    default: "Quick Passport Photo Maker Online | Best AI Passport Size Photo Generator",
    template: "%s | QuickPassportPhoto"
  },
  description: "Create official passport & ID photos in 15 seconds. High-quality AI passport photo maker with automated background removal & biometric cropping. Perfect for UPSC, SSC, Visa, and Indian ID cards.",
  keywords: [
    "quick passport photo", "passport photo maker online", "online passport size photo", 
    "ai passport photo generator", "passport size photo with date", "upsc photo maker",
    "ssc photo with date online", "visa photo maker", "biometric photo maker",
    "free passport photo maker", "passport photo background remover", "id photo maker",
    "passport photo maker india", "3.5x4.5 cm photo maker", "4x6 photo sheet maker",
    "krishan kumar awasthi", "kka photo tool", "passport photo editor free"
  ].join(", "),
  authors: [{ name: "Krishan Kumar Awasthi", url: "https://kkawasthi.vercel.app/" }],
  creator: "Krishan Kumar Awasthi",
  publisher: "QuickPassportPhoto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://quick-passport-photo.vercel.app',
  },
  openGraph: {
    title: "Quick Passport Photo Maker Online | AI Powered ID Studio",
    description: "Get print-ready passport photos instantly with AI. 100% automated background removal and cropping for UPSC, SSC, and Visa.",
    url: "https://quick-passport-photo.vercel.app",
    siteName: "QuickPassportPhoto",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 600,
        alt: "Quick Passport Photo Maker Website"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Passport Photo Maker | AI ID Photo Generator",
    description: "Create official passport & ID photos in 15 seconds. No editing skills required.",
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
    google: "gRA9DqcG_Dr6NCAW_thkqXlHJj58SQp1TPur6sUrUSI",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QuickPassportPhoto",
    "operatingSystem": "Any",
    "applicationCategory": "PhotographyApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200"
    },
    "description": "Best AI-powered passport photo maker online. Create official passport and visa photos in 15 seconds with automated background removal."
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to make a passport size photo online for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply upload your selfie to QuickPassportPhoto. Our AI will automatically remove the background, crop it to official dimensions (like 3.5x4.5 cm), and generate a print-ready sheet in 15 seconds."
        }
      },
      {
        "@type": "Question",
        "name": "What is the standard passport photo size in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The standard size is 3.5 x 4.5 cm with the face covering 70-80% of the photo. Our tool automatically crops your photo to these exact specifications."
        }
      },
      {
        "@type": "Question",
        "name": "Is this tool suitable for UPSC or SSC exam forms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We offer specific templates for UPSC, SSC, and other Indian competitive exams, including 'Name and Date' overlay options required by many government portals."
        }
      }
    ]
  }
];

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
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
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
