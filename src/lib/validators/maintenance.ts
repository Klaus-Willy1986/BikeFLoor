import { z } from 'zod';

export const maintenancePlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  bike_type: z.string().optional().nullable(),
  service_interval_id: z.string().uuid().optional().nullable(),
});

export type MaintenancePlanFormData = z.infer<typeof maintenancePlanSchema>;

export const maintenancePlanItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  sort_order: z.number().int().min(0).optional(),
  is_required: z.boolean().optional(),
});

export type MaintenancePlanItemFormData = z.infer<typeof maintenancePlanItemSchema>;
