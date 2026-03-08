import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Bike, ArrowLeft } from 'lucide-react';

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ImprintPageContent />;
}

function ImprintPageContent() {
  const t = useTranslations('imprint');

  return (
    <div className="min-h-screen bg-[#0a0c12]">
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0c12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 ring-1 ring-amber-500/30">
              <Bike className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">BikeFloor</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="mb-8 text-3xl font-bold text-white sm:text-4xl">{t('title')}</h1>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">{t('responsible.title')}</h2>
            <p className="whitespace-pre-line">{t('responsible.text')}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">{t('contact.title')}</h2>
            <p className="whitespace-pre-line">{t('contact.text')}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">{t('disclaimer.title')}</h2>
            <p>{t('disclaimer.text')}</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-zinc-500 sm:px-6">
          © {new Date().getFullYear()} BikeFloor
        </div>
      </footer>
    </div>
  );
}
