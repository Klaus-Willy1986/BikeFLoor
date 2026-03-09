import { z } from 'zod';

export const componentSchema = z.object({
  name: z.string().min(1).max(100),
  category_id: z.string().uuid().optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  max_distance_km: z.number().int().positive().optional().nullable(),
  rotation_threshold_km: z.number().int().positive().optional().nullable(),
  installed_at: z.string().min(1),
  notes: z.string().max(2000).optional().nullable(),
});

export type ComponentFormData = z.infer<typeof componentSchema>;

export const swapSchema = z.object({
  to_bike_id: z.string().uuid(),
  notes: z.string().max(500).optional().nullable(),
});

export type SwapFormData = z.infer<typeof swapSchema>;

export const rotateSchema = z.object({
  ready_component_id: z.string().uuid(),
  notes: z.string().max(500).optional().nullable(),
});

export type RotateFormData = z.infer<typeof rotateSchema>;
