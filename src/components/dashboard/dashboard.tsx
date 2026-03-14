'use client';

import { useTranslations } from 'next-intl';
import { useBikes } from '@/hooks/use-bikes';
import { useRides } from '@/hooks/use-rides';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Plus, Route, Wrench } from 'lucide-react';
import { FleetOverview } from './fleet-overview';
import { MaintenanceAlerts } from './maintenance-alerts';
import { RecentRides } from './recent-rides';
import { ComponentWear } from './component-wear';
import { InventoryStock } from './inventory-stock';
import { ActiveChecklists } from './active-checklists';

export function Dashboard() {
  const t = useTranslations('dashboard');
  const { data: bikes, isLoading: bikesLoading } = useBikes();
  const { data: rides, isLoading: ridesLoading } = useRides(undefined, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href="/bikes/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                {t('quickBike')}
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/rides">
                <Route className="mr-1.5 h-3.5 w-3.5" />
                {t('quickRide')}
              </Link>
            </Button>
          </div>
        }
      />
      <FleetOverview bikes={bikes ?? []} rides={rides ?? []} loading={bikesLoading} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MaintenanceAlerts />
        <ComponentWear />
      </div>
      <InventoryStock />
      <ActiveChecklists />
      <RecentRides rides={rides ?? []} loading={ridesLoading} />
    </div>
  );
}
