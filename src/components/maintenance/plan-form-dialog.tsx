'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenancePlanSchema, type MaintenancePlanFormData } from '@/lib/validators/maintenance';
import { useCreatePlan } from '@/hooks/use-maintenance-plans';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BIKE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanFormDialog({ open, onOpenChange }: PlanFormDialogProps) {
  const t = useTranslations();
  const createPlan = useCreatePlan();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaintenancePlanFormData>({
    resolver: zodResolver(maintenancePlanSchema),
  });

  const onSubmit = async (data: MaintenancePlanFormData) => {
    try {
      await createPlan.mutateAsync(data);
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
          <DialogTitle>{t('maintenance.createPlan')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('maintenance.planName')} *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('maintenance.bikeType')}</Label>
            <Select onValueChange={(v) => setValue('bike_type', v === 'universal' ? null : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('maintenance.universal')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="universal">{t('maintenance.universal')}</SelectItem>
                {BIKE_TYPES.filter((bt) => bt !== 'other').map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`bikes.types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Textarea id="description" {...register('description')} rows={2} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '...' : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
