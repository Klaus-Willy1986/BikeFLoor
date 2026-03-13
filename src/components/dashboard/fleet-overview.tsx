'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Bike, Route, Wrench, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Database } from '@/types/database';

type BikeRow = Database['public']['Tables']['bikes']['Row'];

interface FleetOverviewProps {
  bikes: BikeRow[];
  rides: any[];
  loading: boolean;
}

const statStyles = [
  { bg: 'bg-emerald-500/10', text: 'text-emerald-600', accent: 'from-emerald-500 to-emerald-600', icon: Bike },
  { bg: 'bg-blue-500/10', text: 'text-blue-600', accent: 'from-blue-500 to-blue-600', icon: Route },
  { bg: 'bg-amber-500/10', text: 'text-amber-600', accent: 'from-amber-500 to-amber-600', icon: Wrench },
  { bg: 'bg-violet-500/10', text: 'text-violet-600', accent: 'from-violet-500 to-violet-600', icon: TrendingUp },
];

export function FleetOverview({ bikes, rides, loading }: FleetOverviewProps) {
  const t = useTranslations('dashboard');

  const supabase = createClient();
  const { data: serviceRecords } = useQuery({
    queryKey: ['service-records-year'],
    queryFn: async () => {
      const year = new Date().getFullYear();
      const { data, error } = await supabase
        .from('service_records')
        .select('cost, performed_at')
        .gte('performed_at', `${year}-01-01`);
      if (error) throw error;
      return data;
    },
  });

  const totalDistance = bikes.reduce(
    (sum, bike) => sum + Number(bike.total_distance_km),
    0
  );

  const servicesThisYear = serviceRecords?.length ?? 0;
  const totalCosts = serviceRecords?.reduce(
    (sum, r) => sum + Number(r.cost ?? 0),
    0
  ) ?? 0;

  // Distance this month
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const distanceThisMonth = (rides ?? [])
    .filter((r) => r.date >= monthStart)
    .reduce((sum, r) => sum + Number(r.distance_km), 0);

  const stats = [
    { label: t('totalBikes'), value: String(bikes.length), href: '/bikes' as const },
    { label: t('totalDistance'), value: `${Math.round(totalDistance).toLocaleString()} km`, href: '/rides' as const },
    { label: t('servicesThisYear'), value: String(servicesThisYear), sub: totalCosts > 0 ? `${totalCosts.toFixed(0)} €` : undefined, href: '/services' as const },
    { label: t('thisMonth'), value: `${Math.round(distanceThisMonth).toLocaleString()} km`, href: '/rides' as const },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-7 w-16 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const style = statStyles[i];
        const Icon = style.icon;
        return (
          <Link key={stat.label} href={stat.href}>
            <Card className="group relative overflow-hidden hover:shadow-md transition-all cursor-pointer h-full border-0 card-elevated">
              <div className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-b ${style.accent}`} />
              <CardContent className="p-4 pl-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground sm:text-[13px]">
                    {stat.label}
                  </p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${style.bg} transition-colors group-hover:scale-105`}>
                    <Icon className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${style.text}`} />
                  </div>
                </div>
                <p className="mt-1.5 text-xl font-bold tabular-nums tracking-tight sm:mt-2 sm:text-2xl">
                  {stat.value}
                </p>
                {stat.sub && (
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
