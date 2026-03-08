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

export async function POST() {
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

    // Fetch last 30 days of activities
    const after = Math.floor(
      (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000
    );

    const activitiesRes = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!activitiesRes.ok) {
      const errText = await activitiesRes.text();
      console.error('Strava activities fetch failed:', activitiesRes.status, errText);
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      );
    }

    const activities = await activitiesRes.json();
    console.log(`Strava: fetched ${activities.length} activities`);
    let synced = 0;
    const errors: string[] = [];

    for (const activity of activities) {
      if (activity.type !== 'Ride' && activity.type !== 'VirtualRide') {
        continue;
      }

      const isIndoor = activity.type === 'VirtualRide' || activity.trainer;

      if (connection.exclude_indoor && isIndoor) {
        continue;
      }

      // Find matching bike
      let bikeId: string | null = null;
      if (activity.gear_id) {
        const { data: bike } = await adminDb
          .from('bikes')
          .select('id')
          .eq('strava_gear_id', activity.gear_id)
          .eq('user_id', user.id)
          .maybeSingle();
        bikeId = bike?.id ?? null;
      }

      // Upsert ride
      const { error } = await adminDb.from('rides').upsert(
        {
          user_id: user.id,
          bike_id: bikeId,
          strava_activity_id: activity.id,
          title: activity.name,
          distance_km: parseFloat((activity.distance / 1000).toFixed(2)),
          duration_seconds: activity.moving_time,
          elevation_m: Math.round(activity.total_elevation_gain),
          date: activity.start_date_local.split('T')[0],
          source: 'strava',
          is_indoor: isIndoor,
        },
        { onConflict: 'strava_activity_id' }
      );

      if (error) {
        console.error('Ride upsert error:', activity.id, error.message);
        errors.push(`${activity.id}: ${error.message}`);
      } else {
        synced++;
      }
    }

    // Update last sync time
    await adminDb
      .from('strava_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', connection.id);

    console.log(`Strava sync: ${synced} synced, ${errors.length} errors`);
    return NextResponse.json({ synced, errors: errors.length > 0 ? errors : undefined });
  } catch (error) {
    console.error('Strava sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    );
  }
}
