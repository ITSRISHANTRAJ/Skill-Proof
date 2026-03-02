import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, LayoutDashboard, Users, Settings, LogOut, Menu, X, Award } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const navLink = (href, label) => (
        <Link
            to={href}
            onClick={() => setMobileOpen(false)}
            className={`nav-link${location.pathname === href ? ' nav-link--active' : ''}`}
        >
            {label}
        </Link>
    );

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <ShieldCheck className="navbar-logo-icon" />
                    <span>SkillProof</span>
                </Link>

                {/* Desktop nav */}
                <div className="navbar-links">
                    {navLink('/about', 'About')}

                    {!user ? (
                        <>
                            {navLink('/login', 'Log In')}
                            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'professional' && (
                                <>
                                    {navLink('/dashboard', 'Dashboard')}
                                    {navLink('/apply', 'Apply')}
                                    {user.isVerified && navLink('/badge', 'My Badge')}
                                </>
                            )}
                            {user.role === 'employer' && (
                                <>
                                    {navLink('/dashboard', 'Dashboard')}
                                    {navLink('/professionals', 'Browse Talent')}
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    {navLink('/admin', 'Admin Panel')}
                                    {navLink('/admin/challenges', 'Challenges')}
                                </>
                            )}
                            <div className="navbar-user">
                                <span className="navbar-user-name">{user.name.split(' ')[0]}</span>
                                <span className={`role-pill role-pill--${user.role}`}>{user.role}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                <LogOut size={14} />
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="navbar-mobile-menu">
                    {navLink('/about', 'About')}
                    {!user ? (
                        <>
                            {navLink('/login', 'Log In')}
                            {navLink('/register', 'Get Started')}
                        </>
                    ) : (
                        <>
                            {user.role === 'professional' && (
                                <>
                                    {navLink('/dashboard', 'Dashboard')}
                                    {navLink('/apply', 'Apply')}
                                    {user.isVerified && navLink('/badge', 'My Badge')}
                                </>
                            )}
                            {user.role === 'employer' && (
                                <>
                                    {navLink('/dashboard', 'Dashboard')}
                                    {navLink('/professionals', 'Browse Talent')}
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    {navLink('/admin', 'Admin Panel')}
                                    {navLink('/admin/challenges', 'Challenges')}
                                </>
                            )}
                            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
