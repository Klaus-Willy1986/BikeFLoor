// Static parts catalog for common bike components
// Used for autocomplete in the inventory form

export interface CatalogPart {
  brand: string;
  model: string;
  category_key: string;
  max_distance_km?: number;
}

export const PARTS_CATALOG: CatalogPart[] = [
  // ─── SHIMANO — Ketten ───────────────────────
  { brand: 'Shimano', model: 'CN-HG901-11 (Dura-Ace 11v)', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'Shimano', model: 'CN-HG701-11 (Ultegra 11v)', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'Shimano', model: 'CN-HG601-11 (105 11v)', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'Shimano', model: 'CN-M9100 (XTR 12v)', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'Shimano', model: 'CN-M8100 (XT 12v)', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'Shimano', model: 'CN-M7100 (SLX 12v)', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'Shimano', model: 'CN-M6100 (Deore 12v)', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'Shimano', model: 'CN-R9200 (Dura-Ace 12v)', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'Shimano', model: 'CN-R8100 (Ultegra 12v)', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'Shimano', model: 'CN-R7100 (105 12v)', category_key: 'chain', max_distance_km: 5000 },

  // ─── SHIMANO — Kassetten ────────────────────
  { brand: 'Shimano', model: 'CS-R9200 Dura-Ace 12v (11-30)', category_key: 'cassette', max_distance_km: 15000 },
  { brand: 'Shimano', model: 'CS-R9200 Dura-Ace 12v (11-34)', category_key: 'cassette', max_distance_km: 15000 },
  { brand: 'Shimano', model: 'CS-R8100 Ultegra 12v (11-30)', category_key: 'cassette', max_distance_km: 12000 },
  { brand: 'Shimano', model: 'CS-R8100 Ultegra 12v (11-34)', category_key: 'cassette', max_distance_km: 12000 },
  { brand: 'Shimano', model: 'CS-R7100 105 12v (11-34)', category_key: 'cassette', max_distance_km: 10000 },
  { brand: 'Shimano', model: 'CS-M9100 XTR 12v (10-51)', category_key: 'cassette', max_distance_km: 10000 },
  { brand: 'Shimano', model: 'CS-M8100 XT 12v (10-51)', category_key: 'cassette', max_distance_km: 8000 },
  { brand: 'Shimano', model: 'CS-M7100 SLX 12v (10-51)', category_key: 'cassette', max_distance_km: 8000 },

  // ─── SHIMANO — Bremsbeläge ──────────────────
  { brand: 'Shimano', model: 'L05A-RF Resin (Dura-Ace/Ultegra)', category_key: 'brake_pads', max_distance_km: 3000 },
  { brand: 'Shimano', model: 'L04C Metal (Dura-Ace/Ultegra)', category_key: 'brake_pads', max_distance_km: 5000 },
  { brand: 'Shimano', model: 'K05S-RX Resin (105/GRX)', category_key: 'brake_pads', max_distance_km: 2500 },
  { brand: 'Shimano', model: 'K04S Metal (105/GRX)', category_key: 'brake_pads', max_distance_km: 4000 },
  { brand: 'Shimano', model: 'B05S Resin (Deore/SLX)', category_key: 'brake_pads', max_distance_km: 2000 },
  { brand: 'Shimano', model: 'D03S Resin (XT/XTR 4-Kolben)', category_key: 'brake_pads', max_distance_km: 2000 },
  { brand: 'Shimano', model: 'N04C Metal (XT/XTR 4-Kolben)', category_key: 'brake_pads', max_distance_km: 4000 },

  // ─── SHIMANO — Bremsscheiben ────────────────
  { brand: 'Shimano', model: 'RT-CL900 (Dura-Ace, 140mm)', category_key: 'brake_rotors', max_distance_km: 20000 },
  { brand: 'Shimano', model: 'RT-CL900 (Dura-Ace, 160mm)', category_key: 'brake_rotors', max_distance_km: 20000 },
  { brand: 'Shimano', model: 'RT-CL800 (Ultegra, 140mm)', category_key: 'brake_rotors', max_distance_km: 15000 },
  { brand: 'Shimano', model: 'RT-CL800 (Ultegra, 160mm)', category_key: 'brake_rotors', max_distance_km: 15000 },
  { brand: 'Shimano', model: 'RT-MT900 (XTR, 180mm)', category_key: 'brake_rotors', max_distance_km: 15000 },
  { brand: 'Shimano', model: 'RT-MT800 (XT, 180mm)', category_key: 'brake_rotors', max_distance_km: 12000 },
  { brand: 'Shimano', model: 'RT-MT800 (XT, 203mm)', category_key: 'brake_rotors', max_distance_km: 12000 },

  // ─── SHIMANO — Tretlager ───────────────────
  { brand: 'Shimano', model: 'SM-BB92-41B (Pressfit Road)', category_key: 'bottom_bracket', max_distance_km: 20000 },
  { brand: 'Shimano', model: 'BB-R9100 (Dura-Ace BSA)', category_key: 'bottom_bracket', max_distance_km: 25000 },
  { brand: 'Shimano', model: 'SM-BBR60 (Ultegra/105 BSA)', category_key: 'bottom_bracket', max_distance_km: 20000 },
  { brand: 'Shimano', model: 'BB-MT800 (XT BSA)', category_key: 'bottom_bracket', max_distance_km: 15000 },

  // ─── SRAM — Ketten ─────────────────────────
  { brand: 'SRAM', model: 'Red AXS Flattop 12v', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'SRAM', model: 'Force AXS Flattop 12v', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'SRAM', model: 'Rival AXS Flattop 12v', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'SRAM', model: 'XX T-Type 12v', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'SRAM', model: 'X0 T-Type 12v', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'SRAM', model: 'GX Eagle T-Type 12v', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'SRAM', model: 'NX Eagle 12v', category_key: 'chain', max_distance_km: 3000 },
  { brand: 'SRAM', model: 'PC-1170 11v', category_key: 'chain', max_distance_km: 5000 },

  // ─── SRAM — Kassetten ──────────────────────
  { brand: 'SRAM', model: 'Red AXS XG-1290 12v (10-28)', category_key: 'cassette', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'Red AXS XG-1290 12v (10-33)', category_key: 'cassette', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'Force AXS XG-1270 12v (10-33)', category_key: 'cassette', max_distance_km: 12000 },
  { brand: 'SRAM', model: 'Force AXS XG-1270 12v (10-36)', category_key: 'cassette', max_distance_km: 12000 },
  { brand: 'SRAM', model: 'Rival AXS XG-1250 12v (10-36)', category_key: 'cassette', max_distance_km: 10000 },
  { brand: 'SRAM', model: 'XX T-Type XS-1297 12v (10-52)', category_key: 'cassette', max_distance_km: 10000 },
  { brand: 'SRAM', model: 'X0 T-Type XS-1275 12v (10-52)', category_key: 'cassette', max_distance_km: 8000 },
  { brand: 'SRAM', model: 'GX Eagle T-Type XS-1275 12v (10-52)', category_key: 'cassette', max_distance_km: 8000 },

  // ─── SRAM — Bremsbeläge ────────────────────
  { brand: 'SRAM', model: 'HRD Organic (Road)', category_key: 'brake_pads', max_distance_km: 3000 },
  { brand: 'SRAM', model: 'HRD Sintered (Road)', category_key: 'brake_pads', max_distance_km: 5000 },
  { brand: 'SRAM', model: 'Code/Guide Organic', category_key: 'brake_pads', max_distance_km: 2000 },
  { brand: 'SRAM', model: 'Code/Guide Sintered', category_key: 'brake_pads', max_distance_km: 4000 },
  { brand: 'SRAM', model: 'Level Organic', category_key: 'brake_pads', max_distance_km: 2000 },

  // ─── SRAM — Bremsscheiben ──────────────────
  { brand: 'SRAM', model: 'CenterLine XR 140mm', category_key: 'brake_rotors', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'CenterLine XR 160mm', category_key: 'brake_rotors', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'HS2 180mm', category_key: 'brake_rotors', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'HS2 200mm', category_key: 'brake_rotors', max_distance_km: 12000 },
  { brand: 'SRAM', model: 'Paceline 140mm', category_key: 'brake_rotors', max_distance_km: 18000 },
  { brand: 'SRAM', model: 'Paceline 160mm', category_key: 'brake_rotors', max_distance_km: 18000 },

  // ─── SRAM — Tretlager ─────────────────────
  { brand: 'SRAM', model: 'DUB BSA (68/73mm)', category_key: 'bottom_bracket', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'DUB Pressfit BB86', category_key: 'bottom_bracket', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'DUB Pressfit BB92', category_key: 'bottom_bracket', max_distance_km: 15000 },
  { brand: 'SRAM', model: 'DUB T47', category_key: 'bottom_bracket', max_distance_km: 20000 },

  // ─── CAMPAGNOLO — Ketten ───────────────────
  { brand: 'Campagnolo', model: 'C13 (13v Super Record/Record)', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'Campagnolo', model: 'Ekar 13v', category_key: 'chain', max_distance_km: 5000 },
  { brand: 'Campagnolo', model: 'CN-RE500 12v', category_key: 'chain', max_distance_km: 5000 },

  // ─── CAMPAGNOLO — Kassetten ────────────────
  { brand: 'Campagnolo', model: 'Super Record 13v (10-29)', category_key: 'cassette', max_distance_km: 15000 },
  { brand: 'Campagnolo', model: 'Super Record 13v (10-34)', category_key: 'cassette', max_distance_km: 15000 },
  { brand: 'Campagnolo', model: 'Ekar 13v (9-36)', category_key: 'cassette', max_distance_km: 12000 },
  { brand: 'Campagnolo', model: 'Ekar 13v (10-44)', category_key: 'cassette', max_distance_km: 12000 },

  // ─── CAMPAGNOLO — Bremsbeläge ──────────────
  { brand: 'Campagnolo', model: 'DB-310 Organic', category_key: 'brake_pads', max_distance_km: 3000 },
  { brand: 'Campagnolo', model: 'DB-310 Sintered', category_key: 'brake_pads', max_distance_km: 5000 },

  // ─── CONTINENTAL — Reifen ──────────────────
  { brand: 'Continental', model: 'GP 5000 S TR 25mm', category_key: 'tires_front', max_distance_km: 8000 },
  { brand: 'Continental', model: 'GP 5000 S TR 28mm', category_key: 'tires_front', max_distance_km: 8000 },
  { brand: 'Continental', model: 'GP 5000 S TR 30mm', category_key: 'tires_front', max_distance_km: 8000 },
  { brand: 'Continental', model: 'GP 5000 S TR 32mm', category_key: 'tires_front', max_distance_km: 8000 },
  { brand: 'Continental', model: 'GP 5000 AS TR 28mm', category_key: 'tires_front', max_distance_km: 10000 },
  { brand: 'Continental', model: 'GP 5000 AS TR 32mm', category_key: 'tires_front', max_distance_km: 10000 },
  { brand: 'Continental', model: 'GP 5000 TT TR 25mm', category_key: 'tires_front', max_distance_km: 4000 },
  { brand: 'Continental', model: 'Terra Trail 40mm', category_key: 'tires_front', max_distance_km: 6000 },
  { brand: 'Continental', model: 'Terra Speed 35mm', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Continental', model: 'Kryptotal Front 29" Trail', category_key: 'tires_front', max_distance_km: 4000 },
  { brand: 'Continental', model: 'Kryptotal Rear 29" Trail', category_key: 'tires_rear', max_distance_km: 3000 },
  { brand: 'Continental', model: 'Argotal 29" DH', category_key: 'tires_front', max_distance_km: 3000 },

  // ─── SCHWALBE — Reifen ─────────────────────
  { brand: 'Schwalbe', model: 'Pro One TLE 25mm', category_key: 'tires_front', max_distance_km: 7000 },
  { brand: 'Schwalbe', model: 'Pro One TLE 28mm', category_key: 'tires_front', max_distance_km: 7000 },
  { brand: 'Schwalbe', model: 'Pro One TLE 30mm', category_key: 'tires_front', max_distance_km: 7000 },
  { brand: 'Schwalbe', model: 'G-One Allround 40mm', category_key: 'tires_front', max_distance_km: 6000 },
  { brand: 'Schwalbe', model: 'G-One Speed 30mm', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Schwalbe', model: 'G-One R 35mm', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Schwalbe', model: 'Magic Mary 29" Super Trail', category_key: 'tires_front', max_distance_km: 4000 },
  { brand: 'Schwalbe', model: 'Hans Dampf 29" Super Trail', category_key: 'tires_front', max_distance_km: 4000 },
  { brand: 'Schwalbe', model: 'Nobby Nic 29" Super Ground', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Schwalbe', model: 'Racing Ralph 29" Super Race', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Schwalbe', model: 'Marathon Plus 28" (Pannenschutz)', category_key: 'tires_front', max_distance_km: 12000 },

  // ─── PIRELLI — Reifen ──────────────────────
  { brand: 'Pirelli', model: 'P ZERO Race TLR 26mm', category_key: 'tires_front', max_distance_km: 6000 },
  { brand: 'Pirelli', model: 'P ZERO Race TLR 28mm', category_key: 'tires_front', max_distance_km: 6000 },
  { brand: 'Pirelli', model: 'Cinturato Gravel H 35mm', category_key: 'tires_front', max_distance_km: 6000 },
  { brand: 'Pirelli', model: 'Cinturato Gravel M 40mm', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Pirelli', model: 'Scorpion XC RC 29"', category_key: 'tires_front', max_distance_km: 4000 },

  // ─── VITTORIA — Reifen ─────────────────────
  { brand: 'Vittoria', model: 'Corsa PRO TLR 28mm', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Vittoria', model: 'Corsa N.EXT TLR 28mm', category_key: 'tires_front', max_distance_km: 7000 },
  { brand: 'Vittoria', model: 'Terreno Dry 33mm', category_key: 'tires_front', max_distance_km: 5000 },

  // ─── MAXXIS — Reifen ───────────────────────
  { brand: 'Maxxis', model: 'Minion DHF 29" EXO+', category_key: 'tires_front', max_distance_km: 4000 },
  { brand: 'Maxxis', model: 'Minion DHR II 29" EXO+', category_key: 'tires_rear', max_distance_km: 3000 },
  { brand: 'Maxxis', model: 'Dissector 29" EXO+', category_key: 'tires_front', max_distance_km: 4000 },
  { brand: 'Maxxis', model: 'Assegai 29" EXO+', category_key: 'tires_front', max_distance_km: 3500 },
  { brand: 'Maxxis', model: 'Rekon 29" EXO', category_key: 'tires_rear', max_distance_km: 4000 },
  { brand: 'Maxxis', model: 'Ikon 29" EXO', category_key: 'tires_front', max_distance_km: 5000 },
  { brand: 'Maxxis', model: 'Rambler 40mm EXO', category_key: 'tires_front', max_distance_km: 6000 },
  { brand: 'Maxxis', model: 'Receptor 40mm EXO', category_key: 'tires_front', max_distance_km: 7000 },

  // ─── SUPACAZ / LIZARD SKINS — Lenkerband ──
  { brand: 'Supacaz', model: 'Super Sticky Kush', category_key: 'handlebar_tape', max_distance_km: 5000 },
  { brand: 'Supacaz', model: 'Super Sticky Kush Star Fade', category_key: 'handlebar_tape', max_distance_km: 5000 },
  { brand: 'Lizard Skins', model: 'DSP 2.5mm', category_key: 'handlebar_tape', max_distance_km: 6000 },
  { brand: 'Lizard Skins', model: 'DSP 3.2mm', category_key: 'handlebar_tape', max_distance_km: 6000 },
  { brand: 'Fizik', model: 'Vento Microtex Tacky', category_key: 'handlebar_tape', max_distance_km: 5000 },
  { brand: 'Fizik', model: 'Vento Solocush Tacky', category_key: 'handlebar_tape', max_distance_km: 5000 },
  { brand: 'PRO', model: 'Sport Control', category_key: 'handlebar_tape', max_distance_km: 5000 },
  { brand: 'PRO', model: 'Race Comfort', category_key: 'handlebar_tape', max_distance_km: 5000 },

  // ─── SwissStop — Bremsbeläge ───────────────
  { brand: 'SwissStop', model: 'Disc 34 RS Organic (Shimano)', category_key: 'brake_pads', max_distance_km: 3000 },
  { brand: 'SwissStop', model: 'Disc 34 RS Sintered (Shimano)', category_key: 'brake_pads', max_distance_km: 5000 },
  { brand: 'SwissStop', model: 'Disc 35 RS Organic (SRAM)', category_key: 'brake_pads', max_distance_km: 3000 },
  { brand: 'SwissStop', model: 'EXOTherm2 (Shimano 4-Piston)', category_key: 'brake_pads', max_distance_km: 4000 },

  // ─── CeramicSpeed / Chris King — Tretlager ─
  { brand: 'CeramicSpeed', model: 'BB86 Coated', category_key: 'bottom_bracket', max_distance_km: 30000 },
  { brand: 'CeramicSpeed', model: 'BSA Coated', category_key: 'bottom_bracket', max_distance_km: 30000 },
  { brand: 'CeramicSpeed', model: 'T47 Coated', category_key: 'bottom_bracket', max_distance_km: 30000 },
  { brand: 'Chris King', model: 'ThreadFit 24 BSA', category_key: 'bottom_bracket', max_distance_km: 40000 },
  { brand: 'Chris King', model: 'ThreadFit 30 T47', category_key: 'bottom_bracket', max_distance_km: 40000 },

  // ─── Jagwire / Shimano — Züge ──────────────
  { brand: 'Jagwire', model: 'Road Elite Link Brake Set', category_key: 'cables', max_distance_km: 10000 },
  { brand: 'Jagwire', model: 'Pro Road Brake Set', category_key: 'cables', max_distance_km: 8000 },
  { brand: 'Jagwire', model: 'Mountain Elite Link Brake Set', category_key: 'cables', max_distance_km: 8000 },
  { brand: 'Shimano', model: 'OT-SP41 Schalt-Set (Road)', category_key: 'cables', max_distance_km: 10000 },
  { brand: 'Shimano', model: 'OT-RS900 Polymer Schalt-Set', category_key: 'cables', max_distance_km: 12000 },
  { brand: 'Shimano', model: 'BH90 Bremsleitung (1700mm)', category_key: 'cables', max_distance_km: 20000 },

  // ─── Diverse — Steuersätze ─────────────────
  { brand: 'Chris King', model: 'InSet i7 (ZS44/EC44)', category_key: 'headset', max_distance_km: 50000 },
  { brand: 'Chris King', model: 'NoThreadSet (EC34)', category_key: 'headset', max_distance_km: 50000 },
  { brand: 'Cane Creek', model: '110 ZS44/28.6 | EC44/40', category_key: 'headset', max_distance_km: 30000 },
  { brand: 'Cane Creek', model: '40 ZS44/28.6 | EC44/40', category_key: 'headset', max_distance_km: 20000 },

  // ─── Diverse — Pedale ──────────────────────
  { brand: 'Shimano', model: 'PD-R9100 (Dura-Ace SPD-SL)', category_key: 'pedals' },
  { brand: 'Shimano', model: 'PD-R8000 (Ultegra SPD-SL)', category_key: 'pedals' },
  { brand: 'Shimano', model: 'PD-R7000 (105 SPD-SL)', category_key: 'pedals' },
  { brand: 'Shimano', model: 'PD-M9120 (XTR SPD Trail)', category_key: 'pedals' },
  { brand: 'Shimano', model: 'PD-M8120 (XT SPD Trail)', category_key: 'pedals' },
  { brand: 'Shimano', model: 'PD-ES600 (SPD Road)', category_key: 'pedals' },
  { brand: 'Look', model: 'Kéo Blade Carbon', category_key: 'pedals' },
  { brand: 'Look', model: 'X-Track Race Carbon', category_key: 'pedals' },
  { brand: 'Wahoo', model: 'Speedplay Zero', category_key: 'pedals' },
  { brand: 'Wahoo', model: 'Speedplay Nano', category_key: 'pedals' },
  { brand: 'Crankbrothers', model: 'Eggbeater 3', category_key: 'pedals' },
  { brand: 'Crankbrothers', model: 'Candy 7', category_key: 'pedals' },
  { brand: 'Crankbrothers', model: 'Stamp 7', category_key: 'pedals' },

  // ─── Sättel ────────────────────────────────
  { brand: 'Fizik', model: 'Antares Versus Evo R1', category_key: 'saddle' },
  { brand: 'Fizik', model: 'Argo Vento R1', category_key: 'saddle' },
  { brand: 'Fizik', model: 'Terra Argo X5', category_key: 'saddle' },
  { brand: 'Selle Italia', model: 'SLR Boost Kit Carbonio', category_key: 'saddle' },
  { brand: 'Selle Italia', model: 'Flite Boost', category_key: 'saddle' },
  { brand: 'Prologo', model: 'Dimension NDR', category_key: 'saddle' },
  { brand: 'Prologo', model: 'Scratch M5', category_key: 'saddle' },
  { brand: 'Specialized', model: 'Power Expert Mirror', category_key: 'saddle' },
  { brand: 'Specialized', model: 'Romin Evo Expert', category_key: 'saddle' },
  { brand: 'Ergon', model: 'SM Pro', category_key: 'saddle' },
  { brand: 'Ergon', model: 'SME10', category_key: 'saddle' },
  { brand: 'SQLab', model: '612 Ergowave Active', category_key: 'saddle' },
  { brand: 'WTB', model: 'Volt', category_key: 'saddle' },
];

// Groups: categories that should appear as a single pill in the catalog UI
// e.g. "tires" groups tires_front + tires_rear
const CATEGORY_GROUPS: Record<string, string[]> = {
  tires: ['tires_front', 'tires_rear'],
  wheels: ['wheels_front', 'wheels_rear'],
};

// Reverse map: tires_front → tires, tires_rear → tires
const CATEGORY_TO_GROUP: Record<string, string> = {};
for (const [group, keys] of Object.entries(CATEGORY_GROUPS)) {
  for (const key of keys) {
    CATEGORY_TO_GROUP[key] = group;
  }
}

function expandCategoryKey(categoryKey: string): string[] {
  return CATEGORY_GROUPS[categoryKey] ?? [categoryKey];
}

/**
 * Get all unique category keys in the catalog.
 * Groups like tires_front + tires_rear into "tires".
 */
export function getCatalogCategories(): string[] {
  const keys = new Set<string>();
  for (const part of PARTS_CATALOG) {
    keys.add(CATEGORY_TO_GROUP[part.category_key] ?? part.category_key);
  }
  return Array.from(keys);
}

/**
 * Get all parts for a given category key.
 * Supports grouped keys like "tires" → tires_front + tires_rear.
 */
export function getPartsByCategory(categoryKey: string): CatalogPart[] {
  const expanded = expandCategoryKey(categoryKey);
  return PARTS_CATALOG.filter((p) => expanded.includes(p.category_key));
}

/**
 * Search the parts catalog by query string, optionally filtered by category.
 * Matches against "brand model" combined.
 */
export function searchPartsCatalog(query: string, categoryKey?: string, limit = 50): CatalogPart[] {
  const source = categoryKey
    ? PARTS_CATALOG.filter((p) => expandCategoryKey(categoryKey).includes(p.category_key))
    : PARTS_CATALOG;

  const q = query.toLowerCase().trim();
  if (q.length < 1) return source.slice(0, limit);

  const terms = q.split(/\s+/);

  const scored = source.map((part) => {
    const full = `${part.brand} ${part.model}`.toLowerCase();
    let score = 0;

    if (full.startsWith(q)) score += 80;
    else if (full.includes(q)) score += 60;

    const allTermsMatch = terms.every((term) => full.includes(term));
    if (allTermsMatch) score += 40;

    for (const term of terms) {
      if (part.brand.toLowerCase().startsWith(term)) score += 20;
      if (part.model.toLowerCase().includes(term)) score += 10;
    }

    return { part, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((s) => s.part);
}
