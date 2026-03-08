'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBikes } from '@/hooks/use-bikes';
import { useInstallFromInventory } from '@/hooks/use-inventory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Wrench } from 'lucide-react';
import { toast } from 'sonner';

interface InstallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any | null;
}

export function InstallDialog({ open, onOpenChange, item }: InstallDialogProps) {
  const t = useTranslations();
  const { data: bikes } = useBikes();
  const install = useInstallFromInventory();
  const [selectedBikeId, setSelectedBikeId] = useState<string>('');

  const handleInstall = async () => {
    if (!item || !selectedBikeId) return;
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
        bikeId: selectedBikeId,
      });
      toast.success(t('lager.installSuccess'));
      setSelectedBikeId('');
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setSelectedBikeId(''); onOpenChange(o); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('lager.installTitle')}</DialogTitle>
          <DialogDescription>
            {item?.name}
            {item?.brand || item?.model
              ? ` — ${[item.brand, item.model].filter(Boolean).join(' ')}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>{t('lager.selectBike')}</Label>
          <Select value={selectedBikeId} onValueChange={setSelectedBikeId}>
            <SelectTrigger>
              <SelectValue placeholder={t('components.selectBike')} />
            </SelectTrigger>
            <SelectContent>
              {bikes?.map((bike) => (
                <SelectItem key={bike.id} value={bike.id}>
                  {bike.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleInstall}
            disabled={!selectedBikeId || install.isPending}
          >
            {install.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wrench className="mr-2 h-4 w-4" />
            )}
            {t('lager.install')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
