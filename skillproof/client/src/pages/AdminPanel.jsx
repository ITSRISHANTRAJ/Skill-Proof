import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, Users, Award, FileText, BarChart2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function AdminPanel() {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [rejectModal, setRejectModal] = useState(null); // app ID
    const [rejectReason, setRejectReason] = useState('');
    const [approveModal, setApproveModal] = useState(null); // app ID
    const [scores, setScores] = useState({ technical: '', communication: '', impact: '' });

    useEffect(() => {
        fetchAll();
    }, [activeTab]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [appsRes, statsRes] = await Promise.all([
                api.get(`/admin/pending-applications?status=${activeTab}`),
                api.get('/admin/stats'),
            ]);
            setApplications(appsRes.data.applications);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!approveModal) return;
        setActionLoading(approveModal + '-approve');
        try {
            await api.put(`/verification/approve/${approveModal}`, {
                technical: Number(scores.technical) || 0,
                communication: Number(scores.communication) || 0,
                impact: Number(scores.impact) || 0
            });
            setApproveModal(null);
            setScores({ technical: '', communication: '', impact: '' });
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        setActionLoading(rejectModal + '-reject');
        try {
            await api.post(`/admin/reject/${rejectModal}`, { reason: rejectReason });
            setRejectModal(null);
            setRejectReason('');
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(null);
        }
    };

    const tabs = [
        { key: 'pending', label: 'Pending', count: stats.pending },
        { key: 'approved', label: 'Approved', count: stats.approved },
        { key: 'rejected', label: 'Rejected', count: stats.rejected },
        { key: 'all', label: 'All', count: stats.total },
    ];

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Admin Panel</h1>
                    <p className="dashboard-subtitle">Manage verification applications and platform data</p>
                </div>
                <Link to="/admin/challenges" className="btn btn-outline btn-sm">
                    Manage Challenges →
                </Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={18} /> },
                    { label: 'Professionals', value: stats.totalProfessionals, icon: <FileText size={18} /> },
                    { label: 'Verified', value: stats.totalVerified, icon: <CheckCircle size={18} /> },
                    { label: 'Pending Review', value: stats.totalPending, icon: <Clock size={18} /> },
                    { label: 'Badges Issued', value: stats.totalBadges, icon: <Award size={18} /> },
                    { label: 'Challenges', value: stats.totalChallenges, icon: <BarChart2 size={18} /> },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div style={{ color: '#1E3A8A', marginBottom: '0.4rem' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value ?? '—'}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="tabs">
                {tabs.map(t => (
                    <button key={t.key} className={`tab-btn${activeTab === t.key ? ' tab-btn--active' : ''}`} onClick={() => setActiveTab(t.key)}>
                        {t.label}
                        {t.count !== undefined && (
                            <span style={{ marginLeft: '0.4rem', background: activeTab === t.key ? '#1E3A8A' : '#E4E4E7', color: activeTab === t.key ? 'white' : '#6B7280', borderRadius: 999, padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? <Spinner text="Loading applications..." /> : applications.length === 0 ? (
                <div className="empty-state">
                    <h3>No applications found</h3>
                    <p>There are no {activeTab !== 'all' ? activeTab : ''} applications at this time.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Domain</th>
                                <th>Experience</th>
                                <th>Portfolio</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{app.user?.name}</div>
                                        <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{app.user?.email}</div>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{app.skillDomain}</td>
                                    <td style={{ textTransform: 'capitalize', color: '#6B7280' }}>{app.experience || '—'}</td>
                                    <td>
                                        <a href={app.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: '#1E3A8A', fontSize: '0.82rem' }}>
                                            View ↗
                                        </a>
                                    </td>
                                    <td><StatusBadge status={app.status} /></td>
                                    <td style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {app.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    disabled={actionLoading === app._id + '-approve'}
                                                    onClick={() => { setApproveModal(app._id); setScores({ technical: '', communication: '', impact: '' }); }}
                                                >
                                                    {actionLoading === app._id + '-approve' ? '...' : '✓ Approve'}
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    disabled={actionLoading === app._id + '-reject'}
                                                    onClick={() => { setRejectModal(app._id); setRejectReason(''); }}
                                                >
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rejection Modal */}
            {rejectModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Reject Application</h3>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Please provide a reason for rejection. This will be visible to the applicant.</p>
                        <textarea
                            className="form-textarea"
                            placeholder="e.g. Portfolio does not demonstrate the required skill level..."
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            rows={4}
                        />
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => setRejectModal(null)} style={{ flex: 1 }}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleReject} disabled={!!actionLoading} style={{ flex: 1 }}>
                                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Approve Modal with Scores */}
            {approveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Approve Verification</h3>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Enter grading rubric scores (0-100). The final Badge will display the average.</p>

                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Technical Proficiency</label>
                                <input type="number" min="0" max="100" className="form-input" value={scores.technical} onChange={e => setScores({ ...scores, technical: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Communication</label>
                                <input type="number" min="0" max="100" className="form-input" value={scores.communication} onChange={e => setScores({ ...scores, communication: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Project Impact</label>
                                <input type="number" min="0" max="100" className="form-input" value={scores.impact} onChange={e => setScores({ ...scores, impact: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => setApproveModal(null)} style={{ flex: 1 }}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleApprove} disabled={!!actionLoading} style={{ flex: 1, background: '#1E3A8A', color: 'white', borderColor: '#1E3A8A' }}>
                                {actionLoading ? 'Issuing Badge...' : 'Issue Badge'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
