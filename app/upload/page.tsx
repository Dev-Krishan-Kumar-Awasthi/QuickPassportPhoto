'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Upload, Image as ImageIcon, X, Zap, ChevronLeft, AlertCircle, CheckCircle2, Camera, Check, Shield, Loader2 } from 'lucide-react';
import Navbar from '../_components/Navbar';
import { translations, Language } from '../../lib/translations';
import { loadFaceModels } from '../../lib/utils/faceCrop';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 10;

function UploadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    const handleLangChange = () => {
      const savedLang = localStorage.getItem('app_lang') as Language;
      if (savedLang) setLang(savedLang);
    };
    handleLangChange();
    window.addEventListener('languageChange', handleLangChange);

    // If user came from home page fresh start, clear old session data
    if (searchParams.get('fresh') === '1') {
      sessionStorage.removeItem('processed_images');
      sessionStorage.removeItem('processed_image');
      sessionStorage.removeItem('upload_dataurl');
      sessionStorage.removeItem('upload_name');
      sessionStorage.removeItem('face_detected');
      sessionStorage.removeItem('face_landmarks');
      sessionStorage.removeItem('crop_box');
    }

    return () => window.removeEventListener('languageChange', handleLangChange);
  }, [searchParams]);

  const t = translations[lang];

  const handleFile = (f: File) => {
    setError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_MB}MB.`);
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    
    // START PRE-LOADING AI MODELS IMMEDIATELY
    preloadAI();
  };

  const preloadAI = async () => {
    if (isPreloading) return;
    setIsPreloading(true);
    console.log('Pre-loading AI models...');
    try {
      // Pre-load face detection
      await loadFaceModels();
      // Pre-load background removal (triggers chunk download)
      await import('@imgly/background-removal');
      console.log('AI models pre-loaded successfully');
    } catch (e) {
      console.warn('AI pre-loading failed (will retry in processing page):', e);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleProcess = async () => {
    if (!file) return;

    // Use a Canvas to compress the image before sessionStorage to avoid QuotaExceededError
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to highly optimized JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        try {
          sessionStorage.setItem('upload_dataurl', compressedDataUrl);
          sessionStorage.setItem('upload_name', file.name);
          router.push('/processing');
        } catch (e) {
          console.error("Storage error:", e);
          setError("The image is too large for browser storage. Please try a smaller file or crop it first.");
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main style={{ minHeight: '100vh', padding: '100px 24px 60px', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        
        {/* Back */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 14, textDecoration: 'none', marginBottom: 32, fontWeight: 500 }}>
          <ChevronLeft size={16} /> {lang === 'en' ? 'Back to Home' : 'Home par jayein'}
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="badge" style={{ display: 'inline-flex', marginBottom: 16, background: 'rgba(103, 58, 183, 0.1)', color: '#673AB7', border: '1px solid rgba(103, 58, 183, 0.2)' }}>
            <Zap size={14} color="#673AB7" /> {lang === 'en' ? 'Step 1 of 3 — Upload' : 'Step 1 of 3 — Upload'}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12, fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#1e293b' }}>
            {lang === 'en' ? 'Upload your photo' : 'Apni photo upload karein'}
          </h1>
          <p style={{ color: '#475569', fontSize: 16, fontWeight: 500 }}>
            {t.heroDesc.split('.')[0]}.
          </p>
        </div>

        {/* Drop Zone */}
        {!preview ? (
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#673AB7' : 'rgba(103, 58, 183, 0.3)'}`,
              borderRadius: 24,
              padding: '60px 40px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? 'rgba(103, 58, 183, 0.05)' : '#f8fafc',
              transition: 'all 0.3s ease',
              boxShadow: dragging ? '0 0 20px rgba(103, 58, 183, 0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: 'rgba(103, 58, 183, 0.1)', border: '1px solid rgba(103, 58, 183, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <ImageIcon size={36} color="#673AB7" />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1e293b', marginBottom: 8 }}>
              {dragging ? (lang === 'en' ? 'Drop here' : 'Yahan chhodein') : (lang === 'en' ? 'Drag & drop photo' : 'Photo khinch kar laayein')}
            </h3>
            <p style={{ color: '#475569', fontSize: 15, marginBottom: 24, fontWeight: 500 }}>{lang === 'en' ? 'or click to browse' : 'ya click karke select karein'}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['JPG', 'PNG', 'WEBP', 'Max 10MB'].map(t => (
                <span key={t} style={{ padding: '6px 14px', background: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.2)', borderRadius: 100, color: '#334155', fontSize: 13, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(5,5,16,0.8), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: 14, fontWeight: 500 }}>
                  <CheckCircle2 size={16} />
                  {file?.name} — {lang === 'en' ? 'ready to process' : 'taiyar hai'}
                </div>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setPreview(null); }}
              style={{ 
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36, borderRadius: 10, border: 'none',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                color: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {error && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center', color: '#fca5a5', fontSize: 14 }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div style={{ background: '#ffffff', borderRadius: 24, padding: 32, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Camera size={20} color="#673AB7" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{t.uploadGuideTitle}</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontSize: 14, fontWeight: 600 }}>
                <Check size={16} /> {t.goodPhoto}
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>• {t.uploadGuideTip1}</li>
                <li style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>• {t.uploadGuideTip2}</li>
              </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e11d48', fontSize: 14, fontWeight: 600 }}>
                <X size={16} /> {t.badPhoto}
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>• {t.uploadGuideTip3}</li>
                <li style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>• {t.uploadGuideTip4}</li>
              </ul>
            </div>
          </div>

          <div style={{ background: 'rgba(103, 58, 183, 0.05)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={20} color="#673AB7" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#475569', fontWeight: 500, margin: 0 }}>
              {lang === 'en' 
                ? 'Your privacy is safe. Photos are processed securely and deleted automatically.' 
                : 'Aapki privacy surakshit hai. Photos automatic dlete kar di jati hain.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={!file}
          className="btn-primary"
          style={{ 
            width: '100%', marginTop: 32, fontSize: 17, padding: '18px', justifyContent: 'center',
            opacity: file ? 1 : 0.4, cursor: file ? 'pointer' : 'not-allowed',
            boxShadow: file ? '0 10px 25px rgba(103, 58, 183, 0.3)' : 'none'
          }}
        >
          <Zap size={20} />
          {lang === 'en' ? 'Continue to Preview' : 'Preview dekhein'}
        </button>
      </div>
    </main>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={32} color="#673AB7" />
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  );
}
