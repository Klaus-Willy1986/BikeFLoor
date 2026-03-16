'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { componentSchema, type ComponentFormData } from '@/lib/validators/component';
import { useCreateComponent, useComponentCategories } from '@/hooks/use-components';
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
import { DEFAULT_ROTATION_THRESHOLDS } from '@/lib/constants';
import { getRecommendedMaxDistance } from '@/lib/wear-defaults';
import { useComponentSuggestions } from '@/hooks/use-component-suggestions';
import { Combobox } from '@/components/shared/combobox';
import { toast } from 'sonner';

interface ComponentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeId: string;
  bikeType?: string | null;
}

export function ComponentFormDialog({
  open,
  onOpenChange,
  bikeId,
  bikeType,
}: ComponentFormDialogProps) {
  const t = useTranslations();
  const createComponent = useCreateComponent(bikeId);
  const { data: categories } = useComponentCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComponentFormData>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      installed_at: new Date().toISOString().split('T')[0],
    },
  });

  const watchedBrand = watch('brand') ?? '';

  const { data: brandSuggestions = [] } = useComponentSuggestions({ enabled: open });
  const { data: modelSuggestions = [] } = useComponentSuggestions({
    brand: watchedBrand,
    enabled: open && !!watchedBrand,
  });

  const onSubmit = async (data: ComponentFormData) => {
    try {
      const normalized = {
        ...data,
        brand: data.brand?.trim().replace(/\s+/g, ' '),
        model: data.model?.trim().replace(/\s+/g, ' '),
      };
      await createComponent.mutateAsync(normalized);
      toast.success(t('common.save'));
      reset();
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const selectedCategoryKey = categories?.find(
    (c) => c.id === watch('category_id')
  )?.key;
  const bikeTypeRecommendation = getRecommendedMaxDistance(bikeType, selectedCategoryKey);

  const handleCategoryChange = (categoryId: string) => {
    setValue('category_id', categoryId);
    const cat = categories?.find((c) => c.id === categoryId);
    if (cat) {
      setValue('name', t(`components.categories.${cat.key}`));

      // Prefer bike-type-specific default, then category default
      const recommended = getRecommendedMaxDistance(bikeType, cat.key);
      if (recommended) {
        setValue('max_distance_km', recommended);
      } else if (cat.default_max_distance_km) {
        setValue('max_distance_km', cat.default_max_distance_km);
      }

      // Auto-fill rotation threshold from defaults
      const threshold = DEFAULT_ROTATION_THRESHOLDS[cat.key];
      if (threshold) {
        setValue('rotation_threshold_km', threshold);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('components.addComponent')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('components.category')}</Label>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('components.category')} />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {t(`components.categories.${cat.key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t('components.name')} *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('components.brand')}</Label>
              <Combobox
                value={watchedBrand}
                onChange={(v) => setValue('brand', v)}
                suggestions={brandSuggestions}
                placeholder={t('components.brand')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('components.model')}</Label>
              <Combobox
                value={watch('model') ?? ''}
                onChange={(v) => setValue('model', v)}
                suggestions={modelSuggestions}
                placeholder={t('components.model')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_distance_km">{t('components.maxDistance')} (km)</Label>
              <Input
                id="max_distance_km"
                type="number"
                {...register('max_distance_km')}
              />
              {bikeTypeRecommendation && (
                <p className="text-[11px] text-muted-foreground">
                  {t('components.smartWear.recommendation', {
                    km: bikeTypeRecommendation.toLocaleString(),
                  })}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="installed_at">{t('components.installedAt')}</Label>
              <Input
                id="installed_at"
                type="date"
                {...register('installed_at')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rotation_threshold_km">{t('components.rotation.rotationThreshold')} (km)</Label>
            <Input
              id="rotation_threshold_km"
              type="number"
              placeholder={t('components.rotation.rotationThreshold')}
              {...register('rotation_threshold_km')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('common.notes')}</Label>
            <Textarea id="notes" {...register('notes')} rows={2} />
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
              {isSubmitting ? '...' : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
