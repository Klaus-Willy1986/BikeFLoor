-- Populate bike_templates with researched component specifications
-- Sources: Canyon, Specialized, Trek, Giant, Scott, Cervélo, Pinarello, Colnago, BMC, Factor, Wilier, Cannondale, Orbea, Ridley + manufacturer websites

-- ═══════════════════════════════════════════════════
-- CANYON ROAD
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra CN-M8100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra CS-R8100 11-34T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Token","model":"Ninja Lite BB4124","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ARC 1400 DICUT 62","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ARC 1400 DICUT 62","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 25mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Aeroad CF SLX';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"105 CN-M7100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"105 CS-R7100 11-36T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Token","model":"Ninja Lite BB4124","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"105 Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ARC 1600 DICUT 50","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ARC 1600 DICUT 50","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 25mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Aeroad CF SL';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra CN-M8100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra CS-R8100 11-34T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Token","model":"Ninja Lite BB4124","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ARC 1400 DICUT 50","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ARC 1400 DICUT 50","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 25mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Ultimate CF SLX';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"105 CN-M7100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"105 CS-R7100 11-34T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Token","model":"Ninja Lite BB4124","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"105 Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ARC 1600 DICUT 50","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ARC 1600 DICUT 50","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 25mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Ultimate CF SL';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra CN-M8100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra CS-R8100 11-34T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Token","model":"Ninja Lite BB4124","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ERC 1400 DICUT 35","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ERC 1400 DICUT 35","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Endurace CF SLX';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"105 CN-M7100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"105 CS-R7100 11-34T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Token","model":"Ninja Lite BB4124","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"105 Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"Endurance LN","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"Endurance LN","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Endurace CF SL';

-- ═══════════════════════════════════════════════════
-- CANYON GRAVEL
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"GRX CN-M8100 12v","max_distance_km":4000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"CS-R8100 11-34T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Shimano","model":"SM-BB72","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"GRX Resin","max_distance_km":2500},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"GRC 1400 Spline 42","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"GRC 1400 Spline 42","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Schwalbe","model":"G-One R 40mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Schwalbe","model":"G-One R 40mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Grail CF SLX';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"Rival 12v","max_distance_km":4000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"Rival XPLR XG-1251 10-44T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"SRAM","model":"DUB Pressfit","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Rival Organic","max_distance_km":2500},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"Paceline 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"Gravel LN","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"Gravel LN","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Schwalbe","model":"G-One R 40mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Schwalbe","model":"G-One R 40mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Grail CF SL';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"GRX CN-M8100 12v","max_distance_km":4000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"11-34T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Shimano","model":"SM-BB72","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"GRX Resin","max_distance_km":2500},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"GRC 1400 Spline 42","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"GRC 1400 Spline 42","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Schwalbe","model":"G-One Bite 45mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Schwalbe","model":"G-One Bite 45mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Grizl CF SLX';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"GRX CN-M8100 12v","max_distance_km":4000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"11-42T","max_distance_km":10000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"Shimano","model":"SM-BB72","max_distance_km":20000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"GRX Resin","max_distance_km":2500},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"G 1800 Spline 25","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"G 1800 Spline 25","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Schwalbe","model":"G-One Bite 45mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Schwalbe","model":"G-One Bite 45mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Canyon","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Grizl CF SL';

