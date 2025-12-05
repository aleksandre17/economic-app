import React, { createContext, useContext, useCallback } from 'react';
import { useSurvey } from '../../../../context/SurveyContext';

export interface GrowthPlanEntry {
    id: string;
    category: string;
    oneYearGrowth?: number;
    fiveYearGrowth?: number;
}

interface Step3ContextValue {
    planOneYearGrowth: boolean;
    planFiveYearGrowth: boolean;
    setPlanOneYearGrowth: (value: boolean) => void;
    setPlanFiveYearGrowth: (value: boolean) => void;
    entries: GrowthPlanEntry[];
    addEntry: (entry: Omit<GrowthPlanEntry, 'id'>) => void;
    updateEntry: (id: string, entry: Omit<GrowthPlanEntry, 'id'>) => void;
    deleteEntry: (id: string) => void;
}

const Step3Context = createContext<Step3ContextValue | undefined>(undefined);

export const Step3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { formData, updateFormData } = useSurvey();

    const planOneYearGrowth = formData.planOneYearGrowth || false;
    const planFiveYearGrowth = formData.planFiveYearGrowth || false;
    const entries = (formData.growthPlanEntries || []) as GrowthPlanEntry[];

    const setPlanOneYearGrowth = useCallback(
        (value: boolean) => {
            updateFormData({ planOneYearGrowth: value });
            // თუ გამოითიშა, წავშალოთ oneYearGrowth ყველა entry-დან
            if (!value) {
                const updatedEntries = entries.map(entry => ({
                    ...entry,
                    oneYearGrowth: undefined
                }));
                updateFormData({ growthPlanEntries: updatedEntries });
            }
        },
        [updateFormData, entries]
    );

    const setPlanFiveYearGrowth = useCallback(
        (value: boolean) => {
            updateFormData({ planFiveYearGrowth: value });
            // თუ გამოითიშა, წავშალოთ fiveYearGrowth ყველა entry-დან
            if (!value) {
                const updatedEntries = entries.map(entry => ({
                    ...entry,
                    fiveYearGrowth: undefined
                }));
                updateFormData({ growthPlanEntries: updatedEntries });
            }
        },
        [updateFormData, entries]
    );

    const addEntry = useCallback(
        (entry: Omit<GrowthPlanEntry, 'id'>) => {
            const newEntry: GrowthPlanEntry = {
                ...entry,
                id: Math.random().toString(36).substr(2, 9),
            };
            const updatedEntries = [...entries, newEntry];
            updateFormData({ growthPlanEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const updateEntry = useCallback(
        (id: string, entryData: Omit<GrowthPlanEntry, 'id'>) => {
            const updatedEntries = entries.map((entry) =>
                entry.id === id ? { ...entryData, id } : entry
            );
            updateFormData({ growthPlanEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const deleteEntry = useCallback(
        (id: string) => {
            const updatedEntries = entries.filter((entry) => entry.id !== id);
            updateFormData({ growthPlanEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    return (
        <Step3Context.Provider
            value={{
                planOneYearGrowth,
                planFiveYearGrowth,
                setPlanOneYearGrowth,
                setPlanFiveYearGrowth,
                entries,
                addEntry,
                updateEntry,
                deleteEntry,
            }}
        >
            {children}
        </Step3Context.Provider>
    );
};

export const useStep3 = (): Step3ContextValue => {
    const context = useContext(Step3Context);
    if (!context) {
        throw new Error('useStep3 must be used within Step3Provider');
    }
    return context;
};