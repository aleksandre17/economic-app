import React from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: React.ReactNode;
}

import logo from '@assets/icon/economy-logo.png';

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
                            <img src={logo} style={{ width: 200 }} />
                        </div>
                    </div>

                    <div className={styles.card}>{children}</div>

                    <footer className={styles.footer}>
                        <p>&copy; 2025. ყველა უფლება დაცულია.</p>
                    </footer>
                </div>
            </main>
        </div>
    );
};