import { type CatalogComponent } from './bike-catalog';
import { DEFAULT_COMPONENTS } from './bike-catalog';

// ─── Preset Types ───────────────────────────────────────

export interface GroupsetPreset {
  id: string;
  name: string;
  bikeTypes: string[];
  components: {
    category_key: string;
    name: string;
    brand: string;
    model: string;
    max_distance_km: number;
  }[];
}

export interface WheelPreset {
  id: string;
  name: string;
  bikeTypes: string[];
  front: { brand: string; model: string; max_distance_km: number };
  rear: { brand: string; model: string; max_distance_km: number };
}

export interface TirePreset {
  id: string;
  name: string;
  bikeTypes: string[];
  front: { brand: string; model: string; max_distance_km: number };
  rear: { brand: string; model: string; max_distance_km: number };
}

// ─── Groupset Presets ───────────────────────────────────

export const GROUPSET_PRESETS: GroupsetPreset[] = [
  // Shimano Road
  {
    id: 'shimano-dura-ace-di2-12s',
    name: 'Shimano Dura-Ace Di2 12s',
    bikeTypes: ['road'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-M9100', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-R9200', max_distance_km: 15000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'L05A Resin', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-CL900', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB92', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-R9200', max_distance_km: 50000 },
    ],
  },
  {
    id: 'shimano-ultegra-di2-12s',
    name: 'Shimano Ultegra Di2 12s',
    bikeTypes: ['road'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-M8100', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-R8100', max_distance_km: 15000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'L03A Resin', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-CL800', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB72', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-R8100', max_distance_km: 50000 },
    ],
  },
  {
    id: 'shimano-105-di2-12s',
    name: 'Shimano 105 Di2 12s',
    bikeTypes: ['road'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-M7100', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-R7100', max_distance_km: 12000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'L03A Resin', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-CL800', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB72', max_distance_km: 20000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-R7100', max_distance_km: 50000 },
    ],
  },
  {
    id: 'shimano-tiagra-10s',
    name: 'Shimano Tiagra 10s',
    bikeTypes: ['road', 'city'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-4601', max_distance_km: 4000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-HG500', max_distance_km: 10000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'R55C4', max_distance_km: 3000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB52', max_distance_km: 20000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-4700', max_distance_km: 50000 },
    ],
  },
  // Shimano Gravel
  {
    id: 'shimano-grx-di2-12s',
    name: 'Shimano GRX Di2 12s',
    bikeTypes: ['gravel'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-M8100', max_distance_km: 4000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-R8100', max_distance_km: 12000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'L03A Resin', max_distance_km: 2500 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-CL800', max_distance_km: 18000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB72', max_distance_km: 20000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-RX822', max_distance_km: 50000 },
    ],
  },
  // Shimano MTB
  {
    id: 'shimano-deore-xt-12s',
    name: 'Shimano Deore XT 12s',
    bikeTypes: ['mtb'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-M8100', max_distance_km: 3000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-M8100', max_distance_km: 10000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'N03A Resin', max_distance_km: 2000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-MT800', max_distance_km: 15000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB52', max_distance_km: 15000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-M8100', max_distance_km: 40000 },
    ],
  },
  {
    id: 'shimano-slx-12s',
    name: 'Shimano SLX 12s',
    bikeTypes: ['mtb'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-M7100', max_distance_km: 3000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-M7100', max_distance_km: 8000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'N03A Resin', max_distance_km: 2000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-MT800', max_distance_km: 15000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB52', max_distance_km: 15000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-M7100', max_distance_km: 40000 },
    ],
  },
  {
    id: 'shimano-deore-12s',
    name: 'Shimano Deore 12s',
    bikeTypes: ['mtb', 'ebike'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-M6100', max_distance_km: 3000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-M6100', max_distance_km: 8000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'B05S Resin', max_distance_km: 2000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-MT410', max_distance_km: 12000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB52', max_distance_km: 15000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-M6100', max_distance_km: 40000 },
    ],
  },
  // SRAM Road
  {
    id: 'sram-red-axs-12s',
    name: 'SRAM Red AXS 12s',
    bikeTypes: ['road'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'SRAM', model: 'Red D1 Flattop', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'SRAM', model: 'Red XG-1290', max_distance_km: 15000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'SRAM', model: 'HRD Organic', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'SRAM', model: 'CenterLine XR', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'SRAM', model: 'DUB BSA', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'SRAM', model: 'Red AXS D1', max_distance_km: 50000 },
    ],
  },
  {
    id: 'sram-force-axs-12s',
    name: 'SRAM Force AXS 12s',
    bikeTypes: ['road', 'gravel'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'SRAM', model: 'Force D1 Flattop', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'SRAM', model: 'Force XG-1270', max_distance_km: 12000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'SRAM', model: 'HRD Organic', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'SRAM', model: 'CenterLine XR', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'SRAM', model: 'DUB BSA', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'SRAM', model: 'Force AXS D2', max_distance_km: 50000 },
    ],
  },
  {
    id: 'sram-rival-axs-12s',
    name: 'SRAM Rival AXS 12s',
    bikeTypes: ['road', 'gravel'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'SRAM', model: 'Rival D1 Flattop', max_distance_km: 4000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'SRAM', model: 'Rival XG-1250', max_distance_km: 10000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'SRAM', model: 'HRD Organic', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'SRAM', model: 'CenterLine', max_distance_km: 18000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'SRAM', model: 'DUB BSA', max_distance_km: 20000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'SRAM', model: 'Rival AXS D1', max_distance_km: 50000 },
    ],
  },
  // SRAM MTB
  {
    id: 'sram-x0-eagle-axs',
    name: 'SRAM X0 Eagle AXS',
    bikeTypes: ['mtb'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'SRAM', model: 'X0 Eagle T-Type', max_distance_km: 3000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'SRAM', model: 'X0 Eagle T-Type', max_distance_km: 10000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'SRAM', model: 'Code Organic', max_distance_km: 2000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'SRAM', model: 'CenterLine XR', max_distance_km: 15000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'SRAM', model: 'DUB BSA', max_distance_km: 15000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'SRAM', model: 'X0 Eagle T-Type', max_distance_km: 40000 },
    ],
  },
  {
    id: 'sram-gx-eagle-axs',
    name: 'SRAM GX Eagle AXS',
    bikeTypes: ['mtb', 'ebike'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'SRAM', model: 'GX Eagle T-Type', max_distance_km: 3000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'SRAM', model: 'GX Eagle T-Type', max_distance_km: 8000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'SRAM', model: 'G2 Organic', max_distance_km: 2000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'SRAM', model: 'CenterLine', max_distance_km: 12000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'SRAM', model: 'DUB BSA', max_distance_km: 15000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'SRAM', model: 'GX Eagle T-Type', max_distance_km: 40000 },
    ],
  },
  // Campagnolo
  {
    id: 'campagnolo-super-record-eps',
    name: 'Campagnolo Super Record EPS',
    bikeTypes: ['road'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Campagnolo', model: 'C13', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Campagnolo', model: 'Super Record', max_distance_km: 15000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Campagnolo', model: 'DB-310 Organic', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Campagnolo', model: 'AFS Disc', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Campagnolo', model: 'Ultra-Torque', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Campagnolo', model: 'Super Record UT', max_distance_km: 50000 },
    ],
  },
  {
    id: 'campagnolo-record-eps',
    name: 'Campagnolo Record EPS',
    bikeTypes: ['road'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Campagnolo', model: 'C13', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Campagnolo', model: 'Record', max_distance_km: 12000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Campagnolo', model: 'DB-310 Organic', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Campagnolo', model: 'AFS Disc', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Campagnolo', model: 'Ultra-Torque', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Campagnolo', model: 'Record UT', max_distance_km: 50000 },
    ],
  },
  {
    id: 'campagnolo-ekar-13s',
    name: 'Campagnolo Ekar 13s',
    bikeTypes: ['gravel'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Campagnolo', model: 'C13 Ekar', max_distance_km: 5000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Campagnolo', model: 'Ekar 9-42', max_distance_km: 12000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Campagnolo', model: 'DB-310 Organic', max_distance_km: 2500 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Campagnolo', model: 'AFS Disc', max_distance_km: 18000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Campagnolo', model: 'Ultra-Torque', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Campagnolo', model: 'Ekar UT', max_distance_km: 50000 },
    ],
  },
  // Shimano City/eBike
  {
    id: 'shimano-nexus-8s',
    name: 'Shimano Nexus 8s',
    bikeTypes: ['city', 'ebike'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-NX10', max_distance_km: 5000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'Rollenbremse', max_distance_km: 8000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB52', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-E5010', max_distance_km: 60000 },
    ],
  },
  {
    id: 'shimano-alfine-11s',
    name: 'Shimano Alfine 11s',
    bikeTypes: ['city'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-HG701', max_distance_km: 5000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'L03A Resin', max_distance_km: 4000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-CL800', max_distance_km: 20000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB52', max_distance_km: 25000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-S501', max_distance_km: 60000 },
    ],
  },
  {
    id: 'shimano-cues-9s',
    name: 'Shimano CUES 9s',
    bikeTypes: ['city', 'ebike'],
    components: [
      { category_key: 'chain', name: 'Kette', brand: 'Shimano', model: 'CN-LG500', max_distance_km: 4000 },
      { category_key: 'cassette', name: 'Kassette', brand: 'Shimano', model: 'CS-LG400', max_distance_km: 10000 },
      { category_key: 'brake_pads', name: 'Bremsbeläge', brand: 'Shimano', model: 'B05S Resin', max_distance_km: 3000 },
      { category_key: 'brake_rotors', name: 'Bremsscheiben', brand: 'Shimano', model: 'RT-MT410', max_distance_km: 15000 },
      { category_key: 'bottom_bracket', name: 'Tretlager', brand: 'Shimano', model: 'SM-BB52', max_distance_km: 20000 },
      { category_key: 'crankset', name: 'Kurbel', brand: 'Shimano', model: 'FC-U4000', max_distance_km: 50000 },
    ],
  },
];

