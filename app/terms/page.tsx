'use client';

import Navbar from '../_components/Navbar';
import Footer from '../_components/Footer';

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24, color: '#1e293b' }}>Terms & Conditions</h1>
        <div style={{ background: '#ffffff', padding: 40, borderRadius: 24, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', color: '#475569', lineHeight: 1.6 }}>
          <p style={{ marginBottom: 20 }}>Welcome to QuickPassportPhoto. By using our website, you agree to the following terms.</p>
          
          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>1. Services Provided</h2>
          <p>QuickPassportPhoto provides an AI-powered tool to create passport-sized photos from user-uploaded images. This includes background removal, cropping, and PDF layout generation.</p>

          <h2 id="refunds" style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>2. Payments & Refunds</h2>
          <p>We use Razorpay for payment processing. Payments for premium downloads (₹10 or subscription) are non-refundable once the processed file has been downloaded, due to the digital nature of the product.</p>

          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>3. User Data</h2>
          <p>Users are responsible for the photos they upload. We do not store original photos for more than 24 hours. We do not use your photos for marketing without explicit consent.</p>

          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>4. Intellectual Property</h2>
          <p>The design, code, and logos of QuickPassportPhoto are the intellectual property of Krishan Kumar Awasthi (KKA) Shivpuri.</p>

          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>5. Limitation of Liability</h2>
          <p>We strive for accuracy in biometric cropping, but it is the user's responsibility to verify the final photo meets their specific government requirements before printing/using.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
