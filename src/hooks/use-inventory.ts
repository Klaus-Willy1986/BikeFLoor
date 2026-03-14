'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { InventoryItemFormData } from '@/lib/validators/inventory';
import { getRecommendedMaxDistance } from '@/lib/wear-defaults';

export function useInventory() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('inventory_items')
        .select('*, component_categories(key)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });
}

export function useCreateInventoryItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InventoryItemFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: item, error } = await (supabase as any)
        .from('inventory_items')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInventoryItem(itemId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InventoryItemFormData) => {
      const { data: item, error } = await (supabase as any)
        .from('inventory_items')
        .update(data)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useDeleteInventoryItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await (supabase as any)
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useMoveToInventory() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (component: {
      id: string;
      bike_id: string;
      name: string;
      brand: string | null;
      model: string | null;
      category_id: string | null;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get bike distance for history
      const { data: bike } = await supabase
        .from('bikes')
        .select('total_distance_km')
        .eq('id', component.bike_id)
        .single();

      const bikeDistance = bike?.total_distance_km ?? 0;

      // Create inventory item from component (no category — chosen at install time)
      const { error: invError } = await (supabase as any)
        .from('inventory_items')
        .insert({
          user_id: user.id,
          name: component.name,
          brand: component.brand,
          model: component.model,
          category_id: null,
          quantity: 1,
          suitable_bike_ids: [component.bike_id],
        });

      if (invError) throw invError;

      // Log removal in history
      await supabase.from('component_history').insert({
        component_id: component.id,
        from_bike_id: component.bike_id,
        action: 'removed',
        distance_at_action_km: bikeDistance,
        notes: 'Moved to inventory',
      });

      // Delete the component
      const { error: delError } = await supabase
        .from('components')
        .delete()
        .eq('id', component.id);

      if (delError) throw delError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });
}

export function useInstallFromInventory() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      inventoryItem,
      bikeId,
    }: {
      inventoryItem: {
        id: string;
        name: string;
        brand: string | null;
        model: string | null;
        category_id: string | null;
        quantity: number;
      };
      bikeId: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get bike's current distance + type for wear defaults
      const { data: bike } = await supabase
        .from('bikes')
        .select('total_distance_km, type')
        .eq('id', bikeId)
        .single();

      const today = new Date().toISOString().split('T')[0];
      const bikeDistance = bike?.total_distance_km ?? 0;

      // Look up category key for wear default
      let maxDistanceKm: number | null = null;
      if (inventoryItem.category_id && bike?.type) {
        const { data: cat } = await (supabase as any)
          .from('component_categories')
          .select('key')
          .eq('id', inventoryItem.category_id)
          .single();
        if (cat?.key) {
          maxDistanceKm = getRecommendedMaxDistance(bike.type, cat.key);
        }
      }

      // Create component on bike
      const { data: component, error: compError } = await supabase
        .from('components')
        .insert({
          bike_id: bikeId,
          user_id: user.id,
          name: inventoryItem.name,
          brand: inventoryItem.brand,
          model: inventoryItem.model,
          category_id: inventoryItem.category_id,
          distance_at_install_km: bikeDistance,
          current_distance_km: 0,
          installed_at: today,
          ...(maxDistanceKm ? { max_distance_km: maxDistanceKm } : {}),
        })
        .select()
        .single();

      if (compError) throw compError;

      // Log installation in history
      await supabase.from('component_history').insert({
        component_id: component.id,
        to_bike_id: bikeId,
        action: 'installed',
        distance_at_action_km: bikeDistance,
        notes: 'Installed from inventory',
      });

      // Reduce inventory quantity or delete
      if (inventoryItem.quantity <= 1) {
        await (supabase as any)
          .from('inventory_items')
          .delete()
          .eq('id', inventoryItem.id);
      } else {
        await (supabase as any)
          .from('inventory_items')
          .update({ quantity: inventoryItem.quantity - 1 })
          .eq('id', inventoryItem.id);
      }

      return component;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });
}
