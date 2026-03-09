export type BikeType = 'road' | 'mtb' | 'gravel' | 'city' | 'ebike' | 'other';

export type ComponentCategoryKey =
  | 'chain'
  | 'cassette'
  | 'brake_pads'
  | 'brake_rotors'
  | 'tires_front'
  | 'tires_rear'
  | 'handlebar_tape'
  | 'cables'
  | 'bottom_bracket'
  | 'headset'
  | 'wheels_front'
  | 'wheels_rear'
  | 'fork'
  | 'shock'
  | 'dropper_post'
  | 'pedals'
  | 'saddle'
  | 'other';

export type ServiceIntervalType = 'distance' | 'hours' | 'days';

export type ServiceStatus = 'ok' | 'due_soon' | 'overdue';

export type WearStatus = 'good' | 'warning' | 'critical' | 'overdue';

export type DocumentType = 'invoice' | 'receipt' | 'warranty' | 'manual' | 'other';

export type RideSource = 'manual' | 'strava';

export type RotationStatus = 'mounted' | 'ready' | 'needs_maintenance';

export type ComponentAction = 'installed' | 'removed' | 'swapped' | 'rotated_out' | 'rotated_in' | 'marked_ready';

export interface WearInfo {
  percentage: number;
  status: WearStatus;
  remainingKm: number | null;
}
