import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Award, Copy, CheckCircle } from 'lucide-react';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function BadgePage() {
    const { user } = useContext(AuthContext);
    const [badge, setBadge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get('/professional/badge')
            .then(res => setBadge(res.data))
            .catch(() => setBadge(null))
            .finally(() => setLoading(false));
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(badge?.badgeCode || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <Spinner text="Loading badge..." />;

    if (!badge) {
        return (
            <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}>
                <div className="empty-state">
                    <Award size={40} style={{ margin: '0 auto 1rem', color: '#9CA3AF' }} />
                    <h3>No Badge Yet</h3>
                    <p>Your badge will appear here once your verification is approved.</p>
                </div>
            </div>
        );
    }

    const issueDate = new Date(badge.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingTop: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 className="dashboard-title">Your SkillProof Badge</h1>
                <p className="dashboard-subtitle">This badge certifies your verified skill — share it proudly.</p>
            </div>

            {/* Main Badge Card */}
            <div className="badge-card" style={{ maxWidth: 420, width: '100%' }}>
                <div className="badge-logo">SkillProof · Verified Credential</div>
                <div className="badge-icon-wrap">
                    <ShieldCheck size={30} />
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.25rem' }}>Issued to</div>
                <div className="badge-name">{user?.name}</div>
                <div className="badge-domain">{badge.skillDomain}</div>
                <div className="badge-code-row">
                    <Award size={16} />
                    <span className="badge-code">{badge.badgeCode}</span>
                    <button onClick={handleCopy} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}>
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                </div>
                <div className="badge-issued">Issued on {issueDate} · SkillProof Platform</div>
            </div>

            {/* Details card */}
            <div className="card" style={{ width: '100%' }}>
                <div className="card-header"><div className="card-title">Credential Details</div></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    {[
                        { label: 'Credential Holder', value: user?.name },
                        { label: 'Skill Domain', value: badge.skillDomain },
                        { label: 'Badge ID', value: badge.badgeCode },
                        { label: 'Status', value: badge.isActive ? '✓ Active' : 'Revoked' },
                        { label: 'Issue Date', value: issueDate },
                        { label: 'Issuing Authority', value: 'SkillProof Platform' },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Share section */}
            <div className="card" style={{ width: '100%', textAlign: 'center' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Share Your Credential</h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Add your badge code to your LinkedIn profile, resume, or email signature.</p>
                <button onClick={handleCopy} className="btn btn-primary">
                    {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy Badge Code</>}
                </button>
            </div>
        </div>
    );
}
