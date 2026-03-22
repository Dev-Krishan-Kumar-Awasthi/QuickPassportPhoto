'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Check, X, Clock, RefreshCw, LogIn, Search, AlertCircle, ShoppingBag, ShieldAlert } from 'lucide-react';
import Navbar from '../_components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  created_at: string;
  user_id: string;
  amount: number;
  status: 'pending_verification' | 'paid' | 'failed' | 'pending';
  utr_number: string;
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  // KRISHAN: Enter your official email here for 100% security
  const ADMIN_EMAILS = ['ADMIN_EMAIL_HERE', '7089881219@kka.studio']; 

  useEffect(() => {
    checkAuth();
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    
    // STRICT SECURITY: Only Krishan can access this
    const ALLOWED_ADMINS = ['7089881219@kka.studio', 'krishankumarawasthi@gmail.com']; 
    if (!ALLOWED_ADMINS.includes(user.email || '')) {
      setUnauthorized(true);
      return;
    }

    setUser(user);
  };

  if (unauthorized) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 440, background: 'white', padding: 40, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <ShieldAlert size={64} color="#ef4444" style={{ margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Unauthorized</h1>
          <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>Your account does not have permission to access the KKA Studio Admin Portal.</p>
          <button onClick={() => router.push('/')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Return Home</button>
        </div>
      </main>
    );
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch (err) {
      alert('Error updating order');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '100px 24px 80px' }}>
      <Navbar />
      
      {/* Search Engine De-indexing Meta */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
               <ShieldAlert size={14} /> SECURE ADMIN PORTAL
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>KKA Studio Management</h1>
            <p style={{ color: '#64748b', fontWeight: 500 }}>Only authorized studio owners can verify UPI payments.</p>
          </div>
          <button onClick={fetchOrders} className="btn-secondary" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Orders
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
           <div style={{ background: 'white', padding: 24, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
             <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>REVENUE (PAID)</p>
             <h3 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b' }}>₹{orders.filter(o => o.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0)}</h3>
           </div>
           <div style={{ background: 'white', padding: 24, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
             <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>PENDING UPI VERIFICATION</p>
             <h3 style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{orders.filter(o => o.status === 'pending_verification').length}</h3>
           </div>
           <div style={{ background: 'white', padding: 24, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
             <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>TOTAL ORDERS</p>
             <h3 style={{ fontSize: 28, fontWeight: 800, color: '#673AB7' }}>{orders.length}</h3>
           </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '20px 24px', fontSize: 13, color: '#64748b', fontWeight: 700 }}>DATE</th>
                  <th style={{ padding: '20px 24px', fontSize: 13, color: '#64748b', fontWeight: 700 }}>UTR / TRANSACTION ID</th>
                  <th style={{ padding: '20px 24px', fontSize: 13, color: '#64748b', fontWeight: 700 }}>AMOUNT</th>
                  <th style={{ padding: '20px 24px', fontSize: 13, color: '#64748b', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '20px 24px', fontSize: 13, color: '#64748b', fontWeight: 700 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
                      <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: 16 }} />
                      <p>No transactions to show.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 24px', fontSize: 14 }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 700, fontSize: 15, color: '#1e293b', letterSpacing: '1px' }}>
                        {order.utr_number || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 600 }}>₹{order.amount}</td>
                      <td style={{ padding: '16px 24px' }}>
                         <span style={{ 
                           padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                           background: order.status === 'paid' ? 'rgba(16,185,129,0.1)' : order.status === 'pending_verification' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                           color: order.status === 'paid' ? '#10b981' : order.status === 'pending_verification' ? '#f59e0b' : '#64748b'
                         }}>
                           {order.status.replace('_', ' ').toUpperCase()}
                         </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {order.status === 'pending_verification' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button 
                              onClick={() => updateStatus(order.id, 'paid')}
                              title="Verify & Approve"
                              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => updateStatus(order.id, 'failed')}
                              title="Reject"
                              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                        {order.status === 'paid' && (
                          <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>Approved ✅</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
