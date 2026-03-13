'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Check, Bike, ClipboardList } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ServiceRecordDialog } from '@/components/services/service-record-dialog';
import { StartChecklistDialog } from '@/components/maintenance/start-checklist-dialog';
import { ExecutionDialog } from '@/components/maintenance/execution-dialog';

export function MaintenanceAlerts() {
  const t = useTranslations('dashboard');
  const tm = useTranslations('maintenance');
  const queryClient = useQueryClient();

  const [recordDialog, setRecordDialog] = useState<{
    open: boolean;
    bikeId: string;
    intervalId: string;
    title: string;
  } | null>(null);

  const [checklistDialog, setChecklistDialog] = useState<{
    open: boolean;
    bikeId: string;
  } | null>(null);

  const [activeExec, setActiveExec] = useState<{
    id: string;
    bikeId: string;
    planName: string;
  } | null>(null);

  const { data: intervals, isLoading } = useQuery({
    queryKey: ['all-service-intervals'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('service_intervals')
        .select('*, bikes(id, name, total_distance_km)')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  // Quick "mark as done" mutation
  const markDone = useMutation({
    mutationFn: async (interval: any) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const bikeDistance = Number(interval.bikes?.total_distance_km ?? 0);

      // Create service record
      await supabase.from('service_records').insert({
        service_interval_id: interval.id,
        bike_id: interval.bike_id,
        user_id: user.id,
        title: interval.name,
        performed_at: new Date().toISOString().split('T')[0],
        distance_at_service_km: bikeDistance,
      });

      // Update interval
      await supabase
        .from('service_intervals')
        .update({
          last_performed_at: new Date().toISOString(),
          last_performed_distance_km: bikeDistance,
        })
        .eq('id', interval.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-service-intervals'] });
      queryClient.invalidateQueries({ queryKey: ['service-intervals'] });
      queryClient.invalidateQueries({ queryKey: ['service-records'] });
      toast.success('Als erledigt markiert');
    },
  });

  const getStatus = (interval: any) => {
    if (!interval.last_performed_at) return 'overdue';
    if (interval.interval_type === 'days') {
      const daysSince = Math.floor(
        (Date.now() - new Date(interval.last_performed_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSince >= interval.interval_value) return 'overdue';
      if (daysSince >= interval.interval_value * 0.85) return 'due_soon';
    }
    if (interval.interval_type === 'distance' && interval.bikes?.total_distance_km != null && interval.last_performed_distance_km != null) {
      const kmSince = Number(interval.bikes.total_distance_km) - Number(interval.last_performed_distance_km);
      if (kmSince >= interval.interval_value) return 'overdue';
      if (kmSince >= interval.interval_value * 0.85) return 'due_soon';
    }
    return 'ok';
  };

  const getKmInfo = (interval: any) => {
    if (interval.interval_type !== 'distance') return null;
    if (interval.bikes?.total_distance_km == null) return null;
    if (interval.last_performed_distance_km == null) return `Nie durchgeführt`;
    const kmSince = Math.round(Number(interval.bikes.total_distance_km) - Number(interval.last_performed_distance_km));
    return `vor ${kmSince.toLocaleString()} km (Intervall: ${interval.interval_value.toLocaleString()} km)`;
  };

  const alerts = (intervals ?? [])
    .map((interval) => ({
      ...interval,
      status: getStatus(interval),
    }))
    .filter((i) => i.status !== 'ok')
    .sort((a, b) => (a.status === 'overdue' ? -1 : 1));

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('maintenanceAlerts')}
            </CardTitle>
            <Link
              href="/services"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              {t('viewAll')} →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <CheckCircle className="h-4 w-4 text-success" />
              {t('noAlerts')}
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Link
                        href={`/bikes/${alert.bike_id}`}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Bike className="h-3 w-3" />
                        {alert.bikes?.name}
                      </Link>
                      {getKmInfo(alert) && (
                        <span className="text-[11px] text-muted-foreground">
                          · {getKmInfo(alert)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs shrink-0',
                      alert.status === 'overdue' && 'bg-destructive/10 text-destructive',
                      alert.status === 'due_soon' && 'bg-warning/10 text-warning'
                    )}
                  >
                    {alert.status === 'overdue' ? t('overdue') : t('dueSoon')}
                  </Badge>

                  {/* Quick action buttons */}
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() =>
                        setChecklistDialog({
                          open: true,
                          bikeId: alert.bike_id,
                        })
                      }
                      title={tm('startChecklist')}
                    >
                      <ClipboardList className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => markDone.mutate(alert)}
                      disabled={markDone.isPending}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Erledigt
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() =>
                        setRecordDialog({
                          open: true,
                          bikeId: alert.bike_id,
                          intervalId: alert.id,
                          title: alert.name,
                        })
                      }
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Record Dialog for detailed entry */}
      {recordDialog && (
        <ServiceRecordDialog
          open={recordDialog.open}
          onOpenChange={(open) => {
            if (!open) setRecordDialog(null);
          }}
          bikeId={recordDialog.bikeId}
          preselectedIntervalId={recordDialog.intervalId}
          preselectedTitle={recordDialog.title}
        />
      )}

      {/* Start Checklist Dialog */}
      {checklistDialog && (
        <StartChecklistDialog
          open={checklistDialog.open}
          onOpenChange={(open) => {
            if (!open) setChecklistDialog(null);
          }}
          preselectedBikeId={checklistDialog.bikeId}
          onStarted={(id, name) => {
            setChecklistDialog(null);
            setActiveExec({ id, bikeId: checklistDialog.bikeId, planName: name });
          }}
        />
      )}

      {/* Active Execution Dialog */}
      {activeExec && (
        <ExecutionDialog
          open={!!activeExec}
          onOpenChange={(open) => !open && setActiveExec(null)}
          executionId={activeExec.id}
          bikeId={activeExec.bikeId}
          planName={activeExec.planName}
        />
      )}
    </>
  );
}
