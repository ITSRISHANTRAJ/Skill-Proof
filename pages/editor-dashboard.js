import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { requireAuth } from '../lib/auth';

export default function EditorDashboard({ user, profile }) {
  const [editor, setEditor] = useState(null);
  const [businessEmail, setBusinessEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [types, setTypes] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('editors').select('*').eq('id', user.id).single();
      if (data) {
        setEditor(data);
        setBusinessEmail(data.business_email||'');
        setExperience(data.editing_experience||'');
        setTypes((data.content_types||[]).join(','));
      }
    }
    load();
  }, [user.id]);

  const saveProfile = async () => {
    const content_types = types.split(',').map(s=>s.trim()).filter(Boolean);
    await supabase.from('editors').upsert({
      id: user.id,
      business_email: businessEmail,
      editing_experience: experience,
      content_types
    });
  };

  const submitTest = async () => {
    const { data:cur } = await supabase.from('editors').select('portfolio_links').eq('id', user.id).single();
    const links = cur?.portfolio_links||[];
    links.push(portfolioUrl);
    const score = Math.floor(Math.random()*100);
    await supabase.from('editors').upsert({
      id: user.id,
      portfolio_links: links,
      test_submission_url: portfolioUrl,
      challenge_completed: true,
      score
    });
    setEditor({ ...editor, portfolio_links: links, challenge_completed:true, score });
  };

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

export const getServerSideProps = async (ctx) => {
  return requireAuth(ctx, 'editor');
};
