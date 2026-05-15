'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './icon';
import { logout } from '@/app/login/actions';

type NavItem = { id: string; href: string; label: string; icon: IconName; group: string; badge?: string };

const NAV: NavItem[] = [
  { id: 'dashboard',  href: '/dashboard',  label: 'แดชบอร์ด',      icon: 'dashboard', group: '' },
  { id: 'purchasing', href: '/purchasing', label: 'การรับซื้อ',     icon: 'cart',      group: 'จัดการรายวัน', badge: '3' },
  { id: 'suppliers',  href: '/suppliers',  label: 'ผู้ขาย/เกษตรกร', icon: 'users',     group: 'จัดการรายวัน' },
  { id: 'warehouse',  href: '/warehouse',  label: 'คลังสินค้า',     icon: 'warehouse', group: 'จัดการรายวัน' },
  { id: 'inventory',  href: '/inventory',  label: 'ติดตามสต็อก',    icon: 'box',       group: 'จัดการรายวัน' },
  { id: 'payment',    href: '/payment',    label: 'การชำระเงิน',    icon: 'payment',   group: 'การเงิน', badge: '5' },
  { id: 'accounting', href: '/accounting', label: 'บัญชี',          icon: 'book',      group: 'การเงิน' },
  { id: 'reports',    href: '/reports',    label: 'รายงาน',         icon: 'chart',     group: 'การเงิน' },
  { id: 'mobile',     href: '/mobile',     label: 'โหมดมือถือ',     icon: 'mobile',    group: 'อื่นๆ' },
];

export function Sidebar({ profileName }: { profileName: string }) {
  const pathname = usePathname();

  const groups: { title: string; items: NavItem[] }[] = [];
  for (const item of NAV) {
    let g = groups.find((x) => x.title === item.group);
    if (!g) {
      g = { title: item.group, items: [] };
      groups.push(g);
    }
    g.items.push(item);
  }

  const initials = profileName.slice(0, 2);

  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-logo-mark">F</div>
        <div className="sb-logo-text">
          <b>Fruitful</b>
          <span>คลังสินค้าผลไม้ · v2.4</span>
        </div>
      </div>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.title && <div className="sb-section">{g.title}</div>}
          {g.items.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`sb-item ${active ? 'active' : ''}`}
                title={item.label}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </Link>
            );
          })}
        </div>
      ))}
      <form action={logout} className="sb-foot" style={{ cursor: 'pointer' }}>
        <div className="avatar">{initials}</div>
        <div className="sb-foot-info">
          <b>{profileName}</b>
          <span>ผู้จัดการคลัง</span>
        </div>
        <button
          type="submit"
          className="icon-btn"
          title="ออกจากระบบ"
          style={{ width: 28, height: 28 }}
        >
          <Icon name="logout" size={14} />
        </button>
      </form>
    </aside>
  );
}
