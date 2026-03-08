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

// Popular bikes catalog — used for autocomplete/pre-fill
export const BIKE_CATALOG: CatalogBike[] = [
  // === BASSO ===
  { manufacturer: 'Basso', model: 'Palta III', year: 2025, type: 'gravel', weight_kg: 7.9 },
  { manufacturer: 'Basso', model: 'Palta II', year: 2023, type: 'gravel', weight_kg: 8.2 },
  { manufacturer: 'Basso', model: 'Palta', year: 2021, type: 'gravel', weight_kg: 8.5 },
  {
    manufacturer: 'Basso', model: 'SV (Sempre Veloce)', year: 2025, type: 'road', weight_kg: 6.8,
    imageUrl: 'https://cdn-jupiter.metropolis.co.uk/wp-content/uploads/sites/9/2025/04/Z8M9144-scaled.webp',
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'Ultegra 12v', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'Ultegra 12v (11-32)', max_distance_km: 10000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'Ultegra', max_distance_km: 20000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'Ultegra', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'Ultegra 160mm', max_distance_km: 15000 },
      { category_key: 'wheels_front', name: 'Vorderrad', brand: 'DT Swiss', model: 'ARC 1100 50', max_distance_km: 30000 },
      { category_key: 'wheels_rear', name: 'Hinterrad', brand: 'DT Swiss', model: 'ARC 1100 50', max_distance_km: 25000 },
      { category_key: 'handlebar_tape', name: 'Lenkerband', max_distance_km: 5000 },
      { category_key: 'headset', name: 'Steuersatz', brand: 'Microtech', model: 'Integrated Cables Solid Oil', max_distance_km: 30000 },
      { category_key: 'saddle', name: 'Sattelstütze', brand: 'Basso', model: 'Diamante 2023' },
    ],
  },
  { manufacturer: 'Basso', model: 'Diamante', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Basso', model: 'Astra', year: 2025, type: 'road', weight_kg: 7.5 },
  { manufacturer: 'Basso', model: 'Venta', year: 2025, type: 'road', weight_kg: 7.8 },
  { manufacturer: 'Basso', model: 'Tera', year: 2025, type: 'gravel', weight_kg: 9.0 },

  // === CANYON ===
  { manufacturer: 'Canyon', model: 'Aeroad CF SLX', year: 2025, type: 'road', weight_kg: 7.0 },
  { manufacturer: 'Canyon', model: 'Aeroad CF SL', year: 2025, type: 'road', weight_kg: 7.6 },
  { manufacturer: 'Canyon', model: 'Ultimate CF SLX', year: 2025, type: 'road', weight_kg: 6.5 },
  { manufacturer: 'Canyon', model: 'Ultimate CF SL', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Canyon', model: 'Endurace CF SLX', year: 2025, type: 'road', weight_kg: 7.4 },
  { manufacturer: 'Canyon', model: 'Endurace CF SL', year: 2025, type: 'road', weight_kg: 7.9 },
  { manufacturer: 'Canyon', model: 'Endurace AL', year: 2025, type: 'road', weight_kg: 9.0 },
  { manufacturer: 'Canyon', model: 'Grail CF SLX', year: 2025, type: 'gravel', weight_kg: 7.6 },
  { manufacturer: 'Canyon', model: 'Grail CF SL', year: 2025, type: 'gravel', weight_kg: 8.2 },
  { manufacturer: 'Canyon', model: 'Grail AL', year: 2025, type: 'gravel', weight_kg: 9.5 },
  { manufacturer: 'Canyon', model: 'Grizl CF SLX', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: 'Canyon', model: 'Grizl CF SL', year: 2025, type: 'gravel', weight_kg: 8.6 },
  { manufacturer: 'Canyon', model: 'Spectral CF', year: 2025, type: 'mtb', weight_kg: 13.5 },
  { manufacturer: 'Canyon', model: 'Spectral AL', year: 2025, type: 'mtb', weight_kg: 14.8 },
  { manufacturer: 'Canyon', model: 'Neuron CF', year: 2025, type: 'mtb', weight_kg: 12.5 },
  { manufacturer: 'Canyon', model: 'Neuron AL', year: 2025, type: 'mtb', weight_kg: 13.8 },
  { manufacturer: 'Canyon', model: 'Exceed CF', year: 2025, type: 'mtb', weight_kg: 9.8 },
  { manufacturer: 'Canyon', model: 'Lux Trail CF', year: 2025, type: 'mtb', weight_kg: 11.2 },
  { manufacturer: 'Canyon', model: 'Strive CF', year: 2025, type: 'mtb', weight_kg: 14.5 },
  { manufacturer: 'Canyon', model: 'Torque CF', year: 2025, type: 'mtb', weight_kg: 16.0 },
  { manufacturer: 'Canyon', model: 'Roadlite CF', year: 2025, type: 'city', weight_kg: 8.5 },
  { manufacturer: 'Canyon', model: 'Commuter', year: 2025, type: 'city', weight_kg: 11.0 },

  // === SPECIALIZED ===
  { manufacturer: 'Specialized', model: 'Tarmac SL8', year: 2025, type: 'road', weight_kg: 6.7 },
  { manufacturer: 'Specialized', model: 'Tarmac SL7', year: 2022, type: 'road', weight_kg: 6.9 },
  { manufacturer: 'Specialized', model: 'Aethos', year: 2025, type: 'road', weight_kg: 6.1 },
  { manufacturer: 'Specialized', model: 'Roubaix', year: 2025, type: 'road', weight_kg: 8.2 },
  { manufacturer: 'Specialized', model: 'Allez Sprint', year: 2025, type: 'road', weight_kg: 8.0 },
  { manufacturer: 'Specialized', model: 'Diverge STR', year: 2025, type: 'gravel', weight_kg: 9.2 },
  { manufacturer: 'Specialized', model: 'Diverge Expert', year: 2025, type: 'gravel', weight_kg: 9.0 },
  { manufacturer: 'Specialized', model: 'Crux', year: 2025, type: 'gravel', weight_kg: 7.5 },
  { manufacturer: 'Specialized', model: 'Epic 8', year: 2025, type: 'mtb', weight_kg: 10.2 },
  { manufacturer: 'Specialized', model: 'Epic EVO', year: 2025, type: 'mtb', weight_kg: 11.5 },
  { manufacturer: 'Specialized', model: 'Stumpjumper', year: 2025, type: 'mtb', weight_kg: 13.0 },
  { manufacturer: 'Specialized', model: 'Stumpjumper EVO', year: 2025, type: 'mtb', weight_kg: 13.8 },
  { manufacturer: 'Specialized', model: 'Enduro', year: 2025, type: 'mtb', weight_kg: 15.0 },
  { manufacturer: 'Specialized', model: 'Demo', year: 2025, type: 'mtb', weight_kg: 16.5 },
  { manufacturer: 'Specialized', model: 'Levo SL', year: 2025, type: 'ebike', weight_kg: 17.3 },
  { manufacturer: 'Specialized', model: 'Turbo Levo', year: 2025, type: 'ebike', weight_kg: 21.5 },
  { manufacturer: 'Specialized', model: 'Turbo Creo', year: 2025, type: 'ebike', weight_kg: 12.2 },
  { manufacturer: 'Specialized', model: 'Turbo Vado', year: 2025, type: 'ebike', weight_kg: 21.0 },

  // === TREK ===
  { manufacturer: 'Trek', model: 'Madone SLR', year: 2025, type: 'road', weight_kg: 7.3 },
  { manufacturer: 'Trek', model: 'Madone SL', year: 2025, type: 'road', weight_kg: 8.0 },
  { manufacturer: 'Trek', model: 'Emonda SLR', year: 2025, type: 'road', weight_kg: 6.6 },
  { manufacturer: 'Trek', model: 'Emonda SL', year: 2025, type: 'road', weight_kg: 7.8 },
  { manufacturer: 'Trek', model: 'Domane SLR', year: 2025, type: 'road', weight_kg: 7.9 },
  { manufacturer: 'Trek', model: 'Domane SL', year: 2025, type: 'road', weight_kg: 8.5 },
  { manufacturer: 'Trek', model: 'Domane AL', year: 2025, type: 'road', weight_kg: 9.7 },
  { manufacturer: 'Trek', model: 'Checkpoint SLR', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: 'Trek', model: 'Checkpoint SL', year: 2025, type: 'gravel', weight_kg: 8.9 },
  { manufacturer: 'Trek', model: 'Supercaliber', year: 2025, type: 'mtb', weight_kg: 10.5 },
  { manufacturer: 'Trek', model: 'Top Fuel', year: 2025, type: 'mtb', weight_kg: 11.5 },
  { manufacturer: 'Trek', model: 'Fuel EX', year: 2025, type: 'mtb', weight_kg: 13.5 },
  { manufacturer: 'Trek', model: 'Slash', year: 2025, type: 'mtb', weight_kg: 15.0 },
  { manufacturer: 'Trek', model: 'Remedy', year: 2025, type: 'mtb', weight_kg: 14.5 },
  { manufacturer: 'Trek', model: 'Rail', year: 2025, type: 'ebike', weight_kg: 22.5 },
  { manufacturer: 'Trek', model: 'Fuel EXe', year: 2025, type: 'ebike', weight_kg: 18.5 },

  // === GIANT ===
  { manufacturer: 'Giant', model: 'TCR Advanced SL', year: 2025, type: 'road', weight_kg: 6.7 },
  { manufacturer: 'Giant', model: 'TCR Advanced Pro', year: 2025, type: 'road', weight_kg: 7.3 },
  { manufacturer: 'Giant', model: 'Propel Advanced SL', year: 2025, type: 'road', weight_kg: 7.1 },
  { manufacturer: 'Giant', model: 'Defy Advanced Pro', year: 2025, type: 'road', weight_kg: 7.8 },
  { manufacturer: 'Giant', model: 'Revolt Advanced', year: 2025, type: 'gravel', weight_kg: 8.8 },
  { manufacturer: 'Giant', model: 'Trance X', year: 2025, type: 'mtb', weight_kg: 13.8 },
  { manufacturer: 'Giant', model: 'Anthem', year: 2025, type: 'mtb', weight_kg: 11.0 },
  { manufacturer: 'Giant', model: 'Reign', year: 2025, type: 'mtb', weight_kg: 15.5 },

  // === SCOTT ===
  { manufacturer: 'Scott', model: 'Addict RC', year: 2025, type: 'road', weight_kg: 6.8 },
  { manufacturer: 'Scott', model: 'Foil RC', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Scott', model: 'Speedster', year: 2025, type: 'road', weight_kg: 8.8 },
  { manufacturer: 'Scott', model: 'Addict Gravel', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: 'Scott', model: 'Spark RC', year: 2025, type: 'mtb', weight_kg: 10.5 },
  { manufacturer: 'Scott', model: 'Spark', year: 2025, type: 'mtb', weight_kg: 12.0 },
  { manufacturer: 'Scott', model: 'Genius', year: 2025, type: 'mtb', weight_kg: 14.0 },
  { manufacturer: 'Scott', model: 'Ransom', year: 2025, type: 'mtb', weight_kg: 15.5 },

  // === CERVÉLO ===
  { manufacturer: 'Cervélo', model: 'S5', year: 2025, type: 'road', weight_kg: 7.3 },
  { manufacturer: 'Cervélo', model: 'R5', year: 2025, type: 'road', weight_kg: 6.6 },
  { manufacturer: 'Cervélo', model: 'Caledonia-5', year: 2025, type: 'road', weight_kg: 7.6 },
  { manufacturer: 'Cervélo', model: 'Caledonia', year: 2025, type: 'road', weight_kg: 8.0 },
  { manufacturer: 'Cervélo', model: 'Áspero', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: 'Cervélo', model: 'Rouvida', year: 2025, type: 'gravel', weight_kg: 8.5 },

  // === PINARELLO ===
  { manufacturer: 'Pinarello', model: 'Dogma F', year: 2025, type: 'road', weight_kg: 6.9 },
  { manufacturer: 'Pinarello', model: 'Dogma X', year: 2025, type: 'road', weight_kg: 7.4 },
  { manufacturer: 'Pinarello', model: 'F Series', year: 2025, type: 'road', weight_kg: 7.5 },
  { manufacturer: 'Pinarello', model: 'Paris', year: 2025, type: 'road', weight_kg: 8.2 },
  { manufacturer: 'Pinarello', model: 'Grevil F', year: 2025, type: 'gravel', weight_kg: 8.0 },

  // === COLNAGO ===
  { manufacturer: 'Colnago', model: 'V4Rs', year: 2025, type: 'road', weight_kg: 6.6 },
  { manufacturer: 'Colnago', model: 'C68', year: 2025, type: 'road', weight_kg: 6.9 },
  { manufacturer: 'Colnago', model: 'G4-X', year: 2025, type: 'gravel', weight_kg: 8.2 },

  // === BMC ===
  { manufacturer: 'BMC', model: 'Teammachine SLR', year: 2025, type: 'road', weight_kg: 6.7 },
  { manufacturer: 'BMC', model: 'Roadmachine', year: 2025, type: 'road', weight_kg: 7.8 },
  { manufacturer: 'BMC', model: 'Timemachine Road', year: 2025, type: 'road', weight_kg: 8.0 },
  { manufacturer: 'BMC', model: 'Kaius', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: 'BMC', model: 'URS', year: 2025, type: 'gravel', weight_kg: 8.5 },
  { manufacturer: 'BMC', model: 'Fourstroke', year: 2025, type: 'mtb', weight_kg: 10.8 },
  { manufacturer: 'BMC', model: 'Speedfox', year: 2025, type: 'mtb', weight_kg: 12.5 },

  // === FACTOR ===
  { manufacturer: 'Factor', model: 'Ostro VAM', year: 2025, type: 'road', weight_kg: 6.8 },
  { manufacturer: 'Factor', model: 'O2 VAM', year: 2025, type: 'road', weight_kg: 6.4 },
  { manufacturer: 'Factor', model: 'LS', year: 2025, type: 'gravel', weight_kg: 8.0 },

  // === ROSE ===
  { manufacturer: 'Rose', model: 'Xlite', year: 2025, type: 'road', weight_kg: 7.4 },
  { manufacturer: 'Rose', model: 'Reveal', year: 2025, type: 'road', weight_kg: 7.8 },
  { manufacturer: 'Rose', model: 'Backroad', year: 2025, type: 'gravel', weight_kg: 8.2 },
  { manufacturer: 'Rose', model: 'Backroad AL', year: 2025, type: 'gravel', weight_kg: 9.5 },
  { manufacturer: 'Rose', model: 'Ground Control', year: 2025, type: 'mtb', weight_kg: 13.0 },

  // === CUBE ===
  { manufacturer: 'Cube', model: 'Litening C:68X', year: 2025, type: 'road', weight_kg: 7.0 },
  { manufacturer: 'Cube', model: 'Agree C:62', year: 2025, type: 'road', weight_kg: 8.0 },
  { manufacturer: 'Cube', model: 'Attain GTC', year: 2025, type: 'road', weight_kg: 8.5 },
  { manufacturer: 'Cube', model: 'Nuroad C:62', year: 2025, type: 'gravel', weight_kg: 8.5 },
  { manufacturer: 'Cube', model: 'Stereo ONE77', year: 2025, type: 'mtb', weight_kg: 14.0 },
  { manufacturer: 'Cube', model: 'AMS', year: 2025, type: 'mtb', weight_kg: 12.5 },
  { manufacturer: 'Cube', model: 'Stereo Hybrid', year: 2025, type: 'ebike', weight_kg: 23.0 },
  { manufacturer: 'Cube', model: 'Reaction Hybrid', year: 2025, type: 'ebike', weight_kg: 22.0 },

  // === FOCUS ===
  { manufacturer: 'Focus', model: 'Izalco Max', year: 2025, type: 'road', weight_kg: 7.0 },
  { manufacturer: 'Focus', model: 'Atlas', year: 2025, type: 'gravel', weight_kg: 8.5 },
  { manufacturer: 'Focus', model: 'Jam2', year: 2025, type: 'ebike', weight_kg: 22.5 },

  // === MERIDA ===
  { manufacturer: 'Merida', model: 'Scultura', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Merida', model: 'Reacto', year: 2025, type: 'road', weight_kg: 7.5 },
  { manufacturer: 'Merida', model: 'Silex', year: 2025, type: 'gravel', weight_kg: 8.8 },
  { manufacturer: 'Merida', model: 'One-Twenty', year: 2025, type: 'mtb', weight_kg: 13.0 },
  { manufacturer: 'Merida', model: 'One-Forty', year: 2025, type: 'mtb', weight_kg: 14.0 },
  { manufacturer: 'Merida', model: 'One-Sixty', year: 2025, type: 'mtb', weight_kg: 15.0 },

  // === CANNONDALE ===
  { manufacturer: 'Cannondale', model: 'SuperSix EVO', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Cannondale', model: 'SystemSix', year: 2025, type: 'road', weight_kg: 7.8 },
  { manufacturer: 'Cannondale', model: 'Synapse', year: 2025, type: 'road', weight_kg: 8.5 },
  { manufacturer: 'Cannondale', model: 'CAAD13', year: 2025, type: 'road', weight_kg: 8.3 },
  { manufacturer: 'Cannondale', model: 'Topstone Carbon', year: 2025, type: 'gravel', weight_kg: 8.5 },
  { manufacturer: 'Cannondale', model: 'Topstone', year: 2025, type: 'gravel', weight_kg: 9.5 },
  { manufacturer: 'Cannondale', model: 'Scalpel', year: 2025, type: 'mtb', weight_kg: 10.5 },
  { manufacturer: 'Cannondale', model: 'Habit', year: 2025, type: 'mtb', weight_kg: 13.5 },
  { manufacturer: 'Cannondale', model: 'Jekyll', year: 2025, type: 'mtb', weight_kg: 15.0 },
  { manufacturer: 'Cannondale', model: 'Moterra', year: 2025, type: 'ebike', weight_kg: 23.0 },

  // === RIBBLE ===
  { manufacturer: 'Ribble', model: 'Endurance SL R', year: 2025, type: 'road', weight_kg: 7.5 },
  { manufacturer: 'Ribble', model: 'Ultra SL R', year: 2025, type: 'road', weight_kg: 6.8 },
  { manufacturer: 'Ribble', model: 'CGR SL', year: 2025, type: 'gravel', weight_kg: 8.5 },

  // === ORBEA ===
  { manufacturer: 'Orbea', model: 'Orca', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Orbea', model: 'Terra', year: 2025, type: 'gravel', weight_kg: 8.5 },
  { manufacturer: 'Orbea', model: 'Oiz', year: 2025, type: 'mtb', weight_kg: 10.5 },
  { manufacturer: 'Orbea', model: 'Occam', year: 2025, type: 'mtb', weight_kg: 13.0 },
  { manufacturer: 'Orbea', model: 'Rallon', year: 2025, type: 'mtb', weight_kg: 15.0 },
  { manufacturer: 'Orbea', model: 'Rise', year: 2025, type: 'ebike', weight_kg: 16.5 },
  { manufacturer: 'Orbea', model: 'Wild', year: 2025, type: 'ebike', weight_kg: 22.5 },
  { manufacturer: 'Orbea', model: 'Gain', year: 2025, type: 'ebike', weight_kg: 12.5 },

  // === SANTA CRUZ ===
  { manufacturer: 'Santa Cruz', model: 'Blur', year: 2025, type: 'mtb', weight_kg: 10.5 },
  { manufacturer: 'Santa Cruz', model: 'Tallboy', year: 2025, type: 'mtb', weight_kg: 12.8 },
  { manufacturer: 'Santa Cruz', model: 'Hightower', year: 2025, type: 'mtb', weight_kg: 13.5 },
  { manufacturer: 'Santa Cruz', model: 'Bronson', year: 2025, type: 'mtb', weight_kg: 14.5 },
  { manufacturer: 'Santa Cruz', model: 'Megatower', year: 2025, type: 'mtb', weight_kg: 15.5 },
  { manufacturer: 'Santa Cruz', model: 'Nomad', year: 2025, type: 'mtb', weight_kg: 16.0 },
  { manufacturer: 'Santa Cruz', model: 'Stigmata', year: 2025, type: 'gravel', weight_kg: 8.5 },

  // === YT ===
  { manufacturer: 'YT', model: 'Szepter', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'YT', model: 'Izzo', year: 2025, type: 'mtb', weight_kg: 12.5 },
  { manufacturer: 'YT', model: 'Jeffsy', year: 2025, type: 'mtb', weight_kg: 14.0 },
  { manufacturer: 'YT', model: 'Capra', year: 2025, type: 'mtb', weight_kg: 15.5 },
  { manufacturer: 'YT', model: 'Decoy', year: 2025, type: 'ebike', weight_kg: 22.0 },

  // === PROPAIN ===
  { manufacturer: 'Propain', model: 'Hugene', year: 2025, type: 'mtb', weight_kg: 12.5 },
  { manufacturer: 'Propain', model: 'Tyee', year: 2025, type: 'mtb', weight_kg: 14.0 },
  { manufacturer: 'Propain', model: 'Spindrift', year: 2025, type: 'mtb', weight_kg: 16.0 },
  { manufacturer: 'Propain', model: 'Ekano', year: 2025, type: 'ebike', weight_kg: 22.0 },

  // === LAST ===
  { manufacturer: 'Last', model: 'Glen', year: 2025, type: 'mtb', weight_kg: 13.5 },
  { manufacturer: 'Last', model: 'Tarvo', year: 2025, type: 'mtb', weight_kg: 14.5 },
  { manufacturer: 'Last', model: 'Coal', year: 2025, type: 'mtb', weight_kg: 15.5 },

  // === RADON ===
  { manufacturer: 'Radon', model: 'Vaillant', year: 2025, type: 'road', weight_kg: 7.5 },
  { manufacturer: 'Radon', model: 'Cragger', year: 2025, type: 'gravel', weight_kg: 9.0 },
  { manufacturer: 'Radon', model: 'Slide Trail', year: 2025, type: 'mtb', weight_kg: 13.5 },
  { manufacturer: 'Radon', model: 'Swoop', year: 2025, type: 'mtb', weight_kg: 15.5 },
  { manufacturer: 'Radon', model: 'Jealous', year: 2025, type: 'mtb', weight_kg: 10.5 },

  // === WILIER ===
  { manufacturer: 'Wilier', model: 'Filante SLR', year: 2025, type: 'road', weight_kg: 6.9 },
  { manufacturer: 'Wilier', model: 'Zero SLR', year: 2025, type: 'road', weight_kg: 6.5 },
  { manufacturer: 'Wilier', model: 'Rave SLR', year: 2025, type: 'gravel', weight_kg: 7.8 },
  { manufacturer: 'Wilier', model: 'Urta SLR', year: 2025, type: 'mtb', weight_kg: 10.5 },

  // === LOOK ===
  { manufacturer: 'Look', model: '795 Blade RS', year: 2025, type: 'road', weight_kg: 7.0 },
  { manufacturer: 'Look', model: '785 Huez RS', year: 2025, type: 'road', weight_kg: 6.5 },

  // === RIDLEY ===
  { manufacturer: 'Ridley', model: 'Falcn RS', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Ridley', model: 'Noah', year: 2025, type: 'road', weight_kg: 7.5 },
  { manufacturer: 'Ridley', model: 'Kanzo Fast', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: 'Ridley', model: 'Kanzo Adventure', year: 2025, type: 'gravel', weight_kg: 9.0 },

  // === DE ROSA ===
  { manufacturer: 'De Rosa', model: 'SK Pininfarina', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'De Rosa', model: 'Merak', year: 2025, type: 'road', weight_kg: 6.8 },

  // === 3T ===
  { manufacturer: '3T', model: 'Exploro Max', year: 2025, type: 'gravel', weight_kg: 8.5 },
  { manufacturer: '3T', model: 'Exploro Race', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: '3T', model: 'Strada', year: 2025, type: 'road', weight_kg: 7.5 },

  // === OPEN ===
  { manufacturer: 'Open', model: 'U.P.', year: 2025, type: 'gravel', weight_kg: 8.0 },
  { manufacturer: 'Open', model: 'W.I.D.E.', year: 2025, type: 'gravel', weight_kg: 8.5 },

  // === LAPIERRE ===
  { manufacturer: 'Lapierre', model: 'Xelius SL', year: 2025, type: 'road', weight_kg: 7.2 },
  { manufacturer: 'Lapierre', model: 'Aircode DRS', year: 2025, type: 'road', weight_kg: 7.5 },
  { manufacturer: 'Lapierre', model: 'Crosshill', year: 2025, type: 'gravel', weight_kg: 8.8 },
  { manufacturer: 'Lapierre', model: 'Zesty', year: 2025, type: 'mtb', weight_kg: 14.0 },
  { manufacturer: 'Lapierre', model: 'Spicy', year: 2025, type: 'mtb', weight_kg: 15.0 },

  // === BULLS ===
  { manufacturer: 'Bulls', model: 'Sonic EVO', year: 2025, type: 'ebike', weight_kg: 21.0 },
  { manufacturer: 'Bulls', model: 'Copperhead EVO', year: 2025, type: 'ebike', weight_kg: 22.5 },

  // === HAIBIKE ===
  { manufacturer: 'Haibike', model: 'AllMtn', year: 2025, type: 'ebike', weight_kg: 25.0 },
  { manufacturer: 'Haibike', model: 'AllTrail', year: 2025, type: 'ebike', weight_kg: 24.0 },
  { manufacturer: 'Haibike', model: 'Lyke', year: 2025, type: 'ebike', weight_kg: 18.0 },

  // === KALKHOFF ===
  { manufacturer: 'Kalkhoff', model: 'Endeavour', year: 2025, type: 'ebike', weight_kg: 26.0 },
  { manufacturer: 'Kalkhoff', model: 'Image', year: 2025, type: 'ebike', weight_kg: 27.0 },

  // === RIESE & MÜLLER ===
  { manufacturer: 'Riese & Müller', model: 'Supercharger', year: 2025, type: 'ebike', weight_kg: 30.0 },
  { manufacturer: 'Riese & Müller', model: 'Homage', year: 2025, type: 'ebike', weight_kg: 29.0 },
  { manufacturer: 'Riese & Müller', model: 'Nevo', year: 2025, type: 'ebike', weight_kg: 26.0 },
  { manufacturer: 'Riese & Müller', model: 'Charger', year: 2025, type: 'ebike', weight_kg: 28.0 },

  // === VANMOOF / COWBOY / CITY ===
  { manufacturer: 'Cowboy', model: 'Cruiser', year: 2025, type: 'ebike', weight_kg: 19.0 },
  { manufacturer: 'Cowboy', model: 'Classic', year: 2025, type: 'ebike', weight_kg: 18.9 },
  { manufacturer: 'Schindelhauer', model: 'Arthur', year: 2025, type: 'city', weight_kg: 11.0 },
  { manufacturer: 'Schindelhauer', model: 'Viktor', year: 2025, type: 'city', weight_kg: 12.0 },
  { manufacturer: 'Ampler', model: 'Curt', year: 2025, type: 'ebike', weight_kg: 14.0 },
  { manufacturer: 'Ampler', model: 'Stout', year: 2025, type: 'ebike', weight_kg: 16.0 },
];

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

/**
 * Fuzzy search through the bike catalog.
 * Matches against "manufacturer model" combined string.
 */
export function searchBikeCatalog(query: string, limit = 8): CatalogBike[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/);

  const scored = BIKE_CATALOG.map((bike) => {
    const full = `${bike.manufacturer} ${bike.model}`.toLowerCase();
    let score = 0;

    // Exact full match
    if (full === q) score += 100;
    // Starts with query
    else if (full.startsWith(q)) score += 80;
    // Contains full query
    else if (full.includes(q)) score += 60;

    // All terms match somewhere
    const allTermsMatch = terms.every((term) => full.includes(term));
    if (allTermsMatch) score += 40;

    // Individual term matches
    for (const term of terms) {
      if (bike.manufacturer.toLowerCase().startsWith(term)) score += 20;
      if (bike.model.toLowerCase().startsWith(term)) score += 15;
      if (bike.manufacturer.toLowerCase().includes(term)) score += 10;
      if (bike.model.toLowerCase().includes(term)) score += 8;
    }

    return { bike, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((s) => s.bike);
}
