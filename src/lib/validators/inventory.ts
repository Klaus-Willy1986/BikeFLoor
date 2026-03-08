import { z } from 'zod/v4';

export const inventoryItemSchema = z.object({
  name: z.string().min(1).max(100),
  category_id: z.string().uuid().optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  quantity: z.number().int().min(1).max(999),
  purchased_at: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  suitable_bike_ids: z.array(z.string().uuid()).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
