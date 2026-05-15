'use client';

import { usePathname } from 'next/navigation';
import { Icon } from './icon';

const TITLE_MAP: Record<string, string> = {
  '/dashboard':  'แดชบอร์ด',
  '/purchasing': 'การรับซื้อ',
  '/suppliers':  'ผู้ขาย/เกษตรกร',
  '/warehouse':  'คลังสินค้า',
  '/inventory':  'ติดตามสต็อก',
  '/payment':    'การชำระเงิน',
  '/accounting': 'บัญชี',
  '/reports':    'รายงาน',
  '/mobile':     'โหมดมือถือ',
};

export function Topbar({ profileName }: { profileName: string }) {
  const pathname = usePathname() ?? '/dashboard';
  const title = TITLE_MAP[pathname] ?? '';
  const initials = profileName.slice(0, 2);

  return (
    <div className="topbar">
      <button className="icon-btn" title="ย่อ/ขยายเมนู">
        <Icon name="burger" size={18} />
      </button>
      <div className="crumbs">
        <span>Fruitful</span>
        <span className="sep">/</span>
        <b>{title}</b>
      </div>
      <div className="topbar-search">
        <Icon name="search" size={14} />
        <input placeholder="ค้นหาผู้ขาย, ใบรับซื้อ, ผลไม้, โซน..." />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" title="แจ้งเตือน">
          <Icon name="bell" size={18} />
          <span className="dot" />
        </button>
        <button className="icon-btn" title="ตั้งค่า">
          <Icon name="settings" size={18} />
        </button>
        <div className="tb-divider" />
        <div className="tb-user">
          <div className="avatar">{initials}</div>
          <div className="tb-user-info">
            <b>{profileName}</b>
            <span>ผู้จัดการคลัง</span>
          </div>
        </div>
      </div>
    </div>
  );
}
