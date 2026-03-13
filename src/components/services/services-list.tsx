'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useServiceIntervals, useServiceRecords, useDeleteServiceInterval } from '@/hooks/use-services';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { IntervalBadge } from './interval-badge';
import { ServiceIntervalDialog } from './service-interval-dialog';
import { ServiceRecordDialog } from './service-record-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Wrench, Trash2, ClipboardPlus, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import { StartChecklistDialog } from '@/components/maintenance/start-checklist-dialog';
import { ExecutionDialog } from '@/components/maintenance/execution-dialog';
import { ExecutionHistory } from '@/components/maintenance/execution-history';

interface ServicesListProps {
  bikeId?: string;
}

export function ServicesList({ bikeId }: ServicesListProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { data: intervals, isLoading: loadingIntervals } = useServiceIntervals(bikeId);
  const { data: records, isLoading: loadingRecords } = useServiceRecords(bikeId);
  const deleteInterval = useDeleteServiceInterval();
  const [intervalOpen, setIntervalOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [activeExec, setActiveExec] = useState<{
    id: string;
    planName: string;
  } | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInterval.mutateAsync(deleteId);
      toast.success(t('common.delete'));
      setDeleteId(null);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const isLoading = loadingIntervals || loadingRecords;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {!bikeId && <PageHeader title={t('services.title')} />}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!bikeId && <PageHeader title={t('services.title')} />}

      {/* Service Intervals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {t('services.addInterval').replace('hinzufügen', '').replace('Add ', '')}
          </h3>
          {bikeId && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setChecklistOpen(true)}>
                <ClipboardList className="mr-2 h-4 w-4" />
                {t('maintenance.startChecklist')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setRecordOpen(true)}>
                <ClipboardPlus className="mr-2 h-4 w-4" />
                {t('services.addRecord')}
              </Button>
              <Button size="sm" onClick={() => setIntervalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('services.addInterval')}
              </Button>
            </div>
          )}
        </div>

        {!intervals?.length ? (
          <EmptyState
            title={t('services.noIntervals')}
            icon={<Wrench className="h-16 w-16" strokeWidth={1} />}
            action={
              bikeId ? (
                <Button size="sm" onClick={() => setIntervalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('services.addInterval')}
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-2">
            {intervals.map((interval) => (
              <Card key={interval.id} className="border-border/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <IntervalBadge interval={interval} />
                    <div>
                      <h4 className="font-medium">{interval.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {t(`services.types.${interval.interval_type}`).replace('X', String(interval.interval_value))}
                      </p>
                      {interval.last_performed_at && (
                        <p className="text-xs text-muted-foreground">
                          {t('services.lastPerformed')}: {new Date(interval.last_performed_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(interval.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Service Records */}
      {records && records.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Historie
          </h3>
          <div className="space-y-2">
            {records.map((record) => (
              <Card key={record.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{record.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.performed_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US')}
                        {record.distance_at_service_km && (
                          <> · <span className="font-mono">{Number(record.distance_at_service_km).toLocaleString()} km</span></>
                        )}
                      </p>
                      {record.consumables && (
                        <p className="text-xs text-muted-foreground mt-1">{record.consumables}</p>
                      )}
                    </div>
                    {record.cost && (
                      <span className="text-sm font-mono font-medium">
                        {Number(record.cost).toFixed(2)} €
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Checklist Execution History */}
      {bikeId && <ExecutionHistory bikeId={bikeId} />}

      {bikeId && (
        <>
          <ServiceIntervalDialog
            open={intervalOpen}
            onOpenChange={setIntervalOpen}
            bikeId={bikeId}
          />
          <ServiceRecordDialog
            open={recordOpen}
            onOpenChange={setRecordOpen}
            bikeId={bikeId}
          />
          <StartChecklistDialog
            open={checklistOpen}
            onOpenChange={setChecklistOpen}
            preselectedBikeId={bikeId}
            onStarted={(id, name) => {
              setActiveExec({ id, planName: name });
            }}
          />
          {activeExec && (
            <ExecutionDialog
              open={!!activeExec}
              onOpenChange={(open) => !open && setActiveExec(null)}
              executionId={activeExec.id}
              bikeId={bikeId}
              planName={activeExec.planName}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('services.deleteInterval')}
        description={t('services.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleteInterval.isPending}
      />
    </div>
  );
}
