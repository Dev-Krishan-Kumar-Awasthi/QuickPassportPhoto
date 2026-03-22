'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import logoSrc from '../../public/Logo.png';

import { translations, Language } from '../../lib/translations';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang) setLang(savedLang);

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  const t = translations[lang];

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      backgroundColor: '#673AB7', /* Deep Purple */
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: scrolled ? '12px 0' : '20px 0',
      boxShadow: scrolled ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Image src={logoSrc} alt="QuickPassportPhoto" width={36} height={36} style={{ borderRadius: 10, objectFit: 'cover' }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.3px' }}>
            QuickPassportPhoto
          </span>
        </Link>

        {/* Translation Toggle */}
        <button 
          onClick={toggleLang}
          style={{ 
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', 
            color: 'white', padding: '6px 12px', borderRadius: 8, fontSize: 13, 
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            marginLeft: 20, transition: 'all 0.3s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>

        {/* Navigation links - Desktop */}
        <div className="desktop-only" style={{ gap: 32, alignItems: 'center' }}>
          <Link href="/#features" style={{ color: '#fff', fontSize: 15, fontWeight: 500, textDecoration: 'none', opacity: 0.9, transition: 'color 0.2s' }}>
            {t.features}
          </Link>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openOnboarding'))}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', opacity: 0.9, transition: 'color 0.2s', padding: 0 }}
          >
            {t.howItWorks}
          </button>
          <Link href="/#pricing" style={{ color: '#fff', fontSize: 15, fontWeight: 500, textDecoration: 'none', opacity: 0.9, transition: 'color 0.2s' }}>
            {t.pricing}
          </Link>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/upload" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
            <Zap size={15} />
            {t.tryFree}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            className="mobile-only"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#673AB7',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 20,
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
        }} className="mobile-only">
          <Link href="/#features" onClick={() => setMenuOpen(false)} style={{ color: '#fff', fontSize: 16, textDecoration: 'none', fontWeight: 500 }}>Features</Link>
          <button 
            onClick={() => { window.dispatchEvent(new CustomEvent('openOnboarding')); setMenuOpen(false); }}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16, textAlign: 'left', fontWeight: 500, cursor: 'pointer', padding: 0 }}
          >
            How it works
          </button>
          <Link href="/#pricing" onClick={() => setMenuOpen(false)} style={{ color: '#fff', fontSize: 16, textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
          <Link href="/upload" onClick={() => setMenuOpen(false)} style={{
            background: '#ffffff', color: '#673AB7', padding: '12px', borderRadius: 8, textAlign: 'center', fontWeight: 700, textDecoration: 'none', marginTop: 10
          }}>
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
