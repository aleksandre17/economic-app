import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../../../context/SurveyContext';
import { useStepNavigation } from '../../../hooks/useStepNavigation.tsx';
import { surveyApi } from '../../../api/surveyapi';
import { EMPLOYMENT_DURATION_OPTIONS } from '../../../types/survey.types';
import { Card } from '../../../../../shared/componets/ui/Card/Card';
import { Button } from '../../../../../shared/componets/ui/Button/Button';
import { StepNavigation } from '../../navigation/StepNavigation/StepNavigation';
import styles from './Step5Review.module.css';
import {useAuth} from "../../../../auth/context/AuthContext.tsx";

export const Step5Review: React.FC = () => {
    const { user } = useAuth(); // ⭐ Get current user
    const { formData, isSubmitting, setIsSubmitting, resetForm, surveyId } = useSurvey(); // ⭐ Get surveyId
    const { goToPreviousStep, goToStep, isFirstStep, isLastStep } = useStepNavigation();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!user?.id) {
            alert('შეცდომა: მომხმარებელი არ არის ავტორიზებული');
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare data for submission
            const submissionData = {
                ...formData,
                userId: user.id,
                status: 'submitted' as const,
            };

            // ⭐ Smart Submit: Update if surveyId exists, Create if not
            if (surveyId) {
                console.log('📝 Updating existing survey:', surveyId);
                await surveyApi.updateSurvey(surveyId, submissionData);
                console.log('✅ Survey updated successfully');
            } else {
                console.log('➕ Creating new survey');
                const result = await surveyApi.submitSurvey(submissionData);
                console.log('✅ Survey created successfully:', result);
            }

            // Success
            resetForm();
            navigate('/survey/success');
        } catch (error: never) {
            console.error('❌ Submit error:', error);

            // User-friendly error message
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

    const getDurationLabel = (value: string) => {
        const option = EMPLOYMENT_DURATION_OPTIONS.find((opt) => opt.value === value);
        return option?.label || value;
    };

    return (
        <div className={styles.container}>
            <Card>
                <div className={styles.header}>
                    <h2>გადახედვა</h2>
                    <p>გთხოვთ შეამოწმოთ მონაცემები გაგზავნამდე</p>

                    {/* ⭐ Survey Status Indicator */}
                    {surveyId && (
                        <div className={styles.statusBadge}>
                            📝 არსებული კითხვარის განახლება
                        </div>
                    )}
                </div>

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
                                            <td>{entry.category}</td>
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
                                            <td>{entry.category}</td>
                                            <td>{entry.totalVacancies}</td>
                                            <td>{entry.announcedVacancies}</td>
                                            <td>{entry.unfilledVacancies}</td>
                                            <td>{getDurationLabel(entry.employmentDuration)}</td>
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
                                            <td>{entry.category}</td>
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
                                            <td>{entry.category}</td>
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

                <StepNavigation
                    onBack={goToPreviousStep}
                    onNext={handleSubmit}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    isSubmitting={isSubmitting}
                    nextLabel={surveyId ? 'განახლება' : 'გაგზავნა'} 
                />
            </Card>
        </div>
    );
};