'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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

/* Inner component — only mounts when dialog is open, so useZxing initializes cleanly */
function ScannerView({ onResult, onClose }: {
  onResult: (result: { ean: string; name?: string; brand?: string }) => void;
  onClose: () => void;
}) {
  const t = useTranslations();
  const [looking, setLooking] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
        onClose();
      } catch {
        onResult({ ean });
        onClose();
      } finally {
        setLooking(false);
      }
    },
    [looking, onResult, onClose],
  );

  const { ref: zxingRef } = useZxing({
    paused: looking,
    constraints: {
      video: { facingMode: 'environment' },
      audio: false,
    },
    onDecodeResult: handleDecode,
  });

  // Manually start camera as fallback — ensures stream reaches the video element
  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch {
        if (!cancelled) setCameraError(true);
      }
    };

    // Small delay to let dialog animation finish
    const timer = setTimeout(startCamera, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Combine refs: both zxing and our manual ref
  const setRefs = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      // zxingRef is a callback ref
      if (typeof zxingRef === 'function') {
        (zxingRef as (el: HTMLVideoElement | null) => void)(el);
      } else if (zxingRef && 'current' in zxingRef) {
        (zxingRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
      }
    },
    [zxingRef],
  );

  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-black">
        <video
          ref={setRefs}
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

      <Button variant="outline" onClick={onClose}>
        {t('common.cancel')}
      </Button>
    </>
  );
}

export function BarcodeScannerDialog({ open, onOpenChange, onResult }: BarcodeScannerDialogProps) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('lager.scanBarcode')}</DialogTitle>
        </DialogHeader>

        {open && (
          <ScannerView
            onResult={onResult}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
