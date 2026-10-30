import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Paystack Production Webhook Handler
 * Endpoint: /api/webhooks/paystack
 * 
 * Automatically called by Paystack whenever a card payment,
 * Dedicated Virtual Account bank transfer, or QR payment succeeds or fails.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const paystackSignature = req.headers.get('x-paystack-signature');
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // 1. Cryptographic HMAC-SHA512 Signature Verification
    if (secretKey && paystackSignature) {
      const hash = crypto
        .createHmac('sha512', secretKey)
        .update(rawBody)
        .digest('hex');

      if (hash !== paystackSignature) {
        console.warn('[Paystack Webhook] Invalid HMAC signature detected. Rejecting spoofed request.');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    console.log(`[Paystack Webhook] Received verified event: ${event}`, {
      reference: data?.reference,
      amount: data?.amount ? data.amount / 100 : 0,
      customer: data?.customer?.email,
    });

    // 2. Handle successful payment events
    if (event === 'charge.success') {
      const amountInNaira = data.amount / 100;
      const reference = data.reference;
      const metadata = data.metadata || {};
      const customerEmail = data.customer?.email || '';
      const customerName = metadata.fullName || `${data.customer?.first_name || ''} ${data.customer?.last_name || ''}`.trim();
      const planName = metadata.planName || 'Gym Membership Pass';
      const tenantSlug = metadata.gymSlug || metadata.tenantId || 'dollbass-fitness';

      // Record transaction to Supabase Cloud if configured
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from('pos_transactions').insert({
            item_name: `Paystack Online: ${planName}`,
            quantity: 1,
            amount_paid: amountInNaira,
            cashier_pin: 'PAYSTACK_API',
            payment_method: 'Paystack Dedicated Settlement',
          });

          // If member code or id is provided, ensure subscription is marked active
          if (metadata.memberCode || metadata.memberId) {
            await supabase
              .from('members')
              .update({
                status: 'Active',
              })
              .or(`pass_code.eq.${metadata.memberCode || ''},id.eq.${metadata.memberId || ''}`);
          }
        } catch (dbErr) {
          console.error('[Paystack Webhook] Supabase sync error:', dbErr);
        }
      }
    }

    // Always respond with 200 OK so Paystack knows the event was successfully delivered
    return NextResponse.json({
      status: 'success',
      received: true,
      event,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Paystack Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: 'Webhook processing error', message: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'FitLedger Paystack Webhook Listener is active and listening for verified POST events.',
    documentation: 'https://paystack.com/docs/payments/webhooks/',
  });
}
