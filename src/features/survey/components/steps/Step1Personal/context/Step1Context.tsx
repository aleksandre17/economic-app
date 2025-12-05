import React, { createContext, useContext, useCallback } from 'react';
import { useSurvey } from '../../../../context/SurveyContext';

export interface HREntry {
    id: string;
    category: string;
    quantity2025: number;
    educationLevels: {
        average: number;
        professional: number;
        higher: number;
    };
    quantity2024: number;
    retirementNextFiveYears: number;
}

interface Step1ContextValue {
    entries: HREntry[];
    addEntry: (entry: Omit<HREntry, 'id'>) => void;
    updateEntry: (id: string, entry: Omit<HREntry, 'id'>) => void;
    deleteEntry: (id: string) => void;
}

const Step1Context = createContext<Step1ContextValue | undefined>(undefined);

export const Step1Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { formData, updateFormData } = useSurvey();

    // Get entries from survey formData (stored as hrEntries)
    const entries = (formData.hrEntries || []) as HREntry[];

    const addEntry = useCallback(
        (entry: Omit<HREntry, 'id'>) => {
            const newEntry: HREntry = {
                ...entry,
                id: Math.random().toString(36).substr(2, 9),
            };

            const updatedEntries = [...entries, newEntry];
            updateFormData({ hrEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const updateEntry = useCallback(
        (id: string, entryData: Omit<HREntry, 'id'>) => {
            const updatedEntries = entries.map((entry) =>
                entry.id === id ? { ...entryData, id } : entry
            );
            updateFormData({ hrEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const deleteEntry = useCallback(
        (id: string) => {
            const updatedEntries = entries.filter((entry) => entry.id !== id);
            updateFormData({ hrEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    return (
        <Step1Context.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
            {children}
        </Step1Context.Provider>
    );
};

export const useStep1 = (): Step1ContextValue => {
    const context = useContext(Step1Context);
    if (!context) {
        throw new Error('useStep1 must be used within Step1Provider');
    }
    return context;
};