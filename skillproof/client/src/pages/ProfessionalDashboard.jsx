import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, XCircle, Award, FileText, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function ProfessionalDashboard() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/professional/dashboard')
            .then(res => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner text="Loading dashboard..." />;

    const { applications = [], badge } = data || {};
    const latestApp = applications[0] || null;
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
                </div>
                {user?.isVerified && (
                    <div className="verified-badge" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                        <CheckCircle size={15} />
                        Verified Professional
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-label">Applications</div>
                    <div className="stat-value">{applications.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Status</div>
                    <div className="stat-value" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        {latestApp ? <StatusBadge status={latestApp.status} /> : <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>None</span>}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Badge</div>
                    <div className="stat-value" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
                        {badge
                            ? <span style={{ color: '#16A34A', fontSize: '0.85rem', fontWeight: 700 }}>✓ Issued</span>
                            : <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Pending</span>
                        }
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Application status */}
                <div className="card page-section">
                    <div className="card-header">
                        <div className="card-title">Verification Status</div>
                    </div>
                    {!applications.length ? (
                        <div className="empty-state" style={{ padding: '3rem 2rem' }}>
                            <FileText size={32} style={{ margin: '0 auto 1rem', color: '#9CA3AF' }} />
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No verification history found</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', maxWidth: 280, margin: '0 auto 1.5rem' }}>Submit your portfolio details to start the manual auditing process.</p>
                            <Link to="/apply" className="btn btn-primary btn-sm">
                                Start Application <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {applications.map(app => (
                                <div key={app._id} style={{ border: '1px solid #E4E4E7', borderRadius: 10, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{app.skillDomain}</div>
                                        <a href={app.portfolioUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#1E3A8A' }}>View Portfolio ↗</a>
                                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                        {app.rejectionReason && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#DC2626', background: '#FEF2F2', padding: '4px 8px', borderRadius: 6 }}>
                                                Reason: {app.rejectionReason}
                                            </div>
                                        )}
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>
                            ))}
                            {(!latestApp || latestApp.status === 'rejected') && (
                                <Link to="/apply" className="btn btn-primary btn-sm btn-full">
                                    Submit New Application
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Badge */}
                <div className="card page-section">
                    <div className="card-header">
                        <div className="card-title">Your Verified Badge</div>
                    </div>
                    {badge ? (
                        <div>
                            <div className="badge-card">
                                <div className="badge-logo">SkillProof</div>
                                <div className="badge-icon-wrap">
                                    <Award size={28} />
                                </div>
                                <div className="badge-name">{user?.name}</div>
                                <div className="badge-domain">{badge.skillDomain}</div>
                                <div className="badge-code-row">
                                    <Award size={16} />
                                    <span className="badge-code">{badge.badgeCode}</span>
                                </div>
                                <div className="badge-issued">
                                    Issued {new Date(badge.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <Link to="/badge" className="btn btn-outline btn-sm btn-full" style={{ marginTop: '1rem' }}>
                                View Full Badge Page
                            </Link>
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '3rem 2rem' }}>
                            <Award size={32} style={{ margin: '0 auto 1rem', color: '#9CA3AF' }} />
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No badge issued yet</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', maxWidth: 280, margin: '0 auto' }}>Your cryptographically secure badge will appear here once your application clears the audit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
