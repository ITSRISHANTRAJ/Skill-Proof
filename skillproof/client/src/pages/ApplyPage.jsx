import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import api from '../services/api';

const DOMAINS = ['Frontend Engineering', 'Backend Engineering', 'UI/UX Design', 'Data Science', 'DevOps', 'Mobile Development', 'Product Management', 'Cybersecurity', 'Machine Learning', 'Cloud Architecture'];
const EXPERIENCES = [
    { value: 'junior', label: 'Junior (0–2 years)' },
    { value: 'mid', label: 'Mid-level (2–5 years)' },
    { value: 'senior', label: 'Senior (5–10 years)' },
    { value: 'lead', label: 'Lead / Principal (10+ years)' },
];

export default function ApplyPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ portfolioUrl: '', skillDomain: '', experience: 'mid', bio: '' });
    const [customDomain, setCustomDomain] = useState('');
    const [useCustom, setUseCustom] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const skillDomain = useCustom ? customDomain.trim() : form.skillDomain;
        if (!skillDomain) { setError('Please select or enter a skill domain.'); return; }

        setLoading(true);
        try {
            await api.post('/professional/apply', { ...form, skillDomain });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.75rem' }}>✓</div>
                <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Application Submitted!</h2>
                <p style={{ color: '#6B7280' }}>Our team will review your application and notify you. Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="dashboard-title">Apply for Verification</h1>
                <p className="dashboard-subtitle">Submit your proof of skill for manual review by the SkillProof team.</p>
            </div>

            <div className="card">
                {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Portfolio URL */}
                    <div className="form-group">
                        <label className="form-label">Portfolio / Work Link <span style={{ color: '#DC2626' }}>*</span></label>
                        <div style={{ position: 'relative' }}>
                            <input type="url" required className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="https://github.com/yourname or https://yourportfolio.com" value={form.portfolioUrl} onChange={set('portfolioUrl')} />
                            <ExternalLink size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        </div>
                        <span className="form-hint">Link to your GitHub, Dribbble, live project, or personal portfolio site.</span>
                    </div>

                    {/* Skill Domain */}
                    <div className="form-group">
                        <label className="form-label">Primary Skill Domain <span style={{ color: '#DC2626' }}>*</span></label>
                        {!useCustom ? (
                            <select className="form-select" value={form.skillDomain} onChange={set('skillDomain')} required={!useCustom}>
                                <option value="">Select a domain...</option>
                                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        ) : (
                            <input type="text" className="form-input" placeholder="e.g. Blockchain Development" value={customDomain} onChange={e => setCustomDomain(e.target.value)} required />
                        )}
                        <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', paddingLeft: 0 }} onClick={() => setUseCustom(v => !v)}>
                            {useCustom ? '← Back to list' : 'My domain is not listed'}
                        </button>
                    </div>

                    {/* Experience Level */}
                    <div className="form-group">
                        <label className="form-label">Experience Level</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            {EXPERIENCES.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`role-option${form.experience === value ? ' role-option--active' : ''}`}
                                    onClick={() => setForm(f => ({ ...f, experience: value }))}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="form-group">
                        <label className="form-label">Brief Bio <span style={{ color: '#9CA3AF' }}>(optional)</span></label>
                        <textarea className="form-textarea" placeholder="Tell us about your background, what you've built, and why you'd like to be verified..." value={form.bio} onChange={set('bio')} rows={4} />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg">
                        {loading ? 'Submitting...' : <>Submit Application <ArrowRight size={18} /></>}
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: '#EFF6FF', borderRadius: 10, border: '1px solid #BFDBFE', fontSize: '0.8rem', color: '#2563EB' }}>
                <strong>What happens next?</strong> Our team reviews your portfolio within 2–5 business days.
                You'll see your status update on your dashboard. If approved, your SkillProof badge will be issued automatically.
            </div>
        </div>
    );
}