-- ═══════════════════════════════════════════════════
-- CANYON MTB
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"GX Eagle 12v","max_distance_km":3000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"XS-1275 Eagle 10-52T","max_distance_km":8000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"SRAM","model":"DUB Pressfit","max_distance_km":15000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Code Bronze Organic","max_distance_km":2000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"CenterLine 200mm","max_distance_km":10000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"XM 1700 Spline 29\"","max_distance_km":25000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"XM 1700 Spline 29\"","max_distance_km":20000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Maxxis","model":"Minion DHR II 29x2.4","max_distance_km":4000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Maxxis","model":"Minion DHR II 29x2.4","max_distance_km":3000},
  {"category_key":"fork","name":"Gabel (Service)","brand":"RockShox","model":"Lyrik Select+ 150mm","max_distance_km":5000},
  {"category_key":"shock","name":"Dämpfer (Service)","brand":"RockShox","model":"Super Deluxe Select+ Coil","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Spectral CF';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"GX Eagle 12v","max_distance_km":3000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"XS-1275 Eagle 10-52T","max_distance_km":8000},
  {"category_key":"bottom_bracket","name":"Tretlager","brand":"SRAM","model":"DUB Pressfit","max_distance_km":15000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Code Bronze Organic","max_distance_km":2000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"CenterLine 180mm","max_distance_km":10000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"XM 1700 Spline 29\"","max_distance_km":25000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"XM 1700 Spline 29\"","max_distance_km":20000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Schwalbe","model":"Nobby Nic 29x2.4","max_distance_km":4000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Schwalbe","model":"Wicked Will 29x2.4","max_distance_km":3000},
  {"category_key":"fork","name":"Gabel (Service)","brand":"RockShox","model":"Pike Select+ 140mm","max_distance_km":5000},
  {"category_key":"shock","name":"Dämpfer (Service)","brand":"RockShox","model":"Deluxe Select+ 130mm","max_distance_km":5000}
]' WHERE manufacturer = 'Canyon' AND model = 'Neuron CF';

-- ═══════════════════════════════════════════════════
-- SPECIALIZED
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra CN-R8100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra CS-R8100 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Roval","model":"C38 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Roval","model":"C38 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Specialized","model":"S-Works Turbo 26mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Specialized","model":"S-Works Turbo 26mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Specialized","max_distance_km":5000}
]' WHERE manufacturer = 'Specialized' AND model = 'Tarmac SL8';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra CN-R8100 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra CS-R8100 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Roval","model":"C38 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Roval","model":"C38 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Specialized","model":"S-Works Turbo 26mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Specialized","model":"S-Works Turbo 26mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Specialized","max_distance_km":5000}
]' WHERE manufacturer = 'Specialized' AND model = 'Aethos';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"Rival 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"XG-1250 10-36T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Rival Organic","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"Paceline 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Roval","model":"Terra C 32mm Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Roval","model":"Terra C 32mm Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Specialized","model":"S-Works Mondo 32mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Specialized","model":"S-Works Mondo 32mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Specialized","max_distance_km":5000}
]' WHERE manufacturer = 'Specialized' AND model = 'Roubaix';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"Rival XPLR 12v","max_distance_km":4000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"XPLR XG-1251 10-44T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Rival Organic","max_distance_km":2500},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"CenterLine 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Roval","model":"Terra C 32mm Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Roval","model":"Terra C 32mm Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Specialized","model":"Pathfinder Pro 38mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Specialized","model":"Pathfinder Pro 38mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Specialized","max_distance_km":5000}
]' WHERE manufacturer = 'Specialized' AND model = 'Crux';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"GX Eagle 12v","max_distance_km":3000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"GX Eagle 10-52T","max_distance_km":8000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Maven Bronze Organic","max_distance_km":2000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"200mm","max_distance_km":10000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Roval","model":"Traverse Alloy 30mm","max_distance_km":25000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Roval","model":"Traverse Alloy 30mm","max_distance_km":20000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Specialized","model":"Butcher GRID TRAIL 29x2.3","max_distance_km":4000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Specialized","model":"Eliminator GRID TRAIL 29x2.3","max_distance_km":3000},
  {"category_key":"fork","name":"Gabel (Service)","brand":"Fox","model":"Float 36 Performance Elite 150mm","max_distance_km":5000},
  {"category_key":"shock","name":"Dämpfer (Service)","brand":"Fox","model":"Float Performance Elite 145mm","max_distance_km":5000}
]' WHERE manufacturer = 'Specialized' AND model = 'Stumpjumper';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"GX Eagle 12v","max_distance_km":3000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"GX Eagle 10-52T","max_distance_km":8000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Motive Bronze Organic","max_distance_km":2000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"180/160mm","max_distance_km":10000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Roval","model":"Control SL V Carbon 29\"","max_distance_km":25000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Roval","model":"Control SL V Carbon 29\"","max_distance_km":20000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Specialized","model":"Fast Trak 29x2.35","max_distance_km":4000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Specialized","model":"Air Trak 29x2.35","max_distance_km":3000},
  {"category_key":"fork","name":"Gabel (Service)","brand":"RockShox","model":"SID Select+ 120mm","max_distance_km":5000},
  {"category_key":"shock","name":"Dämpfer (Service)","brand":"RockShox","model":"SIDLuxe Select+ 120mm","max_distance_km":5000}
]' WHERE manufacturer = 'Specialized' AND model = 'Epic 8';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"GX Eagle 12v","max_distance_km":3000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"XG-1275 10-52T","max_distance_km":8000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Code RS Organic","max_distance_km":2000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"200mm","max_distance_km":10000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Specialized","model":"Butcher GRID TRAIL 29x2.3","max_distance_km":4000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Specialized","model":"Butcher GRID TRAIL 29x2.3","max_distance_km":3000},
  {"category_key":"fork","name":"Gabel (Service)","brand":"RockShox","model":"ZEB Select+ 170mm","max_distance_km":5000},
  {"category_key":"shock","name":"Dämpfer (Service)","brand":"RockShox","model":"Super Deluxe Select+ 170mm","max_distance_km":5000}
]' WHERE manufacturer = 'Specialized' AND model = 'Enduro';

