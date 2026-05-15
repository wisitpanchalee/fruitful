import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';

export const runtime = 'edge';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, active')
    .eq('id', user.id)
    .single();

  // Inactive users are signed out
  if (profile && !profile.active) {
    await supabase.auth.signOut();
    redirect('/login?msg=' + encodeURIComponent('บัญชีของคุณถูกปิดใช้งาน — ติดต่อ admin'));
  }

  const name = profile?.full_name ?? user.email ?? 'ผู้ใช้';
  const role = profile?.role ?? 'warehouse_manager';

  return (
    <div className="app">
      <Sidebar profileName={name} role={role} />
      <div className="main">
        <Topbar profileName={name} role={role} />
        <div>{children}</div>
      </div>
    </div>
  );
}
