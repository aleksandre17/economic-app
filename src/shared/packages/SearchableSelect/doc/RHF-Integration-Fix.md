# 🔧 React Hook Form Integration Fix

**Problem:** `{...register('field')}` არ მუშაობს SearchableSelect-თან.

**Reason:** `register` expects event object, but SearchableSelect returns `(value, option)`.

---

## ✅ Solution 1: Controller (რეკომენდირებული)

### ✨ CORRECT Usage

```tsx
import { useForm, Controller } from 'react-hook-form';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

function MyForm() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            category: '',
        },
    });

    const onSubmit = (data) => {
        console.log('Form data:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="category"
                control={control}
                rules={{ required: 'კატეგორია აუცილებელია' }}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        placeholder="აირჩიეთ კატეგორია"
                        label="კატეგორია"
                        required
                    />
                )}
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## ✅ Solution 2: Adapter Wrapper

თუ გინდა `register`-ის გამოყენება, გამოიყენე wrapper:

### Step 1: Create RHFSearchableSelect.tsx

```tsx
// src/shared/components/SearchableSelect/RHFSearchableSelect.tsx

import React, { forwardRef } from 'react';
import { SearchableSelect, SearchableSelectProps } from './SearchableSelect';

interface RHFSearchableSelectProps extends Omit<SearchableSelectProps, 'onChange' | 'value'> {
    value?: string | number;
    onChange?: (event: { target: { name?: string; value: string | number } }) => void;
}

/**
 * React Hook Form compatible wrapper for SearchableSelect
 * Works with {...register('fieldName')}
 */
export const RHFSearchableSelect = forwardRef<HTMLInputElement, RHFSearchableSelectProps>(
    ({ onChange, value, name, ...props }, ref) => {
        const handleChange = (newValue: string | number) => {
            // Convert to event format for React Hook Form
            if (onChange) {
                onChange({
                    target: {
                        name,
                        value: newValue,
                    },
                });
            }
        };

        return (
            <SearchableSelect
                ref={ref}
                name={name}
                value={value}
                onChange={handleChange}
                {...props}
            />
        );
    }
);

RHFSearchableSelect.displayName = 'RHFSearchableSelect';
```

### Step 2: Create RHFClassifierSelect.tsx

```tsx
// src/shared/components/SearchableSelect/RHFClassifierSelect.tsx

import React, { forwardRef } from 'react';
import { RHFSearchableSelect } from './RHFSearchableSelect';
import { useClassifier } from '@/features/classifiers';
import { SearchableSelectOption } from './SearchableSelect';

interface RHFClassifierSelectProps extends Omit<React.ComponentProps<typeof RHFSearchableSelect>, 'options'> {
    classifierKey: string;
    autoLoad?: boolean;
}

/**
 * React Hook Form compatible ClassifierSelect
 * Works with {...register('fieldName')}
 */
export const RHFClassifierSelect = forwardRef<HTMLInputElement, RHFClassifierSelectProps>(
    ({ classifierKey, autoLoad = true, ...props }, ref) => {
        const classifier = useClassifier(classifierKey, { autoLoad });

        const data = classifier.getData();
        const isLoading = classifier.isLoading();

        const options: SearchableSelectOption[] = data || [];

        if (isLoading) {
            return (
                <RHFSearchableSelect
                    ref={ref}
                    options={[]}
                    disabled
                    placeholder="იტვირთება..."
                    {...props}
                />
            );
        }

        return (
            <RHFSearchableSelect
                ref={ref}
                options={options}
                {...props}
            />
        );
    }
);

RHFClassifierSelect.displayName = 'RHFClassifierSelect';
```

### Step 3: Use with register

```tsx
import { useForm } from 'react-hook-form';
import { RHFClassifierSelect } from '@/shared/components/SearchableSelect/RHFClassifierSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

function MyForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <RHFClassifierSelect
                {...register('category', {
                    required: 'კატეგორია აუცილებელია',
                })}
                classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                error={errors.category?.message}
                placeholder="აირჩიეთ კატეგორია"
                label="კატეგორია"
                required
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## 📊 Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Controller** | ✅ Official RHF way<br>✅ Full control<br>✅ Type-safe | ❌ More verbose |
| **Adapter** | ✅ Use `register`<br>✅ Less code | ❌ Extra wrapper<br>❌ Less flexible |

---

## 🎯 Complete Examples

### Example 1: Controller with Validation

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

