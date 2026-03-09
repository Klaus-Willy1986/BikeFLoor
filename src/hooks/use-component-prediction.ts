'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface ComponentPrediction {
  avgLifespanKm: number | null;
  remainingKm: number | null;
  estimatedDate: Date | null;
  kmPerMonth: number | null;
  dataPoints: number;
  source: 'history' | 'max_distance';
}

export function useComponentPrediction(
  componentId: string,
  categoryId: string | null,
  currentDistanceKm: number,
  maxDistanceKm: number | null,
  installedAt: string | null
) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['component-prediction', componentId, categoryId],
    queryFn: async (): Promise<ComponentPrediction> => {
      // 1. Get historical lifespans for same category
      let avgLifespan: number | null = null;
      let dataPoints = 0;
      let source: 'history' | 'max_distance' = 'max_distance';

      if (categoryId) {
        // Find all components with the same category that were removed/swapped
        const { data: historicalComponents } = await supabase
          .from('components')
          .select('id, current_distance_km, distance_at_install_km')
          .eq('category_id', categoryId)
          .eq('is_active', false);

        // Also check active components' history for swap events
        const { data: swapHistory } = await supabase
          .from('component_history')
          .select('component_id, distance_at_action_km, action')
          .in('action', ['removed', 'swapped'])
          .not('component_id', 'eq', componentId);

        // Get install distances for those components
        const { data: installHistory } = await supabase
          .from('component_history')
          .select('component_id, distance_at_action_km')
          .eq('action', 'installed');

        const installMap = new Map<string, number>();
        if (installHistory) {
          for (const h of installHistory) {
            // Take the first (oldest) install distance per component
            if (!installMap.has(h.component_id)) {
              installMap.set(h.component_id, h.distance_at_action_km ?? 0);
            }
          }
        }

        const lifespans: number[] = [];

        // From inactive components
        if (historicalComponents) {
          for (const comp of historicalComponents) {
            const lifespan = Number(comp.current_distance_km);
            if (lifespan > 0) {
              lifespans.push(lifespan);
            }
          }
        }

        // From swap/remove history
        if (swapHistory) {
          for (const event of swapHistory) {
            const installDist = installMap.get(event.component_id);
            if (installDist !== undefined && event.distance_at_action_km) {
              const lifespan = event.distance_at_action_km - installDist;
              if (lifespan > 0) {
                lifespans.push(lifespan);
              }
            }
          }
        }

        dataPoints = lifespans.length;

        // Need at least 3 data points for a reliable average
        if (dataPoints >= 3) {
          avgLifespan = lifespans.reduce((a, b) => a + b, 0) / dataPoints;
          source = 'history';
        }
      }

      // Fallback to max_distance_km
      if (avgLifespan === null && maxDistanceKm && maxDistanceKm > 0) {
        avgLifespan = maxDistanceKm;
        source = 'max_distance';
      }

      if (avgLifespan === null) {
        return {
          avgLifespanKm: null,
          remainingKm: null,
          estimatedDate: null,
          kmPerMonth: null,
          dataPoints,
          source,
        };
      }

      // 2. Calculate remaining km
      const remainingKm = Math.max(avgLifespan - currentDistanceKm, 0);

      // 3. Estimate date based on km/month rate
      let estimatedDate: Date | null = null;
      let kmPerMonth: number | null = null;

      if (installedAt && currentDistanceKm > 0) {
        const installDate = new Date(installedAt);
        const now = new Date();
        const monthsSinceInstall =
          (now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

        if (monthsSinceInstall > 0.5) {
          kmPerMonth = currentDistanceKm / monthsSinceInstall;
          if (kmPerMonth > 0 && remainingKm > 0) {
            const monthsRemaining = remainingKm / kmPerMonth;
            estimatedDate = new Date(
              now.getTime() + monthsRemaining * 30.44 * 24 * 60 * 60 * 1000
            );
          }
        }
      }

      return {
        avgLifespanKm: avgLifespan,
        remainingKm,
        estimatedDate,
        kmPerMonth,
        dataPoints,
        source,
      };
    },
    enabled: !!componentId,
  });
}
