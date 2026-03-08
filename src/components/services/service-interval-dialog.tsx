'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceIntervalSchema, type ServiceIntervalFormData } from '@/lib/validators/service';
import { useCreateServiceInterval } from '@/hooks/use-services';
import { useBike } from '@/hooks/use-bikes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SERVICE_INTERVAL_TYPES } from '@/lib/constants';
import { toast } from 'sonner';

interface ServiceIntervalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeId: string;
}

export function ServiceIntervalDialog({ open, onOpenChange, bikeId }: ServiceIntervalDialogProps) {
  const t = useTranslations();
  const createInterval = useCreateServiceInterval(bikeId);
  const { data: bike } = useBike(bikeId);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ServiceIntervalFormData>({
    resolver: zodResolver(serviceIntervalSchema),
    defaultValues: { interval_type: 'distance' },
  });

  const intervalType = watch('interval_type');

  const onSubmit = async (data: ServiceIntervalFormData) => {
    try {
      await createInterval.mutateAsync(data);
      toast.success(t('common.save'));
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
          <DialogTitle>{t('services.addInterval')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('services.intervalName')} *</Label>
            <Input id="name" {...register('name')} placeholder="z.B. Kette wachsen" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('services.intervalType')}</Label>
              <Select value={watch('interval_type')} onValueChange={(v) => setValue('interval_type', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SERVICE_INTERVAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{t(`services.types.${type}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval_value">{t('services.intervalValue')} *</Label>
              <Input id="interval_value" type="number" {...register('interval_value', { valueAsNumber: true })} />
              {errors.interval_value && <p className="text-xs text-destructive">{errors.interval_value.message}</p>}
            </div>
          </div>

          {/* Retroactive: when was this last done? */}
          {intervalType === 'distance' && (
            <div className="space-y-2 rounded-lg border border-dashed p-3 bg-muted/30">
              <Label htmlFor="last_performed_km_ago" className="text-xs font-medium">
                Zuletzt durchgeführt vor wie vielen km?
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Für den Erststart: Wann hast du das zuletzt gemacht?
                {bike && ` (Aktueller Stand: ${Math.round(bike.total_distance_km).toLocaleString()} km)`}
              </p>
              <Input
                id="last_performed_km_ago"
                type="number"
                placeholder="z.B. 300"
                {...register('last_performed_km_ago', { valueAsNumber: true })}
              />
              {errors.last_performed_km_ago && (
                <p className="text-xs text-destructive">{errors.last_performed_km_ago.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '...' : t('common.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
