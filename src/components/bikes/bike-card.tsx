'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bike, ChevronRight } from 'lucide-react';
import type { Database } from '@/types/database';

type BikeRow = Database['public']['Tables']['bikes']['Row'];

const typeColors: Record<string, string> = {
  road: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  mtb: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  gravel: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  city: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  ebike: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
  other: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

export function BikeCard({ bike }: { bike: BikeRow }) {
  const t = useTranslations('bikes');
  const colorClass = typeColors[bike.type] || typeColors.other;

  return (
    <Link href={`/bikes/${bike.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-primary/20">
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/15">
                <Bike className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold leading-tight transition-colors group-hover:text-primary">
                  {bike.name}
                </h3>
                {bike.manufacturer && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {bike.manufacturer}{bike.model ? ` ${bike.model}` : ''}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`text-[11px] font-medium ${colorClass}`}>
              {t(`types.${bike.type}`)}
            </Badge>
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {Math.round(Number(bike.total_distance_km)).toLocaleString()} km
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
