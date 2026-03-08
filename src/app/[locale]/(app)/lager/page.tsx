import { setRequestLocale } from 'next-intl/server';
import { LagerList } from '@/components/lager/lager-list';

export default async function LagerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LagerList />;
}
