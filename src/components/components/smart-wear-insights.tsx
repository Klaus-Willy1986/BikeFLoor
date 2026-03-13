'use client';

import { useTranslations } from 'next-intl';
import { History, Mountain, Lightbulb } from 'lucide-react';
import type { SmartInsight } from '@/hooks/use-component-prediction';

interface SmartWearInsightsProps {
  insights: SmartInsight[];
  bikeType?: string | null;
}

export function SmartWearInsights({ insights, bikeType }: SmartWearInsightsProps) {
  const t = useTranslations('components');
  const tb = useTranslations('bikes');

  if (insights.length === 0) return null;

  const iconMap: Record<SmartInsight['type'], typeof History> = {
    history_average: History,
    elevation_brake: Mountain,
    bike_type_recommendation: Lightbulb,
  };

  const colorMap: Record<SmartInsight['type'], string> = {
    history_average: 'text-blue-600 bg-blue-50',
    elevation_brake: 'text-amber-600 bg-amber-50',
    bike_type_recommendation: 'text-primary bg-primary/10',
  };

  const getInsightText = (insight: SmartInsight): string => {
    switch (insight.type) {
      case 'history_average':
        return t('smartWear.historyAverage', {
          km: insight.value?.toLocaleString() ?? '?',
          count: insight.value ?? 0,
        });
      case 'elevation_brake':
        return t('smartWear.elevationBrake', {
          value: insight.value ?? 0,
        });
      case 'bike_type_recommendation':
        return t('smartWear.bikeTypeRecommendation', {
          type: bikeType ? tb(`types.${bikeType}`) : '',
          km: insight.value?.toLocaleString() ?? '?',
        });
      default:
        return '';
    }
  };

  return (
    <div className="space-y-1.5">
      <h5 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Lightbulb className="h-3 w-3" />
        {t('smartWear.title')}
      </h5>
      <div className="space-y-1">
        {insights.map((insight, i) => {
          const Icon = iconMap[insight.type];
          const color = colorMap[insight.type];
          return (
            <div
              key={i}
              className="flex items-start gap-2 rounded-md px-2.5 py-1.5 text-[11px]"
            >
              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${color}`}>
                <Icon className="h-2.5 w-2.5" />
              </div>
              <span className="text-muted-foreground leading-tight">
                {getInsightText(insight)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