const schema = z.object({
    category: z.union([
        z.string().min(1, 'კატეგორია აუცილებელია'),
        z.number().min(1, 'კატეგორია აუცილებელია'),
    ]),
    position: z.union([
        z.string().min(1, 'პოზიცია აუცილებელია'),
        z.number().min(1, 'პოზიცია აუცილებელია'),
    ]),
});

type FormData = z.infer<typeof schema>;

export function EmployeeForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            category: '',
            position: '',
        },
    });

    const onSubmit = (data: FormData) => {
        console.log('Form data:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Category */}
            <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        label="კატეგორია"
                        placeholder="აირჩიეთ კატეგორია"
                        required
                    />
                )}
            />

            {/* Position */}
            <Controller
                name="position"
                control={control}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.POSITIONS}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        label="პოზიცია"
                        placeholder="აირჩიეთ პოზიცია"
                        required
                    />
                )}
            />

            <button type="submit">დამატება</button>
        </form>
    );
}
```

---

### Example 2: Multiple Selects

```tsx
export function ComplexForm() {
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            category: '',
            position: '',
            department: '',
            region: '',
        },
    });

    // Watch for dependent field
    const selectedCategory = watch('category');

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="category"
                control={control}
                rules={{ required: 'აუცილებელია' }}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        {...field}
                        onChange={(value) => {
                            field.onChange(value);
                            // Clear dependent fields
                            setValue('position', '');
                        }}
                        error={fieldState.error?.message}
                        label="კატეგორია"
                        required
                    />
                )}
            />

            <Controller
                name="position"
                control={control}
                rules={{ required: 'აუცილებელია' }}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.POSITIONS}
                        {...field}
                        error={fieldState.error?.message}
                        label="პოზიცია"
                        disabled={!selectedCategory}
                        required
                    />
                )}
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```

---

### Example 3: With Adapter (register)

```tsx
import { RHFClassifierSelect } from '@/shared/components/SearchableSelect/RHFClassifierSelect';

export function SimpleForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <RHFClassifierSelect
                {...register('category', {
                    required: 'კატეგორია აუცილებელია',
                })}
                classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                error={errors.category?.message}
                label="კატეგორია"
                required
            />

            <RHFClassifierSelect
                {...register('position', {
                    required: 'პოზიცია აუცილებელია',
                })}
                classifierKey={CLASSIFIER_KEYS.POSITIONS}
                error={errors.position?.message}
                label="პოზიცია"
                required
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## 🚀 Quick Fix for Your Code

### ❌ Current (Not Working)

```tsx
<ClassifierSelect
    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
    {...register('category')}
    error={errors.category}
    placeholder="აირჩიეთ კატეგორია"
    label="კატეგორია"
    required
/>
```

### ✅ Fixed (Use Controller)

```tsx
<Controller
    name="category"
    control={control}
    rules={{ required: 'კატეგორია აუცილებელია' }}
    render={({ field, fieldState }) => (
        <ClassifierSelect
            classifierKey={CLASSIFIER_KEYS.CATEGORIES}
            value={field.value}
            onChange={(value) => field.onChange(value)}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            placeholder="აირჩიეთ კატეგორია"
            label="კატეგორია"
            required
        />
    )}
/>
```

---

## 📝 Type-Safe Pattern

```tsx
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const formSchema = z.object({
    category: z.union([z.string(), z.number()])
        .refine(val => val !== '' && val !== 0, {
            message: 'კატეგორია აუცილებელია',
        }),
    position: z.union([z.string(), z.number()])
        .refine(val => val !== '' && val !== 0, {
            message: 'პოზიცია აუცილებელია',
        }),
});

type FormSchema = z.infer<typeof formSchema>;

export function TypeSafeForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            position: '',
        },
    });

    const onSubmit: SubmitHandler<FormSchema> = (data) => {
        console.log('Validated data:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        label="კატეგორია"
                        required
                    />
                )}
            />

            <Controller
                name="position"
                control={control}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.POSITIONS}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        label="პოზიცია"
                        required
                    />
                )}
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## 🎯 Best Practices

1. ✅ **Always use Controller** for custom components
2. ✅ **Destructure field and fieldState** for clarity
3. ✅ **Use Zod** for type-safe validation
4. ✅ **Set defaultValues** to avoid uncontrolled inputs
5. ✅ **Use proper error handling** with fieldState.error

---

## 📚 Summary

| Method | Usage | Complexity |
|--------|-------|-----------|
| **Controller** | `<Controller render={...} />` | Medium |
| **RHF Adapter** | `{...register('field')}` | Low |

**Recommendation:** Use **Controller** - it's the official React Hook Form way!

---

**Fixed! 🎉**
