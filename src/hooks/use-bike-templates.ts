'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CatalogBike, CatalogComponent } from '@/lib/bike-catalog';

export interface BikeTemplateResult extends CatalogBike {
  contributor_count: number;
  is_verified: boolean;
}

export function useBikeTemplateSearch(query: string, limit = 8) {
  const [results, setResults] = useState<BikeTemplateResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Build ilike pattern for each search term
        const terms = trimmed.split(/\s+/);
        let queryBuilder = supabase
          .from('bike_templates')
          .select('*');

        // Each term must match manufacturer OR model
        for (const term of terms) {
          const pattern = `%${term}%`;
          queryBuilder = queryBuilder.or(
            `manufacturer.ilike.${pattern},model.ilike.${pattern}`
          );
        }

        const { data, error } = await queryBuilder
          .order('is_verified', { ascending: false })
          .order('contributor_count', { ascending: false })
          .limit(limit);

        if (error || cancelled) return;

        setResults(
          (data || []).map((row) => ({
            manufacturer: row.manufacturer,
            model: row.model,
            type: row.type as CatalogBike['type'],
            year: row.year ?? undefined,
            weight_kg: row.weight_kg ? Number(row.weight_kg) : undefined,
            imageUrl: row.image_url ?? undefined,
            components: Array.isArray(row.components)
              ? (row.components as unknown as CatalogComponent[])
              : [],
            contributor_count: row.contributor_count,
            is_verified: row.is_verified,
          }))
        );
      } catch {
        // ignore
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 200); // 200ms debounce

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, limit]);

  return { results, isLoading };
}
