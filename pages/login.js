import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      const dest = profile?.role === 'editor' ? '/editor-dashboard' : '/hirer-dashboard';
      router.push(dest);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
