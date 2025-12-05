import React, { createContext, useContext, useCallback } from 'react';
import { useSurvey } from '../../../../context/SurveyContext';

export interface VacancyEntry {
    id: string;
    category: string;
    totalVacancies: number;
    announcedVacancies: number;
    unfilledVacancies: number;
    employmentDuration: 'under_6_months' | '6_months_to_1_year' | 'over_1_year';
}

interface Step2ContextValue {
    hasVacancies2025: boolean | undefined;
    vacancies2025Count: number | undefined;
    setHasVacancies2025: (value: boolean) => void;
    setVacancies2025Count: (value: number | undefined) => void;
    entries: VacancyEntry[];
    addEntry: (entry: Omit<VacancyEntry, 'id'>) => void;
    updateEntry: (id: string, entry: Omit<VacancyEntry, 'id'>) => void;
    deleteEntry: (id: string) => void;
}

const Step2Context = createContext<Step2ContextValue | undefined>(undefined);

export const Step2Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { formData, updateFormData } = useSurvey();

    const hasVacancies2025 = formData.hasVacancies2025; //false
    const vacancies2025Count = formData.vacancies2025Count;
    const entries = (formData.vacancyEntries || []) as VacancyEntry[];

    const setHasVacancies2025 = useCallback(
        (value: boolean) => {
            updateFormData({ hasVacancies2025: value });
            // თუ "არა", გავწმინდოთ ყველა მონაცემი
            if (!value) {
                updateFormData({
                    vacancies2025Count: undefined,
                    vacancyEntries: [],
                });
            }
        },
        [updateFormData]
    );

    const setVacancies2025Count = useCallback(
        (value: number | undefined) => {
            updateFormData({ vacancies2025Count: value });
        },
        [updateFormData]
    );

    const addEntry = useCallback(
        (entry: Omit<VacancyEntry, 'id'>) => {
            const newEntry: VacancyEntry = {
                ...entry,
                id: Math.random().toString(36).substr(2, 9),
            };
            const updatedEntries = [...entries, newEntry];
            updateFormData({ vacancyEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const updateEntry = useCallback(
        (id: string, entryData: Omit<VacancyEntry, 'id'>) => {
            const updatedEntries = entries.map((entry) =>
                entry.id === id ? { ...entryData, id } : entry
            );
            updateFormData({ vacancyEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    const deleteEntry = useCallback(
        (id: string) => {
            const updatedEntries = entries.filter((entry) => entry.id !== id);
            updateFormData({ vacancyEntries: updatedEntries });
        },
        [entries, updateFormData]
    );

    return (
        <Step2Context.Provider
            value={{
                hasVacancies2025,
                vacancies2025Count,
                setHasVacancies2025,
                setVacancies2025Count,
                entries,
                addEntry,
                updateEntry,
                deleteEntry,
            }}
        >
            {children}
        </Step2Context.Provider>
    );
};

export const useStep2 = (): Step2ContextValue => {
    const context = useContext(Step2Context);
    if (!context) {
        throw new Error('useStep2 must be used within Step2Provider');
    }
    return context;
};