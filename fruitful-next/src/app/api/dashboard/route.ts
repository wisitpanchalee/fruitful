import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Purchase, Zone, Payment } from '@/lib/types';

export const runtime = 'edge';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const [
    { data: purchases },
    { data: zones },
    { data: payments },
  ] = await Promise.all([
    supabase.from('purchases').select('*').order('date', { ascending: false }).limit(30),
    supabase.from('zones').select('*'),
    supabase.from('payments').select('*'),
  ]);

  const today = '2026-05-15';
  const todays = (purchases ?? []).filter((p: Purchase) => p.date === today);

  return NextResponse.json({
    todayKg: todays.reduce((a, p) => a + p.kg, 0),
    todayTotal: todays.reduce((a, p) => a + p.total, 0),
    totalStockKg: (zones ?? []).reduce((a, z: Zone) => a + z.kg, 0),
    pendingPayments: (payments ?? [])
      .filter((p: Payment) => p.status !== 'paid')
      .reduce((a, p) => a + p.amount, 0),
    recent: purchases?.slice(0, 6) ?? [],
  });
}
