'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { swapSchema, type SwapFormData } from '@/lib/validators/component';
import { useBikes } from '@/hooks/use-bikes';
import { useSwapComponent } from '@/hooks/use-components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentId: string;
  fromBikeId: string;
  componentName: string;
}

export function SwapDialog({
  open,
  onOpenChange,
  componentId,
  fromBikeId,
  componentName,
}: SwapDialogProps) {
  const t = useTranslations();
  const { data: bikes } = useBikes();
  const swapComponent = useSwapComponent();

  const {
    handleSubmit,
    setValue,
    register,
    formState: { isSubmitting },
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
  });

  const availableBikes = bikes?.filter((b) => b.id !== fromBikeId) ?? [];

  const onSubmit = async (data: SwapFormData) => {
    try {
      await swapComponent.mutateAsync({
        componentId,
        fromBikeId,
        data,
      });
      toast.success(t('common.save'));
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('components.swapComponent')}: {componentName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('components.swapTo')}</Label>
            <Select onValueChange={(v) => setValue('to_bike_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('components.selectBike')} />
              </SelectTrigger>
              <SelectContent>
                {availableBikes.map((bike) => (
                  <SelectItem key={bike.id} value={bike.id}>
                    {bike.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('common.notes')}</Label>
            <Textarea {...register('notes')} rows={2} />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '...' : t('common.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
