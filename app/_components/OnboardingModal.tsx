'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Layers, Zap, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const OnboardingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
        if (!hasSeenOnboarding) {
            const timer = setTimeout(() => setIsOpen(true), 1500); 
            return () => clearTimeout(timer);
        }

        const handleOpen = () => {
            setStep(0);
            setIsOpen(true);
        };
        window.addEventListener('openOnboarding', handleOpen);
        return () => window.removeEventListener('openOnboarding', handleOpen);
    }, []);

    const closeOnboarding = () => {
        setIsOpen(false);
        localStorage.setItem('onboarding_seen', 'true');
    };

    const steps = [
        {
            title: "Welcome to QuickPassportPhoto",
            desc: "The fastest way to get professional passport photos in India. No more expensive studio visits!",
            icon: <Zap size={32} color="#673AB7" />,
            color: "#673AB715",
            preview: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"
        },
        {
            title: "AI Nikharein (Beauty)",
            desc: "Our AI automatically smooths skin textures and fixes lighting for a perfect, studio-quality finish.",
            icon: <Sparkles size={32} color="#C11C84" />,
            color: "#C11C8415",
            preview: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
        },
        {
            title: "Digital Wardrobe",
            desc: "Instantly change into professional suits or shirts. No need to dress up for the camera!",
            icon: <Layers size={32} color="#3498db" />,
            color: "#3498db15",
            preview: "https://images.unsplash.com/photo-1593032465175-481ac7f402a1?q=80&w=300&auto=format&fit=crop"
        },
        {
            title: "Bulk Layout & Save",
            desc: "Save up to 90% by printing your own 4x6 or A4 sheets with perfect cutting guides.",
            icon: <Camera size={32} color="#27ae60" />,
            color: "#27ae6015",
            preview: "https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?q=80&w=300&auto=format&fit=crop"
        },
        {
            title: "How It Works",
            desc: "1. Upload Photo → 2. AI Edit (Background/Suit) → 3. Select Sheet Size → 4. Download PDF/JPEG.",
            icon: <CheckCircle2 size={32} color="#f59e0b" />,
            color: "#f59e0b15",
            preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
        }
    ];

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
            <div style={{
                background: '#fff', width: '100%', maxWidth: 450,
                borderRadius: 24, padding: 32, position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                animation: 'modalSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <button 
                   onClick={closeOnboarding}
                   style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: 6, cursor: 'pointer', color: '#64748b' }}
                >
                    <X size={18} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', height: 200, marginBottom: 24, borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <img 
                           src={steps[step].preview} 
                           alt={steps[step].title}
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ 
                            position: 'absolute', top: 12, left: 12,
                            width: 48, height: 48, borderRadius: 12, 
                            background: steps[step].color, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            {steps[step].icon}
                        </div>
                    </div>

                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>{steps[step].title}</h2>
                    <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>{steps[step].desc}</p>

                    <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
                        {steps.map((_, i) => (
                            <div key={i} style={{ 
                                width: i === step ? 24 : 8, height: 8, 
                                borderRadius: 4, background: i === step ? '#673AB7' : '#e2e8f0',
                                transition: '0.3s'
                            }} />
                        ))}
                    </div>

                    {step < steps.length - 1 ? (
                        <button 
                            onClick={() => setStep(step + 1)}
                            style={{ 
                                width: '100%', padding: '16px', background: '#673AB7', 
                                border: 'none', borderRadius: 14, color: '#fff', 
                                fontWeight: 700, fontSize: 16, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button 
                            onClick={closeOnboarding}
                            style={{ 
                                width: '100%', padding: '16px', background: '#22c55e', 
                                border: 'none', borderRadius: 14, color: '#fff', 
                                fontWeight: 800, fontSize: 16, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}
                        >
                            Start Creating Now <CheckCircle2 size={18} />
                        </button>
                    )}
                </div>
            </div>
            <style jsx>{`
                @keyframes modalSlideIn {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default OnboardingModal;
