'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { BIKE_SHOPS, type BikeShop } from '@/lib/shops';
import type { ShopFormData } from '@/lib/validators/shop';

// ─── Price comparison shops (localStorage) ────────────────
const STORAGE_KEY = 'bikefloor-shops';

function loadShops(): BikeShop[] {
  if (typeof window === 'undefined') return BIKE_SHOPS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : BIKE_SHOPS;
  } catch {
    return BIKE_SHOPS;
  }
}

function saveShops(shops: BikeShop[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
}

export function useShops() {
  const [shops, setShops] = useState<BikeShop[]>(loadShops);

  const addShop = useCallback((shop: BikeShop) => {
    setShops((prev) => {
      const next = [...prev, shop];
      saveShops(next);
      return next;
    });
  }, []);

  const removeShop = useCallback((id: string) => {
    setShops((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveShops(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setShops(BIKE_SHOPS);
    saveShops(BIKE_SHOPS);
  }, []);

  return { shops, addShop, removeShop, resetToDefaults };
}

// ─── DB-based workshops (Supabase) ────────────────────────

export function useWorkshops() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('shops')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as any[];
    },
  });
}

export function useCreateShop() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShopFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: shop, error } = await (supabase as any)
        .from('shops')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
  });
}

export function useUpdateShop(shopId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShopFormData) => {
      const { data: shop, error } = await (supabase as any)
        .from('shops')
        .update(data)
        .eq('id', shopId)
        .select()
        .single();

      if (error) throw error;
      return shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
  });
}

export function useDeleteShop() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shopId: string) => {
      const { error } = await (supabase as any)
        .from('shops')
        .delete()
        .eq('id', shopId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
}
