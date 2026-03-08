import { z } from 'zod/v4';

export const shopSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  website: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type ShopFormData = z.infer<typeof shopSchema>;
