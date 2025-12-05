import React, { createContext, useContext, useState, useEffect, type ReactNode  } from 'react';
import type {SurveyContextValue, SurveyFormData} from '../types/survey.types';
import {useAuth} from "../../auth/context/AuthContext.tsx";
import {surveyApi} from "../api/surveyapi.ts";

const TOTAL_STEPS = 5;

export const STORAGE_KEY = 'survey-form-data';

const defaultFormData: Partial<SurveyFormData> = {
    // Step 1 - HR მონაცემები
    hrEntries: [],

    // Step 2 - ვაკანსიები
    hasVacancies2025: false,
    vacancies2025Count: undefined,
    vacancyEntries: [],

    // Step 3 - ზრდის გეგმები
    planOneYearGrowth: false,
    planFiveYearGrowth: false,
    growthPlanEntries: [],

    // Step 4 - შემცირების გეგმები
    planOneYearReduction: false,
    planFiveYearReduction: false,
    reductionPlanEntries: [],
};

// ⭐ Helper function to load data from localStorage
const loadFromStorage = (): Partial<SurveyFormData> => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            console.log('📥 Loaded from localStorage:', parsed); // Debug log
            return { ...defaultFormData, ...parsed };
        }
    } catch (error) {
        console.error('❌ Error loading survey data:', error);
    }
    console.log('📝 Using default form data'); // Debug log
    return defaultFormData;
};

const SurveyContext = createContext<SurveyContextValue | undefined>(undefined);

interface SurveyProviderProps {
    children: ReactNode;
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {

    const { user, accessToken } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<SurveyFormData>>(() => loadFromStorage());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [surveyId, setSurveyId] = useState<string | null>(null); // ⭐ Track survey ID

    useEffect(() => {
        const loadSurveyFromAPI = async (token: string) => {
            if (!user?.id) {
                console.log('👤 No user ID available');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                console.log('🔄 Loading survey for user:', user.id);

                const result = await surveyApi.getSurveyByUserId(user.id);

                if (result.success && result.data) {
                    console.log('✅ Survey found in DB:', result.data);

                    // Merge: API data > localStorage > defaultFormData
                    const apiData = result.data;
                    setSurveyId(apiData.id || null);

                    setFormData((prev) => ({
                        ...defaultFormData,
                        ...prev, // Keep any localStorage data
                        ...apiData, // API data takes priority
                    }));
                } else {
                    console.log('📝 No survey found in DB - starting new survey');
                    // Keep current formData (from localStorage or default)
                }
            } catch (error) {
                console.error('❌ Error loading survey from API:', error);
                // Keep current formData on error
            } finally {
                setIsLoading(false);
            }
        };

        loadSurveyFromAPI(accessToken);
    }, [user?.id]); // Re-run when user changes

    // Save to localStorage whenever formData changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.error('Error saving survey data:', error);
        }
    }, [formData]);

    const updateFormData = (data: Partial<SurveyFormData>) => {
        setFormData((prev) => {
            const updated = { ...prev, ...data };
            console.log('🔄 Updating formData:', data, '→ Result:', updated); // Debug log
            return updated;
        });
    };

    const resetForm = () => {
        console.log('🔄 Resetting form'); // Debug log
        setFormData(defaultFormData);
        setCurrentStep(1);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value: SurveyContextValue = {
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        totalSteps: TOTAL_STEPS,
        resetForm,
        isSubmitting,
        setIsSubmitting,
        isLoading, // ⭐ Expose loading state
        surveyId, // ⭐ Expose survey ID
    };

    return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
};

export const useSurvey = (): SurveyContextValue => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurvey must be used within SurveyProvider');
    }
    return context;
};