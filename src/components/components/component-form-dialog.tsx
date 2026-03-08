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
import { toast } from 'sonner';

interface ComponentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeId: string;
}

export function ComponentFormDialog({
  open,
  onOpenChange,
  bikeId,
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

  const onSubmit = async (data: ComponentFormData) => {
    try {
      await createComponent.mutateAsync(data);
      toast.success(t('common.save'));
      reset();
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setValue('category_id', categoryId);
    const cat = categories?.find((c) => c.id === categoryId);
    if (cat) {
      setValue('name', t(`components.categories.${cat.key}`));
      if (cat.default_max_distance_km) {
        setValue('max_distance_km', cat.default_max_distance_km);
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
              <Label htmlFor="brand">{t('components.brand')}</Label>
              <Input id="brand" {...register('brand')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">{t('components.model')}</Label>
              <Input id="model" {...register('model')} />
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