// ─── Wheel Presets ──────────────────────────────────────

export const WHEEL_PRESETS: WheelPreset[] = [
  // ── DT Swiss ──
  {
    id: 'dt-swiss-arc-1400',
    name: 'DT Swiss ARC 1400 DICUT 48',
    bikeTypes: ['road'],
    front: { brand: 'DT Swiss', model: 'ARC 1400 DICUT 48', max_distance_km: 40000 },
    rear: { brand: 'DT Swiss', model: 'ARC 1400 DICUT 48', max_distance_km: 35000 },
  },
  {
    id: 'dt-swiss-erc-1400',
    name: 'DT Swiss ERC 1400 DICUT 35',
    bikeTypes: ['road', 'gravel'],
    front: { brand: 'DT Swiss', model: 'ERC 1400 DICUT 35', max_distance_km: 40000 },
    rear: { brand: 'DT Swiss', model: 'ERC 1400 DICUT 35', max_distance_km: 35000 },
  },
  {
    id: 'dt-swiss-pr-1600',
    name: 'DT Swiss PR 1600 Spline 32',
    bikeTypes: ['road'],
    front: { brand: 'DT Swiss', model: 'PR 1600 Spline 32', max_distance_km: 50000 },
    rear: { brand: 'DT Swiss', model: 'PR 1600 Spline 32', max_distance_km: 45000 },
  },
  {
    id: 'dt-swiss-grc-1400',
    name: 'DT Swiss GRC 1400 Spline 42',
    bikeTypes: ['gravel'],
    front: { brand: 'DT Swiss', model: 'GRC 1400 Spline 42', max_distance_km: 40000 },
    rear: { brand: 'DT Swiss', model: 'GRC 1400 Spline 42', max_distance_km: 35000 },
  },
  {
    id: 'dt-swiss-g-1800',
    name: 'DT Swiss G 1800 Spline 25',
    bikeTypes: ['gravel', 'city'],
    front: { brand: 'DT Swiss', model: 'G 1800 Spline 25', max_distance_km: 50000 },
    rear: { brand: 'DT Swiss', model: 'G 1800 Spline 25', max_distance_km: 45000 },
  },
  {
    id: 'dt-swiss-xrc-1200',
    name: 'DT Swiss XRC 1200 Spline',
    bikeTypes: ['mtb'],
    front: { brand: 'DT Swiss', model: 'XRC 1200 Spline', max_distance_km: 30000 },
    rear: { brand: 'DT Swiss', model: 'XRC 1200 Spline', max_distance_km: 25000 },
  },
  {
    id: 'dt-swiss-xr-1501',
    name: 'DT Swiss XR 1501 Spline ONE',
    bikeTypes: ['mtb'],
    front: { brand: 'DT Swiss', model: 'XR 1501 Spline ONE', max_distance_km: 35000 },
    rear: { brand: 'DT Swiss', model: 'XR 1501 Spline ONE', max_distance_km: 30000 },
  },
  {
    id: 'dt-swiss-m-1900',
    name: 'DT Swiss M 1900 Spline 30',
    bikeTypes: ['mtb', 'ebike'],
    front: { brand: 'DT Swiss', model: 'M 1900 Spline 30', max_distance_km: 40000 },
    rear: { brand: 'DT Swiss', model: 'M 1900 Spline 30', max_distance_km: 35000 },
  },
  {
    id: 'dt-swiss-h-1900',
    name: 'DT Swiss H 1900 Spline 30',
    bikeTypes: ['ebike'],
    front: { brand: 'DT Swiss', model: 'H 1900 Spline 30', max_distance_km: 40000 },
    rear: { brand: 'DT Swiss', model: 'H 1900 Spline 30', max_distance_km: 35000 },
  },
  // ── Zipp ──
  {
    id: 'zipp-303-s',
    name: 'Zipp 303 S',
    bikeTypes: ['road', 'gravel'],
    front: { brand: 'Zipp', model: '303 S', max_distance_km: 40000 },
    rear: { brand: 'Zipp', model: '303 S', max_distance_km: 35000 },
  },
  {
    id: 'zipp-303-firecrest',
    name: 'Zipp 303 Firecrest',
    bikeTypes: ['road', 'gravel'],
    front: { brand: 'Zipp', model: '303 Firecrest', max_distance_km: 40000 },
    rear: { brand: 'Zipp', model: '303 Firecrest', max_distance_km: 35000 },
  },
  {
    id: 'zipp-404-firecrest',
    name: 'Zipp 404 Firecrest',
    bikeTypes: ['road'],
    front: { brand: 'Zipp', model: '404 Firecrest', max_distance_km: 40000 },
    rear: { brand: 'Zipp', model: '404 Firecrest', max_distance_km: 35000 },
  },
  // ── Mavic ──
  {
    id: 'mavic-cosmic-slr',
    name: 'Mavic Cosmic SLR 45',
    bikeTypes: ['road'],
    front: { brand: 'Mavic', model: 'Cosmic SLR 45', max_distance_km: 40000 },
    rear: { brand: 'Mavic', model: 'Cosmic SLR 45', max_distance_km: 35000 },
  },
  {
    id: 'mavic-ksyrium',
    name: 'Mavic Ksyrium SL',
    bikeTypes: ['road', 'gravel'],
    front: { brand: 'Mavic', model: 'Ksyrium SL', max_distance_km: 45000 },
    rear: { brand: 'Mavic', model: 'Ksyrium SL', max_distance_km: 40000 },
  },
  {
    id: 'mavic-allroad-sl',
    name: 'Mavic Allroad SL',
    bikeTypes: ['gravel'],
    front: { brand: 'Mavic', model: 'Allroad SL', max_distance_km: 40000 },
    rear: { brand: 'Mavic', model: 'Allroad SL', max_distance_km: 35000 },
  },
  // ── Fulcrum ──
  {
    id: 'fulcrum-racing-zero',
    name: 'Fulcrum Racing Zero DB',
    bikeTypes: ['road'],
    front: { brand: 'Fulcrum', model: 'Racing Zero DB', max_distance_km: 45000 },
    rear: { brand: 'Fulcrum', model: 'Racing Zero DB', max_distance_km: 40000 },
  },
  {
    id: 'fulcrum-speed-40',
    name: 'Fulcrum Speed 40 DB',
    bikeTypes: ['road'],
    front: { brand: 'Fulcrum', model: 'Speed 40 DB', max_distance_km: 40000 },
    rear: { brand: 'Fulcrum', model: 'Speed 40 DB', max_distance_km: 35000 },
  },
  {
    id: 'fulcrum-rapid-red-5',
    name: 'Fulcrum Rapid Red 5 DB',
    bikeTypes: ['gravel'],
    front: { brand: 'Fulcrum', model: 'Rapid Red 5 DB', max_distance_km: 45000 },
    rear: { brand: 'Fulcrum', model: 'Rapid Red 5 DB', max_distance_km: 40000 },
  },
  // ── Roval ──
  {
    id: 'roval-rapide-clx',
    name: 'Roval Rapide CLX II',
    bikeTypes: ['road'],
    front: { brand: 'Roval', model: 'Rapide CLX II', max_distance_km: 40000 },
    rear: { brand: 'Roval', model: 'Rapide CLX II', max_distance_km: 35000 },
  },
  {
    id: 'roval-alpinist-clx',
    name: 'Roval Alpinist CLX II',
    bikeTypes: ['road'],
    front: { brand: 'Roval', model: 'Alpinist CLX II', max_distance_km: 40000 },
    rear: { brand: 'Roval', model: 'Alpinist CLX II', max_distance_km: 35000 },
  },
  {
    id: 'roval-terra-clx',
    name: 'Roval Terra CLX II',
    bikeTypes: ['gravel'],
    front: { brand: 'Roval', model: 'Terra CLX II', max_distance_km: 35000 },
    rear: { brand: 'Roval', model: 'Terra CLX II', max_distance_km: 30000 },
  },
  {
    id: 'roval-control-sl',
    name: 'Roval Control SL',
    bikeTypes: ['mtb'],
    front: { brand: 'Roval', model: 'Control SL 29', max_distance_km: 30000 },
    rear: { brand: 'Roval', model: 'Control SL 29', max_distance_km: 25000 },
  },
  // ── Bontrager ──
  {
    id: 'bontrager-aeolus-rsl-51',
    name: 'Bontrager Aeolus RSL 51',
    bikeTypes: ['road'],
    front: { brand: 'Bontrager', model: 'Aeolus RSL 51', max_distance_km: 40000 },
    rear: { brand: 'Bontrager', model: 'Aeolus RSL 51', max_distance_km: 35000 },
  },
  {
    id: 'bontrager-aeolus-pro-37',
    name: 'Bontrager Aeolus Pro 37',
    bikeTypes: ['road', 'gravel'],
    front: { brand: 'Bontrager', model: 'Aeolus Pro 37', max_distance_km: 45000 },
    rear: { brand: 'Bontrager', model: 'Aeolus Pro 37', max_distance_km: 40000 },
  },
  {
    id: 'bontrager-kovee-pro-30',
    name: 'Bontrager Kovee Pro 30',
    bikeTypes: ['mtb'],
    front: { brand: 'Bontrager', model: 'Kovee Pro 30', max_distance_km: 35000 },
    rear: { brand: 'Bontrager', model: 'Kovee Pro 30', max_distance_km: 30000 },
  },
  // ── Hunt ──
  {
    id: 'hunt-50-aero-wide',
    name: 'Hunt 50 Aero Wide',
    bikeTypes: ['road'],
    front: { brand: 'Hunt', model: '50 Aero Wide', max_distance_km: 40000 },
    rear: { brand: 'Hunt', model: '50 Aero Wide', max_distance_km: 35000 },
  },
  {
    id: 'hunt-35-carbon-gravel',
    name: 'Hunt 35 Carbon Gravel X-Wide',
    bikeTypes: ['gravel'],
    front: { brand: 'Hunt', model: '35 Carbon Gravel X-Wide', max_distance_km: 40000 },
    rear: { brand: 'Hunt', model: '35 Carbon Gravel X-Wide', max_distance_km: 35000 },
  },
  {
    id: 'hunt-trail-wide-mtb',
    name: 'Hunt Trail Wide MTB',
    bikeTypes: ['mtb', 'ebike'],
    front: { brand: 'Hunt', model: 'Trail Wide MTB 29', max_distance_km: 35000 },
    rear: { brand: 'Hunt', model: 'Trail Wide MTB 29', max_distance_km: 30000 },
  },
  // ── Campagnolo ──
  {
    id: 'campagnolo-bora-ultra-wto-45',
    name: 'Campagnolo Bora Ultra WTO 45',
    bikeTypes: ['road'],
    front: { brand: 'Campagnolo', model: 'Bora Ultra WTO 45', max_distance_km: 40000 },
    rear: { brand: 'Campagnolo', model: 'Bora Ultra WTO 45', max_distance_km: 35000 },
  },
  {
    id: 'campagnolo-shamal-carbon',
    name: 'Campagnolo Shamal Carbon DB',
    bikeTypes: ['road'],
    front: { brand: 'Campagnolo', model: 'Shamal Carbon DB', max_distance_km: 45000 },
    rear: { brand: 'Campagnolo', model: 'Shamal Carbon DB', max_distance_km: 40000 },
  },
  // ── Shimano ──
  {
    id: 'shimano-dura-ace-c50',
    name: 'Shimano Dura-Ace C50',
    bikeTypes: ['road'],
    front: { brand: 'Shimano', model: 'WH-R9270-C50-TL', max_distance_km: 40000 },
    rear: { brand: 'Shimano', model: 'WH-R9270-C50-TL', max_distance_km: 35000 },
  },
  {
    id: 'shimano-ultegra-c36',
    name: 'Shimano Ultegra C36',
    bikeTypes: ['road'],
    front: { brand: 'Shimano', model: 'WH-R8170-C36-TL', max_distance_km: 45000 },
    rear: { brand: 'Shimano', model: 'WH-R8170-C36-TL', max_distance_km: 40000 },
  },
  {
    id: 'shimano-105-c46',
    name: 'Shimano 105 C46',
    bikeTypes: ['road'],
    front: { brand: 'Shimano', model: 'WH-RS710-C46-TL', max_distance_km: 50000 },
    rear: { brand: 'Shimano', model: 'WH-RS710-C46-TL', max_distance_km: 45000 },
  },
  {
    id: 'shimano-deore-xt-mt800',
    name: 'Shimano Deore XT MT800',
    bikeTypes: ['mtb'],
    front: { brand: 'Shimano', model: 'WH-MT800-TL', max_distance_km: 35000 },
    rear: { brand: 'Shimano', model: 'WH-MT800-TL', max_distance_km: 30000 },
  },
  // ── Newmen ──
  {
    id: 'newmen-advanced-sl',
    name: 'Newmen Advanced SL R.32',
    bikeTypes: ['road'],
    front: { brand: 'Newmen', model: 'Advanced SL R.32', max_distance_km: 40000 },
    rear: { brand: 'Newmen', model: 'Advanced SL R.32', max_distance_km: 35000 },
  },
  {
    id: 'newmen-evolution-sl',
    name: 'Newmen Evolution SL X.A.30',
    bikeTypes: ['mtb'],
    front: { brand: 'Newmen', model: 'Evolution SL X.A.30', max_distance_km: 30000 },
    rear: { brand: 'Newmen', model: 'Evolution SL X.A.30', max_distance_km: 25000 },
  },
];

