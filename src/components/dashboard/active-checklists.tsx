'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useActiveExecutions } from '@/hooks/use-maintenance-plans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Play, Bike } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ExecutionDialog } from '@/components/maintenance/execution-dialog';
import { StartChecklistDialog } from '@/components/maintenance/start-checklist-dialog';

export function ActiveChecklists() {
  const t = useTranslations();
  const { data: executions, isLoading } = useActiveExecutions();
  const [activeExec, setActiveExec] = useState<any>(null);
  const [startOpen, setStartOpen] = useState(false);

  return (
    <>
      <Card className="border-0 card-elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              {t('maintenance.activeChecklists')}
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => setStartOpen(true)}
            >
              <Play className="mr-1 h-3 w-3" />
              {t('maintenance.startChecklist')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : !executions?.length ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t('maintenance.noActiveChecklists')}
            </p>
          ) : (
            <div className="space-y-2">
              {executions.map((exec: any) => {
                const items = exec.maintenance_execution_items ?? [];
                const checked = items.filter((i: any) => i.checked).length;
                const total = items.length;
                const progress = total > 0 ? (checked / total) * 100 : 0;

                return (
                  <div
                    key={exec.id}
                    className="rounded-lg border p-3 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setActiveExec(exec)}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {exec.maintenance_plans?.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Bike className="h-3 w-3" />
                          {exec.bikes?.name}
                        </div>
                      </div>
                      <Badge variant="default" className="text-[10px] shrink-0">
                        {checked}/{total}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {activeExec && (
        <ExecutionDialog
          open={!!activeExec}
          onOpenChange={(open) => !open && setActiveExec(null)}
          executionId={activeExec.id}
          bikeId={activeExec.bike_id}
          planName={activeExec.maintenance_plans?.name ?? ''}
        />
      )}

      <StartChecklistDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        onStarted={(id, name) => {
          setActiveExec({
            id,
            bike_id: '',
            maintenance_plans: { name },
          });
        }}
      />
    </>
  );
}
