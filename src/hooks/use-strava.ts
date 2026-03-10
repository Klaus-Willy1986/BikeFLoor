'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useStravaConnection() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['strava-connection'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strava_connections')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useDisconnectStrava() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete all Strava-imported rides
      const { error: ridesError } = await supabase
        .from('rides')
        .delete()
        .eq('user_id', user.id)
        .eq('source', 'strava');
      if (ridesError) throw ridesError;

      // Clear strava_gear_id from all bikes
      const { error: bikesError } = await (supabase as any)
        .from('bikes')
        .update({ strava_gear_id: null })
        .eq('user_id', user.id)
        .not('strava_gear_id', 'is', null);
      if (bikesError) throw bikesError;

      // Delete strava connection
      const { error } = await supabase
        .from('strava_connections')
        .delete()
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strava-connection'] });
      queryClient.invalidateQueries({ queryKey: ['strava-gear'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}

export function useSyncStrava() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/strava/sync', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Sync failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strava-connection'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}

export interface StravaGearBike {
  id: string;
  name: string;
  distance_km: number;
}

export interface LocalBikeMapping {
  id: string;
  name: string;
  strava_gear_id: string | null;
}

export function useStravaGear(enabled = true) {
  return useQuery({
    queryKey: ['strava-gear'],
    queryFn: async () => {
      const res = await fetch('/api/strava/gear');
      if (!res.ok) throw new Error('Failed to fetch gear');
      return res.json() as Promise<{
        stravaBikes: StravaGearBike[];
        localBikes: LocalBikeMapping[];
      }>;
    },
    enabled,
  });
}

export function useMapStravaGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bikeId,
      stravaGearId,
    }: {
      bikeId: string;
      stravaGearId: string | null;
    }) => {
      const res = await fetch('/api/strava/gear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bikeId, stravaGearId }),
      });
      if (!res.ok) throw new Error('Failed to map gear');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strava-gear'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}

export function useImportStravaBike() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stravaBike: StravaGearBike) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await (supabase as any)
        .from('bikes')
        .insert({
          user_id: user.id,
          name: stravaBike.name,
          type: 'road',
          total_distance_km: stravaBike.distance_km,
          distance_offset_km: stravaBike.distance_km,
          strava_gear_id: stravaBike.id,
        })
        .select('id')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
      queryClient.invalidateQueries({ queryKey: ['strava-gear'] });
    },
  });
}
