import React from 'react';
import { SurveyProvider } from '../context/SurveyContext';
import { SurveyLayout } from '../components/ui/SurveyLayout/SurveyLayout';
import { SurveyContainer } from '../components/SurveyContainer';

export const SurveyPage: React.FC = () => {
    return (
        <SurveyProvider>
            <SurveyLayout>
                <SurveyContainer />
            </SurveyLayout>
        </SurveyProvider>
    );
};