import { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function Register() {
    const [searchParams] = useSearchParams();
    const initRole = searchParams.get('role') === 'employer' ? 'employer' : 'professional';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initRole);
    const [company, setCompany] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/register', { name, email, password, role, company });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                    <h1 className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join SkillProof to verify or discover talent</p>
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Role selector */}
                    <div className="form-group">
                        <label className="form-label">I am a...</label>
                        <div className="role-selector">
                            <button type="button" className={`role-option${role === 'professional' ? ' role-option--active' : ''}`} onClick={() => setRole('professional')}>
                                Professional
                            </button>
                            <button type="button" className={`role-option${role === 'employer' ? ' role-option--active' : ''}`} onClick={() => setRole('employer')}>
                                Employer
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" required className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" required className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" required className="form-input" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    {role === 'employer' && (
                        <div className="form-group">
                            <label className="form-label">Company Name <span style={{ color: '#9CA3AF' }}>(optional)</span></label>
                            <input type="text" className="form-input" placeholder="Acme Corp" value={company} onChange={e => setCompany(e.target.value)} />
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#1E3A8A', fontWeight: 600 }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}
