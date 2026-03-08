'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Bike, Route, Wrench, TrendingUp } from 'lucide-react';
import type { Database } from '@/types/database';

type BikeRow = Database['public']['Tables']['bikes']['Row'];

interface FleetOverviewProps {
  bikes: BikeRow[];
  loading: boolean;
}

const statStyles = [
  { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: Bike },
  { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: Route },
  { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: Wrench },
  { bg: 'bg-violet-500/10', text: 'text-violet-600', icon: TrendingUp },
];

export function FleetOverview({ bikes, loading }: FleetOverviewProps) {
  const t = useTranslations('dashboard');

  const totalDistance = bikes.reduce(
    (sum, bike) => sum + Number(bike.total_distance_km),
    0
  );

  const stats = [
    { label: t('totalBikes'), value: String(bikes.length) },
    { label: t('totalDistance'), value: `${totalDistance.toLocaleString()} km` },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-7 w-16 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const style = statStyles[i];
        const Icon = style.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.bg}`}>
                  <Icon className={`h-[18px] w-[18px] ${style.text}`} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
