'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMaintenanceExecutions } from '@/hooks/use-maintenance-plans';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, CheckCircle2, Clock } from 'lucide-react';
import { ExecutionDialog } from './execution-dialog';

interface ExecutionHistoryProps {
  bikeId?: string;
}

export function ExecutionHistory({ bikeId }: ExecutionHistoryProps) {
  const t = useTranslations();
  const { data: executions, isLoading } = useMaintenanceExecutions(bikeId);
  const [activeExecution, setActiveExecution] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (!executions?.length) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        <History className="h-3.5 w-3.5" />
        {t('maintenance.history')}
      </h4>

      <div className="space-y-1.5">
        {executions.map((exec: any) => {
          const isCompleted = !!exec.completed_at;
          return (
            <Card
              key={exec.id}
              className={`border-border/50 ${
                !isCompleted ? 'cursor-pointer hover:border-border transition-colors' : ''
              }`}
              onClick={() => !isCompleted && setActiveExecution(exec)}
            >
              <CardContent className="flex items-center gap-3 p-3">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {exec.maintenance_plans?.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {exec.bikes?.name && <span>{exec.bikes.name}</span>}
                    <span>
                      {new Date(exec.started_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={isCompleted ? 'secondary' : 'default'}
                  className="text-[10px] shrink-0"
                >
                  {isCompleted ? t('maintenance.done') : t('maintenance.inProgress')}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeExecution && (
        <ExecutionDialog
          open={!!activeExecution}
          onOpenChange={(open) => !open && setActiveExecution(null)}
          executionId={activeExecution.id}
          bikeId={activeExecution.bike_id}
          planName={activeExecution.maintenance_plans?.name ?? ''}
        />
      )}
    </div>
  );
}
