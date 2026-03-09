'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { WearIndicator, getWearInfo } from './wear-indicator';
import { ComponentTimeline } from './component-timeline';
import { ComponentPredictionDisplay } from './component-prediction';
import { Separator } from '@/components/ui/separator';

interface ComponentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: any;
}

export function ComponentDetailDialog({
  open,
  onOpenChange,
  component,
}: ComponentDetailDialogProps) {
  const t = useTranslations('components');

  if (!component) return null;

  const wear = getWearInfo(
    Number(component.current_distance_km),
    component.max_distance_km
  );
  const categoryKey = component.component_categories?.key;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {component.name}
            {categoryKey && (
              <Badge variant="secondary" className="text-xs font-normal">
                {t(`categories.${categoryKey}`)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Wear + Info */}
          <div className="flex items-center gap-4">
            <WearIndicator
              percentage={wear.percentage}
              status={wear.status}
              size={64}
              strokeWidth={5}
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold tabular-nums">
                  {Number(component.current_distance_km).toLocaleString()} km
                </span>
                {component.max_distance_km && (
                  <span className="text-sm text-muted-foreground font-mono">
                    / {Number(component.max_distance_km).toLocaleString()} km
                  </span>
                )}
              </div>
              {component.brand && (
                <p className="text-sm text-muted-foreground">
                  {component.brand} {component.model ?? ''}
                </p>
              )}
              {component.installed_at && (
                <p className="text-xs text-muted-foreground">
                  {t('installedAt')}:{' '}
                  {new Date(component.installed_at).toLocaleDateString('de-DE')}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Prediction */}
          <ComponentPredictionDisplay
            componentId={component.id}
            categoryId={component.category_id}
            currentDistanceKm={Number(component.current_distance_km)}
            maxDistanceKm={component.max_distance_km}
            installedAt={component.installed_at}
          />

          <Separator />

          {/* Timeline */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-medium">{t('timeline.title')}</h4>
            <ComponentTimeline componentId={component.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
