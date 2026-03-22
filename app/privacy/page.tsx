'use client';

import Navbar from '../_components/Navbar';


export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24, color: '#1e293b' }}>Privacy Policy</h1>
        <div style={{ background: '#ffffff', padding: 40, borderRadius: 24, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', color: '#475569', lineHeight: 1.6 }}>
          <p style={{ marginBottom: 20 }}>At QuickPassportPhoto, your privacy is our top priority. This policy explains how we handle your data.</p>
          
          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>1. Data Collection</h2>
          <p>We collect your email address for account creation and your uploaded photos solely for the purpose of processing them. We use Supabase and Razorpay to store your account and payment data securely.</p>

          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>2. Photo Storage</h2>
          <p>Photos uploaded to our website are processed locally or via API and then automatically deleted from our production storage within 24 hours.</p>

          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>3. Cookies</h2>
          <p>We use session cookies for authentication and to store your processing preferences temporarily.</p>

          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>4. Security</h2>
          <p>We use SSL encryption and follow industry best practices to protect your data. All transactions are handled securely by Razorpay.</p>

          <h2 style={{ color: '#1e293b', marginTop: 32, marginBottom: 16 }}>5. Contact Us</h2>
          <p>If you have questions about your privacy, please contact us at support@quickpassportphoto.com.</p>
        </div>
      </div>

    </main>
  );
}
