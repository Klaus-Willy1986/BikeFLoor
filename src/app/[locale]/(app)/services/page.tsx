import { setRequestLocale } from 'next-intl/server';
import { MaintenanceBoard } from '@/components/maintenance/maintenance-board';
import { PageHeader } from '@/components/shared/page-header';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="space-y-6">
      <PageHeader title="Wartung & Verschleiß" />
      <MaintenanceBoard />
    </div>
  );
}
