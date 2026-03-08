import { setRequestLocale } from 'next-intl/server';
import { ComponentsList } from '@/components/components/components-list';

export default async function ComponentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComponentsList />;
}