-- ═══════════════════════════════════════════════════
-- TREK
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Bontrager","model":"Aeolus RSL 51 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Bontrager","model":"Aeolus RSL 51 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Pirelli","model":"P Zero Race TLR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Pirelli","model":"P Zero Race TLR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Bontrager","max_distance_km":5000}
]' WHERE manufacturer = 'Trek' AND model = 'Madone SLR';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Bontrager","model":"Aeolus Pro 51 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Bontrager","model":"Aeolus Pro 51 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Pirelli","model":"P Zero Race TLR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Pirelli","model":"P Zero Race TLR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Bontrager","max_distance_km":5000}
]' WHERE manufacturer = 'Trek' AND model = 'Madone SL';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Bontrager","model":"Aeolus RSL 37 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Bontrager","model":"Aeolus RSL 37 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Bontrager","model":"R3 Hard-Case Lite 25mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Bontrager","model":"R3 Hard-Case Lite 25mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Bontrager","max_distance_km":5000}
]' WHERE manufacturer = 'Trek' AND model = 'Emonda SLR';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Bontrager","model":"Aeolus Pro 37 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Bontrager","model":"Aeolus Pro 37 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Bontrager","model":"R2 Hard-Case Lite 25mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Bontrager","model":"R2 Hard-Case Lite 25mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Bontrager","max_distance_km":5000}
]' WHERE manufacturer = 'Trek' AND model = 'Emonda SL';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Bontrager","model":"Aeolus RSL 37 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Bontrager","model":"Aeolus RSL 37 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Bontrager","model":"R3 Hard-Case Lite TLR 32mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Bontrager","model":"R3 Hard-Case Lite TLR 32mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Bontrager","max_distance_km":5000}
]' WHERE manufacturer = 'Trek' AND model = 'Domane SLR';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Bontrager","model":"Aeolus Pro 37 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Bontrager","model":"Aeolus Pro 37 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Bontrager","model":"R3 Hard-Case Lite TLR 32mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Bontrager","model":"R3 Hard-Case Lite TLR 32mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Bontrager","max_distance_km":5000}
]' WHERE manufacturer = 'Trek' AND model = 'Domane SL';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"GX Eagle AXS 12v","max_distance_km":3000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"GX Eagle 10-52T","max_distance_km":8000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"Organic","max_distance_km":2000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"CenterLine 200/180mm","max_distance_km":10000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Bontrager","model":"Line Elite 30 29\"","max_distance_km":25000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Bontrager","model":"Line Elite 30 29\"","max_distance_km":20000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Bontrager","model":"SE5 Team Issue 29x2.5","max_distance_km":4000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Bontrager","model":"SE5 Team Issue 29x2.5","max_distance_km":3000},
  {"category_key":"fork","name":"Gabel (Service)","brand":"Fox","model":"Performance 36 150mm","max_distance_km":5000},
  {"category_key":"shock","name":"Dämpfer (Service)","brand":"Fox","model":"Performance Float X 140mm","max_distance_km":5000}
]' WHERE manufacturer = 'Trek' AND model = 'Fuel EX';

