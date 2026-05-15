import { createClient } from '@/lib/supabase/server';
import { baht } from '@/lib/format';
import type { Payment, Supplier } from '@/lib/types';

export const runtime = 'edge';

const STATUS_LABEL: Record<Payment['status'], { label: string; kind: string }> = {
  paid:      { label: 'ชำระแล้ว',  kind: 'good' },
  pending:   { label: 'รอชำระ',    kind: 'warn' },
  approval:  { label: 'รออนุมัติ',  kind: 'accent' },
  scheduled: { label: 'จัดคิวแล้ว', kind: '' },
};

const METHOD_LABEL: Record<Payment['method'], string> = {
  cash:     'เงินสด',
  transfer: 'โอนธนาคาร',
  qr:       'QR Pay',
};

export default async function PaymentPage() {
  const supabase = await createClient();
  const [{ data: payments }, { data: suppliers }] = await Promise.all([
    supabase.from('payments').select('*').order('due'),
    supabase.from('suppliers').select('*'),
  ]);

  const suppById: Record<string, Supplier> = Object.fromEntries(
    (suppliers ?? []).map((s) => [s.id, s as Supplier]),
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">การชำระเงิน</h1>
          <p className="page-sub">{payments?.length ?? 0} รายการในคิว</p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>เลขที่</th>
                <th>ผู้ขาย</th>
                <th>วิธีชำระ</th>
                <th>ครบกำหนด</th>
                <th className="num">จำนวนเงิน</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {(payments as Payment[] | null)?.map((p) => {
                const s = suppById[p.supplier_id];
                const st = STATUS_LABEL[p.status];
                return (
                  <tr key={p.id}>
                    <td>
                      <span className="row-id">{p.id}</span>
                    </td>
                    <td>{s?.name ?? p.supplier_id}</td>
                    <td>{METHOD_LABEL[p.method]}</td>
                    <td>{p.due}</td>
                    <td className="num">{baht(p.amount)}</td>
                    <td>
                      <span className={`pill ${st.kind}`}>
                        <span className="dot" />
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
