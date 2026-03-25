'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Download, RefreshCw, Check, Layers, Zap, Loader2, Sun, Contrast, Wand2, Maximize2, Move, RotateCcw, Palette, Sliders, Type } from 'lucide-react';
import Navbar from '../_components/Navbar';
import { translations, Language } from '../../lib/translations';
import { checkCompliance, ComplianceResult } from '../../lib/utils/complianceCheck';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const BG_COLORS = {
  classical: [
    { id: 'white', label: 'White', hex: '#ffffff' },
    { id: 'blue', label: 'Blue', hex: '#1e40af' },
    { id: 'red', label: 'Red', hex: '#b91c1c' },
    { id: 'light-blue', label: 'Sky', hex: '#60a5fa' },
    { id: 'dark-grey', label: 'Pro Grey', hex: '#374151' },
  ],
  stylish: [
    { id: 'pastel-pink', label: 'Pink', hex: '#fbcfe8' },
    { id: 'pastel-cyan', label: 'Cyan', hex: '#a5f3fc' },
    { id: 'pastel-green', label: 'Mint', hex: '#bbf7d0' },
    { id: 'modern-grey', label: 'Sleek', hex: '#e5e7eb' },
    { id: 'beige', label: 'Ecru', hex: '#f5f5dc' },
  ]
};

const SHEET_SIZES = [
  { id: '4x6', label: '4×6 inch', photos: 8, desc: '8 photos — Most popular' },
  { id: '5x7', label: '5×7 inch', photos: 16, desc: '16 photos — Medium sheet' },
  { id: 'a4', label: 'A4 Sheet', photos: 30, desc: '30 photos — Large format' },
];

