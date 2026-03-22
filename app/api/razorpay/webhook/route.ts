import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../../lib/supabaseClient';

/**
 * Handle Razorpay Webhook events to securely update order status in Supabase.
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment capture
    if (event.event === 'payment.captured') {
      const { order_id, notes, amount } = event.payload.payment.entity;
      
      // 1. Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('razorpay_order_id', order_id);

      if (orderError) console.error('Supabase order update error:', orderError);
      
      // 2. Grant credits to profile
      if (notes && notes.user_id) {
         // If amount is ₹10 (1000 paise), give 1 credit. 
         // Adjust logic if you have multiple packages.
         const creditsToGrant = amount >= 1000 ? 1 : 0; 

         const { data: profile, error: fetchError } = await supabase
           .from('profiles')
           .select('credits')
           .eq('id', notes.user_id)
           .single();

         if (profile && !fetchError) {
           await supabase
             .from('profiles')
             .update({ credits: profile.credits + creditsToGrant })
             .eq('id', notes.user_id);
         }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
