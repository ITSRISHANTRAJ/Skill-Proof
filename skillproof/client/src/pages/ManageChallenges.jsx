import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Zap } from 'lucide-react';
import Spinner from '../components/Spinner';
import api from '../services/api';

const DOMAINS = ['Frontend Engineering', 'Backend Engineering', 'UI/UX Design', 'Data Science', 'DevOps', 'Mobile Development', 'Product Management'];

export default function ManageChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', skillDomain: '', difficulty: 'medium', instructions: '', timeLimit: 48 });

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    useEffect(() => { fetchChallenges(); }, []);

    const fetchChallenges = async () => {
        try {
            const res = await api.get('/admin/challenges');
            setChallenges(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!form.title || !form.description || !form.skillDomain) {
            setError('Title, description and skill domain are required.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/admin/create-challenge', form);
            setSuccess('Challenge created successfully!');
            setForm({ title: '', description: '', skillDomain: '', difficulty: 'medium', instructions: '', timeLimit: 48 });
            setShowForm(false);
            fetchChallenges();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create challenge.');
        } finally {
            setSubmitting(false);
        }
    };

    const diffClass = { easy: 'diff-easy', medium: 'diff-medium', hard: 'diff-hard' };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.5rem' }}>
                <ArrowLeft size={15} /> Back to Admin Panel
            </Link>

            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Manage Challenges</h1>
                    <p className="dashboard-subtitle">Create verification challenges for skill assessment</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
                    <Plus size={16} /> {showForm ? 'Cancel' : 'New Challenge'}
                </button>
            </div>

            {success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{success}</div>}

            {/* Create Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="card-header"><div className="card-title">Create New Challenge</div></div>
                    {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input type="text" className="form-input" placeholder="e.g. Build a REST API" value={form.title} onChange={set('title')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Skill Domain *</label>
                                <select className="form-select" value={form.skillDomain} onChange={set('skillDomain')} required>
                                    <option value="">Select domain...</option>
                                    {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea className="form-textarea" placeholder="Describe the challenge and what it tests..." value={form.description} onChange={set('description')} rows={3} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Instructions / Deliverables</label>
                            <textarea className="form-textarea" placeholder="Step-by-step instructions and expected deliverables..." value={form.instructions} onChange={set('instructions')} rows={4} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Difficulty</label>
                                <select className="form-select" value={form.difficulty} onChange={set('difficulty')}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time Limit (hours)</label>
                                <input type="number" className="form-input" value={form.timeLimit} onChange={set('timeLimit')} min={1} max={168} />
                            </div>
                        </div>
                        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                            {submitting ? 'Creating...' : 'Create Challenge'}
                        </button>
                    </form>
                </div>
            )}

            {/* Challenges List */}
            <div className="section-title">All Challenges ({challenges.length})</div>
            {loading ? <Spinner /> : challenges.length === 0 ? (
                <div className="empty-state">
                    <Zap size={32} style={{ color: '#9CA3AF', margin: '0 auto 0.75rem' }} />
                    <h3>No challenges yet</h3>
                    <p>Create your first challenge using the button above.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {challenges.map(ch => (
                        <div key={ch._id} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{ch.title}</span>
                                    <span className={`status-badge ${diffClass[ch.difficulty] || ''}`} style={{ textTransform: 'capitalize' }}>{ch.difficulty}</span>
                                    {!ch.isActive && <span className="status-badge status--rejected">Inactive</span>}
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>{ch.description}</p>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#9CA3AF' }}>
                                    <span>Domain: <strong>{ch.skillDomain}</strong></span>
                                    <span>Time: <strong>{ch.timeLimit}h</strong></span>
                                    <span>By: <strong>{ch.createdBy?.name || 'Admin'}</strong></span>
                                    <span>{new Date(ch.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
