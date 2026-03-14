'use client';

import { useTranslations } from 'next-intl';
import { useComponentPrediction } from '@/hooks/use-component-prediction';
import { SmartWearInsights } from './smart-wear-insights';
import { TrendingUp, Calendar, Database, ShieldCheck } from 'lucide-react';

interface ComponentPredictionProps {
  componentId: string;
  categoryId: string | null;
  currentDistanceKm: number;
  maxDistanceKm: number | null;
  installedAt: string | null;
  bikeType?: string | null;
  categoryKey?: string | null;
}

export function ComponentPredictionDisplay({
  componentId,
  categoryId,
  currentDistanceKm,
  maxDistanceKm,
  installedAt,
  bikeType,
  categoryKey,
}: ComponentPredictionProps) {
  const t = useTranslations('components');
  const { data: prediction, isLoading } = useComponentPrediction(
    componentId,
    categoryId,
    currentDistanceKm,
    maxDistanceKm,
    installedAt,
    bikeType,
    categoryKey
  );

  if (isLoading) {
    return <div className="h-16 animate-pulse rounded bg-muted" />;
  }

  if (!prediction?.avgLifespanKm) {
    // Still show insights even without a full prediction
    if (prediction?.insights && prediction.insights.length > 0) {
      return <SmartWearInsights insights={prediction.insights} bikeType={bikeType} />;
    }
    return null;
  }

  const sourceLabel =
    prediction.source === 'history'
      ? t('prediction.fromHistory', { count: prediction.dataPoints })
      : prediction.source === 'bike_type_default'
        ? t('smartWear.fromBikeType')
        : t('prediction.fromMaxDistance');

  const confidenceColor =
    prediction.confidence === 'high'
      ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950'
      : prediction.confidence === 'medium'
        ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950'
        : 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950';

  const confidenceLabel =
    prediction.confidence === 'high'
      ? t('prediction.confidenceHigh')
      : prediction.confidence === 'medium'
        ? t('prediction.confidenceMedium')
        : t('prediction.confidenceLow');

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

        {/* Data basis + confidence */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Database className="h-3 w-3" />
            {t('prediction.basis')}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {sourceLabel}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${confidenceColor}`}>
              <ShieldCheck className="h-2.5 w-2.5" />
              {confidenceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      {prediction.insights.length > 0 && (
        <SmartWearInsights insights={prediction.insights} bikeType={bikeType} />
      )}
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
  bikeType,
  categoryKey,
}: ComponentPredictionProps) {
  const { data: prediction } = useComponentPrediction(
    componentId,
    categoryId,
    currentDistanceKm,
    maxDistanceKm,
    installedAt,
    bikeType,
    categoryKey
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
