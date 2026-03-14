'use client';

import { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('react-qr-code'), { ssr: false });
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface QrLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: { id: string; name: string; brand?: string | null; model?: string | null; quantity: number } | null;
}

export function QrLabelDialog({ open, onOpenChange, item }: QrLabelDialogProps) {
  const t = useTranslations();
  const labelRef = useRef<HTMLDivElement>(null);

  if (!item) return null;

  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/lager?item=${item.id}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !labelRef.current) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${t('lager.printLabel')}</title>
        <style>
          @page { size: 62mm 30mm; margin: 2mm; }
          body { margin: 0; font-family: system-ui, sans-serif; }
          .label { display: flex; align-items: center; gap: 8px; padding: 4px; }
          .label svg { width: 60px; height: 60px; flex-shrink: 0; }
          .info { font-size: 10px; line-height: 1.3; overflow: hidden; }
          .info .name { font-weight: 600; font-size: 11px; }
          .info .meta { color: #666; }
        </style>
      </head>
      <body>
        ${labelRef.current.innerHTML}
        <script>window.onload=()=>{window.print();window.close();}<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = useCallback(() => {
    if (!labelRef.current) return;
    const svg = labelRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `qr-${item.name.replace(/\s+/g, '-')}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [item.name]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>{t('lager.qrLabel')}</DialogTitle>
        </DialogHeader>

        <div
          ref={labelRef}
          className="label flex items-center gap-3 rounded-md border p-3"
        >
          <QRCode value={url} size={80} level="M" />
          <div className="info min-w-0 space-y-0.5">
            <p className="name truncate text-sm font-semibold">{item.name}</p>
            {(item.brand || item.model) && (
              <p className="meta truncate text-xs text-muted-foreground">
                {[item.brand, item.model].filter(Boolean).join(' ')}
              </p>
            )}
            <p className="meta text-xs text-muted-foreground">
              {item.quantity}x
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            {t('lager.printLabel')}
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
