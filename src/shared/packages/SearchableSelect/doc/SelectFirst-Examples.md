# ✅ Auto-Select First Option Feature

**2 პრობლემის გადაწყვეტა:**
1. ✅ Value არ რჩება არჩევის შემდეგ
2. ✅ Auto-select პირველი option როცა data იტვირთება

---

## 🎯 New Feature: autoSelectFirst

```typescript
autoSelectFirst?: boolean  // Default: false
```

როცა `true`:
- ✅ ავტომატურად ირჩევს პირველ option-ს
- ✅ მუშაობს როცა data იტვირთება
- ✅ მუშაობს როცა value ცარიელია
- ✅ გამოტოვებს parent headers და disabled options

---

## 📊 Example 1: Basic Auto-Select

```tsx
import { useState } from 'react';
import { SearchableSelect } from '@/shared/components/SearchableSelect';

const categories = [
    { id: 1, name: 'IT & Technology', code: 'IT' },
    { id: 2, name: 'Human Resources', code: 'HR' },
    { id: 3, name: 'Finance', code: 'FIN' },
];

function Example1() {
    const [category, setCategory] = useState('');

    return (
        <SearchableSelect
            options={categories}
            value={category}
            onChange={(value) => setCategory(value)}
            autoSelectFirst={true}  // ✨ Auto-select first option
            label="კატეგორია"
        />
    );
}

// Result: Automatically selects "IT & Technology" (id: 1)
```

---

## 📊 Example 2: Auto-Select with CODE

```tsx
function Example2() {
    const [categoryCode, setCategoryCode] = useState('');

    return (
        <SearchableSelect
            options={categories}
            value={categoryCode}
            onChange={(value) => setCategoryCode(value)}
            valueField="code"         // Return CODE
            autoSelectFirst={true}    // ✨ Auto-select first
            label="კატეგორია"
        />
    );
}

// Result: Automatically selects "IT" (first code)
```

---

## 📊 Example 3: ClassifierSelect with Auto-Select

```tsx
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

function Example3() {
    const [category, setCategory] = useState('');

    return (
        <ClassifierSelect
            classifierKey={CLASSIFIER_KEYS.CATEGORIES}
            value={category}
            onChange={(value) => setCategory(value)}
            autoSelectFirst={true}  // ✨ Auto-select when data loads
            label="კატეგორია"
        />
    );
}

// Result: 
// 1. Loads data from classifier
// 2. Automatically selects first option
// 3. Shows selected value
```

---

## 📊 Example 4: React Hook Form with Auto-Select

```tsx
import { useForm, Controller } from 'react-hook-form';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

function EmployeeForm() {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            category: '',
        },
    });

    const onSubmit = (data) => {
        console.log('Selected category:', data.category);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        autoSelectFirst={true}  // ✨ Auto-select
                        valueField="code"       // Return CODE
                        label="კატეგორია"
                    />
                )}
            />

            <button type="submit">Submit</button>
        </form>
    );
}

// Result: First category automatically selected and submitted
```

---

## 📊 Example 5: Skip Parents and Disabled

```tsx
const options = [
    { id: 'tech', name: 'TECHNOLOGY', isParent: true },
    { id: 1, name: 'Software Dev', code: 'SW', parentId: 'tech' },
    { id: 2, name: 'Network Admin', code: 'NET', parentId: 'tech', disabled: true },
    { id: 3, name: 'Database Admin', code: 'DBA', parentId: 'tech' },
];

<SearchableSelect
    options={options}
    value={selected}
    onChange={setSelected}
    autoSelectFirst={true}  // ✨
/>

// Result: Selects "Software Dev" (id: 1)
// Skips: "TECHNOLOGY" (parent) and "Network Admin" (disabled)
```

---

## 📊 Example 6: Conditional Auto-Select

```tsx
function ConditionalExample() {
    const [isNewUser, setIsNewUser] = useState(true);
    const [category, setCategory] = useState('');

    return (
        <SearchableSelect
            options={categories}
            value={category}
            onChange={setCategory}
            autoSelectFirst={isNewUser}  // Only for new users
            label="კატეგორია"
        />
    );
}
```

---

## 📊 Example 7: Multiple Selects with Auto-Select

