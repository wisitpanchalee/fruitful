import Link from 'next/link';
import { login, signup } from './actions';

export const runtime = 'edge';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; msg?: string; mode?: string };
}) {
  const isSignup = searchParams.mode === 'signup';
  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <div className="auth-brand">
          <div className="sb-logo-mark">F</div>
          <div>
            <b>Fruitful</b>
            <div className="tiny muted">ระบบจัดการรับซื้อผลไม้และคลังสินค้า</div>
          </div>
        </div>

        <h1 className="page-title" style={{ fontSize: 22, marginBottom: 4 }}>
          {isSignup ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
        </h1>
        <p className="page-sub" style={{ marginTop: 0, marginBottom: 20 }}>
          {isSignup ? 'กรอกข้อมูลเพื่อสร้างบัญชีผู้จัดการคลัง' : 'ใช้อีเมลและรหัสผ่านของคุณ'}
        </p>

        {searchParams.error && (
          <div className="alert bad" style={{ marginBottom: 14 }}>
            <b>เกิดข้อผิดพลาด</b>
            <div>{searchParams.error}</div>
          </div>
        )}
        {searchParams.msg && (
          <div className="alert info" style={{ marginBottom: 14 }}>
            <div>{searchParams.msg}</div>
          </div>
        )}

        <form action={isSignup ? signup : login} className="col" style={{ gap: 14 }}>
          {isSignup && (
            <div className="field">
              <label>
                ชื่อ-นามสกุล<span className="req">*</span>
              </label>
              <input
                name="full_name"
                required
                className="input"
                placeholder="เช่น คุณธนากร ก."
              />
            </div>
          )}
          <div className="field">
            <label>
              อีเมล<span className="req">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="input"
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label>
              รหัสผ่าน<span className="req">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            {isSignup ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="hr" />
        <div className="tiny muted" style={{ textAlign: 'center' }}>
          {isSignup ? (
            <>
              มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
            </>
          ) : (
            <>
              ยังไม่มีบัญชี? <Link href="/login?mode=signup">สมัครสมาชิก</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
