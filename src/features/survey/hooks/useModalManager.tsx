// features/survey/hooks/useModalManager.ts

import { useState, useCallback } from 'react';
import type {
    HREntry,
    VacancyEntry,
    GrowthPlanEntry,
    ReductionPlanEntry
} from '../types/survey.types';

export type ModalEntry = HREntry | VacancyEntry | GrowthPlanEntry | ReductionPlanEntry;

interface ModalState {
    isOpen: boolean;
    entry: ModalEntry | null;
}

interface ModalManager {
    isOpen: boolean;
    entry: ModalEntry | null;
    openModal: (entry?: ModalEntry) => void;
    closeModal: () => void;
}

/**
 * Reusable modal state management
 * Handles open/close and entry editing
 */
export const useModalManager = (): ModalManager => {
    const [state, setState] = useState<ModalState>({
        isOpen: false,
        entry: null,
    });

    const openModal = useCallback((entry?: ModalEntry) => {
        setState({
            isOpen: true,
            entry: entry || null,
        });
    }, []);

    const closeModal = useCallback(() => {
        setState({
            isOpen: false,
            entry: null,
        });
    }, []);

    return {
        isOpen: state.isOpen,
        entry: state.entry,
        openModal,
        closeModal,
    };
};