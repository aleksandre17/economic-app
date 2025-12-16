// features/survey/schemas/primitives.ts

import { z } from 'zod';

/**
 * Universal ID field (string | number)
 */
export const idField = z.union([
    z.string().min(1, 'აუცილებელია: ID-ს მითითება'),
    z.number().min(1, 'აუცილებელია: ID-ს მითითება'),
]);

/**
 * Category field (required number)
 */
export const categoryField = z.number({
    required_error: 'აუცილებელია: კატეგორიის მითითება',
    invalid_type_error: 'კატეგორია უნდა იყოს რიცხვი',
});

/**
 * Boolean field with Georgian error
 */
export const booleanField = (label: string) =>
    z.boolean({
        required_error: `აუცილებელია: ${label}`,
        invalid_type_error: `${label} უნდა იყოს ჭეშმარიტი ან მცდარი`,
    }).nullable();

/**
 * Non-negative integer field (nullable)
 * @param max - Maximum allowed value
 * @param label - Field label for error messages
 * @param options
 */
export const nonNegativeInt = (
    max: number,
    label: string,
    options?: {
        required?: boolean;
        min?: number;
    }
) => {
    const schema = z
        .number({ message: `უნდა იყოს რიცხვი: ${label}` })
        .int(`უნდა იყოს მთელი რიცხვი: ${label}`)
        .min(options?.min ?? 0, `უნდა იყოს ${options?.min ?? 0} ან მეტი: ${label}`)
        .max(max, `ძალიან დიდი რიცხვი: ${label} (მაქს: ${max})`)
        .nullable();

    return options?.required
        ? schema.refine((v) => v != null, {
            message: `აუცილებელია: ${label}`,
        })
        : schema;
};

/**
 * Percentage field (0-100)
 */
export const percentageField = (label: string) =>
    z
        .number({ message: `უნდა იყოს რიცხვი: ${label}` })
        .min(0, `უნდა იყოს 0-დან 100-მდე: ${label}`)
        .max(100, `უნდა იყოს 0-დან 100-მდე: ${label}`)
        .nullable();