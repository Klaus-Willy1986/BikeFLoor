export interface CatalogComponent {
  category_key: string;
  name: string;
  brand?: string;
  model?: string;
  max_distance_km?: number;
}

export interface CatalogBike {
  manufacturer: string;
  model: string;
  type: 'road' | 'mtb' | 'gravel' | 'city' | 'ebike' | 'other';
  year?: number;
  weight_kg?: number;
  imageUrl?: string;
  components?: CatalogComponent[];
}

// ─── Default components per bike type ───────────────────
// category_key must match component_categories.key in DB
export interface ComponentTemplate {
  category_key: string;
  name: string;
  max_distance_km?: number;
}

export const DEFAULT_COMPONENTS: Record<string, ComponentTemplate[]> = {
  road: [
    { category_key: 'chain', name: 'Kette', max_distance_km: 5000 },
    { category_key: 'cassette', name: 'Kassette', max_distance_km: 10000 },
    { category_key: 'brake_pads', name: 'Bremsbeläge', max_distance_km: 3000 },
    { category_key: 'tires_front', name: 'Vorderreifen', max_distance_km: 5000 },
    { category_key: 'tires_rear', name: 'Hinterreifen', max_distance_km: 4000 },
    { category_key: 'handlebar_tape', name: 'Lenkerband', max_distance_km: 5000 },
    { category_key: 'cables', name: 'Züge & Hüllen', max_distance_km: 10000 },
    { category_key: 'bottom_bracket', name: 'Tretlager', max_distance_km: 20000 },
  ],
  mtb: [
    { category_key: 'chain', name: 'Kette', max_distance_km: 3000 },
    { category_key: 'cassette', name: 'Kassette', max_distance_km: 8000 },
    { category_key: 'brake_pads', name: 'Bremsbeläge', max_distance_km: 2000 },
    { category_key: 'brake_rotors', name: 'Bremsscheiben', max_distance_km: 15000 },
    { category_key: 'tires_front', name: 'Vorderreifen', max_distance_km: 4000 },
    { category_key: 'tires_rear', name: 'Hinterreifen', max_distance_km: 3000 },
    { category_key: 'fork', name: 'Gabel (Service)', max_distance_km: 5000 },
    { category_key: 'shock', name: 'Dämpfer (Service)', max_distance_km: 5000 },
    { category_key: 'dropper_post', name: 'Sattelstütze (Service)', max_distance_km: 10000 },
    { category_key: 'bottom_bracket', name: 'Tretlager', max_distance_km: 15000 },
  ],
  gravel: [
    { category_key: 'chain', name: 'Kette', max_distance_km: 4000 },
    { category_key: 'cassette', name: 'Kassette', max_distance_km: 10000 },
    { category_key: 'brake_pads', name: 'Bremsbeläge', max_distance_km: 2500 },
    { category_key: 'brake_rotors', name: 'Bremsscheiben', max_distance_km: 15000 },
    { category_key: 'tires_front', name: 'Vorderreifen', max_distance_km: 5000 },
    { category_key: 'tires_rear', name: 'Hinterreifen', max_distance_km: 4000 },
    { category_key: 'handlebar_tape', name: 'Lenkerband', max_distance_km: 5000 },
    { category_key: 'cables', name: 'Züge & Hüllen', max_distance_km: 10000 },
    { category_key: 'bottom_bracket', name: 'Tretlager', max_distance_km: 20000 },
  ],
  city: [
    { category_key: 'chain', name: 'Kette', max_distance_km: 5000 },
    { category_key: 'brake_pads', name: 'Bremsbeläge', max_distance_km: 5000 },
    { category_key: 'tires_front', name: 'Vorderreifen', max_distance_km: 8000 },
    { category_key: 'tires_rear', name: 'Hinterreifen', max_distance_km: 6000 },
    { category_key: 'cables', name: 'Züge & Hüllen', max_distance_km: 15000 },
  ],
  ebike: [
    { category_key: 'chain', name: 'Kette', max_distance_km: 3000 },
    { category_key: 'cassette', name: 'Kassette', max_distance_km: 8000 },
    { category_key: 'brake_pads', name: 'Bremsbeläge', max_distance_km: 2000 },
    { category_key: 'brake_rotors', name: 'Bremsscheiben', max_distance_km: 10000 },
    { category_key: 'tires_front', name: 'Vorderreifen', max_distance_km: 5000 },
    { category_key: 'tires_rear', name: 'Hinterreifen', max_distance_km: 4000 },
    { category_key: 'cables', name: 'Züge & Hüllen', max_distance_km: 10000 },
    { category_key: 'bottom_bracket', name: 'Tretlager', max_distance_km: 15000 },
  ],
  other: [
    { category_key: 'chain', name: 'Kette', max_distance_km: 5000 },
    { category_key: 'brake_pads', name: 'Bremsbeläge', max_distance_km: 3000 },
    { category_key: 'tires_front', name: 'Vorderreifen', max_distance_km: 5000 },
    { category_key: 'tires_rear', name: 'Hinterreifen', max_distance_km: 4000 },
  ],
};

