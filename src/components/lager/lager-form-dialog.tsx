'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, ScanBarcode } from 'lucide-react';
import { BarcodeScannerDialog } from './barcode-scanner-dialog';
import { inventoryItemSchema, type InventoryItemFormData } from '@/lib/validators/inventory';
import { useCreateInventoryItem, useUpdateInventoryItem } from '@/hooks/use-inventory';
import { useComponentCategories } from '@/hooks/use-components';
import { useBikes } from '@/hooks/use-bikes';
import { searchPartsCatalog, getPartsByCategory, getCatalogCategories, type CatalogPart } from '@/lib/parts-catalog';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface LagerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: any | null;
}

export function LagerFormDialog({ open, onOpenChange, item }: LagerFormDialogProps) {
  const t = useTranslations();
  const isEditing = !!item;
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem(item?.id ?? '');
  const { data: categories } = useComponentCategories();
  const { data: bikes } = useBikes();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      quantity: 1,
      suitable_bike_ids: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          name: item.name,
          category_id: item.category_id,
          brand: item.brand,
          model: item.model,
          quantity: item.quantity,
          purchased_at: item.purchased_at,
          price: item.price != null ? Number(item.price) : null,
          suitable_bike_ids: item.suitable_bike_ids ?? [],
          notes: item.notes,
          ean_code: item.ean_code,
        });
      } else {
        reset({
          name: '',
          category_id: null,
          brand: null,
          model: null,
          quantity: 1,
          purchased_at: null,
          price: null,
          suitable_bike_ids: [],
          notes: null,
          ean_code: null,
        });
      }
    }
  }, [open, item, reset]);

  const [catalogCategoryKey, setCatalogCategoryKey] = useState<string | null>(null);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Get grouped category keys from catalog (e.g. "tires" instead of "tires_front"/"tires_rear")
  const catalogCategoryKeys = getCatalogCategories();

  // Get filtered parts for the selected category
  const catalogResults = catalogCategoryKey
    ? catalogQuery.length >= 1
      ? searchPartsCatalog(catalogQuery, catalogCategoryKey, 50)
      : getPartsByCategory(catalogCategoryKey)
    : [];

  // Reset catalog state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setCatalogCategoryKey(null);
      setCatalogQuery('');
      setShowCatalog(false);
    }
  }, [open]);

  const selectCatalogPart = (part: CatalogPart) => {
    setValue('brand', part.brand);
    setValue('model', part.model);
    const cat = categories?.find((c) => c.key === part.category_key);
    if (cat) {
      setValue('category_id', cat.id);
    }
    setValue('name', `${part.brand} ${part.model}`);
    setShowCatalog(false);
  };

  const suitableBikeIds = watch('suitable_bike_ids') ?? [];

  const toggleBike = (bikeId: string) => {
    const current = suitableBikeIds;
    const next = current.includes(bikeId)
      ? current.filter((id) => id !== bikeId)
      : [...current, bikeId];
    setValue('suitable_bike_ids', next);
  };

  const onSubmit = async (data: InventoryItemFormData) => {
    try {
      if (isEditing) {
        await updateItem.mutateAsync(data);
      } else {
        await createItem.mutateAsync(data);
      }
      toast.success(t('common.save'));
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('lager.editItem') : t('lager.addItem')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Catalog: category-first, then parts list */}
          {!isEditing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('lager.catalogSearch')}</Label>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setScannerOpen(true)}
                  >
                    <ScanBarcode className="mr-1 size-3" />
                    {t('lager.scanBarcode')}
                  </Button>
                  {!showCatalog ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowCatalog(true)}
                    >
                      <Search className="mr-1 size-3" />
                      {t('lager.catalogOpen')}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => { setShowCatalog(false); setCatalogCategoryKey(null); setCatalogQuery(''); }}
                    >
                      {t('common.close')}
                    </Button>
                  )}
                </div>
              </div>

              {showCatalog && (
                <div className="rounded-md border bg-muted/30 p-2 space-y-2">
                  {/* Category pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {catalogCategoryKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          catalogCategoryKey === key
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background border hover:bg-accent'
                        }`}
                        onClick={() => {
                          setCatalogCategoryKey(catalogCategoryKey === key ? null : key);
                          setCatalogQuery('');
                        }}
                      >
                        {t(`components.categories.${key}`)}
                      </button>
                    ))}
                  </div>

                  {/* Search within category */}
                  {catalogCategoryKey && (
                    <>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                        <Input
                          placeholder={t('lager.catalogFilter')}
                          value={catalogQuery}
                          onChange={(e) => setCatalogQuery(e.target.value)}
                          className="h-8 pl-8 text-sm"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-0.5">
                        {catalogResults.length > 0 ? (
                          catalogResults.map((part, i) => (
                            <button
                              key={`${part.brand}-${part.model}-${i}`}
                              type="button"
                              className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => selectCatalogPart(part)}
                            >
                              <span className="truncate">
                                <span className="font-medium">{part.brand}</span>{' '}
                                {part.model}
                              </span>
                              {part.max_distance_km && (
                                <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                                  ~{part.max_distance_km.toLocaleString()} km
                                </span>
                              )}
                            </button>
                          ))
                        ) : (
                          <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                            {t('common.noResults')}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="inv-name">{t('lager.name')} *</Label>
            <Input id="inv-name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('components.category')}</Label>
              <Select
                value={watch('category_id') ?? ''}
                onValueChange={(v) => setValue('category_id', v || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.filter((cat: any) => cat.key !== 'tires_rear' && cat.key !== 'wheels_rear')
                    .map((cat: any) => {
                      // Show grouped label for front variants
                      const label = cat.key === 'tires_front'
                        ? t('components.categories.tires')
                        : cat.key === 'wheels_front'
                        ? t('components.categories.wheels')
                        : t(`components.categories.${cat.key}`);
                      return (
                        <SelectItem key={cat.id} value={cat.id}>
                          {label}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-quantity">{t('lager.quantity')} *</Label>
              <Input
                id="inv-quantity"
                type="number"
                min={1}
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-brand">{t('components.brand')}</Label>
              <Input id="inv-brand" {...register('brand')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-model">{t('components.model')}</Label>
              <Input id="inv-model" {...register('model')} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-purchased">{t('lager.purchasedAt')}</Label>
              <Input id="inv-purchased" type="date" {...register('purchased_at')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-price">{t('lager.price')} ({t('common.currency')})</Label>
              <Input
                id="inv-price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
              />
            </div>
          </div>

          {bikes && bikes.length > 0 && (
            <div className="space-y-2">
              <Label>{t('lager.suitableFor')}</Label>
              <div className="flex flex-wrap gap-2">
                {bikes.map((bike) => (
                  <label
                    key={bike.id}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={suitableBikeIds.includes(bike.id)}
                      onCheckedChange={() => toggleBike(bike.id)}
                    />
                    {bike.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {watch('ean_code') && (
            <div className="space-y-2">
              <Label htmlFor="inv-ean">{t('lager.eanCode')}</Label>
              <Input id="inv-ean" {...register('ean_code')} readOnly className="bg-muted/50 text-xs" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="inv-notes">{t('common.notes')}</Label>
            <Textarea id="inv-notes" {...register('notes')} rows={2} />
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

        <BarcodeScannerDialog
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onResult={(result) => {
            setValue('ean_code', result.ean);
            if (result.name && !watch('name')) setValue('name', result.name);
            if (result.brand && !watch('brand')) setValue('brand', result.brand);
            if (result.name) {
              toast.success(t('lager.productFound'));
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
