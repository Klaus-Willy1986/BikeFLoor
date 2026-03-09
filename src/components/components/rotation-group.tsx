'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComponentCard } from './component-card';
import { RotationDialog } from './rotation-dialog';
import { useMarkReady } from '@/hooks/use-components';
import { RefreshCw, Check, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import type { RotationStatus } from '@/types';

interface RotationGroupProps {
  categoryKey: string;
  components: any[];
  bikeId: string;
  onComponentClick: (component: any) => void;
  onDelete: (id: string) => void;
  onSwap: (id: string, bikeId: string, name: string) => void;
}

export function RotationGroup({
  categoryKey,
  components,
  bikeId,
  onComponentClick,
  onDelete,
  onSwap,
}: RotationGroupProps) {
  const t = useTranslations('components');
  const tc = useTranslations('common');
  const markReady = useMarkReady();
  const [rotateOpen, setRotateOpen] = useState(false);

  const mounted = components.filter((c) => c.rotation_status === 'mounted');
  const ready = components.filter((c) => c.rotation_status === 'ready');
  const needsMaintenance = components.filter((c) => c.rotation_status === 'needs_maintenance');
  const pool = [...ready, ...needsMaintenance];

  const mountedComponent = mounted[0]; // There should be exactly one mounted
  const hasReadyComponents = ready.length > 0;

  const handleMarkReady = async (componentId: string) => {
    try {
      await markReady.mutateAsync(componentId);
      toast.success(t('rotation.markedReady'));
    } catch {
      toast.error(tc('error'));
    }
  };

  const statusConfig: Record<RotationStatus, { icon: React.ReactNode; label: string; className: string }> = {
    mounted: { icon: null, label: t('rotation.mounted'), className: 'text-emerald-600' },
    ready: { icon: <Check className="h-3.5 w-3.5" />, label: t('rotation.ready'), className: 'text-blue-600' },
    needs_maintenance: { icon: <Wrench className="h-3.5 w-3.5" />, label: t('rotation.needsMaintenance'), className: 'text-orange-600' },
  };

  return (
    <>
      <Card className="border-border/50 col-span-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-medium">
            {t(`categories.${categoryKey}`)}
          </CardTitle>
          {mountedComponent && hasReadyComponents && (
            <Button size="sm" variant="outline" onClick={() => setRotateOpen(true)}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              {t('rotation.rotate')}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 pt-0">
          {/* Mounted component — full card */}
          {mountedComponent && (
            <ComponentCard
              component={mountedComponent}
              onDelete={onDelete}
              onSwap={onSwap}
              onClick={() => onComponentClick(mountedComponent)}
            />
          )}

          {/* Pool section */}
          {pool.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{t('rotation.pool')}</p>
              {pool.map((comp) => {
                const status = (comp.rotation_status ?? 'needs_maintenance') as RotationStatus;
                const config = statusConfig[status];

                return (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onComponentClick(comp)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={config.className}>{config.icon}</span>
                      <span className="truncate font-medium">{comp.name}</span>
                      {comp.brand && (
                        <span className="text-xs text-muted-foreground truncate">
                          {comp.brand} {comp.model ?? ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={status === 'ready' ? 'secondary' : 'destructive'}
                        className="text-[10px]"
                      >
                        {config.label}
                      </Badge>
                      {status === 'needs_maintenance' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkReady(comp.id);
                          }}
                          disabled={markReady.isPending}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          {t('rotation.ready')}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rotation dialog */}
      {mountedComponent && (
        <RotationDialog
          open={rotateOpen}
          onOpenChange={setRotateOpen}
          mountedComponent={mountedComponent}
          readyComponents={ready}
          bikeId={bikeId}
        />
      )}
    </>
  );
}
