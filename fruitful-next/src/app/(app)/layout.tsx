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
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  const name = profile?.full_name ?? user.email ?? 'ผู้ใช้';

  return (
    <div className="app">
      <Sidebar profileName={name} />
      <div className="main">
        <Topbar profileName={name} />
        <div>{children}</div>
      </div>
    </div>
  );
}
