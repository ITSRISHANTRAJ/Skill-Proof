import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } }
      });
      if (signupError) throw signupError;
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([{ id: data.user.id, role, name }]);
        if (profileError) throw profileError;
        const dest = role === 'editor' ? '/editor-dashboard' : '/hirer-dashboard';
        await router.push(dest);
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required disabled={loading} />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={loading} />
        <select value={role} onChange={e=>setRole(e.target.value)} disabled={loading}>
          <option value="editor">Editor</option>
          <option value="hirer">Hirer</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
      </form>
    </div>
  );
}