/** Composites a transparent PNG on top of a solid background color using canvas with filters and transforms */
async function compositeImage(
  png: string,
  bg: string,
  b: number,
  c: number,
  s: number,
  x: number,
  y: number,
  r: number,
  sat: number,
  sep: number,
  brd: boolean,
  rad: number,
  sm: number,
  gd: boolean,
  showTxt: boolean,
  uName: string,
  uDate: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // Fill background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Border if enabled
      if (brd) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 20;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }

      // 1. Draw Person
      ctx.save();
      if (rad > 0) {
        const r2 = (rad / 100) * (Math.min(canvas.width, canvas.height) / 2);
        ctx.beginPath();
        ctx.moveTo(r2, 0); ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, r2);
        ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, r2);
        ctx.arcTo(0, canvas.height, 0, 0, r2); ctx.arcTo(0, 0, canvas.width, 0, r2);
        ctx.clip();
      }
      ctx.translate(canvas.width / 2 + x, canvas.height / 2 + y);
      ctx.rotate((r * Math.PI) / 180);
      ctx.scale(s, s);

      if (sm > 0) {
        // High-end studio smoothing: Very slight blur (max 0.4px) + Contrast boost
        const smBlur = (sm / 100) * 0.4;
        const smContrast = 100 + (sm / 100) * 5;
        ctx.filter = `brightness(${b}%) contrast(${c * (smContrast / 100)}%) saturate(${sat}%) sepia(${sep}%) blur(${smBlur}px)`;
      } else {
        ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${sat}%) sepia(${sep}%)`;
      }
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();


      // 3. Indian Standard Guides
      if (gd) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
        ctx.setLineDash([10, 5]);
        ctx.lineWidth = 2;
        const topGap = canvas.height * 0.15;
        const faceHeight = canvas.height * 0.75;
        ctx.beginPath(); ctx.moveTo(0, topGap); ctx.lineTo(canvas.width, topGap); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, topGap + faceHeight * 0.35); ctx.lineTo(canvas.width, topGap + faceHeight * 0.35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, topGap + faceHeight); ctx.lineTo(canvas.width, topGap + faceHeight); ctx.stroke();
        ctx.restore();
      }

      // 4. Name & Date Overlay (Indian Standard)
      if (showTxt && (uName || uDate)) {
        ctx.save();
        const barH = canvas.height * 0.14;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, canvas.height - barH, canvas.width, barH);

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        const fontSize = Math.floor(canvas.height * 0.04);
        ctx.font = `bold ${fontSize}px sans-serif`;

        if (uName && uDate) {
          ctx.fillText(uName.toUpperCase(), canvas.width / 2, canvas.height - barH * 0.55);
          ctx.font = `${fontSize * 0.85}px sans-serif`;
          ctx.fillText(uDate, canvas.width / 2, canvas.height - barH * 0.2);
        } else {
          ctx.fillText((uName || uDate).toUpperCase(), canvas.width / 2, canvas.height - barH * 0.4);
        }
        ctx.restore();
      }

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = png;
  });
}

/** Build a grid sheet image from multiple photos (alternating slots) */
async function buildMultiGrid(photoDataUrls: string[], count: number): Promise<string> {
  const cols = count > 30 ? 6 : (count > 8 ? 5 : 4);
  const rows = Math.ceil(count / cols);
  const cellW = 350; 
  const cellH = 450; 
  const gap = 40; 
  const margin = 100;

  const canvas = document.createElement('canvas');
  canvas.width = cols * cellW + (cols - 1) * gap + margin * 2;
  canvas.height = rows * cellH + (rows - 1) * gap + margin * 2;

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(photoDataUrls.map(url => {
    return new Promise<HTMLImageElement>((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = url;
    });
  }));

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = margin + col * (cellW + gap);
    const y = margin + row * (cellH + gap);
    
    // Cycle through provided images
    const img = images[i % images.length];
    
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.strokeRect(x, y, cellW, cellH);
    ctx.drawImage(img, x, y, cellW, cellH);
  }
  return canvas.toDataURL('image/jpeg', 0.95);
}

/** Build a grid sheet image from a single photo */
async function buildGrid(photoDataUrl: string, count: number): Promise<string> {
  const cols = 4;
  const rows = Math.ceil(count / cols);
  const cellW = 413;
  const cellH = 531;
  const gap = 10;
  const margin = 20;

  const canvas = document.createElement('canvas');
  canvas.width = cols * cellW + (cols - 1) * gap + margin * 2;
  canvas.height = rows * cellH + (rows - 1) * gap + margin * 2;

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  await new Promise<void>((res) => { img.onload = () => res(); img.src = photoDataUrl; });

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = margin + col * (cellW + gap);
    const y = margin + row * (cellH + gap);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.strokeRect(x, y, cellW, cellH);
    ctx.drawImage(img, x, y, cellW, cellH);
  }
  return canvas.toDataURL('image/jpeg', 0.95);
}

export default function PreviewPage() {
  const router = useRouter();
  const [processedPNGs, setProcessedPNGs] = useState<string[]>([]);
  const [compositedPNGs, setCompositedPNGs] = useState<string[]>([]);
  const [gridImage, setGridImage] = useState<string | null>(null);
  const [selectedBg, setSelectedBg] = useState('white');
  const [selectedSheet, setSelectedSheet] = useState('4x6');
  const [loading, setLoading] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [useBorder, setUseBorder] = useState(false);
  const [borderRadius, setBorderRadius] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [smoothness, setSmoothness] = useState(0);
  const [showGuides, setShowGuides] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'edit'>('colors');
  const [showNameOverlay, setShowNameOverlay] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDate, setUserDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [lang, setLang] = useState<Language>('en');
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [customCountInput, setCustomCountInput] = useState('5');
  const [selectedCount, setSelectedCount] = useState<number | ''>(8);
  const [compliance, setCompliance] = useState<ComplianceResult | null>(null);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
  const compositingRef = useRef(false);
  // Interactive Cropping States
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [visualOffsetX, setVisualOffsetX] = useState(0); // For instant CSS feedback
  const [visualOffsetY, setVisualOffsetY] = useState(0);
  const [visualScale, setVisualScale] = useState(1.0);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Manual Crop States
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [originalUpload, setOriginalUpload] = useState<string | null>(null);
  useEffect(() => {
    setVisualOffsetX(offsetX);
    setVisualOffsetY(offsetY);
    setVisualScale(scale);
  }, [offsetX, offsetY, scale]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - visualOffsetX, y: clientY - visualOffsetY });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setVisualOffsetX(clientX - dragStart.x);
    setVisualOffsetY(clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Finally sync the "true" state to trigger the composite/grid update
    setOffsetX(visualOffsetX);
    setOffsetY(visualOffsetY);
    setScale(visualScale);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(0.3, Math.min(3.0, visualScale + delta));
    setVisualScale(newScale);
    setScale(newScale); // Sync for immediate grid update
  };

  useEffect(() => {
    // Master language change and initial load
    const handleLangChange = () => {
      const savedLang = localStorage.getItem('app_lang') as Language;
      if (savedLang) setLang(savedLang);
    };
    handleLangChange();
    window.addEventListener('languageChange', handleLangChange);

    const savedPngs = JSON.parse(sessionStorage.getItem('processed_images') || '[]');
    const latestPng = sessionStorage.getItem('processed_image');
    
    let newList = [...savedPngs];
    if (latestPng && !newList.includes(latestPng)) {
      newList.push(latestPng);
      sessionStorage.setItem('processed_images', JSON.stringify(newList));
      sessionStorage.removeItem('processed_image'); // Clear after moving to list
    }
    
    if (newList.length === 0) {
      router.replace('/upload');
      return;
    }
    setProcessedPNGs(newList);

    // Show face detection result from processing page
    const fd = sessionStorage.getItem('face_detected');
    if (fd !== null) setFaceDetected(fd === 'true');

    // Run compliance check on first processed image
    checkCompliance(newList[0]).then(result => setCompliance(result));

    return () => window.removeEventListener('languageChange', handleLangChange);
  }, [router]);

  const t = translations[lang];

  const compositeAll = useCallback(async (pngs: string[], bgHex: string, count: number, b: number, c: number, s: number, x: number, y: number, r: number, sat: number, sep: number, brd: boolean, rad: number, sm: number, gd: boolean, showTxt: boolean, uName: string, uDate: string) => {
    if (compositingRef.current || pngs.length === 0) return;
    compositingRef.current = true;
    setLoading(true);
    try {
      const comps = await Promise.all(pngs.map(png => 
        compositeImage(png, bgHex, b, c, s, x, y, r, sat, sep, brd, rad, sm, gd, showTxt, uName, uDate)
      ));
      setCompositedPNGs(comps);

      const grid = await buildMultiGrid(comps, count);
      setGridImage(grid);
    } finally {
      setLoading(false);
      compositingRef.current = false;
    }
  }, []);

  const updateGlobalState = useCallback(async () => {
    if (processedPNGs.length === 0) return;
    const allBgs = [...BG_COLORS.classical, ...BG_COLORS.stylish];
    const bgHex = allBgs.find(b => b.id === selectedBg)?.hex ?? '#ffffff';
    const count = Number(selectedCount) || 1;
    // Generate new images, ensuring no infinite recursion loops
    await compositeAll(processedPNGs, bgHex, count, brightness, contrast, scale, offsetX, offsetY, rotation, saturation, sepia, useBorder, borderRadius, smoothness, showGuides, showNameOverlay, userName, userDate);
  }, [processedPNGs, selectedBg, selectedCount, brightness, contrast, scale, offsetX, offsetY, rotation, saturation, sepia, useBorder, borderRadius, smoothness, showGuides, showNameOverlay, userName, userDate, compositeAll]);

  useEffect(() => {
    updateGlobalState();
  }, [updateGlobalState]);

  // Handle Manual Crop save
  const handleSaveCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      ctx.drawImage(
        imgRef.current,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      const croppedBase64 = canvas.toDataURL('image/png');

      // Update the processed PNG to be the newly cropped one
      setProcessedPNGs([croppedBase64]);

      // Re-run compliance check on the new cropped image
      const result = await checkCompliance(croppedBase64);
      setCompliance(result);

      setIsCropping(false);
    } catch (error) {
      console.error('Failed to crop image', error);
      alert('Failed to crop image. Please try again.');
    }
  };

  if (!t) return null;

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
    setUseBorder(false);
    setBorderRadius(0);
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setSmoothness(0);
    setShowGuides(false);
    setShowNameOverlay(false);
    setUserName('');
    setUserDate(new Date().toLocaleDateString('en-GB'));
  };

  const handleDownload = () => {
    if (!gridImage || compositedPNGs.length === 0) return;
    sessionStorage.setItem('preview_bg', selectedBg);
    sessionStorage.setItem('preview_sheet', isCustomCount ? 'custom' : selectedSheet);
    sessionStorage.setItem('preview_count', String(Number(selectedCount) || 1));
    sessionStorage.setItem('composited_image', compositedPNGs[0]);
    sessionStorage.setItem('grid_image', gridImage);
    router.push('/download');
  };

  const allBgs = [...BG_COLORS.classical, ...BG_COLORS.stylish];
  const selectedBgData = allBgs.find(b => b.id === selectedBg)!;

  return (
    <main style={{ minHeight: '100vh', padding: '100px 24px 60px', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <Link
            href="/upload"
            onClick={() => {
              // Clear current state to avoid traps
              sessionStorage.removeItem('processed_image');
              sessionStorage.removeItem('processed_images');
              sessionStorage.removeItem('upload_dataurl');
              sessionStorage.removeItem('upload_name');
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}
          >
            <ChevronLeft size={16} /> {lang === 'en' ? 'Reset All' : 'Sab clear karein'}
          </Link>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => router.push('/upload')}
              style={{ padding: '10px 20px', background: 'rgba(103, 58, 183, 0.1)', color: '#673AB7', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Zap size={16} /> {lang === 'en' ? 'Add Another Person' : 'Ek aur photo jodein'}
            </button>
            <button onClick={handleReset} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: 0.7 }}>Reset Settings</button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="badge" style={{ display: 'inline-flex', marginBottom: 16, background: 'rgba(103, 58, 183, 0.1)', color: '#673AB7', border: '1px solid rgba(103, 58, 183, 0.2)' }}>
            <Layers size={14} color="#673AB7" /> {lang === 'en' ? 'Step 2 of 3 — Customize' : 'Step 2 of 3 — Sahi karein'}
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-1px', color: '#1e293b' }}>
            {t.backgroundRemoved} <span className="text-gradient-purple-pink">{t.selectBackground}</span>
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 32 }}>

          {/* Preview Panel */}
          <div>
            {/* Left Panel: Preview only */}
            <div className="card" style={{ padding: 24, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', textTransform: 'uppercase', margin: 0 }}>{lang === 'en' ? 'Photo Preview' : 'Photo Preview'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => {
                        setOriginalUpload(sessionStorage.getItem('upload_dataurl') || processedPNGs[0]);
                        setCrop(undefined);
                        setCompletedCrop(null);
                        setIsCropping(true);
                    }}
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.2)',
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <Maximize2 size={12} /> {lang === 'en' ? 'Crop Manually' : 'Manual Crop'}
                  </button>
                  {faceDetected !== null && (
                    <span style={{
                      fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                      background: faceDetected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: faceDetected ? '#059669' : '#d97706',
                      border: `1px solid ${faceDetected ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    }}>
                      {faceDetected ? '✓ Auto-Cropped' : '⚠ Action Needed'}
                    </span>
                  )}
                </div>
              </div>
              <div 
                ref={previewContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onWheel={handleWheel}
                style={{ 
                  borderRadius: 12, 
                  overflow: 'hidden', 
                  background: selectedBgData.hex, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: 400, 
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  position: 'relative',
                  touchAction: 'none'
                }}
              >
                {loading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <Loader2 size={28} className="animate-spin" color="#673AB7" />
                  </div>
                )}
                
                {/* Visual Hint */}
                <div style={{ position: 'absolute', top: 12, right: 12, padding: '6px 10px', background: 'rgba(0,0,0,0.4)', color: 'white', borderRadius: 20, fontSize: 10, fontWeight: 700, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 6, zIndex: 5 }}>
                  <Move size={12} /> {lang === 'en' ? 'Drag to position • Scroll to zoom' : 'Drag karke sahi karein • Zoom karein'}
                </div>

                <img 
                  src={processedPNGs[0]} // Use the RAW PNG for better dragging performance
                  alt="Processed" 
                  style={{ 
                    width: 220, 
                    height: 'auto', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    transform: `translate(${visualOffsetX}px, ${visualOffsetY}px) scale(${visualScale})`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%)`
                  }} 
                />
              </div>

              {/* Compliance Badge */}
              {compliance && !loading && (
                <div style={{
                  marginTop: 16, padding: '14px 16px', borderRadius: 12,
                  background: compliance.passed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.07)',
                  border: `1.5px solid ${compliance.passed ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.3)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: compliance.issues.length > 0 ? 10 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{compliance.passed ? '✅' : '⚠️'}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: compliance.passed ? '#059669' : '#d97706' }}>
                        {compliance.passed
                          ? (lang === 'en' ? 'Compliance Check Passed' : 'Photo sahi hai')
                          : (lang === 'en' ? 'Minor Issues Detected' : 'Kuch sahi nahi hai')}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 900, padding: '2px 10px', borderRadius: 20,
                      background: compliance.score >= 80 ? '#059669' : compliance.score >= 60 ? '#d97706' : '#dc2626',
                      color: 'white'
                    }}>{compliance.score}/100</span>
                  </div>
                  {compliance.issues.length > 0 && (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {compliance.issues.map((issue, i) => (
                        <li key={i} style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>
                          • {issue}
                          {compliance.tips[i] && <span style={{ color: '#64748b', fontWeight: 500 }}> — {compliance.tips[i]}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', marginBottom: 16, textTransform: 'uppercase' }}>{lang === 'en' ? 'Full Sheet Layout' : 'Poori Sheet'}</h3>
              <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f8fafc', minHeight: 120 }}>
                {loading ? <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}><Loader2 size={24} className="animate-spin" /></div> : <img src={gridImage!} alt="Sheet" style={{ width: '100%' }} />}
              </div>
            </div>
          </div>

          {/* Controls Panel (Tabs) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: 6, borderRadius: 16, gap: 6, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
              {([
                { id: 'colors', label: lang === 'en' ? 'Colors' : 'Rang', icon: Palette },
                { id: 'edit', label: lang === 'en' ? 'Edit' : 'Fix', icon: Sliders }
              ] as const).map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      background: isActive ? 'linear-gradient(135deg, #673AB7, #9B59B6)' : 'transparent',
                      color: isActive ? '#ffffff' : '#64748b',
                      boxShadow: isActive ? '0 8px 15px rgba(103, 58, 183, 0.25)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <Icon size={18} />
                    <span style={{ fontSize: 11 }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'colors' && (
              <div className="card" style={{ padding: 24 }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{lang === 'en' ? 'Classical backgrounds' : 'Purane Rang'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                    {BG_COLORS.classical.map(bg => (
                      <button key={bg.id} onClick={() => setSelectedBg(bg.id)} style={{ width: '100%', aspectRatio: '1', borderRadius: 10, background: bg.hex, border: selectedBg === bg.id ? '2px solid #673AB7' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', position: 'relative' }}>
                        {selectedBg === bg.id && <div style={{ position: 'absolute', top: -5, right: -5, background: '#673AB7', borderRadius: '50%', color: 'white', padding: 2 }}><Check size={10} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{lang === 'en' ? 'Stylish backgrounds' : 'Modern Rang'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                    {BG_COLORS.stylish.map(bg => (
                      <button key={bg.id} onClick={() => setSelectedBg(bg.id)} style={{ width: '100%', aspectRatio: '1', borderRadius: 10, background: bg.hex, border: selectedBg === bg.id ? '2px solid #673AB7' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', position: 'relative' }}>
                        {selectedBg === bg.id && <div style={{ position: 'absolute', top: -5, right: -5, background: '#673AB7', borderRadius: '50%', color: 'white', padding: 2 }}><Check size={10} /></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', textTransform: 'uppercase', margin: 0 }}>{t.photoSettings}</h3>
                    <button onClick={handleReset} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: 0.7 }}>Reset</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Row 1: Brightness & Contrast */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
                          <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Brightness' : 'Roshni'}</span>
                          <span style={{ color: '#673AB7' }}>{brightness}%</span>
                        </div>
                        <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
                          <span style={{ color: '#64748b' }}>Contrast</span>
                          <span style={{ color: '#673AB7' }}>{contrast}%</span>
                        </div>
                        <input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                      </div>
                    </div>

                    {/* Row 2: Saturation & Sepia */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{lang === 'en' ? 'Saturation' : 'Rang'}</span>
                        <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Retro / Sepia</span>
                        <input type="range" min="0" max="100" value={sepia} onChange={e => setSepia(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                      </div>
                    </div>

                    {/* Row 3: Zoom */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{t.scale} / Zoom</span>
                        <span style={{ fontSize: 12, color: '#673AB7', fontWeight: 700 }}>{scale.toFixed(2)}x</span>
                      </div>
                      <input type="range" min="0.5" max="2.0" step="0.01" value={scale} onChange={e => setScale(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                    </div>

                    {/* Row 4: Pos X & Y */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Pos X</span>
                        <input type="range" min="-100" max="100" value={offsetX} onChange={e => setOffsetX(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Pos Y</span>
                        <input type="range" min="-150" max="150" value={offsetY} onChange={e => setOffsetY(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                      </div>
                    </div>

                    {/* Row 5: Rotation & Border */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{t.rotate}</span>
                        <input type="range" min="-45" max="45" value={rotation} onChange={e => setRotation(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 6 }}>
                        <input type="checkbox" id="useBorder" checked={useBorder} onChange={e => setUseBorder(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#673AB7' }} />
                        <label htmlFor="useBorder" style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>{lang === 'en' ? 'White Border' : 'Mask Border'}</label>
                      </div>
                    </div>

                    {/* Beauty & Smart Tools */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{lang === 'en' ? 'Face Smoothing (Nikharein)' : 'Beauty Finish'}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#673AB7' }}>{smoothness}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={smoothness} onChange={e => setSmoothness(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239, 68, 68, 0.05)', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>{lang === 'en' ? 'Indian Standard Guides' : 'Sahi Size Guide'}</div>
                      <button
                        onClick={() => setShowGuides(!showGuides)}
                        style={{ padding: '4px 12px', background: showGuides ? '#b91c1c' : '#ffffff', border: '1px solid #b91c1c', borderRadius: 6, color: showGuides ? '#ffffff' : '#b91c1c', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
                      >
                        {showGuides ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>

                    {/* Corner Rounding */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{lang === 'en' ? 'Corner Roundness' : 'Golai'}</div>
                      <input type="range" min="0" max="100" value={borderRadius} onChange={e => setBorderRadius(Number(e.target.value))} style={{ width: '100%', accentColor: '#673AB7' }} />
                    </div>

                    {/* Auto-Enhance Button */}
                    <button
                      onClick={() => {
                        setBrightness(112);
                        setContrast(118);
                        setSaturation(108);
                        setSmoothness(25);
                        setScale(1.02);
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'rgba(103, 58, 183, 0.1)', border: 'none', borderRadius: 12, color: '#673AB7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
                    >
                      <Wand2 size={16} /> {lang === 'en' ? 'Auto-Enhance' : 'Magic Boost'}
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Sheet size (Always visible or in tabs?) - Let's keep it visible at the bottom of the panel */}
            <div className="card" style={{ padding: 24, border: isCustomCount ? '2px solid #673AB7' : '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', textTransform: 'uppercase', margin: 0 }}>Sheet Size / Photo Count</h3>
                {isCustomCount && <span style={{ fontSize: 10, color: '#673AB7', fontWeight: 800 }}>CUSTOM MODE</span>}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: isCustomCount ? 16 : 0 }}>
                {SHEET_SIZES.map(s => (
                  <button key={s.id} onClick={() => { setSelectedSheet(s.id); setSelectedCount(s.photos); setIsCustomCount(false); }} style={{ flex: '1 0 80px', display: 'flex', flexDirection: 'column', padding: '10px', background: (!isCustomCount && selectedSheet === s.id) ? 'rgba(103, 58, 183, 0.05)' : '#ffffff', border: `1.5px solid ${(!isCustomCount && selectedSheet === s.id) ? '#673AB7' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ color: '#1e293b', fontSize: 12, fontWeight: 700 }}>{s.label}</div>
                    <div style={{ color: '#64748b', fontSize: 10 }}>{s.photos} {lang === 'en' ? 'Photos' : 'Photos'}</div>
                  </button>
                ))}
                <button
                  onClick={() => { setIsCustomCount(true); setSelectedCount(Number(customCountInput) || 1); }}
                  style={{
                    flex: '1 0 80px', display: 'flex', flexDirection: 'column', padding: '10px',
                    background: isCustomCount ? 'rgba(103, 58, 183, 0.05)' : '#ffffff',
                    border: `1.5px solid ${isCustomCount ? '#673AB7' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 12, cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  <div style={{ color: '#1e293b', fontSize: 12, fontWeight: 700 }}>Custom</div>
                  <div style={{ color: '#64748b', fontSize: 10 }}>Enter count</div>
                </button>
              </div>

              {isCustomCount && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Total photos:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={customCountInput}
                    onChange={e => {
                      const val = e.target.value;
                      setCustomCountInput(val);
                      if (val !== '' && !isNaN(Number(val))) {
                        const num = Math.max(1, Math.min(100, Number(val)));
                        setSelectedCount(num);
                      }
                    }}
                    style={{
                      width: 80, padding: '8px 12px', borderRadius: 8, border: '2px solid #673AB7',
                      fontSize: 14, fontWeight: 700, outline: 'none', color: '#673AB7'
                    }}
                  />
                  <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Max recommended: 48</p>
                </div>
              )}
            </div>

            {/* Exam Overlay (Refined Styling) */}
            <div className="card" style={{
              padding: 24,
              background: '#ffffff',
              border: showNameOverlay ? '2px solid #673AB7' : '1.5px solid rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              borderRadius: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: showNameOverlay ? 'rgba(103, 58, 183, 0.1)' : '#f1f5f9', padding: 8, borderRadius: 12, transition: '0.2s' }}>
                    <Type size={18} color={showNameOverlay ? '#673AB7' : '#64748b'} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 13, color: '#475569', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>Exam Standard Overlay</h3>
                </div>

                <div
                  onClick={() => setShowNameOverlay(!showNameOverlay)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: showNameOverlay ? 'rgba(103, 58, 183, 0.08)' : '#f1f5f9',
                    padding: '8px 16px', borderRadius: 30, cursor: 'pointer',
                    border: showNameOverlay ? '2px solid #673AB7' : '1px solid rgba(0,0,0,0.05)',
                    transition: '0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showNameOverlay}
                    readOnly
                    style={{ width: 16, height: 16, accentColor: '#673AB7', cursor: 'pointer' }}
                  />
                  <label style={{ fontSize: 11, fontWeight: 900, cursor: 'pointer', color: showNameOverlay ? '#673AB7' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {showNameOverlay ? 'ENABLED' : 'OFF'}
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>FULL NAME</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="e.g. RAHUL SHARMA"
                    style={{
                      padding: '14px', borderRadius: 12, border: '1.5px solid #e2e8f0',
                      fontSize: 15, fontWeight: 600, outline: 'none', transition: '0.2s', width: '100%',
                      background: showNameOverlay ? '#ffffff' : '#f8fafc',
                      color: showNameOverlay ? '#1e293b' : '#94a3b8'
                    }}
                    onFocus={(e) => { if(showNameOverlay) e.target.style.borderColor = '#673AB7'; }}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>DATE OF PHOTO</label>
                  <input
                    type="text"
                    value={userDate}
                    onChange={e => setUserDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    style={{
                      padding: '14px', borderRadius: 12, border: '1.5px solid #e2e8f0',
                      fontSize: 15, fontWeight: 600, outline: 'none', transition: '0.2s', width: '100%',
                      background: showNameOverlay ? '#ffffff' : '#f8fafc',
                      color: showNameOverlay ? '#1e293b' : '#94a3b8'
                    }}
                    onFocus={(e) => { if(showNameOverlay) e.target.style.borderColor = '#673AB7'; }}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={{ fontSize: 10, color: '#64748b', background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px dashed #e2e8f0', margin: 0, lineHeight: 1.6 }}>
                  <b style={{ color: '#673AB7' }}>Note:</b> {lang === 'en' ? 'Required for UPSC, SSC, and Banking exams in India.' : 'UPSC, SSC aur Banking exams ke liye zaroori hai.'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={handleDownload} disabled={loading || !gridImage} className="btn-primary" style={{ fontSize: 17, padding: '18px', justifyContent: 'center', opacity: loading || !gridImage ? 0.5 : 1, cursor: loading || !gridImage ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                {loading ? <><Loader2 size={20} className="animate-spin" /> {lang === 'en' ? 'Applying...' : 'Wait karein...'}</> : <><Download size={20} /> {t.downloadFreeSheet}</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Crop Modal */}
      {isCropping && originalUpload && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div className="card" style={{ maxWidth: 800, width: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>{lang === 'en' ? 'Crop Photo Manually' : 'Photo Crop Karein'}</h2>
                <p style={{ color: '#64748b', fontSize: 14 }}>{lang === 'en' ? 'Drag to select your face and upper shoulders. Ratio is locked to passport standard (3.5x4.5).' : 'Pura chehra aur kandhe select karein.'}</p>
              </div>
              <button onClick={() => setIsCropping(false)} style={{ background: '#f1f5f9', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}>
                <ChevronLeft size={20} />
              </button>
            </div>

            <div style={{ flex: 1, minHeight: 0, background: '#f8fafc', borderRadius: 12, overflow: 'auto', display: 'flex', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
               <ReactCrop
                 crop={crop}
                 onChange={(_, percentCrop) => setCrop(percentCrop)}
                 onComplete={(c) => setCompletedCrop(c)}
                 aspect={3.5 / 4.5}
                 style={{ maxHeight: '60vh' }}
               >
                 <img
                   ref={imgRef}
                   src={originalUpload}
                   alt="Crop"
                   style={{ maxHeight: '60vh', width: 'auto', objectFit: 'contain' }}
                 />
               </ReactCrop>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
               <button onClick={() => setIsCropping(false)} style={{ padding: '12px 24px', borderRadius: 8, background: '#f1f5f9', color: '#475569', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                 Cancel
               </button>
               <button onClick={handleSaveCrop} disabled={!completedCrop || completedCrop.width === 0} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 8, fontSize: 15 }}>
                  <Check size={18} /> {lang === 'en' ? 'Apply Crop' : 'Crop Save Karein'}
               </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
