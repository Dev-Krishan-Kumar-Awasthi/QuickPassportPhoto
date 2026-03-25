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
    "krishan kumar awasthi", "kka photo tool", "passport photo editor free",
    "us visa photo 2x2 online", "schengen visa photo online", "uk passport photo maker",
    "australia visa photo online", "student id card photo maker", "resume photo editor",
    "linkedin profile photo maker", "professional headshot ai", "image background remover id",
    "passport photo studio near me online", "instant passport photo print", 
    "passport photo on a4 sheet", "8 passport photos on 4x6", "digital passport photo",
    "biometric id photo", "government exam photo maker", "neet exam photo generator",
    "jee main photo with name and date", "gate exam photo resizer", "ibps photo maker",
    "railway exam photo with date", "pan card photo resizer", "adhaar card photo update",
    "driving license photo maker", "school id photo generator", "corporate id photo",
    "passport photo app for android", "passport photo app for iphone", "best ai photo editor",
    "remove background from selfie for passport", "change photo background to white", 
    "blue background passport photo", "grey background passport photo", "red background passport photo",
    "passport photo size chart", "standard passport photo dimensions", "passport photo requirements india",
    "make passport photo at home", "print passport photo at home", "passport photo template a4",
    "passport photo template 4x6", "passport photo template 5x7", "passport photo layout maker",
    "auto crop face for passport", "face alignment tool for id", "biometric compliance check",
    "passport photo for baby", "infant passport photo online", "passport photo for kids",
    "passport photo for elderly", "fast photo studio online", "cheap passport photo maker",
    "high quality passport photo", "300 dpi photo maker", "uncompressed passport photo",
    "passport photo file size reducer", "kb to mb photo converter for exam", "photo resizer within 50kb",
    "passport photo edit online no login", "online photo studio shivpuri", "best developer shivpuri",
    "ai background removal api", "passport photo api for business", "b2b passport photo solution",
    "id photo software online", "passport photo creator free no watermark", "no watermark passport photo maker",
    "passport size photo maker app", "passport photo maker software", "ai image enhancement for id",
    "unsharp mask for passport", "lighting boost for portrait", "color correction for passport photo",
    "official id photo studio", "digital id photo maker", "e-passport photo creator",
    "online visa application photo", "ds-160 photo maker", "dv lottery photo generator",
    "passport photo check online", "is my passport photo valid", "passport photo validator",
    "biometric data protection", "privacy first photo maker", "secure id photo generator",
    "top rated passport tool", "most popular id photo maker", "easy passport photo maker",
    "one click passport photo", "smart passport photo studio", "next generation id photo",
    "photo for competitive exams", "all india exam photo tool", "state psc photo maker",
    "ssc gd photo with date", "upsc cse photo maker", "rbi assistant photo generator",
    "passport photo for bank account", "kyc photo maker online", "instant kyc photo",
    "passport photo for passport seva", "online passport application portal", "passport seva photo upload",
    "passport size photo dimensions pixels", "350x450 pixels photo maker", "600x600 pixels visa photo",
    "high resolution id photo", "print ready photo sheet", "pdf passport photo maker",
    "jpg passport photo maker", "png to passport photo converter", "heic to passport photo"
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
      "reviewCount": "250"
    },
    "description": "Professional AI-powered passport photo maker online. Create official passport, visa, and ID photos in 15 seconds with automated background removal, biometric face cropping, and print-ready sheet layouts for UPSC, SSC, and Global Visas.",
    "keywords": "passport photo maker, ai passport photo, online passport size photo, visa photo maker, upsc ssc photo with date, background remover id photo, biometric photo generator"
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
