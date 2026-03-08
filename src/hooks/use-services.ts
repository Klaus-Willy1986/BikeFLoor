'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { ServiceIntervalFormData, ServiceRecordFormData } from '@/lib/validators/service';

export function useServiceIntervals(bikeId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['service-intervals', bikeId],
    queryFn: async () => {
      let query = supabase
        .from('service_intervals')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (bikeId) {
        query = query.eq('bike_id', bikeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useServiceRecords(bikeId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['service-records', bikeId],
    queryFn: async () => {
      let query = supabase
        .from('service_records')
        .select('*, service_intervals(name)')
        .order('performed_at', { ascending: false });

      if (bikeId) {
        query = query.eq('bike_id', bikeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateServiceInterval(bikeId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServiceIntervalFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { last_performed_km_ago, ...intervalData } = data;

      // Calculate last_performed_distance_km from "X km ago"
      let last_performed_distance_km: number | null = null;
      let last_performed_at: string | null = null;

      if (last_performed_km_ago != null && last_performed_km_ago >= 0) {
        const { data: bike } = await supabase
          .from('bikes')
          .select('total_distance_km')
          .eq('id', bikeId)
          .single();

        if (bike) {
          last_performed_distance_km = Math.max(0, bike.total_distance_km - last_performed_km_ago);
          last_performed_at = new Date().toISOString();
        }
      }

      const { data: interval, error } = await (supabase as any)
        .from('service_intervals')
        .insert({
          ...intervalData,
          bike_id: bikeId,
          user_id: user.id,
          last_performed_distance_km,
          last_performed_at,
        })
        .select()
        .single();

      if (error) throw error;
      return interval;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-intervals', bikeId] });
    },
  });
}

export function useCreateServiceRecord(bikeId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServiceRecordFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use custom km or fall back to bike's current distance
      let distanceAtService = data.distance_at_service_km;
      if (distanceAtService == null) {
        const { data: bike } = await supabase
          .from('bikes')
          .select('total_distance_km')
          .eq('id', bikeId)
          .single();
        distanceAtService = bike?.total_distance_km ?? 0;
      }

      const { distance_at_service_km: _, ...rest } = data;

      const { data: record, error } = await supabase
        .from('service_records')
        .insert({
          ...rest,
          bike_id: bikeId,
          user_id: user.id,
          distance_at_service_km: distanceAtService,
        })
        .select()
        .single();

      if (error) throw error;

      // Update service interval if linked
      if (data.service_interval_id) {
        await supabase
          .from('service_intervals')
          .update({
            last_performed_at: data.performed_at,
            last_performed_distance_km: distanceAtService,
          })
          .eq('id', data.service_interval_id);
      }

      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-records', bikeId] });
      queryClient.invalidateQueries({ queryKey: ['service-intervals', bikeId] });
    },
  });
}

export function useDeleteServiceInterval() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intervalId: string) => {
      const { error } = await supabase
        .from('service_intervals')
        .delete()
        .eq('id', intervalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-intervals'] });
    },
  });
}
