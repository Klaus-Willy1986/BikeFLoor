import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/settings?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${origin}/settings?error=token_exchange`);
    }

    const tokenData = await tokenResponse.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    // Upsert strava connection
    const { error } = await (supabase as any).from('strava_connections').upsert(
      {
        user_id: user.id,
        strava_athlete_id: tokenData.athlete.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(
          tokenData.expires_at * 1000
        ).toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      return NextResponse.redirect(`${origin}/settings?error=save_failed`);
    }

    return NextResponse.redirect(`${origin}/settings?strava=connected`);
  } catch {
    return NextResponse.redirect(`${origin}/settings?error=unknown`);
  }
}
