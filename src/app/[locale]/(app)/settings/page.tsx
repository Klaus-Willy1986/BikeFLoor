import { setRequestLocale } from 'next-intl/server';
import { SettingsPage } from '@/components/settings/settings-page';

export default async function Settings({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SettingsPage />;
}
