import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className,
                                              padding = 'md',
                                          }) => {
    return (
        <div className={`${styles.card} ${styles[`padding-${padding}`]} ${className || ''}`}>
            {children}
        </div>
    );
};

export const CardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className={styles.body}>{children}</div>;
};