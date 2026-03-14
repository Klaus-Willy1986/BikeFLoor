'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { CalendarClock, Bike } from 'lucide-react';
import { addMonths, isBefore } from 'date-fns';

interface UpcomingChange {
  componentId: string;
  componentName: string;
  bikeId: string;
  bikeName: string;
  remainingKm: number;
  estimatedDate: Date | null;
  estimatedCost: number | null;
}

export function UpcomingChanges() {
  const t = useTranslations('dashboard');

  const { data: upcoming, isLoading } = useQuery({
    queryKey: ['upcoming-changes'],
    queryFn: async () => {
      const supabase = createClient();

      // Get all active components with max_distance_km
      const { data: components, error: compError } = await (supabase as any)
        .from('components')
        .select('id, name, category_id, current_distance_km, max_distance_km, installed_at, bike_id, bikes(name, total_distance_km)')
        .eq('is_active', true)
        .not('max_distance_km', 'is', null)
        .gt('max_distance_km', 0);
      if (compError) throw compError;

      // Get km/month per bike from rides in last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const { data: rides } = await supabase
        .from('rides')
        .select('bike_id, distance_km')
        .gte('date', sixMonthsAgo.toISOString().split('T')[0]);

      const bikeKmPerMonth = new Map<string, number>();
      if (rides) {
        const bikeDistances = new Map<string, number>();
        for (const r of rides) {
          if (!r.bike_id) continue;
          bikeDistances.set(r.bike_id, (bikeDistances.get(r.bike_id) ?? 0) + Number(r.distance_km));
        }
        for (const [bikeId, totalKm] of bikeDistances) {
          bikeKmPerMonth.set(bikeId, totalKm / 6);
        }
      }

      // Get inventory items for cost estimates (cheapest per category)
      const { data: inventoryItems } = await (supabase as any)
        .from('inventory_items')
        .select('category_id, price')
        .not('category_id', 'is', null)
        .not('price', 'is', null)
        .gt('price', 0);

      const cheapestByCategory = new Map<string, number>();
      if (inventoryItems) {
        for (const item of inventoryItems as { category_id: string; price: number }[]) {
          const current = cheapestByCategory.get(item.category_id);
          const price = Number(item.price);
          if (current === undefined || price < current) {
            cheapestByCategory.set(item.category_id, price);
          }
        }
      }

      // Build upcoming changes
      const changes: UpcomingChange[] = [];

      for (const comp of components ?? []) {
        const remaining = Math.max(comp.max_distance_km - comp.current_distance_km, 0);
        const kmMonth = bikeKmPerMonth.get(comp.bike_id);

        let estimatedDate: Date | null = null;
        if (kmMonth && kmMonth > 0 && remaining > 0) {
          const monthsRemaining = remaining / kmMonth;
          estimatedDate = addMonths(new Date(), monthsRemaining);
        }

        // If remaining is 0, it's already overdue → set date to now
        if (remaining === 0) {
          estimatedDate = new Date();
        }

        changes.push({
          componentId: comp.id,
          componentName: comp.name,
          bikeId: comp.bike_id,
          bikeName: comp.bikes?.name ?? '?',
          remainingKm: remaining,
          estimatedDate,
          estimatedCost: comp.category_id ? cheapestByCategory.get(comp.category_id) ?? null : null,
        });
      }

      // Sort by estimated date (earliest first), null dates last
      changes.sort((a, b) => {
        if (!a.estimatedDate && !b.estimatedDate) return a.remainingKm - b.remainingKm;
        if (!a.estimatedDate) return 1;
        if (!b.estimatedDate) return -1;
        return a.estimatedDate.getTime() - b.estimatedDate.getTime();
      });

      return changes.slice(0, 6);
    },
  });

  // Cost sum for next 3 months
  const threeMonthsOut = addMonths(new Date(), 3);
  const costNext3Months = (upcoming ?? [])
    .filter((c) => c.estimatedDate && isBefore(c.estimatedDate, threeMonthsOut) && c.estimatedCost)
    .reduce((sum, c) => sum + (c.estimatedCost ?? 0), 0);

  return (
    <Card className="border-0 card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            {t('upcomingChanges')}
          </CardTitle>
          <Link
            href="/bikes"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {t('viewAll')} →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : !upcoming?.length ? (
          <p className="text-sm text-muted-foreground py-4">{t('noUpcoming')}</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((item) => (
              <Link
                key={item.componentId}
                href={`/bikes/${item.bikeId}`}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{item.componentName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Bike className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-muted-foreground">{item.bikeName}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  {item.estimatedDate && (
                    <p className="text-xs font-medium">
                      ~{item.estimatedDate.toLocaleDateString('de-DE', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  {item.estimatedCost !== null && (
                    <p className="text-[11px] text-muted-foreground">
                      ~{item.estimatedCost.toFixed(0)} €
                    </p>
                  )}
                </div>
              </Link>
            ))}

            {/* Cost summary for next 3 months */}
            {costNext3Months > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {t('estimatedCost')} — {t('next3Months')}
                </span>
                <span className="text-xs font-semibold font-mono">
                  ~{costNext3Months.toFixed(0)} €
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
