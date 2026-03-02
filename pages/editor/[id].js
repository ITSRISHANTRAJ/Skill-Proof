import { supabase } from '../../lib/supabaseClient';

export default function EditorProfile({ editor }) {
  if (!editor) return <p>Not found</p>;
  return (
    <div className="container">
      <h1>{editor.profiles?.name||'Editor'}</h1>
      <p>Business email: {editor.business_email}</p>
      <p>Experience: {editor.editing_experience}</p>
      <p>Content types: {(editor.content_types||[]).join(', ')}</p>
      <p>Portfolio: {(editor.portfolio_links||[]).join(', ')}</p>
      <p>Test URL: {editor.test_submission_url}</p>
      <p>Score: {editor.score}</p>
      <p>Challenge completed: {editor.challenge_completed ? 'yes' : 'no'}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { data } = await supabase.from('editors').select('*, profiles(name)').eq('id', params.id).single();
  return { props: { editor: data || null } };
}
