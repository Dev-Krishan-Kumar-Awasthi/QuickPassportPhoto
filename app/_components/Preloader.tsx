'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logoSrc from '../../public/Logo.png';

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Show for 2 seconds, fade out for 0.5s
    const timer1 = setTimeout(() => setFade(true), 1500);
    const timer2 = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = ''; // allow scroll again explicitly
    }, 2000);
    
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.style.overflow = ''; // failsafe
    };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: '#f4f9fd', // Soft blue matching reference
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: fade ? 0 : 1, transition: 'opacity 0.5s ease'
    }}>
      {/* Circle Icon Container (With App Logo) */}
      <div style={{
        width: 120, height: 120, borderRadius: '50%',
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', // subtle white/grey background
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 30, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        position: 'relative', overflow: 'hidden'
      }}>
        <Image src={logoSrc} alt="QuickPassportPhoto Logo" width={90} height={90} style={{ objectFit: 'contain' }} />
      </div>
      
      {/* CSS Loader Ring */}
      <div style={{
        width: 50, height: 50, borderRadius: '50%',
        border: '4px solid rgba(52, 152, 219, 0.15)',
        borderTopColor: '#3498db',
        animation: 'preloader-spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        marginBottom: 24
      }} />

      {/* Text matching reference */}
      <h1 style={{ 
        color: '#1e293b', fontSize: 26, fontWeight: 800, 
        marginBottom: 10, fontFamily: 'Plus Jakarta Sans, sans-serif',
        textAlign: 'center'
      }}>
        QuickPassportPhoto
      </h1>
      <p style={{ color: '#3498db', fontSize: 16, fontWeight: 500 }}>
        Loading Excellence...
      </p>

      {/* Inlined global animation style since Next App Router doesn't like generic <style jsx> outside Next files initially */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes preloader-spin { 
          100% { transform: rotate(360deg); } 
        }
      `}} />
    </div>
  );
}
