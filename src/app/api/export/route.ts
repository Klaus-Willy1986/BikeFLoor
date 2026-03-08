import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all data
    const [bikesRes, componentsRes, servicesRes, ridesRes] = await Promise.all([
      supabase
        .from('bikes')
        .select('*')
        .eq('user_id', user.id)
        .order('name'),
      supabase
        .from('components')
        .select('*, bikes(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('service_records')
        .select('*, bikes(name)')
        .eq('user_id', user.id)
        .order('performed_at', { ascending: false }),
      supabase
        .from('rides')
        .select('*, bikes(name)')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
    ]);

    const wb = XLSX.utils.book_new();

    // Bikes sheet
    const bikesData = (bikesRes.data ?? []).map((b: any) => ({
      Name: b.name,
      Typ: b.type,
      Hersteller: b.manufacturer ?? '',
      Modell: b.model ?? '',
      Baujahr: b.year ?? '',
      'Gewicht (kg)': b.weight_kg ?? '',
      'Distanz (km)': Number(b.total_distance_km),
      Notizen: b.notes ?? '',
    }));
    const bikesSheet = XLSX.utils.json_to_sheet(bikesData);
    XLSX.utils.book_append_sheet(wb, bikesSheet, 'Fahrräder');

    // Components sheet
    const componentsData = (componentsRes.data ?? []).map((c: any) => ({
      Name: c.name,
      Fahrrad: c.bikes?.name ?? '',
      Marke: c.brand ?? '',
      Modell: c.model ?? '',
      'Aktuelle Distanz (km)': Number(c.current_distance_km),
      'Max. Lebensdauer (km)': c.max_distance_km ?? '',
      'Eingebaut am': c.installed_at,
      Aktiv: c.is_active ? 'Ja' : 'Nein',
    }));
    const componentsSheet = XLSX.utils.json_to_sheet(componentsData);
    XLSX.utils.book_append_sheet(wb, componentsSheet, 'Komponenten');

    // Services sheet
    const servicesData = (servicesRes.data ?? []).map((s: any) => ({
      Titel: s.title,
      Fahrrad: s.bikes?.name ?? '',
      Datum: s.performed_at,
      'Kosten (€)': s.cost ?? '',
      Verbrauchsmaterial: s.consumables ?? '',
      'Distanz (km)': s.distance_at_service_km
        ? Number(s.distance_at_service_km)
        : '',
      Notizen: s.notes ?? '',
    }));
    const servicesSheet = XLSX.utils.json_to_sheet(servicesData);
    XLSX.utils.book_append_sheet(wb, servicesSheet, 'Wartungen');

    // Rides sheet
    const ridesData = (ridesRes.data ?? []).map((r: any) => ({
      Titel: r.title ?? '',
      Fahrrad: r.bikes?.name ?? '',
      Datum: r.date,
      'Distanz (km)': Number(r.distance_km),
      'Dauer (min)': r.duration_seconds
        ? Math.round(r.duration_seconds / 60)
        : '',
      'Höhenmeter (m)': r.elevation_m ?? '',
      Quelle: r.source,
      Indoor: r.is_indoor ? 'Ja' : 'Nein',
    }));
    const ridesSheet = XLSX.utils.json_to_sheet(ridesData);
    XLSX.utils.book_append_sheet(wb, ridesSheet, 'Fahrten');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="bikefloor-export.xlsx"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
