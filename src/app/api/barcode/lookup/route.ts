import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ean = request.nextUrl.searchParams.get('ean');
  if (!ean) {
    return NextResponse.json({ error: 'Missing ean parameter' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${ean}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json({ found: false });
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ found: false });
    }

    const item = data.items[0];
    return NextResponse.json({
      found: true,
      name: item.title || null,
      brand: item.brand || null,
      description: item.description || null,
    });
  } catch {
    return NextResponse.json({ found: false });
  }
}
