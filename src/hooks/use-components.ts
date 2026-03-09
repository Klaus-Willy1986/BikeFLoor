'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { ComponentFormData, SwapFormData } from '@/lib/validators/component';

export function useComponents(bikeId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['components', bikeId],
    queryFn: async () => {
      let query = supabase
        .from('components')
        .select('*, component_categories(key, default_max_distance_km)')
        .order('created_at', { ascending: false });

      if (bikeId) {
        // Load ALL components for bike view (mounted + pool)
        query = query.eq('bike_id', bikeId);
      } else {
        // Global page: only active/mounted
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useComponentCategories() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['component-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });
}

export function useCreateComponent(bikeId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ComponentFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get bike's current distance for install tracking
      const { data: bike } = await supabase
        .from('bikes')
        .select('total_distance_km')
        .eq('id', bikeId)
        .single();

      let distanceAtInstall = bike?.total_distance_km ?? 0;

      // If installed in the past, calculate distance driven since then
      // by summing rides after the install date
      if (data.installed_at) {
        const today = new Date().toISOString().split('T')[0];
        if (data.installed_at < today) {
          const { data: ridesSince } = await supabase
            .from('rides')
            .select('distance_km')
            .eq('bike_id', bikeId)
            .eq('is_indoor', false)
            .gt('date', data.installed_at);

          if (ridesSince && ridesSince.length > 0) {
            const kmSinceInstall = ridesSince.reduce(
              (sum, r) => sum + Number(r.distance_km),
              0
            );
            distanceAtInstall = Math.max(0, distanceAtInstall - kmSinceInstall);
          }
        }
      }

      const bikeDistance = bike?.total_distance_km ?? 0;
      const currentWear = Math.max(bikeDistance - distanceAtInstall, 0);

      const { data: component, error } = await supabase
        .from('components')
        .insert({
          ...data,
          bike_id: bikeId,
          user_id: user.id,
          distance_at_install_km: distanceAtInstall,
          current_distance_km: currentWear,
        })
        .select()
        .single();

      if (error) throw error;

      // Log installation in history
      await supabase.from('component_history').insert({
        component_id: component.id,
        to_bike_id: bikeId,
        action: 'installed',
        distance_at_action_km: distanceAtInstall,
      });

      return component;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components', bikeId] });
    },
  });
}

export function useCreateBulkComponents(bikeId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      components: {
        name: string;
        category_key: string;
        max_distance_km?: number;
        brand?: string;
        model?: string;
      }[]
    ) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get bike's current distance
      const { data: bike } = await supabase
        .from('bikes')
        .select('total_distance_km')
        .eq('id', bikeId)
        .single();

      // Get category IDs by key
      const { data: categories } = await supabase
        .from('component_categories')
        .select('id, key');

      if (!categories) throw new Error('No categories found');

      const catMap = new Map(categories.map((c) => [c.key, c.id]));
      const today = new Date().toISOString().split('T')[0];

      const inserts = components.map((comp) => ({
        bike_id: bikeId,
        user_id: user.id,
        category_id: catMap.get(comp.category_key) ?? null,
        name: comp.name,
        brand: comp.brand ?? null,
        model: comp.model ?? null,
        max_distance_km: comp.max_distance_km ?? null,
        distance_at_install_km: bike?.total_distance_km ?? 0,
        installed_at: today,
      }));

      const { data: created, error } = await supabase
        .from('components')
        .insert(inserts)
        .select();

      if (error) throw error;

      // Log installations in history
      if (created) {
        await supabase.from('component_history').insert(
          created.map((c) => ({
            component_id: c.id,
            to_bike_id: bikeId,
            action: 'installed',
            distance_at_action_km: bike?.total_distance_km ?? 0,
          }))
        );
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components', bikeId] });
    },
  });
}

