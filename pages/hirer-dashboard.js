import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { requireAuth } from '../lib/auth';

export default function HirerDashboard() {
  const [editors, setEditors] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('editors').select('*, profiles(name)').eq('challenge_completed', true).order('score', { ascending: false });
      setEditors(data || []);
    }
    load();
  }, []);

  return (
    <div className="container">
      <h1>Hirer Dashboard</h1>
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
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  return requireAuth(ctx, 'hirer');
};
