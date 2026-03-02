import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Wraps a route requiring authentication.
 * Optionally accepts `role` to enforce role-based access.
 * Usage: <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user.role !== role && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
