'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bikeSchema, type BikeFormData } from '@/lib/validators/bike';
import { useCreateBike, useUpdateBike } from '@/hooks/use-bikes';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { BIKE_TYPES } from '@/lib/constants';
import { ShopSelect } from '@/components/shops/shop-select';
import { toast } from 'sonner';
import type { Database } from '@/types/database';

type BikeRow = Database['public']['Tables']['bikes']['Row'];

interface BikeFormProps {
  bike?: BikeRow;
}

export function BikeForm({ bike }: BikeFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const isEditing = !!bike;

  const createBike = useCreateBike();
  const updateBike = useUpdateBike(bike?.id ?? '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BikeFormData>({
    resolver: zodResolver(bikeSchema),
    defaultValues: bike
      ? {
          name: bike.name,
          type: bike.type as BikeFormData['type'],
          manufacturer: bike.manufacturer,
          model: bike.model,
          year: bike.year,
          weight_kg: bike.weight_kg ? Number(bike.weight_kg) : null,
          notes: bike.notes,
          shop_id: bike.shop_id,
        }
      : {
          type: 'road',
        },
  });

  const onSubmit = async (data: BikeFormData) => {
    try {
      if (isEditing) {
        await updateBike.mutateAsync(data);
        toast.success(t('common.save'));
      } else {
        const newBike = await createBike.mutateAsync(data);
        toast.success(t('common.save'));
        router.push(`/bikes/${newBike.id}`);
        return;
      }
      router.push('/bikes');
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? t('bikes.editBike') : t('bikes.addBike')}
      />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('bikes.name')} *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="z.B. Canyon Aeroad"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t('bikes.type')}</Label>
                <Select
                  value={watch('type')}
                  onValueChange={(v) => setValue('type', v as BikeFormData['type'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BIKE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`bikes.types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">{t('bikes.manufacturer')}</Label>
                <Input id="manufacturer" {...register('manufacturer')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">{t('bikes.model')}</Label>
                <Input id="model" {...register('model')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">{t('bikes.year')}</Label>
                <Input id="year" type="number" {...register('year', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight_kg">{t('bikes.weight')} (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  {...register('weight_kg', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('bikes.notes')}</Label>
              <Textarea id="notes" {...register('notes')} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>{t('shops.shop')}</Label>
              <ShopSelect
                value={watch('shop_id') ?? null}
                onValueChange={(v) => setValue('shop_id', v)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '...' : t('common.save')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
