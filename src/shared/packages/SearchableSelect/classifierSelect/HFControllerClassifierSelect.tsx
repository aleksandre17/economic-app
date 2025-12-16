// src/shared/components/SearchableSelect/RHFControllerClassifierSelect.tsx

import {Control, Controller, FieldValues, Path} from 'react-hook-form';
import { ClassifierSelect } from './ClassifierSelect.tsx';
import { SearchableSelectProps } from '../searcheble/SearchableSelect.tsx';

interface RHFControllerClassifierSelectProps<T extends FieldValues> extends Omit<SearchableSelectProps, 'value' | 'onChange' | 'name'> {
    control: Control<T>
    name: Path<T>;
    classifierKey: string;
    autoLoad?: boolean;
    rules?: Parameters<typeof Controller>[0]['rules'];
}

/**
 * classifierSelect with built-in Controller
 *
 * No need to wrap with <Controller> - it's already integrated!
 * Automatically gets form context from nearest FormProvider
 *
 * @example
 * // Just use it directly - no Controller needed!
 * <RHFControllerClassifierSelect
 *   name="category"
 *   classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *   label="კატეგორია"
 *   rules={{ required: 'აუცილებელია' }}
 * />
 *
 * @example
 * // Full form example
 * function MyForm() {
 *   const methods = useForm();
 *
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <RHFControllerClassifierSelect
 *           name="category"
 *           classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *           rules={{ required: true }}
 *         />
 *       </form>
 *     </FormProvider>
 *   );
 * }
 */
export function RHFControllerClassifierSelect<T extends FieldValues>({ control, name, classifierKey, autoLoad = true, rules, ...props }: RHFControllerClassifierSelectProps<T>) {

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <ClassifierSelect
                    classifierKey={classifierKey}
                    autoLoad={autoLoad}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    {...props}
                />
            )}
        />
    );
}