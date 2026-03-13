'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useMaintenancePlan,
  useAddPlanItem,
  useUpdatePlanItem,
  useDeletePlanItem,
} from '@/hooks/use-maintenance-plans';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, GripVertical, Lock, Star } from 'lucide-react';
import { toast } from 'sonner';

interface PlanDetailDialogProps {
  planId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanDetailDialog({ planId, open, onOpenChange }: PlanDetailDialogProps) {
  const t = useTranslations();
  const { data: plan, isLoading } = useMaintenancePlan(planId);
  const addItem = useAddPlanItem();
  const updateItem = useUpdatePlanItem();
  const deleteItem = useDeletePlanItem();
  const [newItemTitle, setNewItemTitle] = useState('');

  if (!planId) return null;

  const isSystem = plan?.is_system ?? false;
  const items = (plan?.maintenance_plan_items ?? []) as any[];

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return;
    try {
      await addItem.mutateAsync({
        planId: planId!,
        data: {
          title: newItemTitle.trim(),
          sort_order: items.length,
        },
      });
      setNewItemTitle('');
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem.mutateAsync(itemId);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const handleToggleRequired = async (itemId: string, current: boolean) => {
    try {
      await updateItem.mutateAsync({ itemId, data: { is_required: !current } });
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {plan?.name ?? '...'}
            {isSystem && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plan info */}
            <div className="flex items-center gap-2">
              {plan?.bike_type ? (
                <Badge variant="secondary" className="text-xs">
                  {t(`bikes.types.${plan.bike_type}`)}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {t('maintenance.universal')}
                </Badge>
              )}
              {plan?.description && (
                <span className="text-xs text-muted-foreground">{plan.description}</span>
              )}
            </div>

            {/* Items */}
            <div className="space-y-1">
              {items.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 group"
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                  <span className="text-xs text-muted-foreground w-5 shrink-0">
                    {index + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                    )}
                  </div>
                  {item.is_required && (
                    <Star className="h-3 w-3 text-primary shrink-0" fill="currentColor" />
                  )}
                  {!isSystem && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleToggleRequired(item.id, item.is_required)}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add item (only for user plans) */}
            {!isSystem && (
              <div className="flex gap-2">
                <Input
                  placeholder={t('maintenance.addItem')}
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
                  className="h-9 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddItem}
                  disabled={!newItemTitle.trim() || addItem.isPending}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {isSystem && (
              <p className="text-xs text-muted-foreground text-center py-2">
                {t('maintenance.systemPlanHint')}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
