import { z } from 'zod';

// Step 1: Personal Information Schema
export const step1Schema = z.object({
    firstName: z.string()
        .min(2, 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს')
        .max(50, 'სახელი ძალიან გრძელია')
        .regex(/^[ა-ჰa-zA-Z\s]+$/, 'სახელი უნდა შეიცავდეს მხოლოდ ასოებს'),

    lastName: z.string()
        .min(2, 'გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს')
        .max(50, 'გვარი ძალიან გრძელია')
        .regex(/^[ა-ჰa-zA-Z\s]+$/, 'გვარი უნდა შეიცავდეს მხოლოდ ასოებს'),

    email: z.string()
        .email('არასწორი ელ. ფოსტის ფორმატი')
        .min(1, 'ელ. ფოსტა სავალდებულოა'),

    phone: z.string()
        .regex(/^[\d\s\-\+\(\)]+$/, 'არასწორი ტელეფონის ფორმატი')
        .min(9, 'ტელეფონი უნდა შეიცავდეს მინიმუმ 9 ციფრს')
        .optional()
        .or(z.literal('')),
});

// Step 2: Preferences Schema
export const step2Schema = z.object({
    interests: z.array(z.string())
        .min(1, 'აირჩიეთ მინიმუმ 1 ინტერესი'),

    category: z.string()
        .min(1, 'კატეგორია სავალდებულოა'),

    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
        errorMap: () => ({ message: 'აირჩიეთ გამოცდილების დონე' })
    }),
});

// Step 3: Additional Info Schema
export const step3Schema = z.object({
    comments: z.string()
        .max(500, 'კომენტარი ძალიან გრძელია')
        .optional(),

    agreeToTerms: z.boolean()
        .refine(val => val === true, {
            message: 'უნდა დაეთანხმოთ წესებსა და პირობებს'
        }),

    newsletter: z.boolean().optional(),
});

// Full Form Schema (for final submission)
export const fullFormSchema = z.object({
    ...step1Schema.shape,
    ...step2Schema.shape,
    ...step3Schema.shape,
});

// TypeScript types from schemas
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type FullFormData = z.infer<typeof fullFormSchema>;