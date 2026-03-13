'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, Bike, Mountain, Timer } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface RecentRidesProps {
  rides: any[];
  loading: boolean;
}

export function RecentRides({ rides, loading }: RecentRidesProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="h-4 w-4" />
            {t('recentRides')}
          </CardTitle>
          <Link
            href="/rides"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : rides.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">{t('noBikes')}</p>
        ) : (
          <div className="space-y-2">
            {rides.slice(0, 5).map((ride) => (
              <Link
                key={ride.id}
                href={ride.bike_id ? `/bikes/${ride.bike_id}` : '/rides'}
                className="block rounded-lg border p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {ride.title || 'Fahrt'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(ride.date).toLocaleDateString(
                          locale === 'de' ? 'de-DE' : 'en-US',
                          { day: '2-digit', month: '2-digit', year: 'numeric' }
                        )}
                      </span>
                      {ride.bike_id && ride.bikes?.name && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Bike className="h-3 w-3" />
                          {ride.bikes.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-sm font-mono font-semibold">
                      {Number(ride.distance_km).toFixed(1)} km
                    </span>
                    <div className="flex items-center gap-2 justify-end mt-0.5">
                      {ride.elevation_m > 0 && (
                        <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground font-mono">
                          <Mountain className="h-2.5 w-2.5" />
                          {ride.elevation_m} m
                        </span>
                      )}
                      {ride.duration_seconds && (
                        <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground font-mono">
                          <Timer className="h-2.5 w-2.5" />
                          {formatDuration(ride.duration_seconds)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
