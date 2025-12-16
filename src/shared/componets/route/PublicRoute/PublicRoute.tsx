import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '@features/auth/context/AuthContext.tsx';
import styles from "../ProtectedRoute/ProtectedRoute.module.css";

interface PublicRouteProps {
    children?: React.ReactNode;
    redirectTo?: string; // Default: '/survey'
}

/**
 * ⭐ Public Route Component
 *
 * Redirects authenticated users away from login/register pages
 * Example: If user is already logged in, they can't access /login
 *
 * Usage:
 * <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({redirectTo = '/survey' }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}>
                    <svg className="animate-spin" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                        <path d="M44 24a20 20 0 01-20 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>
                <p className={styles.loadingText}>იტვირთება...</p>
            </div>
        );
    }

    // Already authenticated → Redirect to app
    if (isAuthenticated) {
        console.log('✅ Already authenticated - redirecting to', redirectTo);
        return <Navigate to={redirectTo} replace />;
    }

    //return <>{children}</>;
    return <Outlet />;
};

export default PublicRoute;