import React from 'react';
import { SurveyProvider } from '../context/surveyContext.tsx';
import { ClassifierProvider } from '@/shared/packages/classifiers';
import { SurveyLayout } from '../components/ui/SurveyLayout/SurveyLayout';
import { SurveyContainer } from '../components/SurveyContainer';
import { useNotificationStore, NotificationContainer } from '@/shared/packages/notifications';

export const SurveyPage: React.FC = () => {

    // ✅ Subscribe to global notifications
    const notifications = useNotificationStore((state) => state.notifications);
    const dismissNotification = useNotificationStore((state) => state.dismissNotification);

    return (
        <>
            <ClassifierProvider>
                <SurveyProvider>
                    <SurveyLayout>
                        <SurveyContainer />
                    </SurveyLayout>
                </SurveyProvider>
            </ClassifierProvider>

            <NotificationContainer notifications={notifications} onDismiss={dismissNotification}/>
        </>
    );
};