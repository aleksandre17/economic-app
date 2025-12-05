import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {AuthProvider, useAuth} from '.././features/auth/context/AuthContext';

import { ProtectedRoute, PublicRoute} from "../shared/componets/route";
//import { useTokenRefresh } from '../shared/hooks/useTokenRefresh';
import '.././styles/index.css';


// Lazy load pages
const SurveyPage = lazy(() =>
    import('../features/survey/pages/SurveyPage').then(module => ({
        default: module.SurveyPage  // ⭐ Extract named export as default
    }))
);
const LoginPage = lazy(() =>
    import('.././features/auth/pages/LoginPage').then(module => ({
    default: module.LoginPage  // ⭐ Extract named export as default
    }))
);
const SuccessPage = lazy(() =>
    import('../features/survey/pages/SuccessPage').then(module => ({
        default: module.SuccessPage  // ⭐ Extract named export as default
    }))
);


console.log("SurveyPage" + SurveyPage);

const PageLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
    }}>
        იტვირთება...
    </div>
);

function App() {

    // const { isAuthenticated } = useAuth();
    //
    // useTokenRefresh({
    //     enabled: isAuthenticated,
    //     refreshThreshold: 300, // 5 minutes
    //     onRefreshSuccess: () => {
    //         console.log('✅ Token refreshed successfully');
    //         // Show success toast
    //     },
    //     onRefreshError: (error) => {
    //         console.error('❌ Token refresh failed:', error);
    //         // Show error toast
    //     },
    // });

    return (
        <BrowserRouter>
                <AuthProvider>
                    <Suspense fallback={<PageLoader/>}>
                        <Routes>
                            {/* Public Routes */}
                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<LoginPage />} />
                            </Route>

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/survey" element={<SurveyPage />} />
                                <Route path="/survey/success" element={<SuccessPage />} />
                            </Route>

                            {/* Default Redirect */}
                            <Route path="/" element={<Navigate to="/survey" replace />} />
                            <Route path="*" element={<div>404 Not Found</div>} />
                        </Routes>
                    </Suspense>
                </AuthProvider>
        </BrowserRouter>
    );
}

export default App;