import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    redirectPath?: string; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/auth' }) => {
    const { user, loading } = useAuth(); 

    if (loading) {
        return <div className="loading-state">Kontrollerar inloggningsstatus...</div>; 
    }

    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />; 
};

export default ProtectedRoute;