// ─── Tire Presets ───────────────────────────────────────

export const TIRE_PRESETS: TirePreset[] = [
  // ── Continental ──
  {
    id: 'conti-gp5000',
    name: 'Continental GP5000 25mm',
    bikeTypes: ['road'],
    front: { brand: 'Continental', model: 'GP5000 25mm', max_distance_km: 6000 },
    rear: { brand: 'Continental', model: 'GP5000 25mm', max_distance_km: 5000 },
  },
  {
    id: 'conti-gp5000-s-tr',
    name: 'Continental GP5000 S TR 28mm',
    bikeTypes: ['road'],
    front: { brand: 'Continental', model: 'GP5000 S TR 28mm', max_distance_km: 6000 },
    rear: { brand: 'Continental', model: 'GP5000 S TR 28mm', max_distance_km: 5000 },
  },
  {
    id: 'conti-gp5000-s-tr-32',
    name: 'Continental GP5000 S TR 32mm',
    bikeTypes: ['road', 'gravel'],
    front: { brand: 'Continental', model: 'GP5000 S TR 32mm', max_distance_km: 6000 },
    rear: { brand: 'Continental', model: 'GP5000 S TR 32mm', max_distance_km: 5000 },
  },
  {
    id: 'conti-terra-speed',
    name: 'Continental Terra Speed 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Continental', model: 'Terra Speed 40mm', max_distance_km: 5000 },
    rear: { brand: 'Continental', model: 'Terra Speed 40mm', max_distance_km: 4000 },
  },
  {
    id: 'conti-terra-trail',
    name: 'Continental Terra Trail 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Continental', model: 'Terra Trail 40mm', max_distance_km: 5000 },
    rear: { brand: 'Continental', model: 'Terra Trail 40mm', max_distance_km: 4000 },
  },
  {
    id: 'conti-contact-urban',
    name: 'Continental Contact Urban 35mm',
    bikeTypes: ['city', 'ebike'],
    front: { brand: 'Continental', model: 'Contact Urban 35mm', max_distance_km: 8000 },
    rear: { brand: 'Continental', model: 'Contact Urban 35mm', max_distance_km: 6000 },
  },
  {
    id: 'conti-contact-plus',
    name: 'Continental Contact Plus 37mm',
    bikeTypes: ['city', 'ebike'],
    front: { brand: 'Continental', model: 'Contact Plus 37mm', max_distance_km: 10000 },
    rear: { brand: 'Continental', model: 'Contact Plus 37mm', max_distance_km: 8000 },
  },
  // ── Schwalbe ──
  {
    id: 'schwalbe-pro-one',
    name: 'Schwalbe Pro One TLE 28mm',
    bikeTypes: ['road'],
    front: { brand: 'Schwalbe', model: 'Pro One TLE 28mm', max_distance_km: 6000 },
    rear: { brand: 'Schwalbe', model: 'Pro One TLE 28mm', max_distance_km: 5000 },
  },
  {
    id: 'schwalbe-one',
    name: 'Schwalbe One TLE 25mm',
    bikeTypes: ['road'],
    front: { brand: 'Schwalbe', model: 'One TLE 25mm', max_distance_km: 5000 },
    rear: { brand: 'Schwalbe', model: 'One TLE 25mm', max_distance_km: 4000 },
  },
  {
    id: 'schwalbe-g-one-allround',
    name: 'Schwalbe G-One Allround 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Schwalbe', model: 'G-One Allround 40mm', max_distance_km: 5000 },
    rear: { brand: 'Schwalbe', model: 'G-One Allround 40mm', max_distance_km: 4000 },
  },
  {
    id: 'schwalbe-g-one-speed',
    name: 'Schwalbe G-One Speed 38mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Schwalbe', model: 'G-One Speed 38mm', max_distance_km: 4500 },
    rear: { brand: 'Schwalbe', model: 'G-One Speed 38mm', max_distance_km: 3500 },
  },
  {
    id: 'schwalbe-nobby-nic',
    name: 'Schwalbe Nobby Nic 2.35"',
    bikeTypes: ['mtb'],
    front: { brand: 'Schwalbe', model: 'Nobby Nic 2.35"', max_distance_km: 4000 },
    rear: { brand: 'Schwalbe', model: 'Nobby Nic 2.35"', max_distance_km: 3000 },
  },
  {
    id: 'schwalbe-racing-ralph',
    name: 'Schwalbe Racing Ralph 2.25"',
    bikeTypes: ['mtb'],
    front: { brand: 'Schwalbe', model: 'Racing Ralph 2.25"', max_distance_km: 4000 },
    rear: { brand: 'Schwalbe', model: 'Racing Ralph 2.25"', max_distance_km: 3000 },
  },
  {
    id: 'schwalbe-magic-mary',
    name: 'Schwalbe Magic Mary 2.4"',
    bikeTypes: ['mtb'],
    front: { brand: 'Schwalbe', model: 'Magic Mary 2.4"', max_distance_km: 3000 },
    rear: { brand: 'Schwalbe', model: 'Magic Mary 2.4"', max_distance_km: 2000 },
  },
  {
    id: 'schwalbe-hans-dampf',
    name: 'Schwalbe Hans Dampf 2.35"',
    bikeTypes: ['mtb'],
    front: { brand: 'Schwalbe', model: 'Hans Dampf 2.35"', max_distance_km: 3500 },
    rear: { brand: 'Schwalbe', model: 'Hans Dampf 2.35"', max_distance_km: 2500 },
  },
  {
    id: 'schwalbe-marathon',
    name: 'Schwalbe Marathon Plus 37mm',
    bikeTypes: ['city', 'ebike'],
    front: { brand: 'Schwalbe', model: 'Marathon Plus 37mm', max_distance_km: 12000 },
    rear: { brand: 'Schwalbe', model: 'Marathon Plus 37mm', max_distance_km: 10000 },
  },
  {
    id: 'schwalbe-smart-sam-plus',
    name: 'Schwalbe Smart Sam Plus 2.25"',
    bikeTypes: ['ebike', 'mtb'],
    front: { brand: 'Schwalbe', model: 'Smart Sam Plus 2.25"', max_distance_km: 6000 },
    rear: { brand: 'Schwalbe', model: 'Smart Sam Plus 2.25"', max_distance_km: 5000 },
  },
  // ── Maxxis ──
  {
    id: 'maxxis-minion-dhf',
    name: 'Maxxis Minion DHF 2.5"',
    bikeTypes: ['mtb'],
    front: { brand: 'Maxxis', model: 'Minion DHF 2.5" EXO+', max_distance_km: 3500 },
    rear: { brand: 'Maxxis', model: 'Minion DHF 2.5" EXO+', max_distance_km: 2500 },
  },
  {
    id: 'maxxis-minion-dhr-ii',
    name: 'Maxxis Minion DHR II 2.4"',
    bikeTypes: ['mtb'],
    front: { brand: 'Maxxis', model: 'Minion DHR II 2.4" EXO+', max_distance_km: 3500 },
    rear: { brand: 'Maxxis', model: 'Minion DHR II 2.4" EXO+', max_distance_km: 2500 },
  },
  {
    id: 'maxxis-dissector',
    name: 'Maxxis Dissector 2.4"',
    bikeTypes: ['mtb'],
    front: { brand: 'Maxxis', model: 'Dissector 2.4" EXO+', max_distance_km: 3500 },
    rear: { brand: 'Maxxis', model: 'Dissector 2.4" EXO+', max_distance_km: 2500 },
  },
  {
    id: 'maxxis-assegai',
    name: 'Maxxis Assegai 2.5"',
    bikeTypes: ['mtb'],
    front: { brand: 'Maxxis', model: 'Assegai 2.5" EXO+', max_distance_km: 3000 },
    rear: { brand: 'Maxxis', model: 'Assegai 2.5" EXO+', max_distance_km: 2000 },
  },
  {
    id: 'maxxis-rekon',
    name: 'Maxxis Rekon 2.4"',
    bikeTypes: ['mtb'],
    front: { brand: 'Maxxis', model: 'Rekon 2.4" EXO', max_distance_km: 4000 },
    rear: { brand: 'Maxxis', model: 'Rekon 2.4" EXO', max_distance_km: 3000 },
  },
  {
    id: 'maxxis-ikon',
    name: 'Maxxis Ikon 2.2"',
    bikeTypes: ['mtb'],
    front: { brand: 'Maxxis', model: 'Ikon 2.2" EXO', max_distance_km: 4500 },
    rear: { brand: 'Maxxis', model: 'Ikon 2.2" EXO', max_distance_km: 3500 },
  },
  {
    id: 'maxxis-receptor',
    name: 'Maxxis Receptor 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Maxxis', model: 'Receptor 40mm EXO', max_distance_km: 5000 },
    rear: { brand: 'Maxxis', model: 'Receptor 40mm EXO', max_distance_km: 4000 },
  },
  {
    id: 'maxxis-rambler',
    name: 'Maxxis Rambler 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Maxxis', model: 'Rambler 40mm EXO', max_distance_km: 4500 },
    rear: { brand: 'Maxxis', model: 'Rambler 40mm EXO', max_distance_km: 3500 },
  },
  // ── Vittoria ──
  {
    id: 'vittoria-corsa-next',
    name: 'Vittoria Corsa N.EXT 28mm',
    bikeTypes: ['road'],
    front: { brand: 'Vittoria', model: 'Corsa N.EXT 28mm', max_distance_km: 6000 },
    rear: { brand: 'Vittoria', model: 'Corsa N.EXT 28mm', max_distance_km: 5000 },
  },
  {
    id: 'vittoria-corsa-pro',
    name: 'Vittoria Corsa Pro 28mm',
    bikeTypes: ['road'],
    front: { brand: 'Vittoria', model: 'Corsa Pro 28mm', max_distance_km: 5000 },
    rear: { brand: 'Vittoria', model: 'Corsa Pro 28mm', max_distance_km: 4000 },
  },
  {
    id: 'vittoria-terreno-dry',
    name: 'Vittoria Terreno Dry 38mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Vittoria', model: 'Terreno Dry 38mm', max_distance_km: 4500 },
    rear: { brand: 'Vittoria', model: 'Terreno Dry 38mm', max_distance_km: 3500 },
  },
  // ── Pirelli ──
  {
    id: 'pirelli-p-zero-race',
    name: 'Pirelli P Zero Race 26mm',
    bikeTypes: ['road'],
    front: { brand: 'Pirelli', model: 'P Zero Race 26mm', max_distance_km: 5000 },
    rear: { brand: 'Pirelli', model: 'P Zero Race 26mm', max_distance_km: 4000 },
  },
  {
    id: 'pirelli-p-zero-race-tlr',
    name: 'Pirelli P Zero Race TLR 28mm',
    bikeTypes: ['road'],
    front: { brand: 'Pirelli', model: 'P Zero Race TLR 28mm', max_distance_km: 5500 },
    rear: { brand: 'Pirelli', model: 'P Zero Race TLR 28mm', max_distance_km: 4500 },
  },
  {
    id: 'pirelli-cinturato-gravel-h',
    name: 'Pirelli Cinturato Gravel H 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Pirelli', model: 'Cinturato Gravel H 40mm', max_distance_km: 5000 },
    rear: { brand: 'Pirelli', model: 'Cinturato Gravel H 40mm', max_distance_km: 4000 },
  },
  // ── Michelin ──
  {
    id: 'michelin-power-road',
    name: 'Michelin Power Road TLR 28mm',
    bikeTypes: ['road'],
    front: { brand: 'Michelin', model: 'Power Road TLR 28mm', max_distance_km: 6000 },
    rear: { brand: 'Michelin', model: 'Power Road TLR 28mm', max_distance_km: 5000 },
  },
  {
    id: 'michelin-power-gravel',
    name: 'Michelin Power Gravel 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'Michelin', model: 'Power Gravel 40mm', max_distance_km: 5000 },
    rear: { brand: 'Michelin', model: 'Power Gravel 40mm', max_distance_km: 4000 },
  },
  // ── WTB ──
  {
    id: 'wtb-riddler',
    name: 'WTB Riddler 37mm',
    bikeTypes: ['gravel'],
    front: { brand: 'WTB', model: 'Riddler TCS 37mm', max_distance_km: 5000 },
    rear: { brand: 'WTB', model: 'Riddler TCS 37mm', max_distance_km: 4000 },
  },
  {
    id: 'wtb-raddler',
    name: 'WTB Raddler 40mm',
    bikeTypes: ['gravel'],
    front: { brand: 'WTB', model: 'Raddler TCS 40mm', max_distance_km: 4500 },
    rear: { brand: 'WTB', model: 'Raddler TCS 40mm', max_distance_km: 3500 },
  },
  {
    id: 'wtb-vigilante',
    name: 'WTB Vigilante 2.5"',
    bikeTypes: ['mtb'],
    front: { brand: 'WTB', model: 'Vigilante TCS 2.5"', max_distance_km: 3500 },
    rear: { brand: 'WTB', model: 'Vigilante TCS 2.5"', max_distance_km: 2500 },
  },
];

