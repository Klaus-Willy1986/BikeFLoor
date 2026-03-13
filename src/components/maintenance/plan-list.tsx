'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMaintenancePlans, useDeletePlan, useClonePlan } from '@/hooks/use-maintenance-plans';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Copy, Trash2, ClipboardList, Lock, ChevronRight } from 'lucide-react';
import { BIKE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';
import { PlanFormDialog } from './plan-form-dialog';
import { PlanDetailDialog } from './plan-detail-dialog';

export function PlanList() {
  const t = useTranslations();
  const [bikeTypeFilter, setBikeTypeFilter] = useState<string | null>(null);
  const { data: plans, isLoading } = useMaintenancePlans(bikeTypeFilter);
  const deletePlan = useDeletePlan();
  const clonePlan = useClonePlan();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePlan.mutateAsync(deleteId);
      toast.success(t('common.delete'));
      setDeleteId(null);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const handleClone = async (planId: string) => {
    try {
      await clonePlan.mutateAsync(planId);
      toast.success(t('maintenance.cloned'));
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filter + add */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">{t('maintenance.plans')}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={bikeTypeFilter ?? 'all'}
            onValueChange={(v) => setBikeTypeFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              {BIKE_TYPES.filter((bt) => bt !== 'other').map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`bikes.types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {t('maintenance.createPlan')}
          </Button>
        </div>
      </div>

      {/* Plan cards */}
      {!plans?.length ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {t('maintenance.noPlans')}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {plans.map((plan: any) => {
            const itemCount = plan.maintenance_plan_items?.[0]?.count ?? 0;
            return (
              <Card
                key={plan.id}
                className="border-border/50 cursor-pointer hover:border-border transition-colors"
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{plan.name}</p>
                      {plan.is_system && (
                        <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {plan.bike_type && (
                        <Badge variant="secondary" className="text-[10px] px-1.5">
                          {t(`bikes.types.${plan.bike_type}`)}
                        </Badge>
                      )}
                      {!plan.bike_type && (
                        <Badge variant="outline" className="text-[10px] px-1.5">
                          {t('maintenance.universal')}
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {itemCount} {t('maintenance.items')}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleClone(plan.id)}
                      disabled={clonePlan.isPending}
                      title={t('maintenance.clone')}
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    {!plan.is_system && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeleteId(plan.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    )}
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PlanFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <PlanDetailDialog
        planId={selectedPlanId}
        open={!!selectedPlanId}
        onOpenChange={(open) => !open && setSelectedPlanId(null)}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('maintenance.deletePlan')}
        description={t('maintenance.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deletePlan.isPending}
      />
    </div>
  );
}
