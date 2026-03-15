'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useComponents } from '@/hooks/use-components';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareSetupButtonProps {
  bike: {
    id: string;
    manufacturer: string | null;
    model: string | null;
    year: number | null;
    type: string;
    weight_kg: number | null;
  };
}

export function ShareSetupButton({ bike }: ShareSetupButtonProps) {
  const t = useTranslations('bikeTemplates');
  const { data: components } = useComponents(bike.id);
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Only show if bike has manufacturer + model + at least 3 active components
  const activeComponents = components?.filter((c) => c.is_active) ?? [];
  if (!bike.manufacturer || !bike.model || activeComponents.length < 3) {
    return null;
  }

  const handleShare = async () => {
    setSharing(true);
    try {
      const payload = {
        manufacturer: bike.manufacturer!,
        model: bike.model!,
        year: bike.year,
        type: bike.type,
        weight_kg: bike.weight_kg ? Number(bike.weight_kg) : null,
        components: activeComponents.map((c) => ({
          category_key: c.component_categories?.key ?? 'other',
          name: c.name,
          brand: c.brand ?? undefined,
          model: c.model ?? undefined,
          max_distance_km: c.max_distance_km ?? undefined,
        })),
      };

      const res = await fetch('/api/bike-templates/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to share');

      toast.success(t('shareSuccess'));
    } catch {
      toast.error('Fehler beim Teilen');
    } finally {
      setSharing(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-3.5 w-3.5" />
        {t('shareSetup')}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('shareSetup')}
        description={t('shareConfirm', {
          manufacturer: bike.manufacturer,
          model: bike.model,
        })}
        onConfirm={handleShare}
        loading={sharing}
        variant="default"
      />
    </>
  );
}
