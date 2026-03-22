'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Filter, BarChart3, TrendingUp, Settings, LogOut, Download, Clock, Image as ImageIcon, CheckCircle2, ChevronRight, Crown } from 'lucide-react';
import Navbar from '../_components/Navbar';

const MOCK_BULK_ORDERS = [
  { id: 'STU-9921', customer: 'Ankit Dhakad (Walk-in)', date: 'Today, 2:45 PM', type: '8 Print Sheets (A4)', status: 'Processing', value: '₹400' },
  { id: 'STU-9920', customer: 'School Batch A', date: 'Today, 11:30 AM', type: '45 Student ID Photos', status: 'Completed', value: '₹2250' },
  { id: 'STU-9918', customer: 'Ravi Verma', date: 'Yesterday, 5:15 PM', type: '2 Print Sheets (4x6)', status: 'Completed', value: '₹100' },
  { id: 'STU-9915', customer: 'Lokendra Prajapati', date: 'Yesterday, 1:00 PM', type: 'Visa Photo set', status: 'Completed', value: '₹150' },
];

export default function StudioDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <main style={{ minHeight: '100vh', padding: '100px 24px 60px', background: '#f8fafc', position: 'relative', zIndex: 1 }}>
      <Navbar />
      
      <div style={{ maxWidth: 1280, margin: '20px auto 0', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
        
        {/* Sidebar */}
        <div>
          <div className="card" style={{ padding: 24, background: '#ffffff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={24} />
              </div>
              <div>
                <div style={{ color: '#10b981', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Studio Pro</div>
                <div style={{ color: '#1e293b', fontWeight: 800, fontSize: 16 }}>City Color Lab</div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'orders', icon: Clock, label: 'Order Management' },
                { id: 'analytics', icon: BarChart3, label: 'Analytics & Revenue' },
                { id: 'customers', icon: Users, label: 'Customer DB' },
                { id: 'settings', icon: Settings, label: 'Studio Settings' },
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: activeTab === item.id ? 'rgba(103, 58, 183, 0.08)' : 'transparent', color: activeTab === item.id ? '#673AB7' : '#475569', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === item.id ? 700 : 500, transition: 'all 0.2s' }}
                >
                  <item.icon size={18} color={activeTab === item.id ? '#673AB7' : '#94a3b8'} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'transparent', color: '#ef4444', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, width: '100%' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Studio Workspace</h1>
              <p style={{ color: '#475569', fontSize: 15, fontWeight: 500 }}>Process walk-in customers and track revenue.</p>
            </div>
            <Link href="/upload">
              <button className="btn-primary" style={{ padding: '14px 20px', fontSize: 14 }}>
                + New Studio Order
              </button>
            </Link>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Today\'s Revenue', value: '₹2,650', trend: '+12%', icon: TrendingUp, color: '#10b981' },
              { label: 'Photos Processed', value: '142', trend: '+5%', icon: ImageIcon, color: '#673AB7' },
              { label: 'Orders Completed', value: '28', trend: '-2%', icon: CheckCircle2, color: '#3b82f6' },
              { label: 'Active Sessions', value: '3', trend: 'Live', icon: Clock, color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ background: '#ffffff', borderRadius: 16, padding: 20, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={20} color={stat.color} />
                  </div>
                  <span style={{ color: stat.color, fontSize: 13, fontWeight: 700, padding: '4px 8px', borderRadius: 100, background: `${stat.color}15` }}>{stat.trend}</span>
                </div>
                <div style={{ color: '#1e293b', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{stat.value}</div>
                <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ background: '#ffffff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: 16 }}>Live Order Queue</h3>
              <button style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <Filter size={14} /> Filter
              </button>
            </div>
            
            <div style={{ padding: '0 24px' }}>
              {MOCK_BULK_ORDERS.map((order, i) => (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: i < MOCK_BULK_ORDERS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <span style={{ color: '#1e293b', fontWeight: 800, fontSize: 15 }}>{order.customer}</span>
                      <span style={{ background: order.status === 'Processing' ? '#fef3c7' : '#d1fae5', color: order.status === 'Processing' ? '#d97706' : '#059669', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                      {order.id} • {order.date} • <span style={{ color: '#475569', fontWeight: 600 }}>{order.type}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#1e293b', fontWeight: 800, fontSize: 16 }}>{order.value}</div>
                      <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>Billed</div>
                    </div>
                    
                    <button className={order.status === 'Processing' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 16px', fontSize: 13, minWidth: 120, justifyContent: 'center' }}>
                      {order.status === 'Processing' ? 'Process Now' : 'Download ZIP'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ padding: '12px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#673AB7', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%' }}>
                View All Orders <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
