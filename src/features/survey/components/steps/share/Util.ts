import type {VacancyEntry} from "@features/survey/types/survey.types.ts";

export const formatDuration = (duration: VacancyEntry['employmentDuration']): string => {
    const parts: string[] = [];

    if (duration.underSixMonths) {
        parts.push(`<6თვე: ${duration.underSixMonths}`);
    }
    if (duration.fromSixMonthsToOneYear) {
        parts.push(`6თვ-1წ: ${duration.fromSixMonthsToOneYear}`);
    }
    if (duration.overOneYear) {
        parts.push(`1წ+: ${duration.overOneYear}`);
    }

    return parts.length > 0 ? parts.join(', ') : '-';
}