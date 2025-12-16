// features/survey/config/stepMetadata.ts

export interface StepMeta {
    id: number;
    title: string;
    description: string;
}

export const STEP_METADATA = {
    1: {
        id: 1,
        title: 'HR მონაცემები',
        description: 'დასაქმებულთა რაოდენობა'
    },
    2: {
        id: 2,
        title: 'ვაკანსიები',
        description: 'ვაკანსიების ინფორმაცია'
    },
    3: {
        id: 3,
        title: 'ზრდის გეგმები',
        description: 'დასაქმების ზრდა'
    },
    4: {
        id: 4,
        title: 'შემცირების გეგმები',
        description: 'დასაქმების შემცირება'
    },
    5: {
        id: 5,
        title: 'გადახედვა',
        description: 'საბოლოო შემოწმება'
    },
} as const;

export type StepKey = keyof typeof STEP_METADATA; // 1 | 2 | 3 | 4 | 5
export type StepMetaRegistry = typeof STEP_METADATA;

export const STEP_METADATA_ARRAY = Object.values(STEP_METADATA);