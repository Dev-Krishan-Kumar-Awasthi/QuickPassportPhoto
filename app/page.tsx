'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Zap, Star, Check, ChevronRight, Upload, 
  Sparkles, Shield, Clock, Users,
  Camera, Layers, FileImage
} from 'lucide-react';
import Navbar from './_components/Navbar';
import OnboardingModal from './_components/OnboardingModal';

const features = [
  { icon: Sparkles, title: 'AI Background Removal', desc: 'One-click removal & replacement with standard colors — white, light blue, or grey.', color: '#C11C84' },
  { icon: Camera, title: 'Biometric Auto-Crop', desc: 'AI detects your face and aligns head-to-shoulder ratio to exact passport specs.', color: '#673AB7' },
  { icon: Layers, title: 'Smart Print Layout', desc: 'Arranges 8–30 photos on 4×6, 5×7, or A4 sheets with cutting guides automatically.', color: '#3498db' },
  { icon: Sparkles, title: 'Quality Enhancer', desc: 'Auto-sharpens blurry photos and boosts lighting for professional print results.', color: '#ADD8E6' },
  { icon: FileImage, title: 'One-Click Export', desc: 'Download print-ready 300 DPI PDF or JPEG — instantly and uncompressed.', color: '#C11C84' },
  { icon: Shield, title: 'Privacy-First', desc: 'All uploaded photos are deleted from our servers automatically after 24 hours.', color: '#673AB7' },
];

const steps = [
  { num: '01', title: 'Upload', desc: 'Drop your selfie or any photo. Mobile camera works too.' },
  { num: '02', title: 'AI Magic', desc: 'Our AI removes background, crops, and enhances in 3–5 seconds.' },
  { num: '03', title: 'Customize', desc: 'Pick background color and sheet layout (4×6, A4, etc.).' },
  { num: '04', title: 'Download', desc: 'Get a perfect, print-ready PDF to send to any printer.' },
];

const plans = [
  { name: 'Free Forever', price: '₹0', period: 'during beta', desc: 'No signup. No hidden fees. Just high-quality photos.', features: ['Unlimited downloads', 'No watermarks', 'All sheet sizes (4x6, A4)', 'High-res 300 DPI PDF', 'Privacy-first (Auto-delete)'], cta: 'Start Creating Now', href: '/upload', highlighted: true },
];

const testimonials = [
  { name: 'Ankit Dhakad', role: 'User', text: 'Reduced 15-min Photoshop work to 10 seconds. My customers are amazed.', stars: 5 },
  { name: 'Lokendra Prajapati', role: 'User', text: 'Uploaded at midnight, downloaded perfect passport photos instantly. Incredible!', stars: 5 },
  { name: 'Anas Khan', role: 'User', text: 'My B2B plan pays for itself in 1 day. Best ₹499 I spend every month.', stars: 5 },
];

const bgImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // White abstract 3D liquid
  'https://images.unsplash.com/photo-1557682250-33bd709c40a1?q=80&w=2629&auto=format&fit=crop', // Multi pastel abstract glow
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2674&auto=format&fit=crop', // Soft fluid gradient
];

