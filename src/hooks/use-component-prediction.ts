'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getRecommendedMaxDistance } from '@/lib/wear-defaults';

export interface SmartInsight {
  type: 'history_average' | 'elevation_brake' | 'bike_type_recommendation' | 'riding_profile';
  message: string;
  value?: number;
}

export interface ComponentPrediction {
  avgLifespanKm: number | null;
  remainingKm: number | null;
  estimatedDate: Date | null;
  kmPerMonth: number | null;
  dataPoints: number;
  source: 'history' | 'max_distance' | 'bike_type_default';
  recommendedKm: number | null;
  insights: SmartInsight[];
  confidence: 'low' | 'medium' | 'high';
  ridingFactor: number | null;
  adjustedLifespanKm: number | null;
}

export function useComponentPrediction(
  componentId: string,
  categoryId: string | null,
  currentDistanceKm: number,
  maxDistanceKm: number | null,
  installedAt: string | null,
  bikeType?: string | null,
  categoryKey?: string | null
) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['component-prediction', componentId, categoryId, bikeType],
    queryFn: async (): Promise<ComponentPrediction> => {
      const insights: SmartInsight[] = [];

      // Bike-type recommendation
      const recommendedKm = getRecommendedMaxDistance(bikeType, categoryKey);
      if (recommendedKm) {
        insights.push({
          type: 'bike_type_recommendation',
          message: `bike_type_recommendation`,
          value: recommendedKm,
        });
      }

      // 1. Get historical lifespans for same category
      let avgLifespan: number | null = null;
      let dataPoints = 0;
      let source: 'history' | 'max_distance' | 'bike_type_default' = 'max_distance';

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

          // Add history insight
          insights.push({
            type: 'history_average',
            message: 'history_average',
            value: Math.round(avgLifespan),
          });
        }
      }

      // Fetch rides for elevation profile and riding factor
      let ridingFactor: number | null = null;
      let elevPerKm = 0;

      const { data: rides } = await supabase
        .from('rides')
        .select('distance_km, elevation_m')
        .not('elevation_m', 'is', null)
        .gt('distance_km', 0)
        .order('date', { ascending: false })
        .limit(50);

      if (rides && rides.length >= 5) {
        const totalDist = rides.reduce((s, r) => s + Number(r.distance_km), 0);
        const totalElev = rides.reduce((s, r) => s + Number(r.elevation_m ?? 0), 0);
        elevPerKm = totalDist > 0 ? totalElev / totalDist : 0;

        // Elevation brake insight (keep existing)
        if (categoryKey && ['brake_pads', 'brake_rotors'].includes(categoryKey) && elevPerKm > 15) {
          insights.push({
            type: 'elevation_brake',
            message: 'elevation_brake',
            value: Math.round(elevPerKm),
          });
        }

        // Category-specific riding profile wear factors
        if (categoryKey) {
          if (['brake_pads', 'brake_rotors'].includes(categoryKey)) {
            if (elevPerKm > 25) ridingFactor = 0.65;
            else if (elevPerKm > 15) ridingFactor = 0.80;
          } else if (['chain', 'cassette'].includes(categoryKey)) {
            if (elevPerKm > 15) ridingFactor = 0.90;
          } else if (categoryKey === 'tires_rear') {
            if (elevPerKm > 20) ridingFactor = 0.90;
          }

          if (ridingFactor !== null) {
            const reductionPercent = Math.round((1 - ridingFactor) * 100);
            insights.push({
              type: 'riding_profile',
              message: 'riding_profile',
              value: reductionPercent,
            });
          }
        }
      }

      // Fallback to max_distance_km, then bike_type_default
      if (avgLifespan === null && maxDistanceKm && maxDistanceKm > 0) {
        avgLifespan = maxDistanceKm;
        source = 'max_distance';
      }

      if (avgLifespan === null && recommendedKm) {
        avgLifespan = recommendedKm;
        source = 'bike_type_default';
      }

      // Confidence score
      const confidence: 'low' | 'medium' | 'high' =
        dataPoints >= 6 && source === 'history'
          ? 'high'
          : (dataPoints >= 3 && source === 'history') || source === 'max_distance'
            ? 'medium'
            : 'low';

      if (avgLifespan === null) {
        return {
          avgLifespanKm: null,
          remainingKm: null,
          estimatedDate: null,
          kmPerMonth: null,
          dataPoints,
          source,
          recommendedKm,
          insights,
          confidence,
          ridingFactor,
          adjustedLifespanKm: null,
        };
      }

      // Apply riding factor to lifespan
      const adjustedLifespanKm = ridingFactor !== null ? avgLifespan * ridingFactor : null;
      const effectiveLifespan = adjustedLifespanKm ?? avgLifespan;

      // 2. Calculate remaining km
      const remainingKm = Math.max(effectiveLifespan - currentDistanceKm, 0);

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
        recommendedKm,
        insights,
        confidence,
        ridingFactor,
        adjustedLifespanKm,
      };
    },
    enabled: !!componentId,
  });
}
