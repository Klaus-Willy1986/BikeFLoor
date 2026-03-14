'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useZxing } from 'react-zxing';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BarcodeScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResult: (result: { ean: string; name?: string; brand?: string }) => void;
}

export function BarcodeScannerDialog({ open, onOpenChange, onResult }: BarcodeScannerDialogProps) {
  const t = useTranslations();
  const [looking, setLooking] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const handleDecode = useCallback(
    async (result: { getText: () => string }) => {
      const ean = result.getText();
      if (!ean || looking) return;

      setLooking(true);

      try {
        const res = await fetch(`/api/barcode/lookup?ean=${encodeURIComponent(ean)}`);
        const data = await res.json();

        if (data.found) {
          onResult({ ean, name: data.name ?? undefined, brand: data.brand ?? undefined });
        } else {
          onResult({ ean });
        }
        onOpenChange(false);
      } catch {
        onResult({ ean });
        onOpenChange(false);
      } finally {
        setLooking(false);
      }
    },
    [looking, onResult, onOpenChange],
  );

  const { ref } = useZxing({
    paused: !open || looking,
    constraints: {
      video: { facingMode: 'environment' },
      audio: false,
    },
    onDecodeResult: handleDecode,
  });

  // Check camera permission when dialog opens
  useEffect(() => {
    if (!open) {
      setCameraError(false);
      setLooking(false);
      return;
    }

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        // Camera access granted — stop this test stream (useZxing manages its own)
        stream.getTracks().forEach((t) => t.stop());
        setCameraError(false);
      })
      .catch(() => {
        setCameraError(true);
      });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('lager.scanBarcode')}</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-black">
          <video
            ref={ref}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {looking && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>

        {cameraError && (
          <p className="text-xs text-destructive">{t('lager.scanError')}</p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          {t('lager.scanHint')}
        </p>

        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {t('common.cancel')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
