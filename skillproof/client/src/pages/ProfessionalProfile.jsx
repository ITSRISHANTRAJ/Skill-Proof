import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, CheckCircle, Award, Mail } from 'lucide-react';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function ProfessionalProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/employer/professional/${id}`)
            .then(res => setProfile(res.data))
            .catch(() => setError('Professional not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Spinner text="Loading profile..." />;
    if (error) return (
        <div style={{ maxWidth: 480, margin: '3rem auto', textAlign: 'center' }}>
            <div className="empty-state"><h3>{error}</h3></div>
            <Link to="/professionals" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>← Back to Directory</Link>
        </div>
    );

    const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const issueDate = profile.badge?.issuedAt ? new Date(profile.badge.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

    return (
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.5rem' }}>
                <ArrowLeft size={15} /> Back to Directory
            </Link>

            {/* Profile Hero */}
            <div className="profile-hero">
                <div className="profile-avatar">{initials}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div className="profile-name">{profile.name}</div>
                        {profile.isVerified && (
                            <div className="verified-badge">
                                <CheckCircle size={13} /> Verified
                            </div>
                        )}
                    </div>
                    <div className="profile-meta">
                        {profile.skillDomain && <span className="profile-domain">{profile.skillDomain}</span>}
                        {profile.experience && (
                            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'capitalize' }}>· {profile.experience}-level</span>
                        )}
                    </div>
                    {profile.bio && <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#374151', lineHeight: 1.7 }}>{profile.bio}</p>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Left: Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Info card */}
                    <div className="card">
                        <div className="card-header"><div className="card-title">Professional Info</div></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Primary Domain', value: profile.skillDomain || '—' },
                                { label: 'Experience Level', value: profile.experience ? profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1) : '—' },
                                { label: 'Company / Role', value: profile.company || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #F4F4F5' }}>
                                    <span style={{ fontSize: '0.82rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: '1rem' }}>Contact & Links</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {profile.portfolioUrl && (
                                <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-full">
                                    <ExternalLink size={15} /> View Portfolio
                                </a>
                            )}
                            <button className="btn btn-black btn-full" onClick={() => alert(`To hire ${profile.name}, contact them via your recruitment platform.`)}>
                                <Mail size={15} /> Express Interest
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Badge */}
                <div>
                    {profile.badge ? (
                        <div style={{ position: 'sticky', top: 80 }}>
                            <div className="badge-card">
                                <div className="badge-logo">SkillProof</div>
                                <div className="badge-icon-wrap">
                                    <Award size={24} />
                                </div>
                                <div className="badge-name" style={{ fontSize: '1.1rem' }}>{profile.name}</div>
                                <div className="badge-domain" style={{ fontSize: '0.8rem' }}>{profile.skillDomain}</div>
                                <div className="badge-code-row">
                                    <span className="badge-code" style={{ fontSize: '0.85rem' }}>{profile.badge.badgeCode}</span>
                                </div>
                                {issueDate && <div className="badge-issued">Issued {issueDate}</div>}
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center' }}>
                            <Award size={36} style={{ color: '#E4E4E7', margin: '0 auto 0.75rem' }} />
                            <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Badge not yet issued</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
