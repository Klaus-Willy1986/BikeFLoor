import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

// Helper to safely extract period end from subscription
function getPeriodEnd(subscription: Stripe.Subscription): string | null {
  // Stripe v20+ may nest this differently
  const sub = subscription as any;
  const ts = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  if (!ts) return null;
  return new Date(ts * 1000).toISOString();
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id
        );
        const userId = subscription.metadata.supabase_user_id;
        const plan = subscription.metadata.plan;

        if (userId && plan) {
          await supabase
            .from('profiles')
            .update({
              plan,
              stripe_subscription_id: subscription.id,
              subscription_status: 'active',
              current_period_end: getPeriodEnd(subscription),
            })
            .eq('id', userId);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.supabase_user_id;

      if (userId) {
        const plan = subscription.metadata.plan || 'pro';
        await supabase
          .from('profiles')
          .update({
            plan,
            subscription_status: subscription.status === 'active' ? 'active' : 'past_due',
            current_period_end: getPeriodEnd(subscription),
          })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.supabase_user_id;

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            stripe_subscription_id: null,
            subscription_status: 'canceled',
            current_period_end: null,
          })
          .eq('id', userId);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof (invoice as any).subscription === 'string'
          ? (invoice as any).subscription
          : (invoice as any).subscription?.id;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata.supabase_user_id;

        if (userId) {
          await supabase
            .from('profiles')
            .update({ subscription_status: 'past_due' })
            .eq('id', userId);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
