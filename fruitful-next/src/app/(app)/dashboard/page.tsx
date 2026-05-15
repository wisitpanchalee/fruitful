import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { KPI } from '@/components/kpi';
import { FruitDot } from '@/components/fruit-chip';
import { Icon } from '@/components/icon';
import { baht, bahtShort, kg } from '@/lib/format';
import type { Fruit, Purchase, Zone, Payment } from '@/lib/types';

export const runtime = 'edge';

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { data: fruits },
    { data: purchases },
    { data: zones },
    { data: payments },
  ] = await Promise.all([
    supabase.from('fruits').select('*'),
    supabase.from('purchases').select('*').order('date', { ascending: false }).limit(50),
    supabase.from('zones').select('*'),
    supabase.from('payments').select('*'),
  ]);

  const fruitById: Record<string, Fruit> = Object.fromEntries(
    (fruits ?? []).map((f) => [f.id, f as Fruit]),
  );

  const today = '2026-05-15';
  const todays = (purchases ?? []).filter((p: Purchase) => p.date === today);
  const todayKg = todays.reduce((a, p) => a + p.kg, 0);
  const todayTotal = todays.reduce((a, p) => a + p.total, 0);
  const pendingPayments = (payments ?? [])
    .filter((p: Payment) => p.status !== 'paid')
    .reduce((a, p) => a + p.amount, 0);
  const totalStockKg = (zones ?? []).reduce((a, z: Zone) => a + z.kg, 0);

  // Capacity by warehouse prefix
  const capByWh: Record<string, { used: number; cap: number }> = {};
  for (const z of (zones ?? []) as Zone[]) {
    const wh = z.id.split('-')[0];
    if (!capByWh[wh]) capByWh[wh] = { used: 0, cap: 0 };
    capByWh[wh].used += z.kg;
    capByWh[wh].cap += z.cap;
  }

  const recent = (purchases ?? []).slice(0, 6) as Purchase[];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">แดชบอร์ด</h1>
          <p className="page-sub">ภาพรวมการดำเนินงานวันนี้ · {today}</p>
        </div>
        <div className="page-actions">
          <Link href="/purchasing" className="btn btn-primary">
            <Icon name="plus" size={14} /> สร้างใบรับซื้อใหม่
          </Link>
        </div>
      </div>

      <div className="kpi-grid">
        <KPI
          label="รับซื้อวันนี้"
          value={kg(todayKg)}
          delta={8.4}
          deltaDir="up"
          icon="cart"
        />
        <KPI
          label="ยอดซื้อวันนี้"
          value={bahtShort(todayTotal)}
          delta={12.2}
          deltaDir="up"
          icon="coins"
          accent="orange"
        />
        <KPI
          label="สต็อกรวม"
          value={kg(totalStockKg)}
          delta={3.1}
          deltaDir="up"
          icon="box"
          accent="blue"
        />
        <KPI
          label="ค้างชำระ"
          value={bahtShort(pendingPayments)}
          delta={5.2}
          deltaDir="down"
          icon="payment"
          accent="red"
        />
      </div>

      <div className="grid-2">
        {/* Recent transactions */}
        <div className="card">
          <div className="card-head">
            <h3>ใบรับซื้อล่าสุด</h3>
            <div className="right">
              <Link href="/purchasing" className="btn btn-ghost btn-sm">
                ดูทั้งหมด
              </Link>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>เลขที่</th>
                  <th>ผลไม้</th>
                  <th className="num">น้ำหนัก</th>
                  <th className="num">มูลค่า</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => {
                  const f = fruitById[p.fruit_id];
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className="row-id">{p.id}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {f && <FruitDot fruit={f} size={22} />}
                          <span>{f?.name ?? p.fruit_id}</span>
                        </div>
                      </td>
                      <td className="num">{kg(p.kg)}</td>
                      <td className="num">{baht(p.total)}</td>
                      <td>
                        <span
                          className={`pill ${
                            p.pay === 'paid' ? 'good' : p.pay === 'pending' ? 'warn' : 'info'
                          }`}
                        >
                          <span className="dot" />
                          {p.pay === 'paid'
                            ? 'ชำระแล้ว'
                            : p.pay === 'pending'
                            ? 'รอชำระ'
                            : 'ผ่อนชำระ'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warehouse capacity */}
        <div className="card">
          <div className="card-head">
            <h3>ความจุคลัง</h3>
            <div className="right">
              <Link href="/warehouse" className="btn btn-ghost btn-sm">
                ดูแผนผัง
              </Link>
            </div>
          </div>
          <div className="card-body">
            {Object.entries(capByWh).map(([wh, { used, cap }]) => {
              const pct = Math.round((used / cap) * 100);
              const cls = pct > 90 ? 'bad' : pct > 70 ? 'warn' : '';
              return (
                <div key={wh} className="cap-row">
                  <div className="name">คลัง {wh}</div>
                  <div className="bar-bg">
                    <div className={`bar-fg ${cls}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="pct">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
