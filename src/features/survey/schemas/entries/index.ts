// features/survey/schemas/entries/index.ts

/**
 * Entry schemas for survey data
 *
 * Each entry represents a category-based record with specific validation rules.
 */

export { hrEntrySchema, type HREntry } from './hrEntry.schema';
export { vacancyEntrySchema, type VacancyEntry } from './vacancyEntry.schema';
export { growthPlanEntrySchema, type GrowthPlanEntry } from './growthEntry.schema';
export { reductionPlanEntrySchema, type ReductionPlanEntry } from './reductionEntry.schema';