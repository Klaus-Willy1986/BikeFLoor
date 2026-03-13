'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMaintenancePlans, useStartExecution } from '@/hooks/use-maintenance-plans';
import { useBikes } from '@/hooks/use-bikes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ClipboardList, Lock, Play } from 'lucide-react';
import { toast } from 'sonner';

interface StartChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedBikeId?: string;
  preselectedPlanId?: string;
  onStarted?: (executionId: string, planName: string) => void;
}

export function StartChecklistDialog({
  open,
  onOpenChange,
  preselectedBikeId,
  preselectedPlanId,
  onStarted,
}: StartChecklistDialogProps) {
  const t = useTranslations();
  const { data: bikes } = useBikes();
  const [selectedBikeId, setSelectedBikeId] = useState(preselectedBikeId ?? '');
  const [selectedPlanId, setSelectedPlanId] = useState(preselectedPlanId ?? '');

  // Get bike type for filtering plans
  const selectedBike = bikes?.find((b) => b.id === selectedBikeId);
  const bikeType = selectedBike?.type ?? null;
  const { data: plans } = useMaintenancePlans(bikeType);
  const startExecution = useStartExecution();

  const handleStart = async () => {
    if (!selectedBikeId || !selectedPlanId) return;
    try {
      const execution = await startExecution.mutateAsync({
        planId: selectedPlanId,
        bikeId: selectedBikeId,
      });
      const planName = plans?.find((p: any) => p.id === selectedPlanId)?.name ?? '';
      toast.success(t('maintenance.started'));
      onOpenChange(false);
      onStarted?.(execution.id, planName);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            {t('maintenance.startChecklist')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bike selection */}
          <div className="space-y-2">
            <Label>{t('rides.bike')}</Label>
            <Select
              value={selectedBikeId}
              onValueChange={setSelectedBikeId}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.selectBike')} />
              </SelectTrigger>
              <SelectContent>
                {bikes?.filter((b) => b.is_active).map((bike) => (
                  <SelectItem key={bike.id} value={bike.id}>
                    {bike.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plan selection */}
          <div className="space-y-2">
            <Label>{t('maintenance.selectPlan')}</Label>
            {selectedBikeId ? (
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                {plans?.map((plan: any) => (
                  <div
                    key={plan.id}
                    className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                      selectedPlanId === plan.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-border'
                    }`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium truncate">{plan.name}</p>
                        {plan.is_system && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-[11px] text-muted-foreground truncate">{plan.description}</p>
                      )}
                    </div>
                    {plan.bike_type && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {t(`bikes.types.${plan.bike_type}`)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t('maintenance.selectBikeFirst')}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleStart}
            disabled={!selectedBikeId || !selectedPlanId || startExecution.isPending}
          >
            <Play className="mr-1.5 h-3.5 w-3.5" />
            {startExecution.isPending ? '...' : t('maintenance.startChecklist')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
