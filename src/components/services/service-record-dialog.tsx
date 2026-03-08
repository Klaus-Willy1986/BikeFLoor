'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceRecordSchema, type ServiceRecordFormData } from '@/lib/validators/service';
import { useCreateServiceRecord, useServiceIntervals } from '@/hooks/use-services';
import { useBike } from '@/hooks/use-bikes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ServiceRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeId: string;
  preselectedIntervalId?: string;
  preselectedTitle?: string;
}

export function ServiceRecordDialog({
  open,
  onOpenChange,
  bikeId,
  preselectedIntervalId,
  preselectedTitle,
}: ServiceRecordDialogProps) {
  const t = useTranslations();
  const createRecord = useCreateServiceRecord(bikeId);
  const { data: intervals } = useServiceIntervals(bikeId);
  const { data: bike } = useBike(bikeId);

  const currentKm = Math.round(bike?.total_distance_km ?? 0);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<ServiceRecordFormData>({
    resolver: zodResolver(serviceRecordSchema),
    defaultValues: {
      performed_at: new Date().toISOString().split('T')[0],
      service_interval_id: preselectedIntervalId ?? undefined,
      title: preselectedTitle ?? '',
      distance_at_service_km: currentKm,
    },
  });

  const onSubmit = async (data: ServiceRecordFormData) => {
    try {
      await createRecord.mutateAsync(data);
      toast.success('Wartung eingetragen');
      reset();
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('services.addRecord')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Bezeichnung *</Label>
            <Input id="title" {...register('title')} placeholder="z.B. Kette gewachst" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {intervals && intervals.length > 0 && (
            <div className="space-y-2">
              <Label>Zugehöriges Intervall</Label>
              <Select
                defaultValue={preselectedIntervalId}
                onValueChange={(v) => setValue('service_interval_id', v)}
              >
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  {intervals.map((interval) => (
                    <SelectItem key={interval.id} value={interval.id}>{interval.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="performed_at">Datum</Label>
              <Input id="performed_at" type="date" {...register('performed_at')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance_at_service_km">
                Bei km-Stand
              </Label>
              <Input
                id="distance_at_service_km"
                type="number"
                {...register('distance_at_service_km', { valueAsNumber: true })}
              />
              <p className="text-[10px] text-muted-foreground">
                Aktuell: {currentKm.toLocaleString()} km
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Kosten (€)</Label>
              <Input id="cost" type="number" step="0.01" {...register('cost', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consumables">{t('services.consumables')}</Label>
            <Input id="consumables" {...register('consumables')} placeholder="z.B. Silca Hot Melt Wax" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('common.notes')}</Label>
            <Textarea id="notes" {...register('notes')} rows={2} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '...' : t('common.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
