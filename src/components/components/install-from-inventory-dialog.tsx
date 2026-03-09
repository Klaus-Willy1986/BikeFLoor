'use client';

import { useTranslations } from 'next-intl';
import { useInventory, useInstallFromInventory } from '@/hooks/use-inventory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { Package, Wrench } from 'lucide-react';
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
  const install = useInstallFromInventory();

  // Filter to items suitable for this bike (or with no bike restriction)
  const available = items?.filter(
    (item: any) =>
      !item.suitable_bike_ids?.length || item.suitable_bike_ids.includes(bikeId)
  );

  const handleInstall = async (item: any) => {
    try {
      await install.mutateAsync({
        inventoryItem: {
          id: item.id,
          name: item.name,
          brand: item.brand,
          model: item.model,
          category_id: item.category_id,
          quantity: item.quantity,
        },
        bikeId,
      });
      toast.success(t('lager.installSuccess'));
      if ((item.quantity ?? 1) <= 1) {
        // Last one installed, close dialog
        onOpenChange(false);
      }
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('lager.installFromInventory')}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
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
                className="flex items-center justify-between rounded-md border px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[item.brand, item.model].filter(Boolean).join(' ')}
                    {item.component_categories?.key && (
                      <> · {t(`components.categories.${item.component_categories.key}`)}</>
                    )}
                    {item.quantity > 1 && <> · {item.quantity}x</>}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInstall(item)}
                  disabled={install.isPending}
                >
                  <Wrench className="mr-1.5 h-3.5 w-3.5" />
                  {t('lager.install')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
