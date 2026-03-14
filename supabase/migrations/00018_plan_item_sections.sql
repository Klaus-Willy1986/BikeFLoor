-- Add section column to maintenance_plan_items for grouping checklist items
ALTER TABLE maintenance_plan_items
  ADD COLUMN section TEXT;