// ─── Brand grouping helpers ─────────────────────────────

function extractBrand(name: string): string {
  // For groupsets: brand is first word (e.g. "Shimano Dura-Ace Di2 12s" → "Shimano")
  return name.split(' ')[0];
}

export function getGroupsetBrands(bikeType: string): string[] {
  const brands = new Set<string>();
  for (const g of GROUPSET_PRESETS) {
    if (g.bikeTypes.includes(bikeType)) {
      brands.add(extractBrand(g.name));
    }
  }
  return Array.from(brands);
}

export function getGroupsetsByBrand(bikeType: string, brand: string): GroupsetPreset[] {
  return GROUPSET_PRESETS.filter(
    (g) => g.bikeTypes.includes(bikeType) && extractBrand(g.name) === brand,
  );
}

export function getWheelBrands(bikeType: string): string[] {
  const brands = new Set<string>();
  for (const w of WHEEL_PRESETS) {
    if (w.bikeTypes.includes(bikeType)) {
      brands.add(w.front.brand);
    }
  }
  return Array.from(brands);
}

export function getWheelsByBrand(bikeType: string, brand: string): WheelPreset[] {
  return WHEEL_PRESETS.filter(
    (w) => w.bikeTypes.includes(bikeType) && w.front.brand === brand,
  );
}

