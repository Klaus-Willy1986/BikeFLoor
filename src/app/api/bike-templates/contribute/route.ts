import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CatalogComponent } from '@/lib/bike-catalog';

interface ContributeBody {
  manufacturer: string;
  model: string;
  year?: number | null;
  type: string;
  weight_kg?: number | null;
  components: CatalogComponent[];
}

export async function POST(request: NextRequest) {
  // Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: ContributeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { manufacturer, model, year, type, weight_kg, components } = body;

  if (!manufacturer || !model || !type || !components || components.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const admin = createAdminClient();
  const yearVal = year ?? 0;

  // Look up existing template
  const { data: existing } = await admin
    .from('bike_templates')
    .select('*')
    .ilike('manufacturer', manufacturer)
    .ilike('model', model)
    .eq('year', yearVal === 0 ? null as any : year!)
    .maybeSingle();

  // Handle the case where year is null/0
  let template;
  if (existing) {
    // Merge components
    const existingComponents = (existing.components as unknown as CatalogComponent[]) || [];
    const merged = mergeComponents(existingComponents, components);

    const { data, error } = await admin
      .from('bike_templates')
      .update({
        contributor_count: existing.contributor_count + 1,
        components: merged as any,
        weight_kg: existing.weight_kg ?? weight_kg ?? null,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    template = data;
  } else {
    // Create new template
    const { data, error } = await admin
      .from('bike_templates')
      .insert({
        manufacturer,
        model,
        year: year ?? null,
        type,
        weight_kg: weight_kg ?? null,
        components: components as any,
        source: 'community',
        contributor_count: 1,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    template = data;
  }

  return NextResponse.json({ template });
}

/**
 * Merge community-contributed components into existing template components.
 * - New category_keys are added
 * - Existing: brand/model only overwritten if previously empty
 * - max_distance_km: averaged across contributions
 */
function mergeComponents(
  existing: CatalogComponent[],
  incoming: CatalogComponent[]
): CatalogComponent[] {
  const map = new Map<string, CatalogComponent & { _distCount?: number }>();

  for (const comp of existing) {
    map.set(comp.category_key, { ...comp });
  }

  for (const comp of incoming) {
    const current = map.get(comp.category_key);
    if (current) {
      // Fill in brand/model if previously empty
      if (!current.brand && comp.brand) current.brand = comp.brand;
      if (!current.model && comp.model) current.model = comp.model;
      // Average max_distance_km
      if (comp.max_distance_km && current.max_distance_km) {
        const count = (current as any)._distCount || 1;
        current.max_distance_km = Math.round(
          (current.max_distance_km * count + comp.max_distance_km) / (count + 1)
        );
        (current as any)._distCount = count + 1;
      } else if (comp.max_distance_km && !current.max_distance_km) {
        current.max_distance_km = comp.max_distance_km;
      }
    } else {
      map.set(comp.category_key, { ...comp });
    }
  }

  // Clean up internal _distCount field
  return Array.from(map.values()).map(({ ...c }) => {
    delete (c as any)._distCount;
    return c;
  });
}
