'use client';

import { useQuery } from '@tanstack/react-query';

interface UseComponentSuggestionsOptions {
  brand?: string;
  categoryKey?: string;
  enabled?: boolean;
}

export function useComponentSuggestions({
  brand,
  enabled = true,
}: UseComponentSuggestionsOptions = {}) {
  return useQuery<string[]>({
    queryKey: ['component-suggestions', brand ?? null],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (brand) params.set('brand', brand);
      const res = await fetch(`/api/components/suggestions?${params}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
