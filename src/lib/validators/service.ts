import { z } from 'zod';
import { SERVICE_INTERVAL_TYPES } from '@/lib/constants';

export const serviceIntervalSchema = z.object({
  name: z.string().min(1).max(100),
  interval_type: z.enum(SERVICE_INTERVAL_TYPES),
  interval_value: z.number().int().positive(),
  last_performed_km_ago: z.number().min(0).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type ServiceIntervalFormData = z.infer<typeof serviceIntervalSchema>;

export const serviceRecordSchema = z.object({
  title: z.string().min(1).max(200),
  performed_at: z.string().min(1),
  service_interval_id: z.string().uuid().optional().nullable(),
  distance_at_service_km: z.number().min(0).optional().nullable(),
  cost: z.number().min(0).optional().nullable(),
  consumables: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type ServiceRecordFormData = z.infer<typeof serviceRecordSchema>;
