import { createClient } from '@/lib/supabase/server';
import { baht } from '@/lib/format';
import type { Supplier } from '@/lib/types';

export const runtime = 'edge';

export default async function SuppliersPage() {
  const supabase = createClient();
  const { data: suppliers } = await supabase
    .from('suppliers')
    .select('*')
    .order('total', { ascending: false });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">ผู้ขาย/เกษตรกร</h1>
          <p className="page-sub">รายชื่อผู้ขายทั้งหมด {suppliers?.length ?? 0} ราย</p>
        </div>
      </div>

      <div className="card">
        {(suppliers as Supplier[] | null)?.map((s) => (
          <div key={s.id} className="supplier-row">
            <div className="av">{s.name.slice(0, 2)}</div>
            <div className="info">
              <b>{s.name}</b>
              <span>
                {s.owner} · {s.province}
              </span>
            </div>
            <div className="meta">
              <div className="v">{baht(s.total)}</div>
              <div className="k">ยอดซื้อรวม</div>
            </div>
            <div className="meta">
              <div className="v" style={{ color: s.outstanding > 0 ? 'var(--bad)' : 'var(--good)' }}>
                {baht(s.outstanding)}
              </div>
              <div className="k">ค้างชำระ</div>
            </div>
            <div>
              <span className={`grade ${s.credit}`}>{s.credit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
