import React, { createContext, useContext, useCallback } from 'react';
import { useSurvey } from '../../../../context/surveyContext.tsx';

export interface ReductionPlanEntry {
    id: string;
    category: string;
    oneYearReduction?: number;
    fiveYearReduction?: number;
}

interface Step4ContextValue {
    planOneYearReduction: boolean;
    planFiveYearReduction: boolean;
    setPlanOneYearReduction: (value: boolean) => void;
    setPlanFiveYearReduction: (value: boolean) => void;
    entries: ReductionPlanEntry[];
    addEntry: (entry: Omit<ReductionPlanEntry, 'id'>) => void;
    updateEntry: (id: string, entry: Omit<ReductionPlanEntry, 'id'>) => void;
    deleteEntry: (id: string) => void;
}

const Step4Context = createContext<Step4ContextValue | undefined>(undefined);

export const Step4Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { formData, updateFormData } = useSurvey();

    const planOneYearReduction = formData.planOneYearReduction || false;
    const planFiveYearReduction = formData.planFiveYearReduction || false;
    const entries = (formData.reductionPlanEntries || []) as ReductionPlanEntry[];

    const setPlanOneYearReduction = useCallback(
        (value: boolean) => {
            updateFormData({ planOneYearReduction: value });
            // თუ გამოითიშა, წავშალოთ oneYearReduction ყველა entry-დან
            if (!value) {
                const updatedEntries = entries.map(entry => ({
                    ...entry,
                    oneYearReduction: undefined
                }));
                updateFormData({ reductionPlanEntries: updatedEntries });
            }
        },
        [updateFormData, entries]
    );

    const setPlanFiveYearReduction = useCallback(
        (value: boolean) => {
            updateFormData({ planFiveYearReduction: value });
            // თუ გამოითიშა, წავშალოთ fiveYearReduction ყველა entry-დან
            if (!value) {
                const updatedEntries = entries.map(entry => ({
                    ...entry,
                    fiveYearReduction: undefined
                }));
                updateFormData({ reductionPlanEntries: updatedEntries });
            }
        },
        [updateFormData, entries]
    );

    const addEntry = useCallback(
        (entry: Omit<ReductionPlanEntry, 'id'>) => {
            const newEntry: ReductionPlanEntry = {
                ...entry,
                id: Math.random().toString(36).substr(2, 9),
            };
            const updatedEntries = [...entries, newEntry];
            updateFormData({ reductionPlanEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const updateEntry = useCallback(
        (id: string, entryData: Omit<ReductionPlanEntry, 'id'>) => {
            const updatedEntries = entries.map((entry) =>
                entry.id === id ? { ...entryData, id } : entry
            );
            updateFormData({ reductionPlanEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const deleteEntry = useCallback(
        (id: string) => {
            const updatedEntries = entries.filter((entry) => entry.id !== id);
            updateFormData({ reductionPlanEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    return (
        <Step4Context.Provider
            value={{
                planOneYearReduction,
                planFiveYearReduction,
                setPlanOneYearReduction,
                setPlanFiveYearReduction,
                entries,
                addEntry,
                updateEntry,
                deleteEntry,
            }}
        >
            {children}
        </Step4Context.Provider>
    );
};

export const useStep4 = (): Step4ContextValue => {
    const context = useContext(Step4Context);
    if (!context) {
        throw new Error('useStep4 must be used within Step4Provider');
    }
    return context;
};