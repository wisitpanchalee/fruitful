'use client';

import { useState, useTransition } from 'react';
import { updateUserRole, toggleUserActive } from './actions';

type Role = 'admin' | 'warehouse_manager' | 'accountant' | 'viewer';

const ROLE_LABEL: Record<Role, string> = {
  admin: 'ผู้ดูแลระบบ',
  warehouse_manager: 'ผู้จัดการคลัง',
  accountant: 'บัญชี',
  viewer: 'ผู้อ่าน',
};

export function UserRow({
  profile,
  isSelf,
}: {
  profile: {
    id: string;
    full_name: string;
    role: Role;
    active: boolean;
    created_at: string;
  };
  isSelf: boolean;
}) {
  const [role, setRole] = useState<Role>(profile.role);
  const [active, setActive] = useState(profile.active);
  const [error, setError] = useState<string>('');
  const [pending, startTransition] = useTransition();

  const onRoleChange = (next: Role) => {
    setError('');
    startTransition(async () => {
      const res = await updateUserRole(profile.id, next);
      if (res.error) {
        setError(res.error);
      } else {
        setRole(next);
      }
    });
  };

  const onActiveToggle = () => {
    setError('');
    startTransition(async () => {
      const res = await toggleUserActive(profile.id, !active);
      if (res.error) {
        setError(res.error);
      } else {
        setActive(!active);
      }
    });
  };

  const initials = profile.full_name.slice(0, 2);
  const joined = new Date(profile.created_at).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <tr style={pending ? { opacity: 0.6 } : undefined}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
            {initials}
          </div>
          <div>
            <b>{profile.full_name}</b>
            {isSelf && (
              <span className="pill" style={{ marginLeft: 6 }}>
                คุณ
              </span>
            )}
          </div>
        </div>
        {error && (
          <div className="tiny" style={{ color: 'var(--bad)', marginTop: 4 }}>
            {error}
          </div>
        )}
      </td>
      <td>
        <select
          className="select"
          value={role}
          disabled={pending}
          onChange={(e) => onRoleChange(e.target.value as Role)}
          style={{ width: 180 }}
        >
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
      </td>
      <td>
        <span className={`pill ${active ? 'good' : 'bad'}`}>
          <span className="dot" />
          {active ? 'ใช้งานอยู่' : 'ปิดใช้งาน'}
        </span>
      </td>
      <td className="muted tiny">{joined}</td>
      <td>
        <button
          type="button"
          className="btn btn-sm"
          disabled={pending || isSelf}
          onClick={onActiveToggle}
          title={isSelf ? 'ห้ามปิดบัญชีตัวเอง' : undefined}
        >
          {active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
        </button>
      </td>
    </tr>
  );
}
