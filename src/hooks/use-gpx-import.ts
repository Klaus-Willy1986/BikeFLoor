'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { ParsedTrack } from '@/lib/gpx-parser';
import { downsampleTrack } from '@/lib/gpx-parser';

interface ImportInput {
  track: ParsedTrack;
  file: File;
  title: string;
  bikeId: string | null;
}

export function useImportGpxRide() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ImportInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Upload original file to storage
      const timestamp = Date.now();
      const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${user.id}/imports/${timestamp}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('gpx-files')
        .upload(storagePath, input.file);

      if (uploadError) throw uploadError;

      // 2. Insert ride
      const { data: ride, error: rideError } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          bike_id: input.bikeId,
          title: input.title || input.track.title,
          distance_km: input.track.distance_km,
          duration_seconds: input.track.duration_seconds,
          elevation_m: input.track.elevation_m,
          date: input.track.date,
          source: input.track.source,
          average_speed_kmh: input.track.average_speed_kmh,
          file_path: storagePath,
        })
        .select()
        .single();

      if (rideError) throw rideError;

      // 3. Insert downsampled track
      const downsampled = downsampleTrack(input.track.geojson);
      const { error: trackError } = await supabase
        .from('ride_tracks')
        .insert({
          ride_id: ride.id,
          user_id: user.id,
          track_geojson: downsampled as unknown as Record<string, unknown>,
          bounds_ne_lat: input.track.bounds.ne.lat,
          bounds_ne_lng: input.track.bounds.ne.lng,
          bounds_sw_lat: input.track.bounds.sw.lat,
          bounds_sw_lng: input.track.bounds.sw.lng,
          point_count: input.track.pointCount,
        });

      if (trackError) throw trackError;

      return ride;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}

export function useRideTrack(rideId: string | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['ride_track', rideId],
    enabled: !!rideId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ride_tracks')
        .select('*')
        .eq('ride_id', rideId!)
        .single();

      if (error) throw error;
      return data;
    },
  });
}
