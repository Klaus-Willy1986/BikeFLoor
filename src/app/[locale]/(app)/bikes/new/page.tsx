import { setRequestLocale } from 'next-intl/server';
import { BikeAddWizard } from '@/components/bikes/bike-add-wizard';

export default async function NewBikePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BikeAddWizard />;
}
