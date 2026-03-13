-- Maintenance Plans: Structured checklists for bike maintenance

-- Plan templates
CREATE TABLE IF NOT EXISTS maintenance_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  bike_type TEXT,
  service_interval_id UUID REFERENCES service_intervals(id) ON DELETE SET NULL,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plan checklist items
CREATE TABLE IF NOT EXISTS maintenance_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plan execution (per bike)
CREATE TABLE IF NOT EXISTS maintenance_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  bike_id UUID NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_record_id UUID REFERENCES service_records(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Execution item checks
CREATE TABLE IF NOT EXISTS maintenance_execution_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES maintenance_executions(id) ON DELETE CASCADE,
  plan_item_id UUID NOT NULL REFERENCES maintenance_plan_items(id) ON DELETE CASCADE,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  checked_at TIMESTAMPTZ,
  notes TEXT
);

-- Auto-update updated_at on maintenance_plans
CREATE TRIGGER update_maintenance_plans_updated_at
  BEFORE UPDATE ON maintenance_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX idx_maintenance_plans_user_id ON maintenance_plans(user_id);
CREATE INDEX idx_maintenance_plans_bike_type ON maintenance_plans(bike_type);
CREATE INDEX idx_maintenance_plan_items_plan_id ON maintenance_plan_items(plan_id);
CREATE INDEX idx_maintenance_executions_user_id ON maintenance_executions(user_id);
CREATE INDEX idx_maintenance_executions_bike_id ON maintenance_executions(bike_id);
CREATE INDEX idx_maintenance_executions_plan_id ON maintenance_executions(plan_id);
CREATE INDEX idx_maintenance_execution_items_execution_id ON maintenance_execution_items(execution_id);

-- RLS
ALTER TABLE maintenance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_execution_items ENABLE ROW LEVEL SECURITY;

-- maintenance_plans: system plans readable by all, user plans by owner
CREATE POLICY "maintenance_plans_select"
  ON maintenance_plans FOR SELECT TO authenticated
  USING (is_system = TRUE OR user_id = auth.uid());

CREATE POLICY "maintenance_plans_insert"
  ON maintenance_plans FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND is_system = FALSE);

CREATE POLICY "maintenance_plans_update"
  ON maintenance_plans FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND is_system = FALSE);

CREATE POLICY "maintenance_plans_delete"
  ON maintenance_plans FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND is_system = FALSE);

-- maintenance_plan_items: readable if plan is readable
CREATE POLICY "maintenance_plan_items_select"
  ON maintenance_plan_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM maintenance_plans
    WHERE id = maintenance_plan_items.plan_id
    AND (is_system = TRUE OR user_id = auth.uid())
  ));

CREATE POLICY "maintenance_plan_items_insert"
  ON maintenance_plan_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM maintenance_plans
    WHERE id = maintenance_plan_items.plan_id
    AND user_id = auth.uid() AND is_system = FALSE
  ));

CREATE POLICY "maintenance_plan_items_update"
  ON maintenance_plan_items FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM maintenance_plans
    WHERE id = maintenance_plan_items.plan_id
    AND user_id = auth.uid() AND is_system = FALSE
  ));

CREATE POLICY "maintenance_plan_items_delete"
  ON maintenance_plan_items FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM maintenance_plans
    WHERE id = maintenance_plan_items.plan_id
    AND user_id = auth.uid() AND is_system = FALSE
  ));

-- maintenance_executions: user's own only
CREATE POLICY "maintenance_executions_select"
  ON maintenance_executions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "maintenance_executions_insert"
  ON maintenance_executions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "maintenance_executions_update"
  ON maintenance_executions FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "maintenance_executions_delete"
  ON maintenance_executions FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- maintenance_execution_items: accessible if execution is accessible
CREATE POLICY "maintenance_execution_items_select"
  ON maintenance_execution_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM maintenance_executions
    WHERE id = maintenance_execution_items.execution_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "maintenance_execution_items_insert"
  ON maintenance_execution_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM maintenance_executions
    WHERE id = maintenance_execution_items.execution_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "maintenance_execution_items_update"
  ON maintenance_execution_items FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM maintenance_executions
    WHERE id = maintenance_execution_items.execution_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "maintenance_execution_items_delete"
  ON maintenance_execution_items FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM maintenance_executions
    WHERE id = maintenance_execution_items.execution_id
    AND user_id = auth.uid()
  ));
