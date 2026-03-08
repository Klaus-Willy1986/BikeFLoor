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
import { WearIndicator, getWearInfo } from './wear-indicator';
import { MoreHorizontal, ArrowRightLeft, Trash2 } from 'lucide-react';

interface ComponentCardProps {
  component: any;
  onDelete: (id: string) => void;
  onSwap: (id: string, bikeId: string, name: string) => void;
}

export function ComponentCard({ component, onDelete, onSwap }: ComponentCardProps) {
  const t = useTranslations('components');
  const wear = getWearInfo(
    Number(component.current_distance_km),
    component.max_distance_km
  );

  const categoryKey = component.component_categories?.key;

  return (
    <Card className="border-border/50">
      <CardContent className="flex items-center gap-4 p-4">
        <WearIndicator
          percentage={wear.percentage}
          status={wear.status}
          size={52}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{component.name}</h4>
            {categoryKey && (
              <span className="text-xs text-muted-foreground">
                {t(`categories.${categoryKey}`)}
              </span>
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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onSwap(component.id, component.bike_id, component.name)
              }
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              {t('swapComponent')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(component.id)}
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
