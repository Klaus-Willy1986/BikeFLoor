'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useBike } from '@/hooks/use-bikes';
import { useServiceIntervals } from '@/hooks/use-services';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface RepairRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeId: string;
  shop: { name: string; email?: string | null };
}

interface ServiceStatus {
  name: string;
  status: 'overdue' | 'dueSoon';
  detail: string;
}

export function RepairRequestDialog({
  open,
  onOpenChange,
  bikeId,
  shop,
}: RepairRequestDialogProps) {
  const t = useTranslations();
  const { data: bike } = useBike(bikeId);
  const { data: intervals } = useServiceIntervals(bikeId);

  const dueServices = useMemo(() => {
    if (!bike || !intervals) return [];

    const results: ServiceStatus[] = [];
    const bikeKm = bike.total_distance_km;

    for (const interval of intervals) {
      if (interval.interval_type !== 'distance') continue;

      const lastKm = interval.last_performed_distance_km ?? 0;
      const nextDueKm = lastKm + interval.interval_value;
      const remaining = nextDueKm - bikeKm;

      if (remaining < 0) {
        results.push({
          name: interval.name,
          status: 'overdue',
          detail: t('shops.repairRequest.overdueSince', {
            km: Math.abs(Math.round(remaining)),
          }),
        });
      } else if (remaining < interval.interval_value * 0.2) {
        results.push({
          name: interval.name,
          status: 'dueSoon',
          detail: t('shops.repairRequest.dueIn', {
            km: Math.round(remaining),
          }),
        });
      }
    }

    return results;
  }, [bike, intervals, t]);

  const bikeLabel = bike
    ? `${bike.name}${bike.manufacturer || bike.model ? ` (${[bike.manufacturer, bike.model].filter(Boolean).join(' ')})` : ''}`
    : '';

  const subject = `${t('shops.repairRequest.subject')} — ${bikeLabel}`;

  const body = useMemo(() => {
    if (!bike) return '';

    const lines: string[] = [
      t('shops.repairRequest.greeting'),
      '',
      t('shops.repairRequest.intro', {
        bike: bikeLabel,
        km: Math.round(Number(bike.total_distance_km)).toLocaleString(),
      }),
      '',
    ];

    const overdue = dueServices.filter((s) => s.status === 'overdue');
    const dueSoon = dueServices.filter((s) => s.status === 'dueSoon');

    if (overdue.length > 0) {
      lines.push(t('shops.repairRequest.overdueLabel'));
      for (const s of overdue) {
        lines.push(`  - ${s.name} (${s.detail})`);
      }
      lines.push('');
    }

    if (dueSoon.length > 0) {
      lines.push(t('shops.repairRequest.dueSoonLabel'));
      for (const s of dueSoon) {
        lines.push(`  - ${s.name} (${s.detail})`);
      }
      lines.push('');
    }

    if (dueServices.length === 0) {
      lines.push(t('shops.repairRequest.generalService'));
      lines.push('');
    }

    lines.push(t('shops.repairRequest.closing'));

    return lines.join('\n');
  }, [bike, dueServices, bikeLabel, t]);

  const handleEmail = () => {
    const mailto = `mailto:${shop.email ?? ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      toast.success(t('shops.repairRequest.copied'));
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('shops.repairRequest.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            {t('shops.repairRequest.to')}: <strong>{shop.name}</strong>
            {shop.email && ` (${shop.email})`}
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t('shops.repairRequest.subjectLabel')}: {subject}
            </p>
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {body}
            </pre>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {t('shops.repairRequest.copy')}
          </Button>
          {shop.email && (
            <Button onClick={handleEmail}>
              <Mail className="mr-2 h-4 w-4" />
              {t('shops.repairRequest.sendEmail')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
