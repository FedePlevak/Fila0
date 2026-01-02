import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && profile && !roles.includes(profile.role)) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}
