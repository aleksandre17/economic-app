import React from 'react';
import { AuthLayout } from '../components/ui/AuthLayout/AuthLayout';
import { LoginForm } from '../components/forms/LoginForm/LoginForm';

export const LoginPage: React.FC = () => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
};