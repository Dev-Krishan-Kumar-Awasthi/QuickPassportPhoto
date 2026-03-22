'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Layers, Zap, X, ChevronRight, CheckCircle2, UserCheck, Smartphone } from 'lucide-react';
import Image from 'next/image';
import logoSrc from '../../public/Logo.png';

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
            title: "Smart Photo Magic",
            subtitle: "Instant Transformation",
            desc: "Turn any home selfie into a perfect, government-approved passport photo in just 5 seconds. AI handles the lighting and background removal.",
            icon: <Smartphone size={24} color="#673AB7" />,
            color: "rgba(103, 58, 183, 0.1)",
            image: "/onboarding/welcome.png"
        },
        {
            title: "Digital Wardrobe",
            subtitle: "Professional Look",
            desc: "Not wearing a suit? No problem. Instantly change your clothes to formal business attire with single click. Look professional for any application.",
            icon: <Layers size={24} color="#C11C84" />,
            color: "rgba(193, 28, 132, 0.1)",
            image: "/onboarding/smart_suit.png"
        },
        {
            title: "Pro Print Sheet",
            subtitle: "Save 90% Costs",
            desc: "Generate a perfectly aligned 4x6 print sheet with 8 photos. Ready to print at any studio or home for just ₹5 instead of ₹100.",
            icon: <Camera size={24} color="#27ae60" />,
            color: "rgba(39, 174, 96, 0.1)",
            image: "/onboarding/print_sheet.png"
        }
    ];

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(5, 5, 16, 0.6)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
            <div style={{
                background: '#ffffff', width: '100%', maxWidth: 440,
                borderRadius: 28, position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 30px 60px -12px rgba(0,0,0,0.3)',
                animation: 'modalFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header with Logo */}
                <div style={{ padding: '24px 32px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Image src={logoSrc} alt="Logo" width={32} height={32} style={{ borderRadius: 8 }} />
                        <span style={{ fontWeight: 800, color: '#1e293b', fontSize: 16, letterSpacing: '-0.5px' }}>QuickPassportPhoto</span>
                    </div>
                    <button 
                       onClick={closeOnboarding}
                       style={{ background: '#f1f5f9', border: 'none', borderRadius: 12, width: 32, height: 32, cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '0 32px 32px' }}>
                    {/* Image Area */}
                    <div style={{ position: 'relative', width: '100%', height: 260, marginBottom: 28, borderRadius: 20, overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
                        <img 
                           key={step}
                           src={steps[step].image} 
                           alt={steps[step].title}
                           style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'imageSlide 0.5s ease-out' }}
                        />
                        <div style={{ 
                            position: 'absolute', top: 16, left: 16,
                            width: 44, height: 44, borderRadius: 12, 
                            background: 'rgba(255,255,255,0.9)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
                        }}>
                            {steps[step].icon}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 100, background: steps[step].color, color: steps[step].color.replace('0.1', '1'), fontSize: 12, fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {steps[step].subtitle}
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.8px' }}>{steps[step].title}</h2>
                        <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, marginBottom: 32, fontWeight: 500, minHeight: 72 }}>{steps[step].desc}</p>

                        {/* Pagination Dots */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                            {steps.map((_, i) => (
                                <div key={i} style={{ 
                                    width: i === step ? 32 : 8, height: 8, 
                                    borderRadius: 4, background: i === step ? '#673AB7' : '#e2e8f0',
                                    transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }} />
                            ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            {step < steps.length - 1 ? (
                                <>
                                    <button 
                                        onClick={closeOnboarding}
                                        style={{ flex: 1, padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, color: '#64748b', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                                    >
                                        Skip
                                    </button>
                                    <button 
                                        onClick={() => setStep(step + 1)}
                                        style={{ 
                                            flex: 1.5, padding: '16px', background: '#673AB7', 
                                            border: 'none', borderRadius: 16, color: '#fff', 
                                            fontWeight: 700, fontSize: 15, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            boxShadow: '0 10px 20px rgba(103, 58, 183, 0.25)'
                                        }}
                                    >
                                        Next <ChevronRight size={18} />
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={closeOnboarding}
                                    style={{ 
                                        width: '100%', padding: '18px', background: 'linear-gradient(135deg, #673AB7, #C11C84)', 
                                        border: 'none', borderRadius: 18, color: '#fff', 
                                        fontWeight: 800, fontSize: 16, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                        boxShadow: '0 15px 30px rgba(103, 58, 183, 0.3)'
                                    }}
                                >
                                    Start Creating Now <CheckCircle2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes modalFadeIn {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes imageSlide {
                    from { transform: scale(1.1); opacity: 0.8; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default OnboardingModal;
