'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRides } from '@/hooks/use-rides';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Mountain, Timer, Route, ExternalLink } from 'lucide-react';
import { StravaBadge } from '@/components/shared/strava-badge';

export function BikeRides({ bikeId }: { bikeId: string }) {
  const t = useTranslations('rides');
  const locale = useLocale();
  const { data: rides, isLoading } = useRides(bikeId);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (!rides?.length) {
    return <EmptyState title={t('noRides')} />;
  }

  return (
    <div className="space-y-2">
      {rides.map((ride) => (
        <Card key={ride.id} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {ride.title || t('title')}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(ride.date).toLocaleDateString(
                      locale === 'de' ? 'de-DE' : 'en-US',
                      { day: '2-digit', month: '2-digit', year: 'numeric' }
                    )}
                  </span>
                  {ride.source === 'strava' && (
                    ride.strava_activity_id ? (
                      <a
                        href={`https://www.strava.com/activities/${ride.strava_activity_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] text-[#FC4C02] font-medium hover:underline"
                      >
                        Strava
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#FC4C02] font-medium">Strava</span>
                    )
                  )}
                  {(ride.source === 'gpx' || ride.source === 'fit') && (
                    <Badge variant="secondary" className="text-[9px] uppercase px-1.5 py-0">
                      {ride.source}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-sm font-mono font-semibold">
                  {Number(ride.distance_km).toFixed(1)} km
                </span>
                <div className="flex items-center gap-2 justify-end mt-0.5">
                  {(ride.elevation_m ?? 0) > 0 && (
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
          </CardContent>
        </Card>
      ))}
      {rides.some((r) => r.source === 'strava') && (
        <div className="flex justify-end pt-2">
          <StravaBadge />
        </div>
      )}
    </div>
  );
}
