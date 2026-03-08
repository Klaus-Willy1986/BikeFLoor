import { setRequestLocale } from 'next-intl/server';
import { RidesList } from '@/components/strava/rides-list';

export default async function RidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RidesList />;
}
