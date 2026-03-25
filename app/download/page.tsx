'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle2, ChevronLeft, RefreshCw, Smartphone, Monitor, Printer, Loader2, Zap, Check } from 'lucide-react';
import Navbar from '../_components/Navbar';
import { generatePDF } from '../../lib/utils/pdfGenerator';
import { translations, Language } from '../../lib/translations';

export default function DownloadPage() {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [data, setData] = useState({
    bg: 'white',
    sheet: '4x6',
    count: '8',
    grid: '',
    composited: ''
  });

  useEffect(() => {
    const handleLangChange = () => {
      const savedLang = localStorage.getItem('app_lang') as Language;
      if (savedLang) setLang(savedLang);
    };
    handleLangChange();
    window.addEventListener('languageChange', handleLangChange);

    const bg = sessionStorage.getItem('preview_bg');
    const sheet = sessionStorage.getItem('preview_sheet');
    const count = sessionStorage.getItem('preview_count');
    const grid = sessionStorage.getItem('grid_image');
    const composited = sessionStorage.getItem('composited_image');

    if (!grid || !composited) {
      router.replace('/preview');
      return;
    }

    setData({ bg: bg || 'white', sheet: sheet || '4x6', count: count || '8', grid, composited });
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, [router]);

  const t = translations[lang];

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generatePDF({
        imageData: data.grid,
        backgroundColor: data.bg,
        count: Number(data.count)
      });
      setTimeout(() => setShowRating(true), 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    setTimeout(() => setShowRating(true), 2000);
  };

  const handleDownloadJPEG = () => {
    if (!data.composited) return;
    const link = document.createElement('a');
    link.href = data.composited;
    link.download = 'passport-photo.jpg';
    link.click();
    setTimeout(() => setShowRating(true), 1000);
  };

  return (
    <main style={{ minHeight: '100vh', padding: '100px 24px 60px', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ marginBottom: 48 }}>
          <div className="badge" style={{ display: 'inline-flex', marginBottom: 16, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Check size={14} /> {lang === 'en' ? 'Step 3 of 3 — Complete' : 'Sab kuch taiyar hai'}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1.2px', marginBottom: 12, color: '#1e293b' }}>
            {t.printReadyNote}
          </h1>
          <p style={{ color: '#64748b', fontSize: 18, fontWeight: 500, marginBottom: 32 }}>{lang === 'en' ? 'Your passport photo sheet is ready for high-quality printing.' : 'Aapki passport photo sheet high-quality print ke liye taiyar hai.'}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 48 }}>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn-primary"
              style={{ 
                minWidth: 220, fontSize: 17, padding: '18px 32px', justifyContent: 'center',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                borderRadius: 16
              }}
            >
              {downloading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
              {t.downloadPDF}
            </button>

            <button
              onClick={handleDownloadJPEG}
              disabled={!data.composited}
              style={{ 
                minWidth: 180, fontSize: 17, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none',
                borderRadius: 16, fontWeight: 700, cursor: 'pointer', transition: '0.2s', justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.35)',
                opacity: !data.composited ? 0.5 : 1
              }}
            >
              <Download size={20} />
              {lang === 'en' ? 'Save as JPEG' : 'JPEG Save karein'}
            </button>

            <button
              onClick={handlePrint}
              style={{ 
                minWidth: 180, fontSize: 17, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 10,
                background: '#ffffff', color: '#10b981', border: '2px solid #10b981',
                borderRadius: 16, fontWeight: 700, cursor: 'pointer', transition: '0.2s', justifyContent: 'center'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'}
              onMouseOut={e => e.currentTarget.style.background = '#ffffff'}
            >
              <Printer size={20} />
              {lang === 'en' ? 'Print Now (Ctrl+P)' : 'Direct Print Karein'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, textAlign: 'left', alignItems: 'start' }}>
          {/* Preview */}
          <div className="card preview-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', marginBottom: 16, textTransform: 'uppercase' }}>{lang === 'en' ? 'Final Sheet Preview' : 'Sheet Preview'}</h3>
            <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.05)' }}>
              {data.grid ? <img src={data.grid} alt="Final Sheet" style={{ width: '100%', display: 'block' }} /> : (
                <div style={{ padding: 40, color: '#64748b', fontSize: 13 }}>Loading preview...</div>
              )}
            </div>
          </div>

          {/* Printing Guide */}
          <div className="printing-guide" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ padding: 32, background: 'rgba(103, 58, 183, 0.03)', border: '1.5px dashed rgba(103, 58, 183, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Printer size={20} color="#673AB7" />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', margin: 0 }}>{t.printingInstructions}</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#673AB7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>1</div>
                  <p style={{ margin: 0, fontSize: 14, color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>{t.paperType}</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#673AB7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>2</div>
                  <p style={{ margin: 0, fontSize: 14, color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>{t.printerScale}</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#673AB7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>3</div>
                  <p style={{ margin: 0, fontSize: 14, color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>
                    {lang === 'en' 
                      ? 'No printer? Visit any Cyber Cafe or Studio nearby. It costs only ₹5-10 per sheet.' 
                      : 'Printer nahi hai? Kisi bhi bazzar ki shop ya cyber cafe par jayein. Sirf ₹5-10 mein print ho jayega.'}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => router.push('/upload?fresh=1')} style={{ flex: 1, fontSize: 15, padding: '16px', justifyContent: 'center', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)', color: '#334155', borderRadius: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={16} color="#673AB7" /> {lang === 'en' ? 'Create Another' : 'Ek aur banayein'}
              </button>
              <button onClick={() => router.push('/')} style={{ flex: 1, fontSize: 15, padding: '16px', justifyContent: 'center', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', color: '#64748b', borderRadius: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {lang === 'en' ? 'Go to Home' : 'Home par jayein'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* CSS for Print */}
      <style jsx global>{`
        @media print {
          nav, button, .badge, .printing-guide, .card:not(.preview-card) { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          .preview-card { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; max-width: none !important; position: fixed !important; top: 0 !important; left: 0 !important; }
          .preview-card h3 { display: none !important; }
          img { width: 100% !important; height: auto !important; }
        }
      `}</style>

      {/* Rating Modal */}
      {showRating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 5, 16, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card animate-in zoom-in duration-300" style={{ maxWidth: 420, width: '100%', padding: '48px 32px', textAlign: 'center', position: 'relative', background: '#ffffff', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setShowRating(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 24, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
            <div style={{ width: 72, height: 72, background: 'rgba(103, 58, 183, 0.1)', color: '#673AB7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <Zap size={40} fill="#673AB7" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1e293b', marginBottom: 12, letterSpacing: '-0.5px' }}>{lang === 'en' ? 'Help us improve!' : 'Hamari help karein!'}</h2>
            <p style={{ color: '#475569', marginBottom: 36, fontWeight: 600, fontSize: 16, lineHeight: 1.6 }}>
              {lang === 'en' ? 'How was your experience with QuickPassportPhoto?' : 'QuickPassportPhoto ke saath aapka anubhav kaisa raha?'}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onMouseEnter={() => !rated && setRating(star)}
                  onMouseLeave={() => !rated && setRating(0)}
                  onClick={() => { setRating(star); setRated(true); setTimeout(() => setShowRating(false), 1200); }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: rating >= star ? 'scale(1.2)' : 'scale(1)' }}
                >
                  <Zap size={40} color={rating >= star ? '#673AB7' : '#cbd5e1'} fill={rating >= star ? '#673AB7' : 'none'} />
                </button>
              ))}
            </div>

            {rated && <div className="animate-in fade-in slide-in-from-bottom-2" style={{ color: '#10b981', fontWeight: 800, fontSize: 15 }}>{lang === 'en' ? 'Thank you! Pushing to GitHub...' : 'Dhanyawad! GitHub par update ho raha hai...'}</div>}
          </div>
        </div>
      )}
    </main>
  );
}
