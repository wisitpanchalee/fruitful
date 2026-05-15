import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { UserRow } from './user-row';

export const runtime = 'edge';

type ProfileWithEmail = {
  id: string;
  full_name: string;
  role: 'admin' | 'warehouse_manager' | 'accountant' | 'viewer';
  active: boolean;
  created_at: string;
  email: string | null;
};

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: me } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (me?.role !== 'admin') {
    return (
      <div className="page">
        <div className="card">
          <div className="card-body" style={{ padding: 56, textAlign: 'center' }}>
            <h3>ไม่ได้รับอนุญาต</h3>
            <p className="muted">
              หน้านี้สำหรับ admin เท่านั้น — ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  const rows: ProfileWithEmail[] = (profiles ?? []).map((p) => ({
    ...p,
    email: null, // Email lives in auth.users — fetched separately if needed
  }));

  const counts = {
    total: rows.length,
    admin: rows.filter((r) => r.role === 'admin').length,
    active: rows.filter((r) => r.active).length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">จัดการผู้ใช้</h1>
          <p className="page-sub">
            {counts.total} คน · {counts.admin} admin · {counts.active} ใช้งานอยู่
          </p>
        </div>
      </div>

      <div className="alert info" style={{ marginBottom: 16 }}>
        <div>
          <b>หมายเหตุ</b>
          <div>
            ผู้ใช้คนแรกที่สมัครเข้าระบบจะได้ role <b>admin</b> อัตโนมัติ
            ผู้ใช้คนอื่นๆ จะได้ role <b>warehouse_manager</b> ตามค่าเริ่มต้น
            (admin สามารถเปลี่ยน role ของผู้ใช้แต่ละคนได้ในหน้านี้)
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>Role</th>
                <th>สถานะ</th>
                <th>วันที่เข้าร่วม</th>
                <th style={{ width: 240 }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <UserRow key={p.id} profile={p} isSelf={p.id === user.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
