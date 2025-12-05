import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import styles from './Header.module.css';
import { TokenExpiryIndicator } from '../TokenExpiryIndicator/TokenExpiryIndicator.tsx';
import {useNavigate} from "react-router-dom";

export const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropdownOpen]);

    if (!user) return null;

    const getInitials = (name: string) => {
        return name
            // .split(' ')
            // .map((n) => n[0])
            // .join('')
            // .toUpperCase()
            // .slice(0, 2);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>

            {isAuthenticated && <TokenExpiryIndicator warningThreshold={300} />}

            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <img src="/src/assets/static/icon/economy-logo.png" alt="logo" />
                </div>

                {/* User Menu */}
                <div className={styles.userMenu}>
                    <button
                        className={styles.userButton}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className={styles.avatar}>
                            {getInitials(user?.name)}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user?.name || 'User'}</span>
                            <span className={styles.userEmail}>{user?.email}</span>
                        </div>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className={styles.chevron}
                        >
                            <path
                                d="M5 7.5L10 12.5L15 7.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <>
                            <div
                                className={styles.overlay}
                                onClick={() => setDropdownOpen(false)}
                            />
                            <div className={styles.dropdown}>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        navigate('/profile');
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path
                                            d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="M15 15C15 12.7909 12.3137 11 9 11C5.68629 11 3 12.7909 3 15"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    პროფილი
                                </button>

                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        navigate('/dashboard');
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path
                                            d="M3 9H7.5M3 5.25H15M3 12.75H15"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    Dashboard
                                </button>

                                <div className={styles.dropdownDivider} />

                                <button
                                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                                    onClick={handleLogout}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path
                                            d="M11.25 12.75L15 9M15 9L11.25 5.25M15 9H6.75M6.75 3H5.25C4.00736 3 3 4.00736 3 5.25V12.75C3 13.9926 4.00736 15 5.25 15H6.75"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    გასვლა
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};