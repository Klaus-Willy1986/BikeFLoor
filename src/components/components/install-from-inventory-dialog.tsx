'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInventory, useInstallFromInventory } from '@/hooks/use-inventory';
import { useComponentCategories } from '@/hooks/use-components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { Package, Wrench, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface InstallFromInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeId: string;
}

export function InstallFromInventoryDialog({
  open,
  onOpenChange,
  bikeId,
}: InstallFromInventoryDialogProps) {
  const t = useTranslations();
  const { data: items, isLoading } = useInventory();
  const { data: categories } = useComponentCategories();
  const install = useInstallFromInventory();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [categoryId, setCategoryId] = useState<string>('');

  // Filter to items suitable for this bike (or with no bike restriction)
  const available = items?.filter(
    (item: any) =>
      !item.suitable_bike_ids?.length || item.suitable_bike_ids.includes(bikeId)
  );

  const handleInstall = async () => {
    if (!selectedItem) return;
    try {
      await install.mutateAsync({
        inventoryItem: {
          id: selectedItem.id,
          name: selectedItem.name,
          brand: selectedItem.brand,
          model: selectedItem.model,
          category_id: categoryId || selectedItem.category_id,
          quantity: selectedItem.quantity,
        },
        bikeId,
      });
      toast.success(t('lager.installSuccess'));
      if ((selectedItem.quantity ?? 1) <= 1) {
        setSelectedItem(null);
        setCategoryId('');
        onOpenChange(false);
      } else {
        // Stay on category selection for next install
        setCategoryId('');
      }
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelectedItem(null);
      setCategoryId('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('lager.installFromInventory')}</DialogTitle>
        </DialogHeader>

        {selectedItem ? (
          /* ─── Step 2: Category selection ─── */
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 -ml-2 text-muted-foreground"
              onClick={() => { setSelectedItem(null); setCategoryId(''); }}
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              {t('common.back')}
            </Button>

            <div className="rounded-md border px-3 py-2.5">
              <p className="text-sm font-medium">{selectedItem.name}</p>
              <p className="text-xs text-muted-foreground">
                {[selectedItem.brand, selectedItem.model].filter(Boolean).join(' ')}
                {selectedItem.quantity > 1 && <> · {selectedItem.quantity}x</>}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t('lager.installAs')}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('components.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {t(`components.categories.${cat.key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleInstall}
              disabled={!categoryId || install.isPending}
            >
              <Wrench className="mr-2 h-4 w-4" />
              {install.isPending ? '...' : t('lager.install')}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : !available?.length ? (
          <EmptyState
            title={t('lager.noItems')}
            icon={<Package className="h-12 w-12" strokeWidth={1} />}
          />
        ) : (
          <div className="space-y-2">
            {available.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedItem(item)}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[item.brand, item.model].filter(Boolean).join(' ')}
                    {item.quantity > 1 && <> · {item.quantity}x</>}
                  </p>
                </div>
                <Wrench className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
