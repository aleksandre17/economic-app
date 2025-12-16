// features/survey/config/index.ts

// ✅ Export from stepMetadata
export {
    STEP_METADATA,
    STEP_METADATA_ARRAY,
    type StepKey,
    type StepMetaRegistry,
    type StepMeta,
} from './stepMetadata';

// ✅ Export from stepRegistry
export {
    STEP_REGISTRY,
    type StepConfig,
    type StepNumber,
    type StepRegistry,
    type StepData,
    type StepMetaData,
    type StepProps,
    type ModalProps,
    getStepMetadata,
    getStepComponent,
    getStepConfig,
    getTotalSteps,
    isLastStep,
    isFirstStep,
    getNextStep,
    getPreviousStep,
    stepRequiresModal,
    getStepTitle,
    getStepDescription,
    getStepsArray,
} from './stepRegistry';