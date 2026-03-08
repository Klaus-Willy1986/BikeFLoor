import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function refreshTokenIfNeeded(
  connection: any,
  adminDb: any
): Promise<string> {
  const expiresAt = new Date(connection.token_expires_at);
  if (expiresAt > new Date()) {
    return connection.access_token;
  }

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: connection.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) throw new Error('Token refresh failed');

  const data = await res.json();

  await adminDb
    .from('strava_connections')
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_expires_at: new Date(data.expires_at * 1000).toISOString(),
    })
    .eq('id', connection.id);

  return data.access_token;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = createAdminClient();

    const { data: connection } = await adminDb
      .from('strava_connections')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!connection) {
      return NextResponse.json(
        { error: 'No Strava connection' },
        { status: 404 }
      );
    }

    const accessToken = await refreshTokenIfNeeded(connection, adminDb);

    // Fetch athlete profile which includes gear
    const athleteRes = await fetch(
      'https://www.strava.com/api/v3/athlete',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!athleteRes.ok) {
      console.error('Strava athlete fetch failed:', athleteRes.status);
      return NextResponse.json(
        { error: 'Failed to fetch athlete' },
        { status: 500 }
      );
    }

    const athlete = await athleteRes.json();
    console.log('Strava athlete resource_state:', athlete.resource_state);
    console.log('Strava bikes:', JSON.stringify(athlete.bikes ?? 'NO BIKES FIELD'));

    // Extract bikes from gear
    const stravaBikes = (athlete.bikes ?? []).map((bike: any) => ({
      id: bike.id,
      name: bike.name,
      distance_km: Math.round(bike.distance / 1000),
    }));

    // Get current BikeFloor bikes with strava mapping
    const { data: localBikes } = await adminDb
      .from('bikes')
      .select('id, name, strava_gear_id')
      .eq('user_id', user.id);

    return NextResponse.json({
      stravaBikes,
      localBikes: localBikes ?? [],
    });
  } catch (error) {
    console.error('Strava gear error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gear' },
      { status: 500 }
    );
  }
}

// Map a Strava gear to a BikeFloor bike
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = createAdminClient();
    const { bikeId, stravaGearId } = await request.json();

    // Clear old mapping if another bike had this gear
    if (stravaGearId) {
      await adminDb
        .from('bikes')
        .update({ strava_gear_id: null })
        .eq('user_id', user.id)
        .eq('strava_gear_id', stravaGearId);
    }

    // Set new mapping (or clear if stravaGearId is null)
    const { error } = await adminDb
      .from('bikes')
      .update({ strava_gear_id: stravaGearId })
      .eq('id', bikeId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to map gear' },
      { status: 500 }
    );
  }
}
