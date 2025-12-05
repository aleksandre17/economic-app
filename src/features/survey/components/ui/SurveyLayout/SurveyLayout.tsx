import React from 'react';
import { Header } from '../../../../../shared/componets/Header/Header';
import styles from './SurveyLayout.module.css';

interface SurveyLayoutProps {
    children: React.ReactNode;
}

export const SurveyLayout: React.FC<SurveyLayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header />

            <div className={styles.background} />

            <main className={styles.main}>
                {children}
            </main>

            <footer className={styles.footer}>
                <p>&copy; 2024 Survey App. ყველა უფლება დაცულია.</p>
            </footer>
        </div>
    );
};