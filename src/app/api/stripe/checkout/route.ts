import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, getPriceId } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, interval = 'monthly' } = (await request.json()) as {
      plan: string;
      interval?: 'monthly' | 'yearly';
    };

    if (!plan || !['pro', 'fleet'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const priceId = getPriceId(plan as 'pro' | 'fleet', interval);
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 400 });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get('origin')}/settings?stripe=success`,
      cancel_url: `${request.headers.get('origin')}/settings?stripe=cancel`,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