-- ═══════════════════════════════════════════════════
-- GIANT
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"CADEX","model":"40 Disc Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"CADEX","model":"40 Disc Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"CADEX","model":"Race GC TLR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"CADEX","model":"Race GC TLR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Giant","max_distance_km":5000}
]' WHERE manufacturer = 'Giant' AND model = 'TCR Advanced SL';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL800 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Giant","model":"SLR 0 40 Disc Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Giant","model":"SLR 0 40 Disc Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"CADEX","model":"Race GC TLR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"CADEX","model":"Race GC TLR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Giant","max_distance_km":5000}
]' WHERE manufacturer = 'Giant' AND model = 'TCR Advanced Pro';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"RED AXS 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"RED XG-1290 10-33T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"RED Organic","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"PaceLine X 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"CADEX","model":"50 Ultra Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"CADEX","model":"50 Ultra Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"CADEX","model":"Aero TLR 25mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"CADEX","model":"Aero TLR 25mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Giant","max_distance_km":5000}
]' WHERE manufacturer = 'Giant' AND model = 'Propel Advanced SL';

-- ═══════════════════════════════════════════════════
-- SCOTT
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Syncros","model":"Capital 1.0S 40mm","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Syncros","model":"Capital 1.0S 40mm","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Schwalbe","model":"Pro One TLE 30mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Schwalbe","model":"Pro One TLE 30mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Syncros","max_distance_km":5000}
]' WHERE manufacturer = 'Scott' AND model = 'Addict RC';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Syncros","model":"Capital 1.0S Aero 60mm","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Syncros","model":"Capital 1.0S Aero 60mm","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Schwalbe","model":"Pro One Aero TLE 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Schwalbe","model":"Pro One Aero TLE 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Syncros","max_distance_km":5000}
]' WHERE manufacturer = 'Scott' AND model = 'Foil RC';

