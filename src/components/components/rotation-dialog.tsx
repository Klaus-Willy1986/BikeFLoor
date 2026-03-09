'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRotateComponent } from '@/hooks/use-components';
import { toast } from 'sonner';

interface RotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mountedComponent: any;
  readyComponents: any[];
  bikeId: string;
}

export function RotationDialog({
  open,
  onOpenChange,
  mountedComponent,
  readyComponents,
  bikeId,
}: RotationDialogProps) {
  const t = useTranslations('components');
  const tc = useTranslations('common');
  const rotateComponent = useRotateComponent();
  const [selectedId, setSelectedId] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleRotate = async () => {
    if (!selectedId || !mountedComponent) return;
    try {
      await rotateComponent.mutateAsync({
        mountedComponentId: mountedComponent.id,
        readyComponentId: selectedId,
        bikeId,
        notes: notes || null,
      });
      toast.success(t('rotation.rotateSuccess'));
      setSelectedId('');
      setNotes('');
      onOpenChange(false);
    } catch {
      toast.error(tc('error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('rotation.rotateTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Current mounted component */}
          <div className="rounded-md border p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">{t('rotation.mounted')}</p>
            <p className="font-medium">{mountedComponent?.name}</p>
            <p className="text-sm text-muted-foreground font-mono">
              {Number(mountedComponent?.current_distance_km ?? 0).toLocaleString()} km
            </p>
          </div>

          {/* Select ready component */}
          <div className="space-y-2">
            <Label>{t('rotation.selectReady')}</Label>
            {readyComponents.length > 0 ? (
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('rotation.selectReady')} />
                </SelectTrigger>
                <SelectContent>
                  {readyComponents.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>
                      {comp.name}
                      {comp.brand ? ` (${comp.brand}${comp.model ? ` ${comp.model}` : ''})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">{t('rotation.noReadyComponents')}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>{tc('notes')}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={tc('notes')}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tc('cancel')}
            </Button>
            <Button
              onClick={handleRotate}
              disabled={!selectedId || rotateComponent.isPending}
            >
              {rotateComponent.isPending ? '...' : t('rotation.rotate')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
