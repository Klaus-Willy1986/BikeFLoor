import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Strava webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.STRAVA_WEBHOOK_VERIFY_TOKEN) {
    return NextResponse.json({ 'hub.challenge': challenge });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// Strava webhook event
export async function POST(request: Request) {
  try {
    const event = await request.json();

    // Only handle activity creation/updates
    if (
      event.object_type !== 'activity' ||
      !['create', 'update'].includes(event.aspect_type)
    ) {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    // Find user by strava athlete id
    const { data: connection } = await (supabase as any)
      .from('strava_connections')
      .select('*')
      .eq('strava_athlete_id', event.owner_id)
      .single();

    if (!connection) {
      return NextResponse.json({ received: true });
    }

    // Refresh token if needed
    let accessToken = connection.access_token;
    const expiresAt = new Date(connection.token_expires_at);
    if (expiresAt <= new Date()) {
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

      if (res.ok) {
        const data = await res.json();
        accessToken = data.access_token;
        await (supabase as any)
          .from('strava_connections')
          .update({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_expires_at: new Date(data.expires_at * 1000).toISOString(),
          })
          .eq('id', connection.id);
      }
    }

    // Fetch the activity
    const activityRes = await fetch(
      `https://www.strava.com/api/v3/activities/${event.object_id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!activityRes.ok) {
      return NextResponse.json({ received: true });
    }

    const activity = await activityRes.json();

    if (activity.type !== 'Ride' && activity.type !== 'VirtualRide') {
      return NextResponse.json({ received: true });
    }

    const isIndoor = activity.type === 'VirtualRide' || activity.trainer;

    if (connection.exclude_indoor && isIndoor) {
      return NextResponse.json({ received: true });
    }

    // Find matching bike
    let bikeId: string | null = null;
    if (activity.gear_id) {
      const { data: bike } = await (supabase as any)
        .from('bikes')
        .select('id')
        .eq('strava_gear_id', activity.gear_id)
        .eq('user_id', connection.user_id)
        .single();
      bikeId = bike?.id ?? null;
    }

    // Upsert ride
    await (supabase as any).from('rides').upsert(
      {
        user_id: connection.user_id,
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

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
