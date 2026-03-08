import { setRequestLocale } from 'next-intl/server';
import { EditBikeForm } from '@/components/bikes/edit-bike-form';

export default async function EditBikePage({
  params,
}: {
  params: Promise<{ locale: string; bikeId: string }>;
}) {
  const { locale, bikeId } = await params;
  setRequestLocale(locale);
  return <EditBikeForm bikeId={bikeId} />;
}
