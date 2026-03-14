'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  useExecutionItems,
  useToggleExecutionItem,
  useCompleteExecution,
} from '@/hooks/use-maintenance-plans';
import { useBikeSetup } from '@/hooks/use-bike-setup';
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
import { Star, CheckCircle2, ChevronDown, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

interface ExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  executionId: string | null;
  bikeId: string;
  planName: string;
}

const SECTION_COLORS: Record<string, string> = {
  'Bike-Check': 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'Equipment': 'text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  'Ernährung': 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  'Ersatzteile': 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'Technik': 'text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
};

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
  const { data: setup } = useBikeSetup(bikeId);
  const [notes, setNotes] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [setupOpen, setSetupOpen] = useState(true);

  // Group items by section
  const groupedItems = useMemo(() => {
    if (!items) return [];
    const groups = new Map<string, any[]>();
    for (const item of items) {
      const section = item.maintenance_plan_items?.section ?? '';
      if (!groups.has(section)) groups.set(section, []);
      groups.get(section)!.push(item);
    }
    // Convert to array, ungrouped (empty string) first
    const result: { section: string; items: any[] }[] = [];
    if (groups.has('')) {
      result.push({ section: '', items: groups.get('')! });
      groups.delete('');
    }
    for (const [section, sectionItems] of groups) {
      result.push({ section, items: sectionItems });
    }
    return result;
  }, [items]);

  const hasSections = groupedItems.some((g) => g.section !== '');

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

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const isSectionAllChecked = (sectionItems: any[]) =>
    sectionItems.every((i: any) => i.checked);

  const hasSetupData = setup && (
    setup.tire_pressure_front || setup.tire_pressure_rear ||
    setup.fork_pressure || setup.shock_pressure
  );

  const renderItem = (item: any) => (
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
  );

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
            {/* Setup Panel */}
            {hasSetupData && (
              <div className="rounded-lg border bg-muted/30">
                <button
                  type="button"
                  onClick={() => setSetupOpen(!setupOpen)}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <ClipboardList className="h-3.5 w-3.5 text-primary" />
                    {t('maintenance.yourSetup')}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${setupOpen ? '' : '-rotate-90'}`} />
                </button>
                {setupOpen && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 pb-2.5 text-xs">
                    {(setup!.tire_pressure_front || setup!.tire_pressure_rear) && (
                      <>
                        <span className="text-muted-foreground">{t('maintenance.tirePressure')}</span>
                        <span className="font-mono text-right">
                          {setup!.tire_pressure_front ?? '–'} / {setup!.tire_pressure_rear ?? '–'} bar
                        </span>
                      </>
                    )}
                    {setup!.fork_pressure && (
                      <>
                        <span className="text-muted-foreground">{t('maintenance.suspension')} (Fork)</span>
                        <span className="font-mono text-right">{setup!.fork_pressure} psi</span>
                      </>
                    )}
                    {setup!.shock_pressure && (
                      <>
                        <span className="text-muted-foreground">{t('maintenance.suspension')} (Shock)</span>
                        <span className="font-mono text-right">{setup!.shock_pressure} psi</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

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

            {/* Checklist items (grouped by section or flat) */}
            {hasSections ? (
              <div className="space-y-3">
                {groupedItems.map((group) => {
                  if (!group.section) {
                    return (
                      <div key="ungrouped" className="space-y-1">
                        {group.items.map(renderItem)}
                      </div>
                    );
                  }

                  const allChecked = isSectionAllChecked(group.items);
                  const isCollapsed = collapsedSections.has(group.section);
                  const colorClass = SECTION_COLORS[group.section] ?? 'text-foreground border-border';
                  const sectionChecked = group.items.filter((i: any) => i.checked).length;

                  return (
                    <div key={group.section}>
                      <button
                        type="button"
                        onClick={() => toggleSection(group.section)}
                        className={`flex w-full items-center justify-between rounded-md border-l-2 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${colorClass}`}
                      >
                        <span>{group.section}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono font-normal normal-case">
                            {sectionChecked}/{group.items.length}
                          </span>
                          <ChevronDown className={`h-3 w-3 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                        </span>
                      </button>
                      {!isCollapsed && (
                        <div className="mt-1 space-y-1">
                          {group.items.map(renderItem)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1">
                {items?.map(renderItem)}
              </div>
            )}

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
