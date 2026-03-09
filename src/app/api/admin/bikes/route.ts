import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json([], { status: 401 });
    }

    // Verify admin role
    const adminDb = createAdminClient();
    const { data: profile } = await (adminDb as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json([], { status: 403 });
    }

    // Admin can see all bikes via service role (bypasses RLS)
    const { data: bikes } = await (adminDb as any)
      .from('bikes')
      .select('user_id, name, type');

    return NextResponse.json(bikes ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