import { translations, Language } from '../lib/translations';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const handleLangChange = () => {
      const savedLang = localStorage.getItem('app_lang') as Language;
      if (savedLang) setLang(savedLang);
    };
    handleLangChange();
    window.addEventListener('languageChange', handleLangChange);
    
    const initSlider = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bgImages.length);
    }, 5000);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    
    return () => {
      clearInterval(initSlider);
      observer.disconnect();
      window.removeEventListener('languageChange', handleLangChange);
    };
  }, []);

  const t = translations[lang];

  return (
    <main style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-light)' }}>
      <Navbar />
      <OnboardingModal />

      {/* Hero Section with Auto Slider */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', overflow: 'hidden' }}>
        {bgImages.map((src, index) => (
          <div key={index} style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }} />
        ))}
        <div className="hero-slider-overlay" />
        
        <div style={{ position: 'relative', zIndex: 20, maxWidth: 800 }}>
          <div className="scroll-animate" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: 'rgba(103, 58, 183, 0.1)', border: '1px solid rgba(103, 58, 183, 0.2)', borderRadius: 100, color: '#673AB7', fontSize: 13, fontWeight: 700 }}>
            <Zap size={14} color="#673AB7" /> AI-Powered · 15-Second Photos
          </div>

          <h1 className="scroll-animate" style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 24, color: '#1e293b' }}>
            {t.heroTitle.split(' ').slice(0, -3).join(' ')} <br />
            <span className="text-gradient-purple-pink">{t.heroTitle.split(' ').slice(-3).join(' ')}</span>
          </h1>

          <p className="scroll-animate" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#475569', maxWidth: 580, lineHeight: 1.7, margin: '0 auto 40px', fontWeight: 500 }}>
            {t.heroDesc}
          </p>

          <div className="scroll-animate" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
            <Link href="/upload" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px', boxShadow: '0 10px 25px rgba(52, 152, 219, 0.3)' }}>
              <Upload size={18} /> {t.uploadButton}
            </Link>
            <Link href="#how-it-works" style={{ fontSize: 16, padding: '16px 32px', color: '#334155', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'all 0.3s', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}>
              See How it Works <ChevronRight size={18} />
            </Link>
          </div>

          <div className="scroll-animate" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} color="#f59e0b" fill="#f59e0b" />)}
              <span style={{ color: '#334155', fontSize: 15, marginLeft: 6, fontWeight: 700 }}>4.9/5 from 200+ users</span>
            </div>
            <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.15)' }} />
            <div style={{ color: '#475569', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
              <Users size={16} color="#673AB7" /> 10,000+ photos generated
            </div>
          </div>
        </div>
      </section>

      {/* Pro Studio Showcase - HEAVY VISUALS */}
      <section style={{ padding: '80px 24px', background: '#fff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
              The Best AI <span className="text-gradient-purple-pink">Passport Photo Maker</span> Studio
            </h2>
            <p style={{ color: '#64748b', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              We've automated the most complex studio tasks so you can get perfect results in seconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
            {/* Visual 1: Smart Alignment */}
            <div className="info-card scroll-animate" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
               <div style={{ background: '#f8fafc', padding: '24px 40px', display: 'flex', justifyContent: 'center', position: 'relative', height: 280, alignItems: 'center' }}>
                  <div style={{ width: 140, height: 180, borderRadius: 12, background: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}>
                     {/* REAL IMAGE BACKGROUND */}
                     <img 
                       src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" 
                       alt="AI Passport Photo Biometric Alignment Guide"
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     />
                     {/* SVG OVERLAY GUIDES */}
                     <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="40" x2="140" y2="40" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="8" y="32" fill="#ef4444" style={{ fontSize: 9, fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>TOP</text>
                        <line x1="0" y1="75" x2="140" y2="75" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="8" y="68" fill="#ef4444" style={{ fontSize: 9, fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>EYE LEVEL</text>
                        <line x1="0" y1="130" x2="140" y2="130" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="8" y="125" fill="#ef4444" style={{ fontSize: 9, fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>CHIN</text>
                     </svg>
                  </div>
                  <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 11, fontWeight: 900, boxShadow: '0 10px 20px rgba(34, 197, 94, 0.3)' }}>✓ BIOMETRIC PASSPORT OK</div>
               </div>
               <div style={{ padding: 32 }}>
                  <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1e293b', marginBottom: 12 }}>Smart Alignment Guides</h3>
                  <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>AI detects facial nodes instantly for 100% compliance with Indian passport & visa requirements.</p>
               </div>
            </div>

            {/* Visual 2: Bulk Layouts */}
            <div className="info-card scroll-animate" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
               <div style={{ background: '#f8fafc', padding: 40, display: 'flex', justifyContent: 'center', position: 'relative', height: 280, alignItems: 'center' }}>
                  <div style={{ width: 180, height: 220, padding: 8, background: '#fff', borderRadius: 4, boxShadow: '0 25px 50px rgba(0,0,0,0.1)', transform: 'rotate(2deg) perspective(1000px)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
                     {[1,2,3,4].map(i => (
                        <div key={i} style={{ width: '100%', height: '100%', background: '#fff', overflow: 'hidden', borderRadius: 2 }}>
                           <img 
                              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop" 
                              alt="Passport Size Photo Print Sheet Layout"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                           />
                        </div>
                     ))}
                  </div>
                  <div style={{ position: 'absolute', top: 40, right: 40, background: '#673AB7', color: '#fff', padding: '12px 20px', borderRadius: 16, fontSize: 13, fontWeight: 900, boxShadow: '0 10px 25px rgba(103, 58, 183, 0.4)' }}>
                     PRINT READY <br/> <span style={{fontSize: 9, opacity: 0.9}}>A4 / 4x6 / 5x7</span>
                  </div>
               </div>
               <div style={{ padding: 32 }}>
                  <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1e293b', marginBottom: 12 }}>Bulk Sheet Layouts</h3>
                  <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>Automatic grid generation for high-volume printing. Save time with auto-cropping and uncompressed JPEG/PDF output.</p>
               </div>
            </div>

            {/* Visual 3: Digital Outfits */}
            <div className="info-card scroll-animate" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
               <div style={{ background: '#f8fafc', padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280, gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                     <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" style={{ width: 100, height: 130, borderRadius: 10, marginBottom: 8, objectFit: 'cover', opacity: 0.7 }} alt="Casual" />
                     <span style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8' }}>CASUAL</span>
                  </div>
                  <div style={{ color: '#673AB7', fontWeight: 900, fontSize: 24 }}>→</div>
                   <div style={{ textAlign: 'center', position: 'relative' }}>
                      <img src="https://images.unsplash.com/photo-1593032465175-481ac7f402a1?q=80&w=200&auto=format&fit=fit" style={{ width: 130, height: 170, borderRadius: 12, border: '3px solid #673AB7', boxShadow: '0 15px 35px rgba(103, 58, 183, 0.3)', objectFit: 'cover' }} alt="Professional Suit for Passport Photo Online" />
                      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'white', color: 'black', fontSize: 7, fontWeight: 900, width: '80%', padding: '2px 0', border: '0.5px solid black' }}>
                         NAME & DATE OVERLAY
                      </div>
                      <div style={{ position: 'absolute', top: -10, right: -10, background: '#C11C84', color: '#fff', fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100 }}>MAGIC</div>
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#673AB7', display: 'block', marginTop: 8 }}>FORMAL SUIT</span>
                   </div>
               </div>
               <div style={{ padding: 32 }}>
                  <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1e293b', marginBottom: 12 }}>Digital Suit Studio</h3>
                  <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>Swap any casual t-shirt for a sharp corporate suit instantly. Powered by AI to ensure perfect collar alignment and lighting.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features with White Cards & Slide Up Animation */}
      <section id="features" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--primary-purple)', marginBottom: 16 }}>
              Everything you need, <span className="text-gradient-purple-pink">automated</span>
            </h2>
            <p style={{ color: 'var(--text-gray)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
              Professional-grade tools that used to require Photoshop, now automated by AI.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="info-card scroll-animate" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div style={{ 
                    width: 54, height: 54, borderRadius: 12,
                    background: `${f.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                    <Icon size={24} color={f.color} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: 'var(--text-dark)' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-gray)', fontSize: 15, lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '100px 24px', background: 'rgba(103, 58, 183, 0.03)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--primary-purple)', marginBottom: 16 }}>
              From selfie to <span className="text-gradient-purple-pink">print-ready</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 30 }}>
            {steps.map((step, i) => (
              <div key={step.num} className="info-card scroll-animate" style={{ textAlign: 'center', transitionDelay: `${i * 0.1}s` }}>
                <div style={{ 
                  fontSize: 48, fontWeight: 900, 
                  color: 'var(--accent-magenta)', opacity: 0.8,
                  marginBottom: 16
                }}>{step.num}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: 'var(--text-dark)' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: 15, lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="scroll-animate" style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/upload" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
              <Zap size={18} /> Try It Now — Free
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing / Testimonials / Gallery */}
      <section id="pricing" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--primary-purple)', marginBottom: 16 }}>
              Simple, <span className="text-gradient-purple-pink">transparent pricing</span>
            </h2>
            <p style={{ color: 'var(--text-gray)', fontSize: 17 }}>Start free. Pay only when you download.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
            {plans.map((plan, i) => (
              <div key={plan.name} className="info-card scroll-animate" style={{
                transitionDelay: `${i * 0.1}s`,
                border: plan.highlighted ? '2px solid var(--primary-purple)' : '1px solid rgba(0,0,0,0.05)',
                position: 'relative', overflow: 'hidden'
              }}>
                {plan.highlighted && (
                  <div style={{ 
                    position: 'absolute', top: 16, right: 16,
                    background: 'var(--primary-purple)',
                    color: 'white', fontSize: 11, fontWeight: 700,
                    padding: '4px 12px', borderRadius: 100,
                  }}>POPULAR</div>
                )}
                <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary-purple)', marginBottom: 8 }}>{plan.name}</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: 14, marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: 'var(--text-dark)' }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-gray)', fontSize: 14, marginLeft: 6 }}>{plan.period}</span>
                </div>
                <Link href={plan.href} className="btn-primary" style={{ width: '100%', marginBottom: 24 }}>
                  {plan.cta}
                </Link>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: 'var(--text-gray)', fontSize: 14 }}>
                      <Check size={16} color="var(--btn-blue)" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials integrated as Gallery alternative */}
      <section style={{ padding: '80px 24px', background: 'var(--primary-purple)', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>Trusted by 10,000+ Users</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className="scroll-animate" style={{ background: 'rgba(255,255,255,0.1)', padding: 24, borderRadius: 12, transitionDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                  {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} color="#FFB6C1" fill="#FFB6C1" />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>&quot;{t.text}&quot;</p>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ Section for SEO */}
      <section id="faq" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
              Frequently Asked <span className="text-gradient-purple-pink">Questions</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 17 }}>Everything you need to know about our Passport Photo Maker.</p>
          </div>

          <div style={{ display: 'grid', gap: 32 }}>
            {[
              { 
                q: "How to make a passport size photo online for free?", 
                a: "Simply upload your selfie to QuickPassportPhoto. Our AI will automatically remove the background, crop it to official dimensions (like 3.5x4.5 cm), and generate a print-ready sheet in 15 seconds." 
              },
              { 
                q: "What is the standard passport photo size in India?", 
                a: "The standard size is 3.5 x 4.5 cm with the face covering 70-80% of the photo. Our tool automatically crops your photo to these exact specifications." 
              },
              { 
                q: "Can I use a mobile selfie for my passport photo?", 
                a: "Yes! As long as the lighting is good and your face is clear, our AI can transform a standard mobile selfie into a professional biometric passport photo." 
              },
              { 
                q: "How to remove background from passport photo?", 
                a: "Our AI background remover is specialized for ID photos. It detects your hair and clothes accurately to replace any background with official white, blue, or grey colors instantly." 
              },
              { 
                q: "Is this tool suitable for UPSC or SSC exam forms?", 
                a: "Absolutely. We offer specific templates for UPSC, SSC, and other Indian competitive exams, including 'Name and Date' overlay options required by many government portals." 
              }
            ].map((item, i) => (
              <div key={i} className="scroll-animate" style={{ padding: 24, background: '#f8fafc', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', gap: 12 }}>
                  <span style={{ color: '#673AB7' }}>Q.</span> {item.q}
                </h3>
                <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
