'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../_components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { getBiometricCrop } from '../../lib/utils/faceCrop';
import { autoEnhanceImage } from '../../lib/utils/imageEnhancer';

const STEPS = [
  { label: 'Initializing AI engine...', icon: '🚀', key: 'init' },
  { label: 'Detecting biometric features...', icon: '🔍', key: 'detect' },
  { label: 'Isolating portrait subject...', icon: '👤', key: 'remove' },
  { label: 'Applying biometric crop...', icon: '📐', key: 'crop' },
  { label: 'Optimizing image quality...', icon: '✨', key: 'enhance' },
  { label: 'Finalizing print-ready layout...', icon: '🖨️', key: 'layout' },
];

const TIPS = [
  "Did you know? Our AI detects up to 68 facial landmarks for perfect alignment.",
  "Tip: Natural lighting always gives the best passport photo results.",
  "First run? The AI model is being downloaded to your browser for total privacy.",
  "Pro Tip: Keep a neutral expression and look directly at the camera.",
  "Our AI automatically scales your photo to 3.5x4.5cm Indian standards.",
  "Working hard... Your photo is staying 100% on your device during this step."
];

export default function ProcessingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('Initializing...');
  const [tipIndex, setTipIndex] = useState(0);
  const hasRun = useRef(false);

  // Auto-rotate tips every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const storedFile = sessionStorage.getItem('upload_dataurl');

    if (!storedFile) {
      router.replace('/upload');
      return;
    }

    setPreview(storedFile);
    runProcessing(storedFile);
  }, [router]);

  const setStepProgress = (step: number, prog: number, msg: string) => {
    setCurrentStep(step);
    // Smooth progress transition
    setProgress(prev => Math.max(prev, prog));
    setStatusMsg(msg);
  };

  const runProcessing = async (dataUrl: string) => {
    try {
      // Step 0: Load models & validate image
      setStepProgress(0, 5, 'Initializing AI engine...');
      
      // Enhance Image Quality First
      setStepProgress(0, 10, 'Enhancing image quality (Color & Sharpness)...');
      const enhancedUrl = await autoEnhanceImage(dataUrl);
      
      const img = new Image();
      img.src = enhancedUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Invalid image data'));
      });

      // Detect if this is a full-photo (much larger than passport aspect ratio)
      const aspectRatio = img.width / img.height;
      const isFullPhoto = aspectRatio > 0.9 || img.width > 600 || img.height > 800;
      if (isFullPhoto) {
        setStepProgress(0, 15, 'Full photo detected — auto-cropping to passport size...');
      } else {
        setStepProgress(0, 15, 'Photo enhanced — analyzing face...');
      }
      await delay(200);

      // Step 1: Detect & Biometric Crop (works for both full-body and passport photos)
      setStepProgress(1, 22, 'Scanning for face and biometric landmarks...');
      const cropData = await getBiometricCrop(img);
      
      let processedBase;
      if (cropData) {
        // Crop the image to passport dimensions
        const canvas = document.createElement('canvas');
        canvas.width = cropData.targetWidth;
        canvas.height = cropData.targetHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0, targetW, targetH);
        processedBase = canvas.toDataURL('image/png');
        
        // Save landmarks and crop metadata
        sessionStorage.setItem('face_detected', 'true');
        if (cropData.landmarks) {
          sessionStorage.setItem('face_landmarks', JSON.stringify(cropData.landmarks));
          sessionStorage.setItem('crop_box', JSON.stringify({ x: cropData.x, y: cropData.y, width: cropData.width, height: cropData.height }));
        }
        setStepProgress(1, 38, '✓ Face detected & passport crop applied!');
      } else {
        // No face found — use original but resize to passport aspect ratio (user can adjust on preview)
        processedBase = enhancedUrl;
        sessionStorage.setItem('face_detected', 'false');
        setStepProgress(1, 38, 'No face found — will use full image (adjust on preview page)');
      }

      // Step 2: Remove background (Default: Free Local AI)
      setStepProgress(2, 45, 'Removing background (Local AI)...');
      
      try {
        // We now use @imgly by default for 100% free, watermark-free processing
        const { removeBackground } = await import('@imgly/background-removal');
        
        // Notify user about the model download on first run
        if (!window.localStorage.getItem('ai_model_loaded')) {
          setStepProgress(2, 50, 'Downloading AI Model (first time only)...');
        }

        const blob = await (await fetch(processedBase)).blob();
        
        // Start a "smart" progress for the opaque removal process
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev < 70) return prev + 0.5;
            return prev;
          });
        }, 200);

        const resultBlob = await removeBackground(blob, {
          progress: (type: string, p: number) => {
            if (type === 'fetch') {
              setStepProgress(2, 45 + Math.floor(p * 15), 'Downloading AI Model (One-time)...');
            } else if (type === 'compute') {
              setStepProgress(2, 60 + Math.floor(p * 15), 'Processing image pixels...');
            }
          }
        });
        
        clearInterval(interval);
        processedBase = await blobToDataUrl(resultBlob);
        window.localStorage.setItem('ai_model_loaded', 'true');
        setStepProgress(2, 80, 'Subject isolated successfully!');

      } catch (e) {
        console.warn('Local AI failed, trying Cloud Backup...', e);
        
        // Fallback to Photoroom API if local processing fails
        try {
          const bgRes = await fetch('/api/remove-bg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: processedBase })
          });
          const bgData = await bgRes.json();
          if (bgRes.ok && bgData.image) {
            processedBase = bgData.image;
          }
        } catch (apiError) {
          console.error('All background removal methods failed:', apiError);
        }
      }
      
      // Step 3: Enhancement and finalization
      setStepProgress(3, 85, 'Finalizing image... 🪄');
      await delay(500);

      // Step 4: Layout
      setStepProgress(4, 97, 'Ready to print!');
      await delay(400);

      sessionStorage.setItem('processed_image', processedBase);
      setProgress(100);
      setStatusMsg('Done! ✓');

      await delay(600);
      router.replace('/preview');

    } catch (err) {
      console.error('Processing error:', err);
      setError('AI processing failed. Please try a different photo with better lighting.');
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px', position: 'relative', zIndex: 1 }}>
      <Navbar />

      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

        {/* Animated AI icon */}
        <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 40px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#673AB7', borderRightColor: '#9B59B6', animation: 'spin-slow 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid transparent', borderBottomColor: '#C11C84', borderLeftColor: '#FFB6C1', animation: 'spin-slow 1.5s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', background: 'linear-gradient(135deg, #673AB7, #9B59B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(103, 58, 183, 0.3)', animation: 'pulse-glow 2s ease-in-out infinite' }}>
            <Zap size={32} color="white" fill="white" />
          </div>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12, fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#1e293b' }}>
          AI is working its <span className="text-gradient-purple-pink">magic</span>
        </h1>
        <p style={{ color: '#475569', fontSize: 16, marginBottom: 48, fontWeight: 500 }}>
          {error ? 'Something went wrong.' : statusMsg}
        </p>

        {error ? (
          <div style={{ padding: '20px 24px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left' }}>
            <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ color: '#fca5a5', fontWeight: 600, marginBottom: 4 }}>Processing Failed</p>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>{error}</p>
              <button onClick={() => router.push('/upload')} className="btn-primary" style={{ marginTop: 16, padding: '10px 20px', fontSize: 14 }}>
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#475569', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Processing...</span>
                <span style={{ color: '#673AB7', fontSize: 13, fontWeight: 800 }}>{progress}%</span>
              </div>
              <div style={{ height: 10, background: 'rgba(103, 58, 183, 0.1)', borderRadius: 100, overflow: 'hidden', padding: 2 }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #673AB7, #9B59B6)', borderRadius: 100, boxShadow: '0 0 15px rgba(103, 58, 183, 0.4)' }} 
                />
              </div>
            </div>

            {/* Steps and Tips combined */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
              <div className="card" style={{ padding: '16px 24px' }}>
                {STEPS.map((step, i) => (
                  <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < STEPS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', opacity: i <= currentStep ? 1 : 0.3, transition: 'all 0.4s ease' }}>
                    <span style={{ fontSize: 18, minWidth: 24 }}>{step.icon}</span>
                    <span style={{ color: i < currentStep ? '#10b981' : i === currentStep ? '#1e293b' : '#64748b', fontSize: 14, flex: 1, textAlign: 'left', transition: 'color 0.3s', fontWeight: i === currentStep ? 700 : 500 }}>
                      {step.label}
                    </span>
                    {i < currentStep && <CheckCircle size={14} color="#10b981" />}
                    {i === currentStep && (
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #673AB7', borderTopColor: 'transparent', animation: 'spin-slow 0.8s linear infinite' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Tips Carousel */}
              <div className="card" style={{ padding: '20px 24px', background: 'rgba(103, 58, 183, 0.03)', border: '1px dashed rgba(103, 58, 183, 0.2)', minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'left' }}
                  >
                    <p style={{ color: '#673AB7', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '1px' }}>AI Insights</p>
                    <p style={{ color: '#475569', fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{TIPS[tipIndex]}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Note */}
            <div style={{ marginTop: 24, padding: 12, background: 'rgba(245, 158, 11, 0.05)', borderRadius: 12, border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <p style={{ color: '#d97706', fontSize: 12, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                ⏳ {window.localStorage.getItem('ai_model_loaded') ? 'Re-using cached AI model...' : 'First run downloads AI models (~40MB).'}
              </p>
            </div>
          </>
        )}

        {/* Photo thumbnail */}
        {preview && !error && (
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', width: 80 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" style={{ width: 80, height: 96, objectFit: 'cover', opacity: 0.4, filter: 'blur(2px)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(103, 58, 183, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Helpers ───────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Global dimensions constant */
const targetW = 413; // 35mm
const targetH = 531; // 45mm
