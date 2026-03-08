export const BIKE_TYPES = ['road', 'mtb', 'gravel', 'city', 'ebike', 'other'] as const;

export const COMPONENT_CATEGORIES = [
  'chain', 'cassette', 'brake_pads', 'brake_rotors',
  'tires_front', 'tires_rear', 'handlebar_tape', 'cables',
  'bottom_bracket', 'headset', 'wheels_front', 'wheels_rear',
  'fork', 'shock', 'dropper_post', 'pedals', 'saddle', 'other',
] as const;

export const SERVICE_INTERVAL_TYPES = ['distance', 'hours', 'days'] as const;

export const DOCUMENT_TYPES = ['invoice', 'receipt', 'warranty', 'manual', 'other'] as const;

export const WEAR_THRESHOLDS = {
  good: 0.6,
  warning: 0.85,
  critical: 1.0,
} as const;

export const MAX_FILE_SIZES = {
  bikePhoto: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024,  // 10MB
} as const;
