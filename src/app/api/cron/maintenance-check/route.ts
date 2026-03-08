import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Cron endpoint to check for overdue maintenance
// Can be called by Vercel Cron or similar scheduler
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: intervals } = await supabase
    .from('service_intervals')
    .select('*')
    .eq('is_active', true);

  const overdueCount = (intervals ?? []).filter((interval: any) => {
    if (!interval.last_performed_at) return true;

    if (interval.interval_type === 'days') {
      const daysSince = Math.floor(
        (Date.now() - new Date(interval.last_performed_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysSince >= interval.interval_value;
    }

    return false;
  }).length;

  return NextResponse.json({
    checked: intervals?.length ?? 0,
    overdue: overdueCount,
  });
}
