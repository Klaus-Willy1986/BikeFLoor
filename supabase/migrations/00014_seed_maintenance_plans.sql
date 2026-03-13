-- Seed system maintenance plans (user_id = NULL, is_system = TRUE)

-- 1. Schnell-Check (Universal)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Schnell-Check', 'Kurzer Pre-Ride Check in 5 Minuten', NULL, TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Reifendruck prüfen', 'Reifen auf korrekten Druck und sichtbare Schäden prüfen', 1, TRUE),
  ((SELECT id FROM plan), 'Bremsen testen', 'Vorder- und Hinterbremse auf Funktion prüfen', 2, TRUE),
  ((SELECT id FROM plan), 'Kette prüfen', 'Kettenlauf, Schmierung und Verschleiß kontrollieren', 3, TRUE),
  ((SELECT id FROM plan), 'Schaltung testen', 'Alle Gänge durchschalten, sauberer Gangwechsel', 4, FALSE),
  ((SELECT id FROM plan), 'Licht prüfen', 'Vorder- und Rücklicht auf Funktion testen', 5, FALSE);

-- 2. Monats-Check (Universal)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Monats-Check', 'Monatliche Grundinspektion', NULL, TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Reifendruck prüfen', 'Druck nach Herstellerangabe einstellen', 1, TRUE),
  ((SELECT id FROM plan), 'Bremsen prüfen', 'Belagstärke und Bremsleistung kontrollieren', 2, TRUE),
  ((SELECT id FROM plan), 'Kette reinigen & schmieren', 'Kette reinigen und frisch ölen', 3, TRUE),
  ((SELECT id FROM plan), 'Schaltung einstellen', 'Schaltung nachjustieren falls nötig', 4, FALSE),
  ((SELECT id FROM plan), 'Laufräder auf Rundlauf prüfen', 'Seitenschlag und Höhenschlag kontrollieren', 5, FALSE),
  ((SELECT id FROM plan), 'Lenkerband / Griffe prüfen', 'Auf Verschleiß und festen Sitz prüfen', 6, FALSE),
  ((SELECT id FROM plan), 'Schrauben nachziehen', 'Alle wichtigen Schraubverbindungen prüfen (Vorbau, Sattel, Achsen)', 7, TRUE),
  ((SELECT id FROM plan), 'Rahmen inspizieren', 'Rahmen auf Risse, Dellen oder Lackschäden prüfen', 8, FALSE);

-- 3. Saisonstart Rennrad (Road)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Saisonstart Rennrad', 'Kompletter Check zum Saisonstart', 'road', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Reifen wechseln / prüfen', 'Profil und Zustand der Reifen bewerten, ggf. neue Reifen montieren', 1, TRUE),
  ((SELECT id FROM plan), 'Schläuche prüfen', 'Auf porös gewordene Stellen und Ventile prüfen', 2, FALSE),
  ((SELECT id FROM plan), 'Kette prüfen / wechseln', 'Kettenverschleiß messen, bei >0.5% wechseln', 3, TRUE),
  ((SELECT id FROM plan), 'Kassette prüfen', 'Zähne auf Verschleiß prüfen', 4, TRUE),
  ((SELECT id FROM plan), 'Bremsbeläge prüfen', 'Belagstärke kontrollieren, ggf. wechseln', 5, TRUE),
  ((SELECT id FROM plan), 'Bremsscheiben prüfen', 'Auf Verschleiß und Verformung prüfen', 6, FALSE),
  ((SELECT id FROM plan), 'Züge und Hüllen tauschen', 'Brems- und Schaltzüge auf Leichtgängigkeit prüfen', 7, FALSE),
  ((SELECT id FROM plan), 'Lenkerband erneuern', 'Neues Lenkerband wickeln', 8, FALSE),
  ((SELECT id FROM plan), 'Lager prüfen', 'Steuersatz und Tretlager auf Spiel prüfen', 9, TRUE),
  ((SELECT id FROM plan), 'Laufräder zentrieren', 'Speichenspannung und Rundlauf prüfen', 10, FALSE),
  ((SELECT id FROM plan), 'Schrauben prüfen', 'Alle Schraubverbindungen mit Drehmoment nachziehen', 11, TRUE),
  ((SELECT id FROM plan), 'Probefahrt', 'Kurze Probefahrt mit Brems- und Schalttest', 12, TRUE);

