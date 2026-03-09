'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, X } from 'lucide-react';

const PRICES = {
  monthly: { pro: '3,99', fleet: '7,99' },
  yearly: { pro: '39,90', fleet: '79,90' },
};

export function PricingSection() {
  const t = useTranslations('landing');
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {t('pricing.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500">
            {t('pricing.subtitle')}
          </p>

          {/* Interval toggle */}
          <div className="mt-8 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-1">
            <button
              onClick={() => setInterval('monthly')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                interval === 'monthly'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                interval === 'yearly'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {t('pricing.yearly')}
              <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {t('pricing.saveMonths')}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {/* Free */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <h3 className="text-lg font-bold text-zinc-900">{t('pricing.free.name')}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-zinc-900">€0</span>
              <span className="text-sm text-zinc-500">{t('pricing.perMonth')}</span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">{t('pricing.free.description')}</p>
            <Link
              href="/signup"
              className="mt-8 flex w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50"
            >
              {t('pricing.free.cta')}
            </Link>
            <ul className="mt-8 space-y-3">
              <PricingFeature included>{t('pricing.features.bikes', { count: 1 })}</PricingFeature>
              <PricingFeature included>{t('pricing.features.components')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.maintenance')}</PricingFeature>
              <PricingFeature>{t('pricing.features.strava')}</PricingFeature>
              <PricingFeature>{t('pricing.features.workshop')}</PricingFeature>
              <PricingFeature>{t('pricing.features.export')}</PricingFeature>
            </ul>
          </div>

          {/* Pro — highlighted */}
          <div className="relative rounded-2xl border-2 border-[#FC4C02] bg-white p-8 shadow-xl shadow-[#FC4C02]/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#FC4C02] px-4 py-1 text-xs font-bold text-white">
              {t('pricing.popular')}
            </div>
            <h3 className="text-lg font-bold text-zinc-900">{t('pricing.pro.name')}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-zinc-900">
                €{interval === 'monthly' ? PRICES.monthly.pro : PRICES.yearly.pro}
              </span>
              <span className="text-sm text-zinc-500">
                {interval === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')}
              </span>
            </div>
            {interval === 'yearly' && (
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                {t('pricing.yearlyHint', { monthly: PRICES.monthly.pro })}
              </p>
            )}
            <p className="mt-3 text-sm text-zinc-500">{t('pricing.pro.description')}</p>
            <Link
              href="/signup"
              className="mt-8 flex w-full items-center justify-center rounded-lg bg-[#FC4C02] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FC4C02]/25 transition-all hover:bg-[#e54400]"
            >
              {t('pricing.pro.cta')}
            </Link>
            <ul className="mt-8 space-y-3">
              <PricingFeature included>{t('pricing.features.bikes', { count: 5 })}</PricingFeature>
              <PricingFeature included>{t('pricing.features.components')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.maintenance')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.strava')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.workshop')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.export')}</PricingFeature>
            </ul>
          </div>

          {/* Fleet */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <h3 className="text-lg font-bold text-zinc-900">{t('pricing.fleet.name')}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-zinc-900">
                €{interval === 'monthly' ? PRICES.monthly.fleet : PRICES.yearly.fleet}
              </span>
              <span className="text-sm text-zinc-500">
                {interval === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')}
              </span>
            </div>
            {interval === 'yearly' && (
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                {t('pricing.yearlyHint', { monthly: PRICES.monthly.fleet })}
              </p>
            )}
            <p className="mt-3 text-sm text-zinc-500">{t('pricing.fleet.description')}</p>
            <Link
              href="/signup"
              className="mt-8 flex w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50"
            >
              {t('pricing.fleet.cta')}
            </Link>
            <ul className="mt-8 space-y-3">
              <PricingFeature included>{t('pricing.features.bikesUnlimited')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.components')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.maintenance')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.strava')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.workshop')}</PricingFeature>
              <PricingFeature included>{t('pricing.features.export')}</PricingFeature>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingFeature({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      {included ? (
        <Check className="h-4 w-4 shrink-0 text-amber-600" />
      ) : (
        <X className="h-4 w-4 shrink-0 text-zinc-300" />
      )}
      <span className={included ? 'text-zinc-700' : 'text-zinc-400'}>{children}</span>
    </li>
  );
}
