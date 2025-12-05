import React from 'react';
import { SurveyLayout } from '../components/ui/SurveyLayout/SurveyLayout';
import { Button } from '../../../shared/componets/ui/Button/Button';
import { Card } from '../../../shared/componets/ui/Card/Card';
import styles from './SuccessPage.module.css';
import {useAuth} from "../../auth/context/AuthContext.tsx";

export const SuccessPage: React.FC = () => {
    //const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <SurveyLayout>
            <div className={styles.container}>
                <Card>
                    <div className={styles.content}>
                        <div className={styles.icon}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="36" fill="var(--color-success)" opacity="0.1" />
                                <circle cx="40" cy="40" r="30" stroke="var(--color-success)" strokeWidth="3" />
                                <path
                                    d="M25 40l10 10 20-20"
                                    stroke="var(--color-success)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h1 className={styles.title}>წარმატებით გაიგზავნა!</h1>
                        <p className={styles.description}>
                            გმადლობთ კითხვარის შევსებისთვის. თქვენი პასუხები წარმატებით გაიგზავნა.
                        </p>

                        <div className={styles.actions}>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => logout()}
                                fullWidth
                            >
                                გასვლა სისტემიდან
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </SurveyLayout>
    );
};