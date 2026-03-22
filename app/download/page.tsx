'use client';

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
                minWidth: 260, fontSize: 17, padding: '18px 32px', justifyContent: 'center',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                borderRadius: 16
              }}
            >
              {downloading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
              {t.downloadPDF}
            </button>

            <button
              onClick={handlePrint}
              style={{ 
                minWidth: 200, fontSize: 17, padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 10,
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

            <button onClick={() => router.push('/')} style={{ fontSize: 15, padding: '16px', justifyContent: 'center', background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', color: '#334155', borderRadius: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} /> {lang === 'en' ? 'Create Another for Free' : 'Ek aur Muft banayein'}
            </button>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card animate-in zoom-in duration-300" style={{ maxWidth: 400, width: '100%', padding: 40, textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowRating(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20 }}>&times;</button>
            <div style={{ width: 64, height: 64, background: 'rgba(103, 58, 183, 0.1)', color: '#673AB7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Zap size={32} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>{lang === 'en' ? 'Help us improve!' : 'Hamari help karein!'}</h2>
            <p style={{ color: '#64748b', marginBottom: 32, fontWeight: 500, lineHeight: 1.5 }}>
              {lang === 'en' ? 'How was your experience with QuickPassportPhoto?' : 'QuickPassportPhoto ke saath aapka anubhav kaisa raha?'}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => { setRating(star); setRated(true); setTimeout(() => setShowRating(false), 1000); }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', transition: '0.2s', transform: rating >= star ? 'scale(1.2)' : 'scale(1)' }}
                >
                  <Zap size={32} color={rating >= star ? '#673AB7' : '#e2e8f0'} fill={rating >= star ? '#673AB7' : 'none'} />
                </button>
              ))}
            </div>

            {rated && <div className="animate-in fade-in slide-in-from-bottom-2" style={{ color: '#10b981', fontWeight: 700, fontSize: 14 }}>{lang === 'en' ? 'Thanks for the feedback!' : 'Feedback ke liye dhanyawad!'}</div>}
          </div>
        </div>
      )}
    </main>
  );
}
