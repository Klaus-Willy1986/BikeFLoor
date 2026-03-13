'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { MaintenancePlanFormData, MaintenancePlanItemFormData } from '@/lib/validators/maintenance';

// ─── Queries ────────────────────────────────────────────────────────

export function useMaintenancePlans(bikeType?: string | null) {
  const supabase = createClient();
  return useQuery({
    queryKey: ['maintenance-plans', bikeType ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_plans')
        .select('*, maintenance_plan_items(count)')
        .order('is_system', { ascending: false })
        .order('name');

      if (bikeType) {
        query = query.or(`bike_type.eq.${bikeType},bike_type.is.null`);
      }

      const { data, error } = await (query as any);
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useMaintenancePlan(planId: string | null) {
  const supabase = createClient();
  return useQuery({
    queryKey: ['maintenance-plan', planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_plans')
        .select('*, maintenance_plan_items(*)')
        .eq('id', planId!)
        .single();
      if (error) throw error;

      // Sort items by sort_order
      if (data.maintenance_plan_items) {
        (data.maintenance_plan_items as any[]).sort(
          (a: any, b: any) => a.sort_order - b.sort_order
        );
      }
      return data;
    },
    enabled: !!planId,
  });
}

export function useMaintenanceExecutions(bikeId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ['maintenance-executions', bikeId ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_executions')
        .select('*, maintenance_plans(name, bike_type), bikes(name)')
        .order('started_at', { ascending: false });

      if (bikeId) {
        query = query.eq('bike_id', bikeId);
      }

      const { data, error } = await (query as any);
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useActiveExecutions() {
  const supabase = createClient();
  return useQuery({
    queryKey: ['active-executions'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('maintenance_executions')
        .select('*, maintenance_plans(name, bike_type), bikes(name), maintenance_execution_items(id, checked)')
        .is('completed_at', null)
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useExecutionItems(executionId: string | null) {
  const supabase = createClient();
  return useQuery({
    queryKey: ['execution-items', executionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_execution_items')
        .select('*, maintenance_plan_items(title, description, sort_order, is_required)')
        .eq('execution_id', executionId!);
      if (error) throw error;

      // Sort by plan item sort_order
      return (data as any[]).sort(
        (a: any, b: any) =>
          (a.maintenance_plan_items?.sort_order ?? 0) -
          (b.maintenance_plan_items?.sort_order ?? 0)
      );
    },
    enabled: !!executionId,
  });
}

// ─── Plan Mutations ─────────────────────────────────────────────────

export function useCreatePlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MaintenancePlanFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: result, error } = await supabase
        .from('maintenance_plans')
        .insert({
          ...data,
          user_id: user.id,
          is_system: false,
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plans'] });
    },
  });
}

export function useClonePlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourcePlanId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get source plan
      const { data: source, error: sourceError } = await supabase
        .from('maintenance_plans')
        .select('*, maintenance_plan_items(*)')
        .eq('id', sourcePlanId)
        .single();
      if (sourceError) throw sourceError;

      // Create clone
      const { data: newPlan, error: planError } = await supabase
        .from('maintenance_plans')
        .insert({
          user_id: user.id,
          name: `${source.name} (Kopie)`,
          description: source.description,
          bike_type: source.bike_type,
          is_system: false,
        })
        .select()
        .single();
      if (planError) throw planError;

      // Clone items
      if (source.maintenance_plan_items?.length > 0) {
        const items = (source.maintenance_plan_items as any[]).map((item: any) => ({
          plan_id: newPlan.id,
          title: item.title,
          description: item.description,
          sort_order: item.sort_order,
          is_required: item.is_required,
        }));

        const { error: itemsError } = await supabase
          .from('maintenance_plan_items')
          .insert(items);
        if (itemsError) throw itemsError;
      }

      return newPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plans'] });
    },
  });
}

export function useUpdatePlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, data }: { planId: string; data: Partial<MaintenancePlanFormData> }) => {
      const { error } = await supabase
        .from('maintenance_plans')
        .update(data)
        .eq('id', planId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plans'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-plan'] });
    },
  });
}

export function useDeletePlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('maintenance_plans')
        .delete()
        .eq('id', planId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plans'] });
    },
  });
}

// ─── Plan Item Mutations ────────────────────────────────────────────

export function useAddPlanItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, data }: { planId: string; data: MaintenancePlanItemFormData }) => {
      const { data: result, error } = await supabase
        .from('maintenance_plan_items')
        .insert({ ...data, plan_id: planId })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plan'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-plans'] });
    },
  });
}

export function useUpdatePlanItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<MaintenancePlanItemFormData> }) => {
      const { error } = await supabase
        .from('maintenance_plan_items')
        .update(data)
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plan'] });
    },
  });
}

export function useDeletePlanItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('maintenance_plan_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plan'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-plans'] });
    },
  });
}

// ─── Execution Mutations ────────────────────────────────────────────

export function useStartExecution() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, bikeId }: { planId: string; bikeId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create execution
      const { data: execution, error: execError } = await supabase
        .from('maintenance_executions')
        .insert({
          plan_id: planId,
          bike_id: bikeId,
          user_id: user.id,
        })
        .select()
        .single();
      if (execError) throw execError;

      // Get plan items
      const { data: items, error: itemsError } = await supabase
        .from('maintenance_plan_items')
        .select('id')
        .eq('plan_id', planId);
      if (itemsError) throw itemsError;

      // Create execution items
      if (items && items.length > 0) {
        const execItems = items.map((item) => ({
          execution_id: execution.id,
          plan_item_id: item.id,
          checked: false,
        }));

        const { error: execItemsError } = await supabase
          .from('maintenance_execution_items')
          .insert(execItems);
        if (execItemsError) throw execItemsError;
      }

      return execution;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-executions'] });
      queryClient.invalidateQueries({ queryKey: ['active-executions'] });
    },
  });
}

export function useToggleExecutionItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, checked, notes }: { itemId: string; checked: boolean; notes?: string }) => {
      const { error } = await supabase
        .from('maintenance_execution_items')
        .update({
          checked,
          checked_at: checked ? new Date().toISOString() : null,
          notes: notes ?? null,
        })
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['execution-items'] });
      queryClient.invalidateQueries({ queryKey: ['active-executions'] });
    },
  });
}

export function useCompleteExecution() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      executionId,
      bikeId,
      planName,
      notes,
    }: {
      executionId: string;
      bikeId: string;
      planName: string;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get bike distance for the service record
      const { data: bike } = await supabase
        .from('bikes')
        .select('total_distance_km')
        .eq('id', bikeId)
        .single();

      // Create service record
      const { data: serviceRecord, error: srError } = await supabase
        .from('service_records')
        .insert({
          bike_id: bikeId,
          user_id: user.id,
          title: planName,
          performed_at: new Date().toISOString().split('T')[0],
          distance_at_service_km: bike?.total_distance_km ?? 0,
          notes: notes ?? null,
        })
        .select()
        .single();
      if (srError) throw srError;

      // Complete the execution
      const { error: execError } = await supabase
        .from('maintenance_executions')
        .update({
          completed_at: new Date().toISOString(),
          service_record_id: serviceRecord.id,
          notes: notes ?? null,
        })
        .eq('id', executionId);
      if (execError) throw execError;

      return serviceRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-executions'] });
      queryClient.invalidateQueries({ queryKey: ['active-executions'] });
      queryClient.invalidateQueries({ queryKey: ['service-records'] });
      queryClient.invalidateQueries({ queryKey: ['all-service-intervals'] });
    },
  });
}
