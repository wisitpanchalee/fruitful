import { Icon } from './icon';

export function StubPage({ title, subtitle, phase = 2 }: { title: string; subtitle?: string; phase?: number }) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-sub">{subtitle}</p>}
        </div>
      </div>
      <div className="card">
        <div className="card-body" style={{ padding: 56, textAlign: 'center' }}>
          <Icon name="sparkle" size={40} className="muted" />
          <h3 style={{ marginTop: 14, marginBottom: 6 }}>หน้านี้กำลังพัฒนา</h3>
          <p className="muted" style={{ maxWidth: 460, margin: '0 auto' }}>
            หน้านี้จะเชื่อมกับฐานข้อมูล Supabase ใน Phase {phase}.
            ขณะนี้ใช้ Dashboard เพื่อดูข้อมูลที่ดึงจาก DB จริง
          </p>
        </div>
      </div>
    </div>
  );
}
