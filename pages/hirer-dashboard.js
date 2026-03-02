import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';

export default function HirerDashboard() {
  const session = useSession();
  const router = useRouter();
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'hirer') {
        router.push('/editor-dashboard');
        return;
      }
      const { data } = await supabase.from('editors').select('*, profiles(name)').eq('challenge_completed', true).order('score', { ascending: false });
      setEditors(data || []);
      setLoading(false);
    }
    load();
  }, [session, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Hirer Dashboard</h1>
      {editors.length === 0 ? (
        <p>No editors have completed the test yet. Dashboard will populate once submissions are done.</p>
      ) : (
        <div className="grid">
          {editors.map(e=> (
            <div key={e.id} className="card">
              <h3>{e.profiles?.name||'Unnamed'}</h3>
              <p>Score: {e.score}</p>
              <p>Experience: {e.editing_experience}</p>
              <p>Types: {(e.content_types||[]).join(', ')}</p>
              <a href={`/editor/${e.id}`}>View profile</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
