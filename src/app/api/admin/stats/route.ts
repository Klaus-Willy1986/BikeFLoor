import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json(null, { status: 401 });

    const admin = createAdminClient();
    const { data: profile } = await (admin as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(null, { status: 403 });
    }

    // All queries run with service role (bypasses RLS) — results are aggregated, never per-user
    const [
      bikesRes,
      componentsRes,
      ridesRes,
      servicesRes,
      stravaRes,
      documentsRes,
      inventoryRes,
    ] = await Promise.all([
      (admin as any).from('bikes').select('type, total_distance_km'),
      (admin as any).from('components').select('category_id, is_active'),
      (admin as any).from('rides').select('distance_km, source'),
      (admin as any).from('service_records').select('cost'),
      (admin as any).from('strava_connections').select('id'),
      (admin as any).from('documents').select('id'),
      (admin as any).from('inventory_items').select('id'),
    ]);

    const bikes = bikesRes.data ?? [];
    const components = componentsRes.data ?? [];
    const rides = ridesRes.data ?? [];
    const services = servicesRes.data ?? [];
    const stravaConns = stravaRes.data ?? [];
    const documents = documentsRes.data ?? [];
    const inventory = inventoryRes.data ?? [];

    // Bike type breakdown
    const bikeTypes: Record<string, number> = {};
    for (const b of bikes) {
      bikeTypes[b.type] = (bikeTypes[b.type] || 0) + 1;
    }

    // Total distance across all bikes
    const totalDistanceKm = bikes.reduce(
      (sum: number, b: any) => sum + (b.total_distance_km || 0),
      0,
    );

    // Rides by source
    const ridesBySource: Record<string, number> = {};
    let totalRideDistanceKm = 0;
    for (const r of rides) {
      ridesBySource[r.source || 'manual'] = (ridesBySource[r.source || 'manual'] || 0) + 1;
      totalRideDistanceKm += r.distance_km || 0;
    }

    // Service costs
    const totalServiceCost = services.reduce(
      (sum: number, s: any) => sum + (s.cost || 0),
      0,
    );

    const stats = {
      bikes: {
        total: bikes.length,
        byType: bikeTypes,
        totalDistanceKm: Math.round(totalDistanceKm),
      },
      components: {
        total: components.length,
        active: components.filter((c: any) => c.is_active).length,
      },
      rides: {
        total: rides.length,
        totalDistanceKm: Math.round(totalRideDistanceKm),
        bySource: ridesBySource,
      },
      services: {
        total: services.length,
        totalCost: Math.round(totalServiceCost * 100) / 100,
      },
      strava: {
        connections: stravaConns.length,
      },
      documents: {
        total: documents.length,
      },
      inventory: {
        total: inventory.length,
      },
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
