'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useBikeSetup(bikeId: string | null | undefined) {
  const supabase = createClient();
  return useQuery({
    queryKey: ['bike-setup', bikeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bike_setup')
        .select('*')
        .eq('bike_id', bikeId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!bikeId,
  });
}
