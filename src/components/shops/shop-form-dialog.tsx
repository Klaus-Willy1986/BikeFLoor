'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shopSchema, type ShopFormData } from '@/lib/validators/shop';
import { useCreateShop, useUpdateShop } from '@/hooks/use-shops';
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
import { toast } from 'sonner';

interface ShopFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop?: any | null;
  onCreated?: (shop: any) => void;
}

export function ShopFormDialog({ open, onOpenChange, shop, onCreated }: ShopFormDialogProps) {
  const t = useTranslations();
  const isEditing = !!shop;
  const createShop = useCreateShop();
  const updateShop = useUpdateShop(shop?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
  });

  useEffect(() => {
    if (open) {
      if (shop) {
        reset({
          name: shop.name,
          email: shop.email,
          phone: shop.phone,
          address: shop.address,
          website: shop.website,
          notes: shop.notes,
        });
      } else {
        reset({
          name: '',
          email: null,
          phone: null,
          address: null,
          website: null,
          notes: null,
        });
      }
    }
  }, [open, shop, reset]);

  const onSubmit = async (data: ShopFormData) => {
    try {
      if (isEditing) {
        await updateShop.mutateAsync(data);
      } else {
        const newShop = await createShop.mutateAsync(data);
        onCreated?.(newShop);
      }
      toast.success(t('common.save'));
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('shops.editShop') : t('shops.addShop')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop-name">{t('shops.name')} *</Label>
            <Input id="shop-name" {...register('name')} placeholder="z.B. BikeDoc München" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shop-email">{t('auth.email')}</Label>
              <Input id="shop-email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-phone">{t('shops.phone')}</Label>
              <Input id="shop-phone" {...register('phone')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop-address">{t('shops.address')}</Label>
            <Input id="shop-address" {...register('address')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop-website">{t('shops.website')}</Label>
            <Input id="shop-website" {...register('website')} placeholder="https://" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop-notes">{t('common.notes')}</Label>
            <Textarea id="shop-notes" {...register('notes')} rows={2} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '...' : t('common.save')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