-- 4. Vor-Rennen-Check (Road)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Vor-Rennen-Check', 'Schneller Check vor dem Wettkampf', 'road', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Reifendruck einstellen', 'Wettkampf-Reifendruck einstellen', 1, TRUE),
  ((SELECT id FROM plan), 'Bremsen prüfen', 'Bremsleistung und Belagstärke kontrollieren', 2, TRUE),
  ((SELECT id FROM plan), 'Kette schmieren', 'Frisches Kettenöl / Wachs auftragen', 3, TRUE),
  ((SELECT id FROM plan), 'Schaltung einstellen', 'Exakte Schaltung sicherstellen', 4, TRUE),
  ((SELECT id FROM plan), 'Schnellspanner / Steckachsen prüfen', 'Festen Sitz sicherstellen', 5, TRUE),
  ((SELECT id FROM plan), 'Flaschenhalter & Zubehör', 'Alles fest und an der richtigen Position', 6, FALSE),
  ((SELECT id FROM plan), 'Computer / Sensoren prüfen', 'GPS, Powermeter, HF-Sensor verbinden und testen', 7, FALSE);

-- 5. Saisonstart MTB (MTB)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Saisonstart MTB', 'Kompletter Check zum Saisonstart', 'mtb', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Reifen prüfen / wechseln', 'Profil, Seitenwand und Dichtmilch kontrollieren', 1, TRUE),
  ((SELECT id FROM plan), 'Kette prüfen / wechseln', 'Kettenverschleiß messen', 2, TRUE),
  ((SELECT id FROM plan), 'Kassette prüfen', 'Zähne auf Verschleiß prüfen', 3, TRUE),
  ((SELECT id FROM plan), 'Bremsbeläge prüfen', 'Belagstärke und Bremsleistung kontrollieren', 4, TRUE),
  ((SELECT id FROM plan), 'Bremsscheiben prüfen', 'Dicke und Verformung prüfen', 5, TRUE),
  ((SELECT id FROM plan), 'Gabel-Service', 'Standrohre reinigen, Luftdruck einstellen, auf Ölverlust prüfen', 6, TRUE),
  ((SELECT id FROM plan), 'Dämpfer-Service', 'Luftdruck einstellen, auf Ölverlust prüfen', 7, TRUE),
  ((SELECT id FROM plan), 'Dropper-Post prüfen', 'Funktion und Leichtgängigkeit testen', 8, FALSE),
  ((SELECT id FROM plan), 'Lager prüfen', 'Steuersatz, Tretlager, Hinterbau-Lager auf Spiel prüfen', 9, TRUE),
  ((SELECT id FROM plan), 'Schrauben nachziehen', 'Alle Schraubverbindungen mit Drehmoment prüfen', 10, TRUE),
  ((SELECT id FROM plan), 'Tubeless-Dichtmilch erneuern', 'Alte Milch entfernen, neue einfüllen', 11, FALSE),
  ((SELECT id FROM plan), 'Probefahrt', 'Trail-Test mit Brems-, Schalt- und Federungscheck', 12, TRUE);

-- 6. Nach Schlammfahrt (MTB)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Nach Schlammfahrt', 'Reinigung und Check nach schlammiger Fahrt', 'mtb', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Bike waschen', 'Gründlich mit Wasser abspülen, kein Hochdruck auf Lager', 1, TRUE),
  ((SELECT id FROM plan), 'Kette reinigen & schmieren', 'Kette gründlich reinigen und neu schmieren', 2, TRUE),
  ((SELECT id FROM plan), 'Schaltwerk reinigen', 'Schaltwerk und Umwerfer von Schlamm befreien', 3, TRUE),
  ((SELECT id FROM plan), 'Bremsen prüfen', 'Bremsbeläge auf eingedrückten Schmutz prüfen', 4, TRUE),
  ((SELECT id FROM plan), 'Gabel-Standrohre reinigen', 'Standrohre abwischen und leicht ölen', 5, TRUE),
  ((SELECT id FROM plan), 'Lager auf Spiel prüfen', 'Steuersatz und Hinterbau-Lager auf Schmutz-Eintritt prüfen', 6, FALSE),
  ((SELECT id FROM plan), 'Rahmen inspizieren', 'Auf Steinschlag und Beschädigungen prüfen', 7, FALSE);

