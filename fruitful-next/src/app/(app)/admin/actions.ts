'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type Role = 'admin' | 'warehouse_manager' | 'accountant' | 'viewer';

export async function updateUserRole(userId: string, role: Role) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthorized' };

  // RLS will block this if caller isn't admin — but check explicitly for nicer errors
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return { error: 'forbidden' };

  // Don't let admin demote themselves to non-admin if they're the only admin
  if (userId === user.id && role !== 'admin') {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    if ((count ?? 0) <= 1) {
      return { error: 'ต้องมี admin อย่างน้อย 1 คน — เพิ่ม admin คนอื่นก่อนเปลี่ยน role ของตัวเอง' };
    }
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) return { error: error.message };

  revalidatePath('/admin');
  return { ok: true };
}

export async function toggleUserActive(userId: string, active: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthorized' };
  if (userId === user.id) return { error: 'ห้ามปิดบัญชีตัวเอง' };

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return { error: 'forbidden' };

  const { error } = await supabase.from('profiles').update({ active }).eq('id', userId);
  if (error) return { error: error.message };

  revalidatePath('/admin');
  return { ok: true };
}