export function getTireBrands(bikeType: string): string[] {
  const brands = new Set<string>();
  for (const t of TIRE_PRESETS) {
    if (t.bikeTypes.includes(bikeType)) {
      brands.add(t.front.brand);
    }
  }
  return Array.from(brands);
}

export function getTiresByBrand(bikeType: string, brand: string): TirePreset[] {
  return TIRE_PRESETS.filter(
    (t) => t.bikeTypes.includes(bikeType) && t.front.brand === brand,
  );
}

// ─── Merge function ─────────────────────────────────────

export function buildComponentsFromPresets(
  bikeType: string,
  groupsetId: string | null,
  wheelId: string | null,
  tireId: string | null,
): CatalogComponent[] {
  // Start with defaults for the bike type
  const base = (DEFAULT_COMPONENTS[bikeType] ?? DEFAULT_COMPONENTS.other).map((c) => ({
    category_key: c.category_key,
    name: c.name,
    max_distance_km: c.max_distance_km,
  }));

  // Build a map for easy lookup/override
  const componentMap = new Map<string, CatalogComponent>();
  for (const c of base) {
    componentMap.set(c.category_key, c);
  }

  // Apply groupset preset
  if (groupsetId) {
    const groupset = GROUPSET_PRESETS.find((g) => g.id === groupsetId);
    if (groupset) {
      for (const gc of groupset.components) {
        componentMap.set(gc.category_key, {
          category_key: gc.category_key,
          name: gc.name,
          brand: gc.brand,
          model: gc.model,
          max_distance_km: gc.max_distance_km,
        });
      }
    }
  }

  // Apply wheel preset
  if (wheelId) {
    const wheels = WHEEL_PRESETS.find((w) => w.id === wheelId);
    if (wheels) {
      componentMap.set('wheels_front', {
        category_key: 'wheels_front',
        name: 'Vorderrad',
        brand: wheels.front.brand,
        model: wheels.front.model,
        max_distance_km: wheels.front.max_distance_km,
      });
      componentMap.set('wheels_rear', {
        category_key: 'wheels_rear',
        name: 'Hinterrad',
        brand: wheels.rear.brand,
        model: wheels.rear.model,
        max_distance_km: wheels.rear.max_distance_km,
      });
    }
  }

  // Apply tire preset
  if (tireId) {
    const tires = TIRE_PRESETS.find((t) => t.id === tireId);
    if (tires) {
      componentMap.set('tires_front', {
        category_key: 'tires_front',
        name: 'Vorderreifen',
        brand: tires.front.brand,
        model: tires.front.model,
        max_distance_km: tires.front.max_distance_km,
      });
      componentMap.set('tires_rear', {
        category_key: 'tires_rear',
        name: 'Hinterreifen',
        brand: tires.rear.brand,
        model: tires.rear.model,
        max_distance_km: tires.rear.max_distance_km,
      });
    }
  }

  return Array.from(componentMap.values());
}
