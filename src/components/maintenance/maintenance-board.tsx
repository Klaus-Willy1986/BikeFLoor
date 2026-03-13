'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useComponents } from '@/hooks/use-components';
import { useBikes } from '@/hooks/use-bikes';
import { getWearInfo } from '@/components/components/wear-indicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getShopSearchUrl } from '@/lib/shops';
import { useShops } from '@/hooks/use-shops';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  ExternalLink,
  Bike,
  Scale,
  ClipboardList,
  Play,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { WearStatus } from '@/types';
import { PlanList } from './plan-list';
import { ExecutionHistory } from './execution-history';
import { StartChecklistDialog } from './start-checklist-dialog';
import { ExecutionDialog } from './execution-dialog';

interface ComponentWithWear {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  bike_id: string;
  bikeName: string;
  current_distance_km: number;
  max_distance_km: number | null;
  percentage: number;
  status: WearStatus;
  remainingKm: number | null;
  categoryKey: string | null;
}

const columns = [
  {
    key: 'good' as const,
    title: 'Alles OK',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    statuses: ['good'] as WearStatus[],
  },
  {
    key: 'warning' as const,
    title: 'Bald bestellen',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    statuses: ['warning'] as WearStatus[],
  },
  {
    key: 'critical' as const,
    title: 'Jetzt bestellen!',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    statuses: ['critical', 'overdue'] as WearStatus[],
  },
];

export function MaintenanceBoard() {
  const t = useTranslations();
  const { data: allComponents, isLoading: compLoading } = useComponents();
  const { data: bikes, isLoading: bikesLoading } = useBikes();
  const [startChecklistOpen, setStartChecklistOpen] = useState(false);
  const [activeExecution, setActiveExecution] = useState<{
    id: string;
    bikeId: string;
    planName: string;
  } | null>(null);

  const componentsWithWear = useMemo(() => {
    if (!allComponents || !bikes) return [];

    const bikeMap = new Map(bikes.map((b) => [b.id, b.name]));

    return allComponents
      .filter((c) => c.max_distance_km && c.max_distance_km > 0)
      .map((c): ComponentWithWear => {
        const wear = getWearInfo(c.current_distance_km, c.max_distance_km);
        const categoryData = c.component_categories as { key: string } | null;
        return {
          id: c.id,
          name: c.name,
          brand: c.brand,
          model: c.model,
          bike_id: c.bike_id,
          bikeName: bikeMap.get(c.bike_id) ?? 'Bike',
          current_distance_km: c.current_distance_km,
          max_distance_km: c.max_distance_km,
          percentage: wear.percentage,
          status: wear.status,
          remainingKm: wear.remainingKm,
          categoryKey: categoryData?.key ?? null,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [allComponents, bikes]);

  const { shops } = useShops();
  const isLoading = compLoading || bikesLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (componentsWithWear.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">
            Noch keine Komponenten mit Verschleißlimit angelegt.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lege bei einem Fahrrad Komponenten mit max. Lebensdauer an.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Wear Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {columns.map((col) => {
          const items = componentsWithWear.filter((c) =>
            col.statuses.includes(c.status)
          );

          return (
            <div key={col.key}>
              {/* Column header */}
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${col.bg}`}>
                  <col.icon className={`h-4 w-4 ${col.color}`} />
                </div>
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">
                  {items.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {items.length === 0 && (
                  <div className={`rounded-lg border ${col.border} border-dashed p-4 text-center`}>
                    <p className="text-xs text-muted-foreground">
                      {col.key === 'good' ? 'Keine Teile im grünen Bereich' : 'Keine Teile fällig'}
                    </p>
                  </div>
                )}

                {items.map((comp) => (
                  <Card key={comp.id} className={`border-l-[3px] ${col.border}`}>
                    <CardContent className="p-3">
                      {/* Component info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{comp.name}</p>
                          {comp.brand && (
                            <p className="text-xs text-muted-foreground truncate">
                              {comp.brand} {comp.model ?? ''}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-sm font-bold font-mono ${col.color}`}>
                            {Math.round(comp.percentage)}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            comp.status === 'good'
                              ? 'bg-emerald-500'
                              : comp.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          } ${comp.status === 'overdue' ? 'animate-pulse' : ''}`}
                          style={{ width: `${Math.min(comp.percentage, 100)}%` }}
                        />
                      </div>

                      {/* Bike + remaining */}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <Link
                          href={`/bikes/${comp.bike_id}`}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <Bike className="h-3 w-3" />
                          {comp.bikeName}
                        </Link>
                        {comp.remainingKm !== null && (
                          <span className="font-mono tabular-nums">
                            {comp.remainingKm > 0
                              ? `noch ${comp.remainingKm.toLocaleString()} km`
                              : `${Math.abs(comp.remainingKm).toLocaleString()} km überfällig`}
                          </span>
                        )}
                      </div>

                      {/* Shop links for warning/critical */}
                      {(col.key === 'warning' || col.key === 'critical') && (
                        <div className="mt-3 border-t pt-2">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                            Bestellen & Preisvergleich
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {/* idealo price comparison */}
                            <a
                              href={`https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${encodeURIComponent([comp.brand, comp.model ?? comp.name].filter(Boolean).join(' '))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                              <Scale className="h-2.5 w-2.5" />
                              idealo
                            </a>
                            {shops.slice(0, 4).map((shop) => (
                              <a
                                key={shop.id}
                                href={getShopSearchUrl(shop, comp.name, comp.brand, comp.model)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                              >
                                {shop.name}
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Checklists Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {t('maintenance.checklists')}
          </h2>
          <Button size="sm" onClick={() => setStartChecklistOpen(true)}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            {t('maintenance.startChecklist')}
          </Button>
        </div>

        <ExecutionHistory />
        <PlanList />
      </div>

      {/* Start Checklist Dialog */}
      <StartChecklistDialog
        open={startChecklistOpen}
        onOpenChange={setStartChecklistOpen}
        onStarted={(id, name) => {
          setActiveExecution({ id, bikeId: '', planName: name });
        }}
      />

      {/* Active Execution Dialog */}
      {activeExecution && (
        <ExecutionDialog
          open={!!activeExecution}
          onOpenChange={(open) => !open && setActiveExecution(null)}
          executionId={activeExecution.id}
          bikeId={activeExecution.bikeId}
          planName={activeExecution.planName}
        />
      )}
    </div>
  );
}