export function useSwapComponent() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      componentId,
      fromBikeId,
      data,
    }: {
      componentId: string;
      fromBikeId: string;
      data: SwapFormData;
    }) => {
      // Get target bike distance
      const { data: targetBike } = await supabase
        .from('bikes')
        .select('total_distance_km')
        .eq('id', data.to_bike_id)
        .single();

      // Update component to new bike
      const { error } = await supabase
        .from('components')
        .update({
          bike_id: data.to_bike_id,
          distance_at_install_km: targetBike?.total_distance_km ?? 0,
          current_distance_km: 0,
        })
        .eq('id', componentId);

      if (error) throw error;

      // Log swap in history
      await supabase.from('component_history').insert({
        component_id: componentId,
        from_bike_id: fromBikeId,
        to_bike_id: data.to_bike_id,
        action: 'swapped',
        distance_at_action_km: targetBike?.total_distance_km ?? 0,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });
}

export function useUpdateComponent() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      componentId,
      bikeId,
      data,
    }: {
      componentId: string;
      bikeId: string;
      data: Partial<ComponentFormData> & { current_distance_km?: number };
    }) => {
      const updates: Record<string, unknown> = {};
      if (data.name !== undefined) updates.name = data.name;
      if (data.brand !== undefined) updates.brand = data.brand;
      if (data.model !== undefined) updates.model = data.model;
      if (data.max_distance_km !== undefined) updates.max_distance_km = data.max_distance_km;
      if (data.rotation_threshold_km !== undefined) updates.rotation_threshold_km = data.rotation_threshold_km;
      if (data.notes !== undefined) updates.notes = data.notes;

      // If current_distance_km changed, recalculate distance_at_install_km
      if (data.current_distance_km !== undefined) {
        const { data: bike } = await supabase
          .from('bikes')
          .select('total_distance_km')
          .eq('id', bikeId)
          .single();

        const bikeKm = Number(bike?.total_distance_km ?? 0);
        updates.distance_at_install_km = Math.max(bikeKm - data.current_distance_km, 0);
        updates.current_distance_km = data.current_distance_km;
      }

      const { error } = await supabase
        .from('components')
        .update(updates)
        .eq('id', componentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });
}

export function useDeleteComponent() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (componentId: string) => {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', componentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });
}

export function useRotateComponent() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mountedComponentId,
      readyComponentId,
      bikeId,
      notes,
    }: {
      mountedComponentId: string;
      readyComponentId: string;
      bikeId: string;
      notes?: string | null;
    }) => {
      // Get bike's current distance
      const { data: bike } = await supabase
        .from('bikes')
        .select('total_distance_km')
        .eq('id', bikeId)
        .single();

      const bikeDistance = bike?.total_distance_km ?? 0;

      // 1. Rotate out: mounted → needs_maintenance
      const { error: outError } = await supabase
        .from('components')
        .update({
          is_active: false,
          rotation_status: 'needs_maintenance',
        })
        .eq('id', mountedComponentId);

      if (outError) throw outError;

      // 2. Rotate in: ready → mounted
      const { error: inError } = await supabase
        .from('components')
        .update({
          is_active: true,
          rotation_status: 'mounted',
          distance_at_install_km: bikeDistance,
          current_distance_km: 0,
        })
        .eq('id', readyComponentId);

      if (inError) throw inError;

      // 3. History entries
      await supabase.from('component_history').insert([
        {
          component_id: mountedComponentId,
          from_bike_id: bikeId,
          action: 'rotated_out',
          distance_at_action_km: bikeDistance,
          notes,
        },
        {
          component_id: readyComponentId,
          to_bike_id: bikeId,
          action: 'rotated_in',
          distance_at_action_km: bikeDistance,
          notes,
        },
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
      queryClient.invalidateQueries({ queryKey: ['component-history'] });
    },
  });
}

export function useMarkReady() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (componentId: string) => {
      const { error } = await supabase
        .from('components')
        .update({ rotation_status: 'ready' })
        .eq('id', componentId);

      if (error) throw error;

      // History entry
      await supabase.from('component_history').insert({
        component_id: componentId,
        action: 'marked_ready',
        distance_at_action_km: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
      queryClient.invalidateQueries({ queryKey: ['component-history'] });
    },
  });
}

export function useComponentHistory(componentId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['component-history', componentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_history')
        .select('*, from_bike:bikes!component_history_from_bike_id_fkey(name), to_bike:bikes!component_history_to_bike_id_fkey(name)')
        .eq('component_id', componentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!componentId,
  });
}
