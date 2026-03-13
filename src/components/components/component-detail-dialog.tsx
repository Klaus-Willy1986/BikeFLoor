'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WearIndicator, getWearInfo } from './wear-indicator';
import { ComponentTimeline } from './component-timeline';
import { ComponentPredictionDisplay } from './component-prediction';
import { Separator } from '@/components/ui/separator';
import { useUpdateComponent, useMarkReady } from '@/hooks/use-components';
import { Pencil, Check, X, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import type { RotationStatus } from '@/types';

interface ComponentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: any;
  bikeType?: string | null;
}

export function ComponentDetailDialog({
  open,
  onOpenChange,
  component,
  bikeType,
}: ComponentDetailDialogProps) {
  const t = useTranslations('components');
  const tc = useTranslations('common');
  const updateComponent = useUpdateComponent();
  const markReady = useMarkReady();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    brand: '',
    model: '',
    max_distance_km: '',
    current_distance_km: '',
    rotation_threshold_km: '',
    notes: '',
  });

  if (!component) return null;

  const wear = getWearInfo(
    Number(component.current_distance_km),
    component.max_distance_km
  );
  const categoryKey = component.component_categories?.key;

  const rotationStatus = (component?.rotation_status ?? 'mounted') as RotationStatus;

  const rotationBadgeConfig: Record<RotationStatus, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
    mounted: { variant: 'default', label: t('rotation.mounted') },
    ready: { variant: 'secondary', label: t('rotation.ready') },
    needs_maintenance: { variant: 'destructive', label: t('rotation.needsMaintenance') },
  };

  const startEdit = () => {
    setEditData({
      name: component.name ?? '',
      brand: component.brand ?? '',
      model: component.model ?? '',
      max_distance_km: component.max_distance_km?.toString() ?? '',
      current_distance_km: Math.round(Number(component.current_distance_km)).toString(),
      rotation_threshold_km: component.rotation_threshold_km?.toString() ?? '',
      notes: component.notes ?? '',
    });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    try {
      await updateComponent.mutateAsync({
        componentId: component.id,
        bikeId: component.bike_id,
        data: {
          name: editData.name,
          brand: editData.brand || null,
          model: editData.model || null,
          max_distance_km: editData.max_distance_km ? Number(editData.max_distance_km) : null,
          current_distance_km: editData.current_distance_km ? Number(editData.current_distance_km) : 0,
          rotation_threshold_km: editData.rotation_threshold_km ? Number(editData.rotation_threshold_km) : null,
          notes: editData.notes || null,
        },
      });
      toast.success(tc('save'));
      setEditing(false);
    } catch {
      toast.error(tc('error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setEditing(false); onOpenChange(o); }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {component.name}
              {categoryKey && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {t(`categories.${categoryKey}`)}
                </Badge>
              )}
              <Badge variant={rotationBadgeConfig[rotationStatus].variant} className="text-xs font-normal">
                {rotationBadgeConfig[rotationStatus].label}
              </Badge>
            </DialogTitle>
            {!editing && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={startEdit}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {editing ? (
            /* ─── EDIT MODE ─── */
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('name')}</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('brand')}</Label>
                  <Input
                    value={editData.brand}
                    onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('model')}</Label>
                  <Input
                    value={editData.model}
                    onChange={(e) => setEditData({ ...editData, model: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('currentDistance')}</Label>
                  <Input
                    type="number"
                    value={editData.current_distance_km}
                    onChange={(e) => setEditData({ ...editData, current_distance_km: e.target.value })}
                    className="h-9"
                    placeholder="km"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('maxDistance')} (km)</Label>
                  <Input
                    type="number"
                    value={editData.max_distance_km}
                    onChange={(e) => setEditData({ ...editData, max_distance_km: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('rotation.rotationThreshold')} (km)</Label>
                <Input
                  type="number"
                  value={editData.rotation_threshold_km}
                  onChange={(e) => setEditData({ ...editData, rotation_threshold_km: e.target.value })}
                  className="h-9"
                  placeholder={t('rotation.rotationThreshold')}
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  {tc('cancel')}
                </Button>
                <Button size="sm" onClick={saveEdit} disabled={updateComponent.isPending}>
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  {updateComponent.isPending ? '...' : tc('save')}
                </Button>
              </div>
            </div>
          ) : (
            /* ─── VIEW MODE ─── */
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
                {component.rotation_threshold_km && (
                  <p className="text-xs text-muted-foreground">
                    {t('rotation.rotationThreshold')}: {Number(component.rotation_threshold_km).toLocaleString()} km
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mark ready button for needs_maintenance components */}
          {!editing && rotationStatus === 'needs_maintenance' && (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  await markReady.mutateAsync(component.id);
                  toast.success(t('rotation.markedReady'));
                } catch {
                  toast.error(tc('error'));
                }
              }}
              disabled={markReady.isPending}
            >
              <Wrench className="mr-2 h-4 w-4" />
              {markReady.isPending ? '...' : t('rotation.markReady')}
            </Button>
          )}

          <Separator />

          {/* Prediction */}
          <ComponentPredictionDisplay
            componentId={component.id}
            categoryId={component.category_id}
            currentDistanceKm={Number(component.current_distance_km)}
            maxDistanceKm={component.max_distance_km}
            installedAt={component.installed_at}
            bikeType={bikeType}
            categoryKey={categoryKey}
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
