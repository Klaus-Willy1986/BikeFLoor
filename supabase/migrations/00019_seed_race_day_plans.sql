-- Seed Race-Day system checklists with section grouping

-- 1. Race Day: Zeitfahren / Triathlon (TT)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Race Day: Zeitfahren / Triathlon', 'Komplette Race-Day Checkliste für Zeitfahren und Triathlon', 'tt', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required, section) VALUES
  ((SELECT id FROM plan), 'Reifendruck prüfen', 'Druck nach Rennvorgabe einstellen', 1, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Kette reinigen & schmieren', 'Kette frisch reinigen und mit Race-Öl schmieren', 2, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Schaltung testen', 'Alle Gänge durchschalten, Schaltauge prüfen', 3, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Bremsen prüfen', 'Bremsleistung und Belagstärke kontrollieren', 4, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Aero-Position prüfen', 'Aero-Bars, Sattelposition und Spacer kontrollieren', 5, FALSE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Helm', 'Zeitfahr-Helm oder Aero-Helm einpacken', 6, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Zeitfahr-Anzug', 'Skinsuit / TT-Anzug', 7, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Schuhe', 'Radschuhe + Cleats prüfen', 8, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Startnummer', 'Startnummer + Befestigung', 9, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Transponder', 'Zeitmess-Chip nicht vergessen', 10, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Gels / Riegel', 'Verpflegung für Rennen vorbereiten', 11, TRUE, 'Ernährung'),
  ((SELECT id FROM plan), 'Getränk', 'Flaschen mit Renngetränk füllen', 12, TRUE, 'Ernährung'),
  ((SELECT id FROM plan), 'Elektrolyte', 'Elektrolyt-Tabs / -Pulver einpacken', 13, FALSE, 'Ernährung'),
  ((SELECT id FROM plan), 'GPS-Computer', 'Radcomputer geladen + Rennprofil eingestellt', 14, TRUE, 'Technik'),
  ((SELECT id FROM plan), 'Powermeter', 'Powermeter kalibriert + Batterie voll', 15, FALSE, 'Technik'),
  ((SELECT id FROM plan), 'Herzfrequenz-Gurt', 'HF-Sensor geladen und gepairt', 16, FALSE, 'Technik');

-- 2. Race Day: MTB Race
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Race Day: MTB Race', 'Komplette Race-Day Checkliste für MTB-Rennen', 'mtb', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required, section) VALUES
  ((SELECT id FROM plan), 'Federung einstellen', 'Gabel + Dämpfer auf Rennsetup (Druck, Rebound, Compression)', 1, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Reifendruck prüfen', 'Druck für Streckenbedingungen anpassen', 2, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Kette reinigen & schmieren', 'Kette frisch reinigen und schmieren', 3, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Bremsen prüfen', 'Bremsleistung und Belagstärke kontrollieren', 4, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Dropper Post testen', 'Absenkbare Sattelstütze auf Funktion prüfen', 5, FALSE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Helm', 'MTB-Helm einpacken', 6, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Protektoren', 'Knie-/Ellbogenprotektoren je nach Strecke', 7, FALSE, 'Equipment'),
  ((SELECT id FROM plan), 'Schuhe', 'MTB-Schuhe + Cleats prüfen', 8, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Brille', 'Sportbrille mit passenden Gläsern', 9, FALSE, 'Equipment'),
  ((SELECT id FROM plan), 'Handschuhe', 'MTB-Handschuhe einpacken', 10, FALSE, 'Equipment'),
  ((SELECT id FROM plan), 'Startnummer', 'Startnummer + Befestigung', 11, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Gels', 'Gels / Riegel für Rennen', 12, TRUE, 'Ernährung'),
  ((SELECT id FROM plan), 'Getränk', 'Flaschen mit Renngetränk', 13, TRUE, 'Ernährung'),
  ((SELECT id FROM plan), 'Trinkrucksack', 'Trinkrucksack gefüllt (bei langen Rennen)', 14, FALSE, 'Ernährung'),
  ((SELECT id FROM plan), 'Schlauch / Reifenheber', 'Ersatzschlauch + Reifenheber einpacken', 15, TRUE, 'Ersatzteile'),
  ((SELECT id FROM plan), 'Multi-Tool', 'Multitool mit allen nötigen Schlüsseln', 16, TRUE, 'Ersatzteile'),
  ((SELECT id FROM plan), 'Kettenschloss', 'Quick-Link passend zur Kette', 17, FALSE, 'Ersatzteile');

-- 3. Race Day: Gravel Race
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Race Day: Gravel Race', 'Komplette Race-Day Checkliste für Gravel-Rennen', 'gravel', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required, section) VALUES
  ((SELECT id FROM plan), 'Reifendruck prüfen', 'Druck für Untergrund anpassen (Tubeless-Check)', 1, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Dichtmilch-Level prüfen', 'Tubeless-Dichtmilch auffüllen falls nötig', 2, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Kette reinigen & schmieren', 'Kette frisch reinigen und schmieren', 3, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Schaltung testen', 'Alle Gänge durchschalten', 4, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Bremsen prüfen', 'Bremsleistung und Belagstärke kontrollieren', 5, TRUE, 'Bike-Check'),
  ((SELECT id FROM plan), 'Helm', 'Gravel-/Rennrad-Helm einpacken', 6, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Schuhe', 'Radschuhe + Cleats prüfen', 7, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Brille', 'Sportbrille mit passenden Gläsern', 8, FALSE, 'Equipment'),
  ((SELECT id FROM plan), 'Handschuhe', 'Radhandschuhe einpacken', 9, FALSE, 'Equipment'),
  ((SELECT id FROM plan), 'Startnummer', 'Startnummer + Befestigung', 10, TRUE, 'Equipment'),
  ((SELECT id FROM plan), 'Gels / Riegel', 'Verpflegung für Rennen vorbereiten', 11, TRUE, 'Ernährung'),
  ((SELECT id FROM plan), 'Getränk', 'Flaschen mit Renngetränk füllen', 12, TRUE, 'Ernährung'),
  ((SELECT id FROM plan), 'Elektrolyte', 'Elektrolyt-Tabs / -Pulver', 13, FALSE, 'Ernährung'),
  ((SELECT id FROM plan), 'Schlauch', 'Ersatzschlauch (oder Tubeless-Reparatur-Kit)', 14, TRUE, 'Ersatzteile'),
  ((SELECT id FROM plan), 'CO2-Patronen', 'CO2-Patronen + Adapter', 15, TRUE, 'Ersatzteile'),
  ((SELECT id FROM plan), 'Multi-Tool', 'Multitool mit allen nötigen Schlüsseln', 16, TRUE, 'Ersatzteile'),
  ((SELECT id FROM plan), 'Kettenschloss', 'Quick-Link passend zur Kette', 17, FALSE, 'Ersatzteile');
