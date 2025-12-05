import { create } from "zustand";
import {SurveyFormData, surveySchema} from "@features/survey/schemas/surveySchema.ts";
import {createJSONStorage, persist} from "zustand/middleware/persist";
import { surveyApi } from '../api/surveyapi';

// export const useSurveyFormStore = create<{
//   formData: Partial<SurveyFormData>;
//   setFormData: (data: Partial<SurveyFormData>)  => void;
// }>((set) => ({
//   formData: surveySchema.parse({}),
//   setFormData: (data) => set({formData: data}),
// }));


const TOTAL_STEPS = 5;
export const STORAGE_KEY = 'survey-form-data';


const useSurveyStore = create<{
  formData: Partial<SurveyFormData>;
  currentStep: number;
  isLoading: boolean;
  isSubmitting: boolean;
  surveyId: string | number | null;

  setFormData: (data: Partial<SurveyFormData>) => void;
  updateFormData: (data: Partial<SurveyFormData>) => void;
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setSurveyId: (id: string | null) => void;
  resetForm: () => void;
  loadSurveyFromAPI: (userId: number) => Promise<void>;
}>()(
    persist((set, get) => ({
          // State
          formData: surveySchema.parse({}),
          currentStep: 1,
          isLoading: false,
          isSubmitting: false,
          surveyId: null,

          // Actions
          setFormData: (data) => {
            console.log('📝 Setting form data:', data);
            set({ formData: data });
          },

          updateFormData: (data) => {
            set((state) => {
              const updated = { ...state.formData, ...data };
              console.log('🔄 Updating formData:', data, '→ Result:', updated);
              return { formData: updated };
            });
          },

          setCurrentStep: (step) => {
            if (step >= 1 && step <= TOTAL_STEPS) {
              set({ currentStep: step });
            }
          },

          setIsLoading: (loading) => set({ isLoading: loading }),
          setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
          setSurveyId: (id) => set({ surveyId: id }),

          resetForm: () => {
            console.log('🔄 Resetting form');
            set({
              formData: surveySchema.parse({}),
              currentStep: 1,
              surveyId: null,
            });
            localStorage.removeItem(STORAGE_KEY);
          },

          // Your original API loading logic
          loadSurveyFromAPI: async (userId: number) => {
            if (!userId) {
              console.log('👤 No user ID available');
              set({ isLoading: false });
              return;
            }

            try {
              set({ isLoading: true });
              console.log('🔄 Loading survey for user:', userId);

              const result = await surveyApi.getSurveyByUserId(userId);

              if (result.success && result.data) {
                console.log('✅ Survey found in DB:', result.data);
                const apiData = result.data;

                set((state) => ({
                  formData: {
                    ...surveySchema.parse({}),
                    ...state.formData,
                    ...apiData,
                  },
                  surveyId: apiData.id || null,
                }));
              } else {
                console.log('📝 No survey found in DB - starting new survey');
              }
            } catch (error) {
              console.error('❌ Error loading survey from API:', error);
            } finally {
              set({ isLoading: false });
            }
          },
        }),
        {
          name: STORAGE_KEY,
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            formData: state.formData,
            surveyId: state.surveyId,
          }),
        }
    )
);



export const useLoadSurveyFromAPI = () => useSurveyStore((s) => s.loadSurveyFromAPI);
export const useFormData = () => useSurveyStore((state) => state.formData);
export const useCurrentStep = () => useSurveyStore((state) => state.currentStep);
export const useIsLoading = () => useSurveyStore((state) => state.isLoading);
export const useIsSubmitting = () => useSurveyStore((state) => state.isSubmitting);
export const useSurveyId = () => useSurveyStore((state) => state.surveyId);