import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, CheckCircle, Users, Filter } from 'lucide-react';
import Spinner from '../components/Spinner';
import api from '../services/api';

const SKILL_FILTERS = ['All', 'Frontend Engineering', 'Backend Engineering', 'UI/UX Design', 'Data Science', 'DevOps', 'Mobile Development'];

export default function EmployerDashboard() {
    const [professionals, setProfessionals] = useState([]);
    const [stats, setStats] = useState({ totalVerified: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        Promise.all([
            api.get('/employer/dashboard'),
            api.get('/employer/verified-professionals'),
        ]).then(([dashRes, profsRes]) => {
            setStats({ totalVerified: dashRes.data.totalVerified });
            setProfessionals(profsRes.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = professionals.filter(p => {
        const matchSkill = activeFilter === 'All' || p.skillDomain === activeFilter;
        const matchSearch = !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.skillDomain && p.skillDomain.toLowerCase().includes(search.toLowerCase()));
        return matchSkill && matchSearch;
    });

    if (loading) return <Spinner text="Loading talent directory..." />;

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Talent Directory</h1>
                    <p className="dashboard-subtitle">Browse and discover manually verified professionals</p>
                </div>
                <div className="stat-card" style={{ minWidth: 140 }}>
                    <div className="stat-label">Verified Talent</div>
                    <div className="stat-value stat-value--accent">{stats.totalVerified}</div>
                </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: 400, marginBottom: '1rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Search by name or skill..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Skill Filters */}
            <div className="filter-chips" style={{ marginBottom: '1.5rem' }}>
                {SKILL_FILTERS.map(f => (
                    <button key={f} className={`chip${activeFilter === f ? ' chip--active' : ''}`} onClick={() => setActiveFilter(f)}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
                <div className="empty-state" style={{ padding: '4rem 2rem', marginTop: '2rem' }}>
                    <Users size={40} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No professionals match your search</h3>
                    <p style={{ color: '#6B7280', maxWidth: 300, margin: '0 auto' }}>Try adjusting your search query, or switching the domain filter to see more talent.</p>
                </div>
            ) : (
                <div className="professionals-grid">
                    {filtered.map(prof => {
                        const initials = prof.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                        return (
                            <div key={prof._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Profile row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <div className="profile-avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>{initials}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{prof.name}</span>
                                            <CheckCircle size={14} color="#1E3A8A" />
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.1rem' }}>{prof.skillDomain || 'General'}</div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {prof.skillDomain && <span className="chip" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{prof.skillDomain}</span>}
                                    {prof.experience && <span className="chip" style={{ fontSize: '0.75rem', padding: '2px 8px', textTransform: 'capitalize' }}>{prof.experience}</span>}
                                    {prof.badgeMetadata && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(30,58,138,0.08)', color: '#1E3A8A', borderRadius: 999, fontWeight: 700 }}>
                                            <Award size={10} /> {prof.badgeMetadata.score}% Match
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    {prof.portfolioUrl && (
                                        <a href={prof.portfolioUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                                            <ExternalLink size={13} /> Portfolio
                                        </a>
                                    )}
                                    <Link to={`/professionals/${prof._id}`} className="btn btn-black btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
