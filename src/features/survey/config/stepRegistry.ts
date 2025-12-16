// features/survey/config/stepRegistry.ts
import { ComponentType } from 'react';

// Step Components
import { Step1Personal } from '../components/steps/Step1Personal/Step1Personal';
import { Step2Vacancies } from '../components/steps/Step2Vacancies/Step2Vacancies';
import { Step3Additional } from '../components/steps/Step3Additional/Step3Additional';
import { Step4Reduction } from '../components/steps/Step4Reduction/Step4Reduction';
import { Step5Review } from '../components/steps/Step5Review/Step5Review';

// Modal Components
import { AddEntryModal } from '../components/steps/Step1Personal/components/AddEntryModal/AddEntryModal';
import { AddVacancyModal } from '../components/steps/Step2Vacancies/components/AddVacancyModal/AddVacancyModal';
import { AddGrowthModal } from '../components/steps/Step3Additional/components/AddGrowthModal/AddGrowthModal';
import { AddReductionModal } from '../components/steps/Step4Reduction/components/AddReductionModal/AddReductionModal';

import type {
    Step1Data,
    Step2Data,
    Step3Data,
    Step4Data,
    Survey
} from '@features/survey/schemas';

import type {
    GrowthPlanEntry,
    HREntry,
    ReductionPlanEntry,
    VacancyEntry
} from '@features/survey/types/survey.types';

import { STEP_METADATA, type StepKey, type StepMetaRegistry } from './stepMetadata';

// ============================================
// Step Config Definition
// ============================================

export interface StepConfig<TFormData = any, TModalEntry = any> {
    component: ComponentType<StepProps<TFormData, TModalEntry>>;
    modal?: ComponentType<ModalProps<TModalEntry>>;
    requiresModal: boolean;
}

/**
 * Generic props for step components
 */
export interface StepProps<TFormData, TModalEntry> {
    onError?: (errors: any) => void;
    onSubmit?: (data: TFormData) => void;
    onOpenModal: (entry?: TModalEntry) => void;
}

/**
 * Generic props for modal components
 */
export interface ModalProps<TEntry = unknown> {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (entry: TEntry) => void;
    entry?: TEntry;
}

// ============================================
// Typed Registry Interface
// ============================================

export interface StepRegistry {
    1: StepConfig<Step1Data, HREntry>;
    2: StepConfig<Step2Data, VacancyEntry>;
    3: StepConfig<Step3Data, GrowthPlanEntry>;
    4: StepConfig<Step4Data, ReductionPlanEntry>;
    5: StepConfig<Survey, never>;
}

// ============================================
// Registry Type with Constraint
// ============================================

type StepRegistryType = Record<StepKey, StepConfig>;


// ✅ Helper function that enforces the constraint
function defineStepRegistry<T extends StepRegistryType>(registry: T): T {
    return registry;
}

// ============================================
// Step Registry Definition
// ============================================

export const STEP_REGISTRY = defineStepRegistry({
    1: {
        component: Step1Personal,
        modal: AddEntryModal,
        requiresModal: true,
    },
    2: {
        component: Step2Vacancies,
        modal: AddVacancyModal,
        requiresModal: true,
    },
    3: {
        component: Step3Additional,
        modal: AddGrowthModal,
        requiresModal: true,
    },
    4: {
        component: Step4Reduction,
        modal: AddReductionModal,
        requiresModal: true,
    },
    5: {
        component: Step5Review,
        requiresModal: false,
    },
});

// ============================================
// Type Helpers
// ============================================

export type StepNumber = keyof StepRegistry;
export type StepData<N extends StepNumber> = StepRegistry[N];
export type StepMetaData<N extends StepNumber> = StepMetaRegistry[N];

// ============================================
// Helper Functions
// ============================================

/**
 * ✅ Get step metadata (title, description)
 */
export const getStepMetadata = <K extends StepNumber>(step: K): StepMetaData<K> => {
    return STEP_METADATA[step];
};

/**
 * ✅ Get step component and modal configuration
 */
export const getStepComponent = <K extends StepNumber>(step: K): StepData<K> => {
    return STEP_REGISTRY[step] as StepData<K>;
};

/**
 * ✅ Get complete step configuration (metadata + component)
 */
export const getStepConfig = <K extends StepNumber>(
    step: K
): StepData<K> & StepMetaData<K> => {
    return {
        ...STEP_METADATA[step],
        ...STEP_REGISTRY[step],
    } as StepData<K> & StepMetaData<K>;
};

/**
 * ✅ Get total number of steps
 */
export const getTotalSteps = (): number => {
    return Object.keys(STEP_REGISTRY).length;
};

/**
 * ✅ Check if step is the last one
 */
export const isLastStep = (step: number): boolean => {
    return step === getTotalSteps();
};

/**
 * ✅ Check if step is the first one
 */
export const isFirstStep = (step: number): boolean => {
    return step === 1;
};

/**
 * ✅ Get next step number
 */
export const getNextStep = (currentStep: StepNumber): StepNumber | null => {
    const next = (currentStep + 1) as StepNumber;
    return next <= getTotalSteps() ? next : null;
};

/**
 * ✅ Get previous step number
 */
export const getPreviousStep = (currentStep: StepNumber): StepNumber | null => {
    const prev = (currentStep - 1) as StepNumber;
    return prev >= 1 ? prev : null;
};

/**
 * ✅ Check if step requires modal
 */
export const stepRequiresModal = <K extends StepNumber>(step: K): boolean => {
    return STEP_REGISTRY[step].requiresModal;
};

/**
 * ✅ Get step title
 */
export const getStepTitle = <K extends StepNumber>(step: K): string => {
    return STEP_METADATA[step].title;
};

/**
 * ✅ Get step description
 */
export const getStepDescription = <K extends StepNumber>(step: K): string => {
    return STEP_METADATA[step].description;
};

/**
 * ✅ Get all steps as array
 */
export const getStepsArray = () => {
    return Object.entries(STEP_METADATA).map(([key, meta]) => ({
        step: Number(key) as StepNumber,
        ...meta,
        ...STEP_REGISTRY[Number(key) as StepNumber],
    }));
};