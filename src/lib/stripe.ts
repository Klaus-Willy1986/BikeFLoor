import Stripe from 'stripe';

export { PLANS, getBikeLimit, type PlanKey } from './plans';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

// Lazy-initialized Stripe client (avoids crash when env var is missing at build time)
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

export function getPriceId(plan: 'pro' | 'fleet'): string | undefined {
  if (plan === 'pro') return process.env.STRIPE_PRO_PRICE_ID;
  if (plan === 'fleet') return process.env.STRIPE_FLEET_PRICE_ID;
  return undefined;
}
