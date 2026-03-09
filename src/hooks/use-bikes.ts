'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { BikeFormData } from '@/lib/validators/bike';

export function useBikes() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['bikes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useBike(bikeId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['bikes', bikeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .eq('id', bikeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bikeId,
  });
}

export function useCreateBike() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BikeFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: bike, error } = await supabase
        .from('bikes')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return bike;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}

export function useUpdateBike(bikeId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BikeFormData) => {
      const { data: bike, error } = await supabase
        .from('bikes')
        .update(data)
        .eq('id', bikeId)
        .select()
        .single();

      if (error) throw error;
      return bike;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}

export function useUploadBikePhoto(bikeId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${user.id}/${bikeId}/photo.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('bike-photos')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('bike-photos')
        .getPublicUrl(path);

      // Update bike record
      const { error: updateError } = await supabase
        .from('bikes')
        .update({ photo_url: urlData.publicUrl })
        .eq('id', bikeId);

      if (updateError) throw updateError;

      return urlData.publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes', bikeId] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}

export function useDeleteBike() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bikeId: string) => {
      const { error } = await supabase.from('bikes').delete().eq('id', bikeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}
