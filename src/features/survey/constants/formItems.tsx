import {Step3Data, Step4Data} from "@features/survey/schemas";
import React from "react";

/**
 * ✅ Growth plan checkbox items
 */
export const GROWTH_PLAN_ITEMS: Array<{
    name: keyof Step3Data;
    label: React.ReactNode;
}> = [
    {
        name: 'planOneYearGrowth' as const,
        label: (
            <>
                მომდევნო <strong>1 წლის</strong> განმავლობაში, აპირებთ თუ არა დასაქმებულთა რაოდენობის გაზრდას?
            </>
        ),
    },
    {
        name: 'planFiveYearGrowth' as const,
            label: (
                <>
                    მომდევნო <strong>5 წლის</strong> განმავლობაში, აპირებთ თუ არა დასაქმებულთა რაოდენობის გაზრდას?
                </>
            ),
        },
] as const;

/**
 * ✅ Reduction plan checkbox items
 */
export const REDUCTION_PLAN_ITEMS : Array<{
    name: keyof Step4Data;
    label: React.ReactNode;
}> = [
    {
        name: 'planOneYearReduction' as const,
        label: (
            <>
                მომდევნო <strong>1 წლის</strong> განმავლობაში, აპირებთ თუ არა დასაქმებულთა რაოდენობის შემცირებას?
            </>
        ),
    },
    {
        name: 'planFiveYearReduction' as const,
            label: (
        <>
            მომდევნო <strong>5 წლის</strong> განმავლობაში,
        აპირებთ თუ არა დასაქმებულთა რაოდენობის შემცირებას?
        </>
    ),
    },
] as const;

