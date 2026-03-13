'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useExecutionItems,
  useToggleExecutionItem,
  useCompleteExecution,
} from '@/hooks/use-maintenance-plans';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Star, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  executionId: string | null;
  bikeId: string;
  planName: string;
}

export function ExecutionDialog({
  open,
  onOpenChange,
  executionId,
  bikeId,
  planName,
}: ExecutionDialogProps) {
  const t = useTranslations();
  const { data: items, isLoading } = useExecutionItems(executionId);
  const toggleItem = useToggleExecutionItem();
  const completeExecution = useCompleteExecution();
  const [notes, setNotes] = useState('');

  if (!executionId) return null;

  const checkedCount = items?.filter((i: any) => i.checked).length ?? 0;
  const totalCount = items?.length ?? 0;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
  const allRequiredDone =
    items?.every(
      (i: any) => !i.maintenance_plan_items?.is_required || i.checked
    ) ?? false;
  const allDone = checkedCount === totalCount;

  const handleToggle = async (itemId: string, checked: boolean) => {
    try {
      await toggleItem.mutateAsync({ itemId, checked });
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const handleComplete = async () => {
    try {
      await completeExecution.mutateAsync({
        executionId: executionId!,
        bikeId,
        planName,
        notes: notes || undefined,
      });
      toast.success(t('maintenance.completed'));
      onOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {planName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {t('maintenance.progress')}
                </span>
                <span className="font-mono font-medium">
                  {checkedCount}/{totalCount}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Checklist items */}
            <div className="space-y-1">
              {items?.map((item: any) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) =>
                      handleToggle(item.id, checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        item.checked ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {item.maintenance_plan_items?.title}
                    </p>
                    {item.maintenance_plan_items?.description && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.maintenance_plan_items.description}
                      </p>
                    )}
                  </div>
                  {item.maintenance_plan_items?.is_required && (
                    <Star
                      className="h-3 w-3 text-primary shrink-0 mt-0.5"
                      fill="currentColor"
                    />
                  )}
                </label>
              ))}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Textarea
                placeholder={t('common.notes')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Complete button */}
            <Button
              className="w-full"
              onClick={handleComplete}
              disabled={!allRequiredDone || completeExecution.isPending}
            >
              {completeExecution.isPending
                ? '...'
                : allDone
                  ? t('maintenance.completeChecklist')
                  : t('maintenance.completeRequired')}
            </Button>

            {!allRequiredDone && (
              <p className="text-[11px] text-muted-foreground text-center">
                {t('maintenance.requiredItemsHint')}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
