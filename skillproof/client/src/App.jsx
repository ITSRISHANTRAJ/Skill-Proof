import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';

// Professional Pages
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ApplyPage from './pages/ApplyPage';
import BadgePage from './pages/BadgePage';

// Employer Pages
import EmployerDashboard from './pages/EmployerDashboard';
import ProfessionalProfile from './pages/ProfessionalProfile';

// Admin Pages
import AdminPanel from './pages/AdminPanel';
import ManageChallenges from './pages/ManageChallenges';

function DashboardRedirect() {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'employer') return <Navigate to="/employer" replace />;
    return <Navigate to="/professional" replace />;
}

function App() {
    const { loading } = useContext(AuthContext);
    if (loading) return <Spinner size={40} text="Loading SkillProof..." />;

    return (
        <Router>
            <div className="page-wrapper">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Smart dashboard redirect */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute><DashboardRedirect /></ProtectedRoute>
                        } />

                        {/* Professional */}
                        <Route path="/professional" element={
                            <ProtectedRoute role="professional"><ProfessionalDashboard /></ProtectedRoute>
                        } />
                        <Route path="/apply" element={
                            <ProtectedRoute role="professional"><ApplyPage /></ProtectedRoute>
                        } />
                        <Route path="/badge" element={
                            <ProtectedRoute role="professional"><BadgePage /></ProtectedRoute>
                        } />

                        {/* Employer */}
                        <Route path="/employer" element={
                            <ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>
                        } />
                        <Route path="/professionals" element={
                            <ProtectedRoute><EmployerDashboard /></ProtectedRoute>
                        } />
                        <Route path="/professionals/:id" element={
                            <ProtectedRoute><ProfessionalProfile /></ProtectedRoute>
                        } />

                        {/* Admin */}
                        <Route path="/admin" element={
                            <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
                        } />
                        <Route path="/admin/challenges" element={
                            <ProtectedRoute role="admin"><ManageChallenges /></ProtectedRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={
                            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                                <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#E4E4E7' }}>404</h1>
                                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Page not found</p>
                                <a href="/" className="btn btn-black">Go Home</a>
                            </div>
                        } />
                    </Routes>
                </main>
                <footer className="footer">
                    © {new Date().getFullYear()} SkillProof · Performance-Based Skill Verification
                </footer>
            </div>
        </Router>
    );
}

export default App;