```tsx
function MultipleSelectsForm() {
    const [category, setCategory] = useState('');
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');

    return (
        <div>
            {/* Auto-select all */}
            <ClassifierSelect
                classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                value={category}
                onChange={setCategory}
                autoSelectFirst={true}
                label="კატეგორია"
            />

            <ClassifierSelect
                classifierKey={CLASSIFIER_KEYS.POSITIONS}
                value={position}
                onChange={setPosition}
                autoSelectFirst={true}
                label="პოზიცია"
            />

            <ClassifierSelect
                classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                value={department}
                onChange={setDepartment}
                autoSelectFirst={true}
                label="დეპარტამენტი"
            />
        </div>
    );
}

// Result: All three selects auto-populate with first option
```

---

## 🎯 How It Works

### Logic Flow

```typescript
useEffect(() => {
    // Check conditions
    if (autoSelectFirst && options.length > 0 && !value) {
        // Find first selectable option
        const firstSelectable = options.find(opt => 
            !opt.isParent && !opt.disabled
        );
        
        if (firstSelectable && onChange) {
            // Get value (ID or CODE)
            const firstValue = getOptionValue(firstSelectable);
            
            // Call onChange
            onChange(firstValue, firstSelectable);
        }
    }
}, [autoSelectFirst, options.length]);
```

---

### Conditions for Auto-Select

1. ✅ `autoSelectFirst` = `true`
2. ✅ `options.length > 0` (has data)
3. ✅ `!value` (no value selected)
4. ✅ First option is not parent
5. ✅ First option is not disabled

---

## 📊 Comparison

### Without autoSelectFirst

```tsx
<SearchableSelect
    options={categories}
    value={category}
    onChange={setCategory}
/>

// Initial state: Shows "აირჩიეთ..." placeholder
// User must manually select
```

---

### With autoSelectFirst

```tsx
<SearchableSelect
    options={categories}
    value={category}
    onChange={setCategory}
    autoSelectFirst={true}  // ✨
/>

// Initial state: Shows "IT & Technology" (first option)
// Already selected!
```

---

## 🎯 When to Use

### Use `autoSelectFirst={true}` when:
- ✅ Single-choice field (like category)
- ✅ First option is most common
- ✅ Want to save user time
- ✅ Default value makes sense
- ✅ Form should be pre-filled

### Don't use when:
- ❌ Multiple valid choices
- ❌ No clear default
- ❌ User must make conscious choice
- ❌ Empty state is valid

---

## 🔧 Props Summary

```typescript
interface SearchableSelectProps {
    options: SearchableSelectOption[];
    value?: string | number;
    onChange?: (value: string | number, option: SearchableSelectOption) => void;
    
    // Value field
    valueField?: 'id' | 'code';  // Default: 'id'
    
    // Auto-select
    autoSelectFirst?: boolean;   // Default: false ✨ NEW
    
    // Other props...
}
```

---

## ✅ Benefits

1. **Better UX** - Users don't need to click if default is good
2. **Faster forms** - Pre-filled with sensible defaults
3. **Less clicks** - Auto-populated on load
4. **Smart** - Skips parents and disabled options
5. **Flexible** - Works with both ID and CODE

---

## 🎨 Complete Example

```tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

function EmployeeRegistrationForm() {
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            category: '',
            position: '',
            department: '',
        },
    });

    const onSubmit = (data) => {
        console.log('Form data:', data);
        // All fields pre-populated with first options!
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Category - Auto-select */}
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        value={field.value}
                        onChange={field.onChange}
                        autoSelectFirst={true}  // ✨
                        valueField="code"
                        label="კატეგორია"
                        required
                    />
                )}
            />

            {/* Position - Auto-select */}
            <Controller
                name="position"
                control={control}
                render={({ field }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.POSITIONS}
                        value={field.value}
                        onChange={field.onChange}
                        autoSelectFirst={true}  // ✨
                        valueField="code"
                        label="პოზიცია"
                        required
                    />
                )}
            />

            {/* Department - Auto-select */}
            <Controller
                name="department"
                control={control}
                render={({ field }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                        value={field.value}
                        onChange={field.onChange}
                        autoSelectFirst={true}  // ✨
                        valueField="code"
                        label="დეპარტამენტი"
                        required
                    />
                )}
            />

            <button type="submit">დამატება</button>
        </form>
    );
}

// Result: All fields automatically populated when data loads!
```

---

## 🎉 Summary

| Feature | Before | After |
|---------|--------|-------|
| **Manual selection** | Required | Optional |
| **Initial state** | Empty | Pre-filled |
| **User clicks** | Always needed | Not needed |
| **Default value** | None | First option |
| **Smart** | No | Yes (skips parents/disabled) |

---

**გამოიყენე `autoSelectFirst={true}` ავტომატური არჩევისთვის! 🚀**
