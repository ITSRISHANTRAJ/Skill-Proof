import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';

export default function EditorDashboard() {
  const session = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [businessEmail, setBusinessEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [types, setTypes] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  useEffect(() => {
    async function checkAuth() {
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'editor') {
        router.push('/hirer-dashboard');
        return;
      }
      setUser(session.user);
      setUserRole(profile.role);
      const { data } = await supabase.from('editors').select('*').eq('id', session.user.id).single();
      if (data) {
        setEditor(data);
        setBusinessEmail(data.business_email||'');
        setExperience(data.editing_experience||'');
        setTypes((data.content_types||[]).join(','));
      }
      setLoading(false);
    }
    checkAuth();
  }, [session, router]);

  const saveProfile = async () => {
    if (!user) return;
    const content_types = types.split(',').map(s=>s.trim()).filter(Boolean);
    await supabase.from('editors').upsert({
      id: user.id,
      business_email: businessEmail,
      editing_experience: experience,
      content_types
    });
  };

  const submitTest = async () => {
    if (!user) return;
    const { data:cur } = await supabase.from('editors').select('portfolio_links').eq('id', user.id).single();
    const links = cur?.portfolio_links||[];
    links.push(portfolioUrl);
    const score = Array.from(portfolioUrl).reduce((a,c)=>a+c.charCodeAt(0),0) % 101;
    await supabase.from('editors').upsert({
      id: user.id,
      portfolio_links: links,
      test_submission_url: portfolioUrl,
      challenge_completed: true,
      score
    });
    setEditor({ ...editor, portfolio_links: links, challenge_completed:true, score });
    router.push('/editor-dashboard');
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="container">
      <h1>Editor Dashboard</h1>
      <div className="card">
        <h2>Profile</h2>
        <input value={businessEmail} onChange={e=>setBusinessEmail(e.target.value)} placeholder="Business email" />
        <input value={experience} onChange={e=>setExperience(e.target.value)} placeholder="Experience" />
        <input value={types} onChange={e=>setTypes(e.target.value)} placeholder="Content types (comma)" />
        <button onClick={saveProfile}>Save</button>
      </div>
      <div className="card">
        <h2>Submit test</h2>
        <input value={portfolioUrl} onChange={e=>setPortfolioUrl(e.target.value)} placeholder="Test URL" />
        <button onClick={submitTest}>Submit</button>
      </div>
      {editor && editor.challenge_completed && (
        <div className="card">
          <p>Score: {editor.score}</p>
          <p>Portfolio: {editor.portfolio_links.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
