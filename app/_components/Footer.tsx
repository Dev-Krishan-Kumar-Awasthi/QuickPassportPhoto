import Link from 'next/link';
import Image from 'next/image';
import logoSrc from '../../public/Logo.png';
import { Zap, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#FFB6C1', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '60px 0 30px', color: '#333' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Image src={logoSrc} alt="QuickPassportPhoto" width={34} height={34} style={{ borderRadius: 9, objectFit: 'cover' }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#673AB7' }}>
                QuickPassportPhoto
              </span>
            </div>
            <p style={{ color: '#555', fontSize: 14, lineHeight: '1.6', maxWidth: 240 }}>
              Say goodbye to studio visits. Create perfect passport, visa, and ID photos from your phone in seconds.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(103,58,183,0.15)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(103,58,183,0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.05)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.08)'; }}
                >
                  <Icon size={15} color="#673AB7" />
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ color: '#673AB7', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="#features" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>Features</Link>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openOnboarding'))}
                style={{ background: 'none', border: 'none', color: '#444', fontSize: 14, cursor: 'pointer', textAlign: 'left', padding: 0 }}
              >
                How it works
              </button>
              <Link href="#pricing" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>Pricing</Link>
              <Link href="/upload" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>Create Photo</Link>
              <Link href="#" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>B2B API</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#673AB7', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="#" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>About Us</Link>
              <Link href="/privacy" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>Terms of Service</Link>
              <Link href="/terms#refunds" style={{ color: '#444', fontSize: 14, textDecoration: 'none' }}>Refund Policy</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#673AB7', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Get in touch</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#444', fontSize: 14, marginBottom: 10 }}>
              <Mail size={14} />
              hello@quickpassportphoto.com
            </div>
            <div style={{
              marginTop: 20, padding: '14px 18px',
              background: 'rgba(103,58,183,0.08)', border: '1px solid rgba(103,58,183,0.2)',
              borderRadius: 12,
            }}>
              <p style={{ color: '#673AB7', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>🎉 Launching soon</p>
              <p style={{ color: '#555', fontSize: 12 }}>Be first to know when we go live</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#666', fontSize: 13 }}>© 2025 QuickPassportPhoto. All rights reserved.</p>
          <p style={{ color: '#666', fontSize: 13 }}>Made with ⚡ in India</p>
        </div>
      </div>
    </footer>
  );
}
