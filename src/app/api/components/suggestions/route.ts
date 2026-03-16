import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAllPresetBrands, getPresetModelsByBrand } from '@/lib/component-presets';

export async function GET(request: NextRequest) {
  try {
    // Auth check — any logged-in user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 401 });

    const { searchParams } = request.nextUrl;
    const brand = searchParams.get('brand');

    const admin = createAdminClient();

    if (!brand) {
      // Return all brands: DB + presets merged
      const { data: dbRows } = await (admin as any)
        .from('components')
        .select('brand')
        .not('brand', 'is', null)
        .neq('brand', '');

      // Case-insensitive dedup: most frequent spelling wins
      const countMap = new Map<string, Map<string, number>>();
      for (const row of dbRows ?? []) {
        const key = (row.brand as string).toLowerCase();
        if (!countMap.has(key)) countMap.set(key, new Map());
        const variants = countMap.get(key)!;
        variants.set(row.brand, (variants.get(row.brand) || 0) + 1);
      }

      const brands = new Map<string, string>();
      for (const [key, variants] of countMap) {
        let best = '';
        let bestCount = 0;
        for (const [name, count] of variants) {
          if (count > bestCount) { best = name; bestCount = count; }
        }
        brands.set(key, best);
      }

      // Merge preset brands
      for (const pb of getAllPresetBrands()) {
        const key = pb.toLowerCase();
        if (!brands.has(key)) brands.set(key, pb);
      }

      const result = Array.from(brands.values()).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      );
      return NextResponse.json(result);
    }

    // Return models for a specific brand
    const { data: dbRows } = await (admin as any)
      .from('components')
      .select('model')
      .ilike('brand', brand)
      .not('model', 'is', null)
      .neq('model', '');

    // Case-insensitive dedup
    const countMap = new Map<string, Map<string, number>>();
    for (const row of dbRows ?? []) {
      const key = (row.model as string).toLowerCase();
      if (!countMap.has(key)) countMap.set(key, new Map());
      const variants = countMap.get(key)!;
      variants.set(row.model, (variants.get(row.model) || 0) + 1);
    }

    const models = new Map<string, string>();
    for (const [key, variants] of countMap) {
      let best = '';
      let bestCount = 0;
      for (const [name, count] of variants) {
        if (count > bestCount) { best = name; bestCount = count; }
      }
      models.set(key, best);
    }

    // Merge preset models
    for (const pm of getPresetModelsByBrand(brand)) {
      const key = pm.toLowerCase();
      if (!models.has(key)) models.set(key, pm);
    }

    const result = Array.from(models.values()).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
