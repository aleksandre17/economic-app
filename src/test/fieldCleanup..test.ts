// fieldCleanup.test.ts

// import { FIELD_CLEANUP_RULES } from './fieldCleanup';
// import type { SurveyFormData } from '../types/survey.types';
//
// describe('Field Cleanup Rules', () => {
//     it('should clear oneYear when planOneYearGrowth is false', () => {
//         const formData: SurveyFormData = {
//             planOneYearGrowth: true,
//             planFiveYearGrowth: true,
//             growthPlanEntries: [
//                 { id: 1, category: 'IT', currentYear: 100, oneYear: 120, fiveYears: 150 },
//             ],
//         };
//
//         const rule = FIELD_CLEANUP_RULES.find(
//             (r) => r.field === 'planOneYearGrowth' && r.cleanup
//         );
//
//         expect(rule).toBeDefined();
//         expect(rule!.when(false, formData)).toBe(true);
//
//         const updates = rule!.cleanup(formData);
//         expect(updates.growthPlanEntries[0].oneYear).toBe(null);
//         expect(updates.growthPlanEntries[0].fiveYears).toBe(150);
//     });
//
//     it('should clear entire array when both unchecked', () => {
//         const formData: SurveyFormData = {
//             planOneYearGrowth: false,
//             planFiveYearGrowth: true,
//             growthPlanEntries: [
//                 { id: 1, category: 'IT', currentYear: 100, oneYear: null, fiveYears: 150 },
//             ],
//         };
//
//         const rule = FIELD_CLEANUP_RULES.find(
//             (r) =>
//                 r.field === 'planFiveYearGrowth' &&
//                 r.when(false, { ...formData, planFiveYearGrowth: false })
//         );
//
//         expect(rule).toBeDefined();
//
//         const updates = rule!.cleanup(formData);
//         expect(updates.growthPlanEntries).toEqual([]);
//     });
//
//     it('should handle empty array safely', () => {
//         const formData: SurveyFormData = {
//             planOneYearGrowth: true,
//             growthPlanEntries: [],
//         };
//
//         const rule = FIELD_CLEANUP_RULES.find((r) => r.field === 'planOneYearGrowth');
//         const updates = rule!.cleanup(formData);
//
//         expect(updates.growthPlanEntries).toEqual([]);
//     });
// });