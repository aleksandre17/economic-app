# 🔧 Debug Guide: Selected Text Issue

**პრობლემა:** არჩევის შემდეგ ისევ "აირჩიეთ" ჩანს

---

## 🎯 მიზეზები და გადაწყვეტები

### Cause 1: Value Type Mismatch

**პრობლემა:** `value` არის string, მაგრამ option.id არის number (ან პირიქით)

```tsx
// ❌ WRONG - Type mismatch
const options = [
    { id: 1, name: 'IT' },  // id is number
];

const [category, setCategory] = useState('');  // value is string
onChange={(value) => setCategory(value)}  // Gets number, stores as string

// Later comparison fails:
// '1' !== 1
```

**გადაწყვეტა 1:** Type consistency

```tsx
// ✅ GOOD - Consistent types
const [category, setCategory] = useState<number | string>('');

onChange={(value) => {
    console.log('Selected value:', value, typeof value);
    setCategory(value);
}}
```

---

**გადაწყვეტა 2:** Use string IDs

```tsx
const options = [
    { id: '1', name: 'IT', code: 'IT' },  // String IDs
    { id: '2', name: 'HR', code: 'HR' },
];

const [category, setCategory] = useState('');
```

---

**გადაწყვეტა 3:** Use valueField="code"

```tsx
// Always returns string codes
<SearchableSelect
    options={options}
    value={category}
    onChange={setCategory}
    valueField="code"  // ✅ Always returns strings
/>
```

---

### Cause 2: onChange Not Firing

**Debug:**

```tsx
<Controller
    name="category"
    control={control}
    render={({ field }) => (
        <ClassifierSelect
            classifierKey={CLASSIFIER_KEYS.CATEGORIES}
            value={field.value}
            onChange={(value, option) => {
                console.log('🔥 onChange called!');
                console.log('Value:', value, typeof value);
                console.log('Option:', option);
                console.log('Field value before:', field.value);
                field.onChange(value);
                console.log('Field value after:', field.value);
            }}
            label="კატეგორია"
        />
    )}
/>
```

---

### Cause 3: Value Not Matching

**Debug:**

```tsx
// Add debug to SearchableSelect
console.log('Current value:', value);
console.log('Options:', options);
console.log('Selected option:', selectedOption);
```

---

## ✅ Working Solution

```tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

function WorkingExample() {
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            category: '',  // Start empty
        },
    });

    // Debug: Watch value changes
    const categoryValue = watch('category');
    console.log('Current category value:', categoryValue);

    const onSubmit = (data) => {
        console.log('Form data:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => {
                    console.log('Field value:', field.value);
                    
                    return (
                        <ClassifierSelect
                            classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                            value={field.value}
                            onChange={(value, option) => {
                                console.log('Selected:', { value, option });
                                field.onChange(value);
                            }}
                            onBlur={field.onBlur}
                            autoSelectFirst={false}  // Disable for testing
                            valueField="code"        // Use string codes
                            error={fieldState.error?.message}
                            label="კატეგორია"
                        />
                    );
                }}
            />

            <button type="submit">Submit</button>
            
            {/* Debug display */}
            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
                <strong>Debug Info:</strong>
                <pre>{JSON.stringify({ category: categoryValue }, null, 2)}</pre>
            </div>
        </form>
    );
}
```

---

## 🔍 Debugging Steps

### Step 1: Check Console

1. Open browser console (F12)
2. Select an option
3. Check logs:

```
🔥 onChange called!
Value: "IT" string
Option: { id: 1, name: "IT & Technology", code: "IT" }
Field value before: ""
Field value after: "IT"
```

---

### Step 2: Check Value in Component

Add temporary debug:

```tsx
<button
    type="button"
    onClick={() => {
        console.log('Current form values:', control._formValues);
    }}
>
    Debug Form Values
</button>
```

---

### Step 3: Check Options Format

```tsx
// Add to ClassifierSelect
console.log('Classifier data:', classifier.getData());
```

Expected format:
```json
[
    {
        "id": 1,
        "name": "IT & Technology",
        "code": "IT"
    }
]
```

---

## 🎯 Common Issues & Fixes

### Issue 1: Empty value after selection

**Cause:** field.onChange not called

**Fix:**
```tsx
onChange={(value) => {
    field.onChange(value);  // ✅ Must call this!
}}
```

---

### Issue 2: Wrong value type

**Cause:** valueField mismatch

**Fix:**
```tsx
// If using numeric IDs
valueField="id"  // Returns number

// If using string codes
valueField="code"  // Returns string
```

---

### Issue 3: Classifier data not loaded

**Cause:** autoLoad not working

**Fix:**
```tsx
<ClassifierSelect
    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
    autoLoad={true}  // ✅ Ensure it loads
    value={field.value}
    onChange={field.onChange}
/>
```

---

## 🎨 Test Component

```tsx
import React, { useState } from 'react';
import { SearchableSelect } from '@/shared/components/SearchableSelect';

const testOptions = [
    { id: '1', name: 'IT & Technology', code: 'IT' },
    { id: '2', name: 'Human Resources', code: 'HR' },
    { id: '3', name: 'Finance', code: 'FIN' },
];

function TestComponent() {
    const [selected, setSelected] = useState('');

    return (
        <div style={{ padding: '20px' }}>
            <SearchableSelect
                options={testOptions}
                value={selected}
                onChange={(value, option) => {
                    console.log('onChange:', { value, option });
                    setSelected(value);
                }}
                valueField="id"  // Try "id" or "code"
                label="Test Select"
                placeholder="Select option..."
            />

            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
                <strong>Selected value:</strong> {selected || 'none'}
                <br />
                <strong>Type:</strong> {typeof selected}
            </div>

            <button
                onClick={() => {
                    console.log('Current selected:', selected);
                }}
                style={{ marginTop: '10px' }}
            >
                Log Value
            </button>
        </div>
    );
}

export default TestComponent;
```

---

## ✅ Checklist

- [ ] Console logs show onChange is called
- [ ] Value type matches option ID/code type
- [ ] field.onChange is called in Controller
- [ ] Options have correct format
- [ ] valueField is set correctly
- [ ] Classifier data loaded
- [ ] No TypeScript errors

---

## 🚨 If Still Not Working

### Try Minimal Example:

```tsx
import { useState } from 'react';
import { SearchableSelect } from '@/shared/components/SearchableSelect';

// Hardcoded data
const options = [
    { id: 1, name: 'Option 1', code: 'OPT1' },
    { id: 2, name: 'Option 2', code: 'OPT2' },
];

function MinimalTest() {
    const [value, setValue] = useState<number>(0);

    return (
        <SearchableSelect
            options={options}
            value={value}
            onChange={(val) => {
                console.log('Setting value to:', val);
                setValue(val as number);
            }}
            label="Test"
        />
    );
}
```

If this works → Problem is with React Hook Form integration
If this doesn't work → Problem is with SearchableSelect component

---

**გამოიყენე ეს debug guide რომ იპოვო პრობლემა! 🔍**
