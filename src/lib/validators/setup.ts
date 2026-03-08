import { z } from 'zod';

const optionalNumber = z.number().optional().nullable();
const optionalInt = z.number().int().optional().nullable();

export const bikeSetupSchema = z.object({
  // Tire pressure
  tire_pressure_front: optionalNumber,
  tire_pressure_rear: optionalNumber,
  tire_width_front: optionalNumber,
  tire_width_rear: optionalNumber,
  tire_type: z.string().max(50).optional().nullable(),
  // Fork
  fork_pressure: optionalNumber,
  fork_rebound: optionalInt,
  fork_compression: optionalInt,
  fork_sag_percent: optionalNumber,
  fork_travel_mm: optionalInt,
  // Shock
  shock_pressure: optionalNumber,
  shock_rebound: optionalInt,
  shock_compression: optionalInt,
  shock_sag_percent: optionalNumber,
  shock_travel_mm: optionalInt,
  // Bike Fit
  seat_height_mm: optionalNumber,
  stem_length_mm: optionalNumber,
  stem_angle: optionalNumber,
  handlebar_width_mm: optionalNumber,
  crank_length_mm: optionalNumber,
  stack_mm: optionalNumber,
  reach_mm: optionalNumber,
  notes: z.string().max(2000).optional().nullable(),
});

export type BikeSetupFormData = z.infer<typeof bikeSetupSchema>;
