import axios from 'axios';
import type {SurveyFormData} from '../types/survey.types';
import { apiClient } from "../../../shared/api";

export const surveyApi = {

    getSurveyByUserId: async (userId: number) => {
        try {
            const response = await apiClient.get(`/surveys/user/${userId}`);

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            // თუ 404 - survey არ არსებობს (ნორმალური case)
            if (error.response?.status === 404) {
                return {
                    success: false,
                    data: null,
                    message: 'Survey not found',
                };
            }
            // სხვა შეცდომები
            throw error;
        }
    },

    /**
     * ⭐ Partial update survey (PATCH)
     */
    patchSurvey: async (surveyId: string, data: Partial<SurveyFormData>) => {
        try {
            const response = await apiClient.patch(`/surveys/${surveyId}`, data);
            console.log('✅ Survey patched successfully');
            return response.data;
        } catch (error: any) {
            console.error('❌ Patch survey failed:', error);
            throw error;
        }
    },

    /**
     * ⭐ Delete survey
     */
    deleteSurvey: async (surveyId: string) => {
        try {
            const response = await apiClient.delete(`/surveys/${surveyId}`);
            console.log('✅ Survey deleted successfully');
            return response.data;
        } catch (error: any) {
            console.error('❌ Delete survey failed:', error);
            throw error;
        }
    },

    /**
     * ⭐ Auto-save survey (draft)
     */
    autoSave: async (userId: string, data: Partial<SurveyFormData>) => {
        try {
            const response = await apiClient.post('/surveys/autosave', {
                userId,
                data,
            });
            console.log('💾 Auto-save successful');
            return response.data;
        } catch (error: any) {
            console.error('⚠️ Auto-save failed:', error);
            // Don't throw - auto-save failures shouldn't break the app
            return null;
        }
    },

    /**
     * ⭐ Export survey data
     * Example: surveyApi.exportSurvey('survey_123', 'pdf')
     */
    exportSurvey: async (surveyId: string, format: 'pdf' | 'excel' | 'json') => {
        try {
            const response = await apiClient.get(`/surveys/${surveyId}/export`, {
                params: {format},
                responseType: 'blob', // For file download
            });

            console.log('✅ Survey exported successfully');
            return response.data;
        } catch (error: any) {
            console.error('❌ Export survey failed:', error);
            throw error;
        }
    },


    /**
     * ⭐ Update existing survey
     */
    updateSurvey: async (surveyId: string, data: Partial<SurveyFormData>) => {
        try {
            const response = await apiClient.put(`/surveys/${surveyId}`, data);
            console.log('✅ Survey updated successfully');
            return response.data;
        } catch (error: any) {
            console.error('❌ Update survey failed:', error);
            throw error;
        }
    },

    submitSurvey: async (data: Partial<SurveyFormData>) => {
        try {
            //await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await apiClient.post('/surveys', data);
            console.log('✅ Survey submitted successfully');
            return {
                success: true,
                message: 'კითხვარი წარმატებით გაიგზავნა!',
                data: response.data
                // data: {
                //     id: Math.random().toString(36).substr(2, 9),
                //     submittedAt: new Date().toISOString(),
                // },
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'დაფიქსირდა შეცდომა კითხვარის გაგზავნისას');
            }
            throw new Error('დაფიქსირდა შეცდომა კითხვარის გაგზავნისას');
        }
    },
};