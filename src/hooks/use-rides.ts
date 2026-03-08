'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useRides(bikeId?: string, limit?: number) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['rides', bikeId, limit],
    queryFn: async () => {
      let query = supabase
        .from('rides')
        .select('*, bikes(name)')
        .order('date', { ascending: false });

      if (bikeId) {
        query = query.eq('bike_id', bikeId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateRide() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      bike_id: string;
      title?: string;
      distance_km: number;
      duration_seconds?: number;
      elevation_m?: number;
      date: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: ride, error } = await supabase
        .from('rides')
        .insert({ ...data, user_id: user.id, source: 'manual' })
        .select()
        .single();

      if (error) throw error;
      return ride;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}
