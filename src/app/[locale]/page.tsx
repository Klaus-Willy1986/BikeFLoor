import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { LandingPage } from '@/components/landing/landing-page';

export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Check if user is logged in — if Supabase is not configured, show landing page
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        redirect({ href: '/dashboard', locale });
      }
    } catch {
      // Supabase not reachable — show landing page
    }
  }

  return <LandingPage />;
}
