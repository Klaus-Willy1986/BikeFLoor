'use client';

import { useTranslations } from 'next-intl';
import { useBikes } from '@/hooks/use-bikes';
import { useRides } from '@/hooks/use-rides';
import { PageHeader } from '@/components/shared/page-header';
import { FleetOverview } from './fleet-overview';
import { MaintenanceAlerts } from './maintenance-alerts';
import { RecentRides } from './recent-rides';

export function Dashboard() {
  const t = useTranslations('dashboard');
  const { data: bikes, isLoading: bikesLoading } = useBikes();
  const { data: rides, isLoading: ridesLoading } = useRides(undefined, 10);

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} />
      <FleetOverview bikes={bikes ?? []} loading={bikesLoading} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MaintenanceAlerts />
        <RecentRides rides={rides ?? []} loading={ridesLoading} />
      </div>
    </div>
  );
}
