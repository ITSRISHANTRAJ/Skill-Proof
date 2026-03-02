import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function requireAuth(ctx, role) {
  const supabase = createServerSupabaseClient({ req: ctx.req, res: ctx.res });
  const { data: { session, user } } = await supabase.auth.getSession();
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (role && profile?.role !== role) {
    const dest = profile?.role === 'editor' ? '/editor-dashboard' : '/hirer-dashboard';
    return { redirect: { destination: dest, permanent: false } };
  }
  return { props: { user, profile } };
}
