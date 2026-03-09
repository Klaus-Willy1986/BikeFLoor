-- Component Rotation: add rotation_status and rotation_threshold_km
ALTER TABLE components
  ADD COLUMN rotation_status TEXT NOT NULL DEFAULT 'mounted',
  ADD COLUMN rotation_threshold_km INTEGER;

ALTER TABLE components
  ADD CONSTRAINT components_rotation_status_check
  CHECK (rotation_status IN ('mounted', 'ready', 'needs_maintenance'));

-- Set existing inactive components to needs_maintenance
UPDATE components SET rotation_status = 'needs_maintenance' WHERE is_active = FALSE;

-- Index for pool queries
CREATE INDEX idx_components_rotation ON components(bike_id, category_id, rotation_status);
