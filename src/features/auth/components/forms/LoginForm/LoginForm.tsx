import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '@/shared/componets/ui/Button/Button.tsx';
import { Input } from '@/shared/componets/ui/Input/Input.tsx';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
    const { login, error, clearError} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // ⭐ Get the location user tried to access before being redirected to login
    const from = (location.state as any)?.from?.pathname || '/survey';

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!email.trim()) {
            newErrors.email = 'ელ. ფოსტა სავალდებულოა';
        }
        // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        //     newErrors.email = 'არასწორი ელ. ფოსტის ფორმატი';
        // }

        if (!password) {
            newErrors.password = 'პაროლი სავალდებულოა';
        } else if (password.length < 6) {
            newErrors.password = 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            console.log('🔐 Attempting login...');

            const result = await login({ email: email, password: password });

            if (result.success) {
                console.log('✅ Login successful');
                console.log('🚀 Redirecting to:', from);

                // ⭐ Redirect to saved location or default to /survey
                navigate(from, { replace: true });
            } else {
                console.error('❌ Login failed:', result.error);
                //setError(result.error || 'Login failed');
            }
        } catch (err: any) {
            console.error('❌ Login error:', err);
            setErrors({ general: err.message || 'An error occurred during login' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.header}>
                <h2>სისტემაში შესვლა</h2>
                <p>შეიყვანეთ თქვენი მონაცემები</p>
            </div>

            {error && (
                <div className={styles.errorBanner}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {error}
                </div>
            )}

            <Input
                label="ელ. ფოსტა"
                type="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="example@email.com"
                disabled={isSubmitting}
                required
                fullWidth
            />

            <div className={styles.passwordWrapper}>
                <Input
                    label="პაროლი"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    placeholder="შეიყვანეთ პაროლი"
                    disabled={isSubmitting}
                    required
                    fullWidth
                />
                <button
                    type="button"
                    className={styles.showPasswordBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                >
                    {/*{showPassword ? '👁️' : '👁️‍🗨️'}*/}
                </button>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
            >
                შესვლა
            </Button>

            {/* ✅ Download Link - Elegantly placed */}
            <div className={styles.helpSection}>
                <a
                    href="/docs/კითხვარი_2025.xlsx"
                    className={styles.downloadLink}
                    download
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M9 11.25V3.75M9 11.25l-2.625-2.625M9 11.25l2.625-2.625M3.375 14.25h11.25"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>გადმოწერეთ კითხვარის Excel - ვერსია</span>
                </a>
            </div>

            {/* ⭐ Debug info (remove in production) */}
            {import.meta.env.DEV && (
                <div className={styles.debug}>
                    <p><strong>Test Account:</strong></p>
                    <p>Email: test@example.com</p>
                    <p>Password: 123456</p>
                    <p><strong>Will redirect to:</strong> {from}</p>
                </div>
            )}
        </form>
    );
};