'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { WearIndicator, getWearInfo } from './wear-indicator';
import { ComponentPredictionLine } from './component-prediction';
import { MoreHorizontal, ArrowRightLeft, Trash2, Package } from 'lucide-react';

interface ComponentCardProps {
  component: any;
  onDelete: (id: string) => void;
  onSwap: (id: string, bikeId: string, name: string) => void;
  onMoveToInventory?: (component: any) => void;
  onClick?: () => void;
}

export function ComponentCard({ component, onDelete, onSwap, onMoveToInventory, onClick }: ComponentCardProps) {
  const t = useTranslations('components');
  const wear = getWearInfo(
    Number(component.current_distance_km),
    component.max_distance_km
  );

  const categoryKey = component.component_categories?.key;
  const needsRotation =
    component.rotation_threshold_km &&
    Number(component.current_distance_km) >= Number(component.rotation_threshold_km);

  return (
    <Card
      className="border-border/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-primary/20"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <WearIndicator
          percentage={wear.percentage}
          status={wear.status}
          size={52}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 min-w-0">
            <h4 className="font-medium truncate min-w-0">{component.name}</h4>
            {categoryKey && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {t(`categories.${categoryKey}`)}
              </span>
            )}
            {needsRotation && (
              <Badge variant="destructive" className="shrink-0 text-[10px] px-1.5 py-0">
                {t('rotation.needsRotation')}
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">
              {Number(component.current_distance_km).toLocaleString()} km
            </span>
            {component.max_distance_km && (
              <span className="font-mono">
                / {Number(component.max_distance_km).toLocaleString()} km
              </span>
            )}
          </div>
          {component.brand && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {component.brand} {component.model ?? ''}
            </p>
          )}
          <div className="mt-1">
            <ComponentPredictionLine
              componentId={component.id}
              categoryId={component.category_id}
              currentDistanceKm={Number(component.current_distance_km)}
              maxDistanceKm={component.max_distance_km}
              installedAt={component.installed_at}
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onSwap(component.id, component.bike_id, component.name);
              }}
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              {t('swapComponent')}
            </DropdownMenuItem>
            {onMoveToInventory && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveToInventory(component);
                }}
              >
                <Package className="mr-2 h-4 w-4" />
                {t('moveToInventory')}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(component.id);
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('deleteComponent')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
