import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('editor');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });
    if (data.user) {
      await supabase.from('profiles').insert([{ id: data.user.id, role, name }]);
      const dest = role === 'editor' ? '/editor-dashboard' : '/hirer-dashboard';
      router.push(dest);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="editor">Editor</option>
          <option value="hirer">Hirer</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
