'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { Cog, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WEAR_THRESHOLDS } from '@/lib/constants';

export function ComponentWear() {
  const t = useTranslations('dashboard');
  const tc = useTranslations('components');

  const { data: components, isLoading } = useQuery({
    queryKey: ['all-components-wear'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('components')
        .select('id, name, category_id, current_distance_km, max_distance_km, bike_id, bikes(name)')
        .eq('is_active', true)
        .not('max_distance_km', 'is', null)
        .order('current_distance_km', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const wornComponents = (components ?? [])
    .map((c) => {
      const wear = c.max_distance_km ? c.current_distance_km / c.max_distance_km : 0;
      return { ...c, wear };
    })
    .filter((c) => c.wear >= WEAR_THRESHOLDS.good)
    .sort((a, b) => b.wear - a.wear)
    .slice(0, 8);

  const getWearColor = (wear: number) => {
    if (wear >= WEAR_THRESHOLDS.critical) return 'bg-destructive';
    if (wear >= WEAR_THRESHOLDS.warning) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getWearLabel = (wear: number) => {
    if (wear >= WEAR_THRESHOLDS.critical) return tc('wearStatus.critical');
    if (wear >= WEAR_THRESHOLDS.warning) return tc('wearStatus.warning');
    return tc('wearStatus.good');
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Cog className="h-4 w-4" />
            {t('componentWear')}
          </CardTitle>
          <Link
            href="/bikes"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : wornComponents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">{t('noWear')}</p>
        ) : (
          <div className="space-y-3">
            {wornComponents.map((comp) => (
              <Link
                key={comp.id}
                href={`/bikes/${comp.bike_id}`}
                className="block rounded-lg border p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{comp.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Bike className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {(comp as any).bikes?.name}
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    comp.wear >= WEAR_THRESHOLDS.critical ? 'text-destructive' :
                    comp.wear >= WEAR_THRESHOLDS.warning ? 'text-amber-600' :
                    'text-emerald-600'
                  )}>
                    {Math.round(comp.wear * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', getWearColor(comp.wear))}
                    style={{ width: `${Math.min(comp.wear * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {Math.round(comp.current_distance_km).toLocaleString()} km
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {comp.max_distance_km?.toLocaleString()} km
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