-- 7. Saisonstart Gravel (Gravel)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Saisonstart Gravel', 'Kompletter Check zum Saisonstart', 'gravel', TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Reifen prüfen / wechseln', 'Profil und Seitenwand kontrollieren, Dichtmilch erneuern', 1, TRUE),
  ((SELECT id FROM plan), 'Kette prüfen / wechseln', 'Kettenverschleiß messen', 2, TRUE),
  ((SELECT id FROM plan), 'Kassette prüfen', 'Zähne auf Verschleiß prüfen', 3, TRUE),
  ((SELECT id FROM plan), 'Bremsbeläge prüfen', 'Belagstärke kontrollieren', 4, TRUE),
  ((SELECT id FROM plan), 'Bremsscheiben prüfen', 'Auf Verschleiß und Verformung prüfen', 5, FALSE),
  ((SELECT id FROM plan), 'Züge / Leitungen prüfen', 'Hydraulikleitungen und Schaltzüge kontrollieren', 6, FALSE),
  ((SELECT id FROM plan), 'Lenkerband erneuern', 'Neues Lenkerband wickeln', 7, FALSE),
  ((SELECT id FROM plan), 'Lager prüfen', 'Steuersatz und Tretlager auf Spiel prüfen', 8, TRUE),
  ((SELECT id FROM plan), 'Schrauben nachziehen', 'Alle Schraubverbindungen prüfen', 9, TRUE),
  ((SELECT id FROM plan), 'Probefahrt', 'Testfahrt mit Brems- und Schalttest', 10, TRUE);

-- 8. Jahresservice (Universal)
WITH plan AS (
  INSERT INTO maintenance_plans (user_id, name, description, bike_type, is_system)
  VALUES (NULL, 'Jahresservice', 'Umfassender jährlicher Komplett-Service', NULL, TRUE)
  RETURNING id
)
INSERT INTO maintenance_plan_items (plan_id, title, description, sort_order, is_required) VALUES
  ((SELECT id FROM plan), 'Kette wechseln', 'Neue Kette montieren', 1, TRUE),
  ((SELECT id FROM plan), 'Kassette prüfen / wechseln', 'Bei Verschleiß neue Kassette montieren', 2, TRUE),
  ((SELECT id FROM plan), 'Bremsbeläge wechseln', 'Neue Bremsbeläge einsetzen', 3, TRUE),
  ((SELECT id FROM plan), 'Bremsscheiben prüfen', 'Dicke messen, ggf. wechseln', 4, FALSE),
  ((SELECT id FROM plan), 'Brems-/Schaltzüge wechseln', 'Alle Züge und Hüllen erneuern', 5, FALSE),
  ((SELECT id FROM plan), 'Reifen wechseln', 'Neue Reifen montieren', 6, TRUE),
  ((SELECT id FROM plan), 'Schläuche / Dichtmilch erneuern', 'Neue Schläuche einlegen oder Dichtmilch erneuern', 7, FALSE),
  ((SELECT id FROM plan), 'Steuersatz warten', 'Steuersatz-Lager reinigen und neu fetten', 8, TRUE),
  ((SELECT id FROM plan), 'Tretlager warten', 'Tretlager prüfen, reinigen oder wechseln', 9, TRUE),
  ((SELECT id FROM plan), 'Laufräder zentrieren', 'Speichenspannung und Rundlauf prüfen', 10, FALSE),
  ((SELECT id FROM plan), 'Lenkerband / Griffe erneuern', 'Neues Lenkerband oder Griffe montieren', 11, FALSE),
  ((SELECT id FROM plan), 'Pedale warten', 'Pedale reinigen und Lager fetten', 12, FALSE),
  ((SELECT id FROM plan), 'Federung warten', 'Gabel/Dämpfer: Öl wechseln, Dichtungen prüfen (falls vorhanden)', 13, FALSE),
  ((SELECT id FROM plan), 'Rahmen reinigen & inspizieren', 'Gründliche Reinigung, auf Risse und Schäden prüfen', 14, TRUE),
  ((SELECT id FROM plan), 'Alle Schrauben mit Drehmoment nachziehen', 'Drehmomentschlüssel verwenden', 15, TRUE),
  ((SELECT id FROM plan), 'Probefahrt', 'Ausführliche Probefahrt mit allen Tests', 16, TRUE);
