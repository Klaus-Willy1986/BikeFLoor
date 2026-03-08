'use client';

import { useTranslations } from 'next-intl';
import { useBikes } from '@/hooks/use-bikes';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { BikeCard } from '@/components/bikes/bike-card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';

export function BikesList() {
  const t = useTranslations('bikes');
  const { data: bikes, isLoading } = useBikes();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('title')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        action={
          <Button asChild>
            <Link href="/bikes/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('addBike')}
            </Link>
          </Button>
        }
      />
      {!bikes?.length ? (
        <EmptyState
          title={t('noBikes')}
          action={
            <Button asChild>
              <Link href="/bikes/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('addBike')}
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      )}
    </div>
  );
}
