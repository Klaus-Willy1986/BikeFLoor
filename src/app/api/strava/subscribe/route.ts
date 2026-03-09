import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Check current subscription status
export async function GET() {
  try {
    const res = await fetch(
      `https://www.strava.com/api/v3/push_subscriptions?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}`
    );

    if (!res.ok) {
      return NextResponse.json({ active: false });
    }

    const subscriptions = await res.json();
    const active = Array.isArray(subscriptions) && subscriptions.length > 0;

    return NextResponse.json({
      active,
      subscription: active ? subscriptions[0] : null,
    });
  } catch {
    return NextResponse.json({ active: false });
  }
}

// Register webhook subscription (admin only)
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();

    // Verify caller is admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_APP_URL not configured' },
        { status: 500 }
      );
    }

    // Check if subscription already exists
    const checkRes = await fetch(
      `https://www.strava.com/api/v3/push_subscriptions?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}`
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json({ active: true, subscription: existing[0] });
      }
    }

    const callbackUrl = `${appUrl}/api/strava/webhook`;

    const res = await fetch('https://www.strava.com/api/v3/push_subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        callback_url: callbackUrl,
        verify_token: process.env.STRAVA_WEBHOOK_VERIFY_TOKEN!,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Strava subscribe error:', res.status, errorBody);
      return NextResponse.json(
        { error: `Strava error: ${errorBody}` },
        { status: res.status }
      );
    }

    const subscription = await res.json();
    return NextResponse.json({ active: true, subscription });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
