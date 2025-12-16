import {useEffect} from "react";
import {useAuth} from "@features/auth/context/AuthContext.tsx";

import {useLoadSurveyFromAPI} from "@features/survey/store/SurveyFormStore.ts";

export const useSurveyLoader = () => {
    const { user } = useAuth();
    const loadSurveyFromAPI = useLoadSurveyFromAPI();

    useEffect(() => {
        if (user?.id) {
            console.log('🔐 User authenticated, loading survey...');
            loadSurveyFromAPI(user.id).then(() => {});
        }
    }, [user?.id, loadSurveyFromAPI]);
};

export const SurveyLoader: React.FC = () => {
    useSurveyLoader();
    return null;
};