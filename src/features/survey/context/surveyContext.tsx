// features/survey/context/surveyContext.tsx
import React, { createContext, useContext, type ReactNode, useCallback, useMemo } from 'react';
import type { SurveyContextValue, SurveyFormData } from '../types/survey.types';
import { useSurveyStore } from '@features/survey/store/SurveyFormStore';
import { useSurveyLoader } from '@features/survey/hooks/useSurveyLoader';
import { FIELD_CLEANUP_RULES } from '../config/fieldDependencies';
import { getTotalSteps } from "@features/survey/config";

export const STORAGE_KEY = 'survey-form-data';

const SurveyContext = createContext<SurveyContextValue | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    useSurveyLoader();

    // ✅ Subscribe to individual store slices (selective re-renders)
    const formData = useSurveyStore((s) => s.formData) as  SurveyFormData;
    const currentStep = useSurveyStore((s) => s.currentStep);
    const isLoading = useSurveyStore((s) => s.isLoading);
    const isSubmitting = useSurveyStore((s) => s.isSubmitting);
    const surveyId = useSurveyStore((s) => s.surveyId);
    const setCurrentStep = useSurveyStore((s) => s.setCurrentStep);
    const setIsSubmitting = useSurveyStore((s) => s.setIsSubmitting);
    const resetForm = useSurveyStore((s) => s.resetForm);

    // ✅ OPTIMIZED: Single pass cleanup
    const updateFormData = useCallback(
        (data: Partial<SurveyFormData>) => {
            // Get fresh state once
            const { formData: currentFormData, updateFormData: storeUpdate } =
                useSurveyStore.getState();

            // Start with user updates
            let updates = { ...data };

            // Merge with current data for condition checking
            const fullData = { ...currentFormData, ...updates };

            // ✅ Apply all matching cleanup rules
            Object.keys(data).forEach((key) => {
                const field = key as keyof SurveyFormData;
                const value = data[field];

                // Find matching rules
                const matchingRules = FIELD_CLEANUP_RULES.filter(
                    (rule) => rule.field === field && rule.when(value, fullData)
                );

                // Apply cleanup from all matching rules
                matchingRules.forEach((rule) => {
                    const cleanupUpdates = rule.cleanup(currentFormData);
                    updates = { ...updates, ...cleanupUpdates };

                    console.log(`🧹 Cleanup triggered for ${String(field)}:`, cleanupUpdates);
                });
            });

            console.log('📝 Update:', { original: data, final: updates });

            // ✅ Single store update
            storeUpdate(updates);
        },
        [] // ✅ No dependencies - uses getState()
    );

    // ✅ Single field update
    const updateField = useCallback(
        <K extends keyof SurveyFormData>(field: K, value: SurveyFormData[K]) => {
            updateFormData({ [field]: value });
        },
        [updateFormData]
    );

    // ✅ Memoize context value - only changes when dependencies change
    const value: SurveyContextValue = useMemo(
        () => ({
            formData,
            updateFormData, // ✅ Custom with cleanup
            updateField,    // ✅ Wrapper
            currentStep,
            setCurrentStep,
            totalSteps: getTotalSteps(),
            resetForm,
            isSubmitting,
            setIsSubmitting,
            isLoading,
            surveyId,
        }),
        [
            formData,
            updateFormData,
            updateField,
            currentStep,
            setCurrentStep,
            resetForm,
            isSubmitting,
            setIsSubmitting,
            isLoading,
            surveyId,
        ]
    );

    return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSurvey = (): SurveyContextValue => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurvey must be used within SurveyProvider');
    }
    return context;
};