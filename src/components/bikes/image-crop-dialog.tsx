'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const MAX_WIDTH = 1920;
const ASPECT_RATIO = 16 / 9;

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (file: File) => void;
}

function getCroppedCanvas(
  image: HTMLImageElement,
  crop: PixelCrop,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  let outputWidth = crop.width * scaleX;
  let outputHeight = crop.height * scaleY;

  // Downscale if wider than MAX_WIDTH
  if (outputWidth > MAX_WIDTH) {
    const ratio = MAX_WIDTH / outputWidth;
    outputWidth = MAX_WIDTH;
    outputHeight = outputHeight * ratio;
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return canvas;
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
}: ImageCropDialogProps) {
  const t = useTranslations('bikes');
  const tCommon = useTranslations('common');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [saving, setSaving] = useState(false);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      imgRef.current = e.currentTarget;

      // Default crop: centered 16:9 area covering as much as possible
      const imgAspect = width / height;
      let cropWidth: number;
      let cropHeight: number;

      if (imgAspect > ASPECT_RATIO) {
        // Image wider than 16:9 → fit height
        cropHeight = height;
        cropWidth = cropHeight * ASPECT_RATIO;
      } else {
        // Image taller than 16:9 → fit width
        cropWidth = width;
        cropHeight = cropWidth / ASPECT_RATIO;
      }

      setCrop({
        unit: 'px',
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      });
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!imgRef.current || !crop) return;

    setSaving(true);
    try {
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: crop.x ?? 0,
        y: crop.y ?? 0,
        width: crop.width ?? 0,
        height: crop.height ?? 0,
      };

      const canvas = getCroppedCanvas(imgRef.current, pixelCrop);

      const blob = await new Promise<Blob>((resolve) => {
        // Try webp first, fallback to jpeg
        canvas.toBlob(
          (b) => {
            if (b) {
              resolve(b);
            } else {
              canvas.toBlob(
                (b2) => resolve(b2!),
                'image/jpeg',
                0.9,
              );
            }
          },
          'image/webp',
          0.85,
        );
      });

      const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
      const file = new File([blob], `bike-photo.${ext}`, { type: blob.type });
      onCropComplete(file);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }, [crop, onCropComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('cropImage')}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center overflow-hidden rounded-lg bg-muted">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={ASPECT_RATIO}
            className="max-h-[60vh]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={saving || !crop}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tCommon('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
