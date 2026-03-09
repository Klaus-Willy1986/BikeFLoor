'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useBikes } from '@/hooks/use-bikes';
import { createClient } from '@/lib/supabase/client';
import { getBikeLimit } from '@/lib/plans';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { BikeCard } from '@/components/bikes/bike-card';
import { BikeGarageCard } from '@/components/bikes/bike-garage-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { Plus, Lock, LayoutGrid, GalleryHorizontalEnd } from 'lucide-react';

type ViewMode = 'grid' | 'garage';

const STORAGE_KEY = 'bikefloor-bikes-view';

export function BikesList() {
  const t = useTranslations('bikes');
  const tSettings = useTranslations('settings');
  const { data: bikes, isLoading } = useBikes();

  const [view, setView] = useState<ViewMode>('grid');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (stored === 'grid' || stored === 'garage') setView(stored);
  }, []);

  const handleViewChange = (v: ViewMode) => {
    setView(v);
    localStorage.setItem(STORAGE_KEY, v);
  };

  const supabase = createClient();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('plan, is_early_bird')
        .eq('id', user.id)
        .single();
      return data;
    },
  });

  const bikeLimit = getBikeLimit(profile?.plan ?? 'free', profile?.is_early_bird ?? false);
  const bikesCount = bikes?.length ?? 0;
  const limitReached = bikesCount >= bikeLimit;

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
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg border bg-muted/50 p-0.5">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => handleViewChange('grid')}
                title={t('viewGrid')}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={view === 'garage' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => handleViewChange('garage')}
                title={t('viewGarage')}
              >
                <GalleryHorizontalEnd className="h-3.5 w-3.5" />
              </Button>
            </div>

            {limitReached ? (
              <>
                <Badge variant="secondary" className="text-xs">
                  <Lock className="mr-1 h-3 w-3" />
                  {t('limitReached', { count: bikeLimit })}
                </Badge>
                <Button asChild size="sm">
                  <Link href="/settings">{tSettings('upgradePro')}</Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/bikes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('addBike')}
                </Link>
              </Button>
            )}
          </div>
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
      ) : view === 'garage' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {bikes.map((bike) => (
            <BikeGarageCard key={bike.id} bike={bike} />
          ))}
        </div>
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
