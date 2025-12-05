import React from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <div className={styles.background}>
                <div className={styles.gradientOverlay} />
            </div>

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="4" y="4" width="40" height="40" rx="8" fill="currentColor" opacity="0.1" />
                                <path d="M24 12v24M12 24h24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1>Survey App</h1>
                    </div>

                    <div className={styles.card}>{children}</div>

                    <footer className={styles.footer}>
                        <p>&copy; 2024 Survey App. ყველა უფლება დაცულია.</p>
                    </footer>
                </div>
            </main>
        </div>
    );
};