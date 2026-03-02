import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            const { role } = res.data.user;
            navigate(role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <ShieldCheck size={28} color="#1E3A8A" />
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>SkillProof</span>
                    </div>
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            required
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#1E3A8A', fontWeight: 600 }}>Create one</Link>
                </div>

                {/* Dev hint */}
                <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#FAFAFA', borderRadius: 8, border: '1px solid #E4E4E7', fontSize: '0.78rem', color: '#6B7280' }}>
                    <strong>Admin demo:</strong> admin@skillproof.com / admin123
                </div>
            </div>
        </div>
    );
}
