'use client';

import { useTranslations } from 'next-intl';
import { useComponentPrediction } from '@/hooks/use-component-prediction';
import { TrendingUp, Calendar, Database } from 'lucide-react';

interface ComponentPredictionProps {
  componentId: string;
  categoryId: string | null;
  currentDistanceKm: number;
  maxDistanceKm: number | null;
  installedAt: string | null;
}

export function ComponentPredictionDisplay({
  componentId,
  categoryId,
  currentDistanceKm,
  maxDistanceKm,
  installedAt,
}: ComponentPredictionProps) {
  const t = useTranslations('components');
  const { data: prediction, isLoading } = useComponentPrediction(
    componentId,
    categoryId,
    currentDistanceKm,
    maxDistanceKm,
    installedAt
  );

  if (isLoading) {
    return <div className="h-16 animate-pulse rounded bg-muted" />;
  }

  if (!prediction?.avgLifespanKm) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      <h4 className="text-sm font-medium flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-primary" />
        {t('prediction.title')}
      </h4>

      <div className="grid gap-2 text-sm">
        {/* Remaining km */}
        {prediction.remainingKm !== null && (
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <span className="text-muted-foreground">{t('prediction.remaining')}</span>
            <span className="font-mono font-medium tabular-nums">
              {prediction.remainingKm <= 0 ? (
                <span className="text-destructive">{t('prediction.overdue')}</span>
              ) : (
                `~${Math.round(prediction.remainingKm).toLocaleString()} km`
              )}
            </span>
          </div>
        )}

        {/* Estimated date */}
        {prediction.estimatedDate && prediction.remainingKm && prediction.remainingKm > 0 && (
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {t('prediction.estimatedDate')}
            </span>
            <span className="font-medium">
              ~{prediction.estimatedDate.toLocaleDateString('de-DE', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        )}

        {/* Data basis */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Database className="h-3 w-3" />
            {t('prediction.basis')}
          </span>
          <span className="text-xs text-muted-foreground">
            {prediction.source === 'history'
              ? t('prediction.fromHistory', { count: prediction.dataPoints })
              : t('prediction.fromMaxDistance')}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact one-line prediction for use inside component cards
 */
export function ComponentPredictionLine({
  componentId,
  categoryId,
  currentDistanceKm,
  maxDistanceKm,
  installedAt,
}: ComponentPredictionProps) {
  const t = useTranslations('components');
  const { data: prediction } = useComponentPrediction(
    componentId,
    categoryId,
    currentDistanceKm,
    maxDistanceKm,
    installedAt
  );

  if (!prediction?.remainingKm || prediction.remainingKm <= 0) return null;

  const label = prediction.estimatedDate
    ? `~${Math.round(prediction.remainingKm).toLocaleString()} km · ~${prediction.estimatedDate.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}`
    : `~${Math.round(prediction.remainingKm).toLocaleString()} km`;

  return (
    <span className="text-[11px] text-primary/70 flex items-center gap-1">
      <TrendingUp className="h-3 w-3" />
      {label}
    </span>
  );
}
