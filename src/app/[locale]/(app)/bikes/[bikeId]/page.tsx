import { setRequestLocale } from 'next-intl/server';
import { BikeDetail } from '@/components/bikes/bike-detail';

export default async function BikeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; bikeId: string }>;
}) {
  const { locale, bikeId } = await params;
  setRequestLocale(locale);
  return <BikeDetail bikeId={bikeId} />;
}
