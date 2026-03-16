import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await (admin as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') return null;
  return admin;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json(null, { status: 403 });

    const { data: rows } = await (admin as any)
      .from('components')
      .select('brand')
      .not('brand', 'is', null)
      .neq('brand', '');

    if (!rows || rows.length === 0) return NextResponse.json([]);

    // Group by lowercase key
    const groups = new Map<string, Map<string, number>>();
    for (const row of rows) {
      const brand = row.brand as string;
      const key = brand.toLowerCase();
      if (!groups.has(key)) groups.set(key, new Map());
      const variants = groups.get(key)!;
      variants.set(brand, (variants.get(brand) || 0) + 1);
    }

    // Build response — only include groups with >1 variant
    const result = Array.from(groups.entries())
      .map(([key, variants]) => {
        const variantList = Array.from(variants.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        const total = variantList.reduce((sum, v) => sum + v.count, 0);
        return { key, variants: variantList, total };
      })
      .filter((g) => g.variants.length > 1)
      .sort((a, b) => b.total - a.total);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json(null, { status: 403 });

    const { variants, canonical } = await request.json();

    if (!Array.isArray(variants) || !canonical || typeof canonical !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    let updated = 0;
    for (const variant of variants) {
      if (variant === canonical) continue;
      const { count } = await (admin as any)
        .from('components')
        .update({ brand: canonical })
        .eq('brand', variant);
      updated += count ?? 0;
    }

    return NextResponse.json({ updated });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
