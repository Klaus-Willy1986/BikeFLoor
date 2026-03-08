'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useBikes } from '@/hooks/use-bikes';
import { createClient } from '@/lib/supabase/client';
import { getBikeLimit } from '@/lib/plans';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { BikeCard } from '@/components/bikes/bike-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { Plus, Lock } from 'lucide-react';

export function BikesList() {
  const t = useTranslations('bikes');
  const tSettings = useTranslations('settings');
  const { data: bikes, isLoading } = useBikes();

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
          limitReached ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Lock className="mr-1 h-3 w-3" />
                {t('limitReached', { count: bikeLimit })}
              </Badge>
              <Button asChild size="sm">
                <Link href="/settings">{tSettings('upgradePro')}</Link>
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/bikes/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('addBike')}
              </Link>
            </Button>
          )
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