-- ═══════════════════════════════════════════════════
-- PREMIUM BRANDS
-- ═══════════════════════════════════════════════════

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-34T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Reserve","model":"57 Carbon (DT Swiss 180)","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Reserve","model":"64 Carbon (DT Swiss 180)","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa Pro TLR 29mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa Pro TLR 29mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Cervélo","max_distance_km":5000}
]' WHERE manufacturer = 'Cervélo' AND model = 'S5';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Reserve","model":"34 Carbon (DT Swiss 240)","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Reserve","model":"37 Carbon (DT Swiss 240)","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa Pro Speed TLR 26mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa Pro Speed TLR 26mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Cervélo","max_distance_km":5000}
]' WHERE manufacturer = 'Cervélo' AND model = 'R5';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Princeton CarbonWorks","model":"Peak 4550","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Princeton CarbonWorks","model":"Peak 4550","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Pinarello","max_distance_km":5000}
]' WHERE manufacturer = 'Pinarello' AND model = 'Dogma F';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Shimano","model":"Dura-Ace C50 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Shimano","model":"Dura-Ace C50 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 S TR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Colnago","max_distance_km":5000}
]' WHERE manufacturer = 'Colnago' AND model = 'V4Rs';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"RED AXS 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"RED XG-1290","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"RED Organic","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"PaceLine X 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ARC 1100 DICUT 38","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ARC 1100 DICUT 38","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Pirelli","model":"P Zero Race TLR RS 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Pirelli","model":"P Zero Race TLR RS 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"BMC","max_distance_km":5000}
]' WHERE manufacturer = 'BMC' AND model = 'Teammachine SLR';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"SRAM","model":"RED AXS 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"SRAM","model":"RED XG-1290","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"SRAM","model":"RED Organic","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"SRAM","model":"PaceLine X 160mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ERC 1100 DICUT 45","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ERC 1100 DICUT 45","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa N.EXT 30mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa N.EXT 30mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"BMC","max_distance_km":5000}
]' WHERE manufacturer = 'BMC' AND model = 'Roadmachine';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Black Inc","model":"48mm Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Black Inc","model":"58mm Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Goodyear","model":"Eagle F1R 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Goodyear","model":"Eagle F1R 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Factor","max_distance_km":5000}
]' WHERE manufacturer = 'Factor' AND model = 'Ostro VAM';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Black Inc","model":"28mm Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Black Inc","model":"33mm Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Goodyear","model":"Eagle F1R 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Goodyear","model":"Eagle F1R 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Factor","max_distance_km":5000}
]' WHERE manufacturer = 'Factor' AND model = 'O2 VAM';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Miche","model":"Kleos RD 50 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Miche","model":"Kleos RD 50 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa Pro 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa Pro 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Wilier","max_distance_km":5000}
]' WHERE manufacturer = 'Wilier' AND model = 'Filante SLR';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Miche","model":"Kleos RD 36 Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Miche","model":"Kleos RD 36 Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa Pro 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa Pro 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Wilier","max_distance_km":5000}
]' WHERE manufacturer = 'Wilier' AND model = 'Zero SLR';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Reserve","model":"57 Carbon (DT Swiss 180)","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Reserve","model":"64 Carbon (DT Swiss 180)","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa Pro TLR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa Pro TLR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Cannondale","max_distance_km":5000}
]' WHERE manufacturer = 'Cannondale' AND model = 'SuperSix EVO';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"OQUO","model":"RP35 LTD Carbon 35mm","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"OQUO","model":"RP35 LTD Carbon 35mm","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa Pro Speed TLR 26mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa Pro Speed TLR 26mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Orbea","max_distance_km":5000}
]' WHERE manufacturer = 'Orbea' AND model = 'Orca';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ARC 1400 DICUT Carbon","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ARC 1400 DICUT Carbon","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Vittoria","model":"Corsa Pro TLR 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Vittoria","model":"Corsa Pro TLR 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Ridley","max_distance_km":5000}
]' WHERE manufacturer = 'Ridley' AND model = 'Falcn RS';

UPDATE bike_templates SET is_verified = TRUE, components = '[
  {"category_key":"chain","name":"Kette","brand":"Shimano","model":"Dura-Ace 12v","max_distance_km":5000},
  {"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Dura-Ace 11-30T","max_distance_km":10000},
  {"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Dura-Ace Resin","max_distance_km":3000},
  {"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"RT-CL900 160/140mm","max_distance_km":15000},
  {"category_key":"wheels_front","name":"Vorderrad","brand":"Microtech","model":"RE38 Carbon 38mm","max_distance_km":30000},
  {"category_key":"wheels_rear","name":"Hinterrad","brand":"Microtech","model":"RE38 Carbon 38mm","max_distance_km":25000},
  {"category_key":"tires_front","name":"Vorderreifen","brand":"Continental","model":"GP 5000 28mm","max_distance_km":5000},
  {"category_key":"tires_rear","name":"Hinterreifen","brand":"Continental","model":"GP 5000 28mm","max_distance_km":4000},
  {"category_key":"handlebar_tape","name":"Lenkerband","brand":"Basso","max_distance_km":5000}
]' WHERE manufacturer = 'Basso' AND model = 'Diamante';
