import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Bike,
  Wrench,
  CalendarCheck,
  Activity,
  Package,
  Store,
  ArrowRight,
  CheckCircle2,
  Mountain,
  TreePine,
  Building2,
  Timer,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0c12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 ring-1 ring-amber-500/30">
              <Bike className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">BikeFloor</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#FC4C02] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#FC4C02]/25 transition-all hover:bg-[#e54400] hover:shadow-[#FC4C02]/35"
            >
              {t('nav.signup')}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0a0c12] pb-24 pt-20 sm:pb-32 sm:pt-28">
        {/* Gradient glow effects */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[500px] w-[800px] rounded-full bg-amber-500/[0.07] blur-[120px]" />
        </div>
        <div className="absolute -left-32 top-1/3">
          <div className="h-[300px] w-[300px] rounded-full bg-orange-500/[0.05] blur-[100px]" />
        </div>
        <div className="absolute -right-32 bottom-0">
          <div className="h-[400px] w-[400px] rounded-full bg-amber-600/[0.04] blur-[100px]" />
        </div>

        {/* Topographic pattern overlay */}
        <TopoPattern />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.headline')}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400 sm:text-xl">
              {t('hero.subline')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FC4C02] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#FC4C02]/25 transition-all hover:bg-[#e54400] hover:shadow-[#FC4C02]/35"
              >
                {t('hero.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-white/[0.03] px-7 py-3.5 text-base font-semibold text-zinc-300 transition-all hover:border-zinc-600 hover:bg-white/[0.06] hover:text-white"
              >
                {t('hero.features')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="features" className="relative scroll-mt-16 bg-[#f4f5f7] py-20 sm:py-24">
        <TopoPatternLight />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {t('features.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Wrench className="h-5 w-5" />}
              title={t('features.tracking.title')}
              description={t('features.tracking.description')}
            />
            <FeatureCard
              icon={<CalendarCheck className="h-5 w-5" />}
              title={t('features.maintenance.title')}
              description={t('features.maintenance.description')}
            />
            <FeatureCard
              icon={<Activity className="h-5 w-5" />}
              title={t('features.strava.title')}
              description={t('features.strava.description')}
            />
            <FeatureCard
              icon={<Package className="h-5 w-5" />}
              title={t('features.inventory.title')}
              description={t('features.inventory.description')}
            />
            <FeatureCard
              icon={<Store className="h-5 w-5" />}
              title={t('features.workshop.title')}
              description={t('features.workshop.description')}
            />
            <FeatureCard
              icon={<Bike className="h-5 w-5" />}
              title={t('features.multibike.title')}
              description={t('features.multibike.description')}
            />
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {t('steps.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500">
              {t('steps.subtitle')}
            </p>
          </div>

          <div className="relative mt-14">
            {/* Connector line — desktop only */}
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent sm:block" />

            <div className="grid gap-10 sm:grid-cols-3">
              <StepCard
                number={1}
                title={t('steps.step1.title')}
                description={t('steps.step1.description')}
              />
              <StepCard
                number={2}
                title={t('steps.step2.title')}
                description={t('steps.step2.description')}
              />
              <StepCard
                number={3}
                title={t('steps.step3.title')}
                description={t('steps.step3.description')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Bike Types ── */}
      <section className="relative bg-[#f4f5f7] py-20 sm:py-24">
        <TopoPatternLight />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {t('bikeTypes.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500">
              {t('bikeTypes.subtitle')}
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <BikeTypeCard
              icon={<Bike className="h-7 w-7" />}
              title={t('bikeTypes.road.title')}
              description={t('bikeTypes.road.description')}
            />
            <BikeTypeCard
              icon={<Mountain className="h-7 w-7" />}
              title={t('bikeTypes.mtb.title')}
              description={t('bikeTypes.mtb.description')}
            />
            <BikeTypeCard
              icon={<TreePine className="h-7 w-7" />}
              title={t('bikeTypes.gravel.title')}
              description={t('bikeTypes.gravel.description')}
            />
            <BikeTypeCard
              icon={<Building2 className="h-7 w-7" />}
              title={t('bikeTypes.city.title')}
              description={t('bikeTypes.city.description')}
            />
            <BikeTypeCard
              icon={<Timer className="h-7 w-7" />}
              title={t('bikeTypes.tt.title')}
              description={t('bikeTypes.tt.description')}
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
              <Sparkles className="h-4 w-4" />
              {t('pricing.earlyBird')}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {t('pricing.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
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
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-sm text-zinc-400 line-through">€3,99</span>
                <span className="text-4xl font-extrabold text-zinc-900">€0</span>
                <span className="text-sm text-zinc-500">{t('pricing.perMonth')}</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                <Sparkles className="h-3 w-3" />
                {t('pricing.earlyBirdFree')}
              </div>
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
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-sm text-zinc-400 line-through">€7,99</span>
                <span className="text-4xl font-extrabold text-zinc-900">€0</span>
                <span className="text-sm text-zinc-500">{t('pricing.perMonth')}</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                <Sparkles className="h-3 w-3" />
                {t('pricing.earlyBirdFree')}
              </div>
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

      {/* ── Stats Bar ── */}
      <section className="relative overflow-hidden bg-[#0a0c12] py-14">
        <TopoPattern />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-full w-[300px] bg-amber-500/[0.04] blur-[80px]" />
          <div className="absolute right-1/4 top-0 h-full w-[300px] bg-orange-500/[0.03] blur-[80px]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4">
          <StatItem label={t('stats.parts')} />
          <StatItem label={t('stats.categories')} />
          <StatItem label={t('stats.strava')} />
          <StatItem label={t('stats.freeStart')} />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {t('bottomCta.title')}
          </h2>
          <p className="mt-4 text-lg text-zinc-500">
            {t('bottomCta.subtitle')}
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#FC4C02] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#FC4C02]/25 transition-all hover:bg-[#e54400] hover:shadow-[#FC4C02]/35"
          >
            {t('bottomCta.cta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative border-t border-white/[0.06] bg-[#0a0c12] py-10">
        <TopoPattern />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/20 ring-1 ring-amber-500/30">
              <Bike className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-white">BikeFloor</span>
          </div>
          <p className="text-sm text-zinc-500">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="transition-colors hover:text-zinc-300">{t('footer.privacy')}</Link>
            <Link href="/imprint" className="transition-colors hover:text-zinc-300">{t('footer.imprint')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/[0.08]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white shadow-lg shadow-amber-500/25">
        {number}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
    </div>
  );
}

function BikeTypeCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center transition-all hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/[0.08]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{description}</p>
    </div>
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

function StatItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 text-center">
      <CheckCircle2 className="h-5 w-5 text-amber-400" />
      <span className="text-sm font-semibold text-zinc-300 sm:text-base">{label}</span>
    </div>
  );
}

function TopoPatternLight() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.06]">
        <defs>
          <filter id="topo-lines-light" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.008 0.006" numOctaves="5" seed="8" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feComponentTransfer in="gray" result="bands">
              <feFuncR type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
              <feFuncG type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
              <feFuncB type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
            </feComponentTransfer>
            <feMorphology operator="erode" radius="1" in="bands" result="thin" />
            <feComposite operator="out" in="bands" in2="thin" result="edges" />
            <feColorMatrix type="matrix" in="edges" values="0.45 0 0 0 0  0.2 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#topo-lines-light)" />
      </svg>
    </div>
  );
}

function TopoPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.2]">
        <defs>
          <filter id="topo-lines-dark" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.008 0.006" numOctaves="5" seed="8" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feComponentTransfer in="gray" result="bands">
              <feFuncR type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
              <feFuncG type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
              <feFuncB type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
            </feComponentTransfer>
            <feMorphology operator="erode" radius="1" in="bands" result="thin" />
            <feComposite operator="out" in="bands" in2="thin" result="edges" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#topo-lines-dark)" />
      </svg>
    </div>
  );
}
