import { z } from 'zod';
import { BIKE_TYPES } from '@/lib/constants';

export const bikeSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(BIKE_TYPES),
  manufacturer: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  weight_kg: z.number().positive().max(50).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  shop_id: z.string().uuid().optional().nullable(),
});

export type BikeFormData = z.infer<typeof bikeSchema>;
