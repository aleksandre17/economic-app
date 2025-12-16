// Step5Review.tsx
import React, {useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import { useSurveyNavigation } from '@features/survey/hooks/useSurveyNavigation';
import { useAuth } from '@features/auth/context/AuthContext';
import { surveyApi } from '@features/survey/api/surveyapi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { surveySchema } from '@features/survey/schemas';
import { type SurveyFormData } from '@features/survey/types/survey.types';
import {formatDuration} from "@features/survey/components/steps/share/Util.ts";
import { Card } from '@/shared/componets/ui/Card/Card';
import { Button } from '@/shared/componets/ui/Button/Button';
import styles from './Step5Review.module.css';
import {CLASSIFIER_KEYS, useClassifier} from "@/shared/packages/classifiers";

export const Step5Review: React.FC = () => {

    const { user } = useAuth();
    const { formData, isSubmitting, setIsSubmitting, resetForm, surveyId } = useSurvey();
    const { goToStep } = useSurveyNavigation();
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors },
    } = useForm<SurveyFormData>({
        resolver: zodResolver(surveySchema),
        defaultValues: formData,
    });

    const classifier = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });

    const findClassifierByCode = useCallback((code: string) => {
        const data = classifier.getData() || [];
        return data.find(item => item.code === code)?.name || null;
    }, [classifier]);

    const onSubmit: SubmitHandler<SurveyFormData> = async () => {
        if (!user?.id) {
            alert('შეცდომა: მომხმარებელი არ არის ავტორიზებული');
            return;
        }

        try {
            setIsSubmitting(true);

            const submissionData = {
                ...formData,
                user: user,
                status: 'success' as const,
            };

            if (surveyId) {
                console.log('📝 Updating existing survey:', surveyId);
                await surveyApi.updateSurvey(surveyId, submissionData);
                console.log('✅ Survey updated successfully');
            } else {
                console.log('➕ Creating new survey');
                const result = await surveyApi.submitSurvey(submissionData);
                console.log('✅ Survey created successfully:', result);
            }

            resetForm();
            navigate('/survey/success');
        } catch (error: any) {
            console.error('❌ Submit error:', error);

            const errorMessage = error.response?.data?.message
                || error.message
                || 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.';

            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hrEntries = formData.hrEntries || [];
    const vacancyEntries = formData.vacancyEntries || [];
    const growthPlanEntries = formData.growthPlanEntries || [];
    const reductionPlanEntries = formData.reductionPlanEntries || [];



    // Check if there are validation errors
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)} id="step-form">
            <Card>
                <div className={styles.header}>
                    <h2>გადახედვა</h2>
                    <p>გთხოვთ შეამოწმოთ მონაცემები გაგზავნამდე</p>

                    {surveyId && (
                        <div className={styles.statusBadge}>
                            📝 არსებული კითხვარის განახლება
                        </div>
                    )}
                </div>

                {/* Validation Errors */}
                {hasErrors && (
                    <div className={styles.errorSection}>
                        <h4>⚠️ გთხოვთ შეავსოთ ყველა სავალდებულო ველი:</h4>
                        <ul className={styles.errorList}>
                            {errors.hrEntries && (
                                <li onClick={() => goToStep(1)}>
                                    დასაქმებულთა მონაცემები: {errors.hrEntries.message}
                                </li>
                            )}
                            {errors.hasVacancies2025 && (
                                <li onClick={() => goToStep(2)}>
                                    ვაკანსიები: {errors.hasVacancies2025.message}
                                </li>
                            )}
                            {errors.vacancies2025Count && (
                                <li onClick={() => goToStep(2)}>
                                    ვაკანსიების რაოდენობა: {errors.vacancies2025Count.message}
                                </li>
                            )}
                            {errors.vacancyEntries && (
                                <li onClick={() => goToStep(2)}>
                                    ვაკანსიების ჩანაწერები: {errors.vacancyEntries.message}
                                </li>
                            )}
                            {errors.growthPlanEntries && (
                                <li onClick={() => goToStep(3)}>
                                    ზრდის გეგმები: {errors.growthPlanEntries.message}
                                </li>
                            )}
                            {errors.reductionPlanEntries && (
                                <li onClick={() => goToStep(4)}>
                                    შემცირების გეგმები: {errors.reductionPlanEntries.message}
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                <div className={styles.sections}>
                    {/* Step 1 - HR მონაცემები */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>დასაქმებულთა მონაცემები</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToStep(1)}
                                disabled={isSubmitting}
                                type="button"
                            >
                                რედაქტირება
                            </Button>
                        </div>

                        {hrEntries.length > 0 ? (
                            <div className={styles.tableWrapper}>
                                <table className={styles.reviewTable}>
                                    <thead>
                                    <tr>
                                        <th>კატეგორია</th>
                                        <th>2025</th>
                                        <th>საშუალო</th>
                                        <th>პროფესიული</th>
                                        <th>უმაღლესი</th>
                                        <th>2024</th>
                                        <th>საპენსიო</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {hrEntries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{findClassifierByCode(entry.category)}</td>
                                            <td>{entry.quantity2025}</td>
                                            <td>{entry.educationLevels.average}</td>
                                            <td>{entry.educationLevels.professional}</td>
                                            <td>{entry.educationLevels.higher}</td>
                                            <td>{entry.quantity2024}</td>
                                            <td>{entry.retirementNextFiveYears}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td><strong>სულ:</strong></td>
                                        <td><strong>{hrEntries.reduce((s, e) => s + e.quantity2025, 0)}</strong></td>
                                        <td><strong>{hrEntries.reduce((s, e) => s + e.educationLevels.average, 0)}</strong></td>
                                        <td><strong>{hrEntries.reduce((s, e) => s + e.educationLevels.professional, 0)}</strong></td>
                                        <td><strong>{hrEntries.reduce((s, e) => s + e.educationLevels.higher, 0)}</strong></td>
                                        <td><strong>{hrEntries.reduce((s, e) => s + e.quantity2024, 0)}</strong></td>
                                        <td><strong>{hrEntries.reduce((s, e) => s + e.retirementNextFiveYears, 0)}</strong></td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <p className={styles.noData}>მონაცემები არ არის დამატებული</p>
                        )}
                    </div>

                    {/* Step 2 - ვაკანსიები */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>ვაკანსიების ინფორმაცია</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToStep(2)}
                                disabled={isSubmitting}
                                type="button"
                            >
                                რედაქტირება
                            </Button>
                        </div>

                        <div className={styles.dataGrid}>
                            <div className={styles.dataItem}>
                                <span className={styles.label}>2025 წელს გქონდათ ვაკანსიები:</span>
                                <span className={styles.value}>
                                    {formData.hasVacancies2025 ? '✓ დიახ' : '✗ არა'}
                                </span>
                            </div>
                            {formData.hasVacancies2025 && formData.vacancies2025Count && (
                                <div className={styles.dataItem}>
                                    <span className={styles.label}>ვაკანსიების რაოდენობა:</span>
                                    <span className={styles.value}>{formData.vacancies2025Count}</span>
                                </div>
                            )}
                        </div>

                        {vacancyEntries.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <table className={styles.reviewTable}>
                                    <thead>
                                    <tr>
                                        <th>პროფ. ჯგუფი</th>
                                        <th>არსებული</th>
                                        <th>გამოცხადებული</th>
                                        <th>შეუვსებელი</th>
                                        <th>ხანგრძლივობა</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vacancyEntries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{findClassifierByCode(entry.category)}</td>
                                            <td>{entry.totalVacancies}</td>
                                            <td>{entry.announcedVacancies}</td>
                                            <td>{entry.unfilledVacancies}</td>
                                            <td>{formatDuration(entry.employmentDuration)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Step 3 - ზრდის გეგმები */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>დასაქმების ზრდის გეგმები</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToStep(3)}
                                disabled={isSubmitting}
                                type="button"
                            >
                                რედაქტირება
                            </Button>
                        </div>

                        <div className={styles.dataGrid}>
                            <div className={styles.dataItem}>
                                <span className={styles.label}>1 წლის გეგმა:</span>
                                <span className={styles.value}>
                                    {formData.planOneYearGrowth ? '✓ კი' : '✗ არა'}
                                </span>
                            </div>
                            <div className={styles.dataItem}>
                                <span className={styles.label}>5 წლის გეგმა:</span>
                                <span className={styles.value}>
                                    {formData.planFiveYearGrowth ? '✓ კი' : '✗ არა'}
                                </span>
                            </div>
                        </div>

                        {growthPlanEntries.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <table className={styles.reviewTable}>
                                    <thead>
                                    <tr>
                                        <th>პროფესიული ჯგუფი</th>
                                        {formData.planOneYearGrowth && <th>1 წლის ზრდა</th>}
                                        {formData.planFiveYearGrowth && <th>5 წლის ზრდა</th>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {growthPlanEntries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{findClassifierByCode(entry.category)}</td>
                                            {formData.planOneYearGrowth && <td>{entry.oneYearGrowth || '-'}</td>}
                                            {formData.planFiveYearGrowth && <td>{entry.fiveYearGrowth || '-'}</td>}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Step 4 - შემცირების გეგმები */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>დასაქმების შემცირების გეგმები</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToStep(4)}
                                disabled={isSubmitting}
                                type="button"
                            >
                                რედაქტირება
                            </Button>
                        </div>

                        <div className={styles.dataGrid}>
                            <div className={styles.dataItem}>
                                <span className={styles.label}>1 წლის გეგმა:</span>
                                <span className={styles.value}>
                                    {formData.planOneYearReduction ? '✓ კი' : '✗ არა'}
                                </span>
                            </div>
                            <div className={styles.dataItem}>
                                <span className={styles.label}>5 წლის გეგმა:</span>
                                <span className={styles.value}>
                                    {formData.planFiveYearReduction ? '✓ კი' : '✗ არა'}
                                </span>
                            </div>
                        </div>

                        {reductionPlanEntries.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <table className={styles.reviewTable}>
                                    <thead>
                                    <tr>
                                        <th>პროფესიული ჯგუფი</th>
                                        {formData.planOneYearReduction && <th>1 წლის შემცირება</th>}
                                        {formData.planFiveYearReduction && <th>5 წლის შემცირება</th>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reductionPlanEntries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{findClassifierByCode(entry.category)}</td>
                                            {formData.planOneYearReduction && <td>{entry.oneYearReduction || '-'}</td>}
                                            {formData.planFiveYearReduction && <td>{entry.fiveYearReduction || '-'}</td>}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* No StepNavigation here - uses global navigation */}
            </Card>
        </form>
    );
};