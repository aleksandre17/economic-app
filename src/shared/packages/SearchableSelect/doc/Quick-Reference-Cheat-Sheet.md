# ⚡ SearchableSelect - სწრაფი რეფერენსი

**Cheat Sheet - ყველა ტიპი ერთ გვერდზე**

---

## 🎯 სწრაფი დეციზია (30 წამი)

```
არ იყენებ React Hook Form?
  → ClassifierSelect (data classifiers-დან)
  → SearchableSelect (hardcoded data)

იყენებ React Hook Form?
  → Production: Manual Controller + ClassifierSelect
  → Simple CRUD: RHFControllerClassifierSelect
  → Prototype: RHFClassifierSelect
```

---

## 📊 ყველა ტიპი ერთ ცხრილში

| # | ტიპი | Import | Usage Lines | Best For |
|---|------|--------|-------------|----------|
| 1 | SearchableSelect | `SearchableSelect` | ~5 | Hardcoded + useState |
| 2 | ClassifierSelect | `ClassifierSelect` | ~6 | Classifiers + useState |
| 3 | RHFSearchableSelect | `RHFSearchableSelect` | ~8 | Hardcoded + register |
| 4 | RHFClassifierSelect | `RHFClassifierSelect` | ~9 | Classifiers + register |
| 5 | RHFControllerSearchableSelect | `RHFControllerSearchableSelect` | ~6 | Hardcoded + FormProvider |
| 6 | RHFControllerClassifierSelect | `RHFControllerClassifierSelect` | ~7 | Classifiers + FormProvider |
| M | Manual Controller | `Controller` + `ClassifierSelect` | ~12 | Production forms |

---

## 💡 Import Statements

```tsx
// Type 1-2
import { SearchableSelect, ClassifierSelect } from '@/shared/components/SearchableSelect';

// Type 3-4
import { RHFSearchableSelect, RHFClassifierSelect } from '@/shared/components/SearchableSelect';

// Type 5-6
import { RHFControllerSearchableSelect, RHFControllerClassifierSelect } from '@/shared/components/SearchableSelect';

// Manual
import { Controller } from 'react-hook-form';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';

// Classifiers
import { CLASSIFIER_KEYS } from '@/features/classifiers';
```

---

## 🔥 ყველაზე ხშირი Patterns

### Pattern 1: Simple Filter (No Form)

```tsx
const [category, setCategory] = useState('');

<ClassifierSelect
    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
    value={category}
    onChange={setCategory}
    valueField="code"
/>
```

**3 ხაზი კოდი ⚡**

---

### Pattern 2: Production Form

```tsx
const { control } = useForm({ defaultValues: { category: '' } });

<Controller
    name="category"
    control={control}
    render={({ field }) => (
        <ClassifierSelect
            classifierKey={CLASSIFIER_KEYS.CATEGORIES}
            {...field}
            valueField="code"
            autoSelectFirst
        />
    )}
/>
```

**12 ხაზი კოდი ⭐**

---

### Pattern 3: Quick CRUD

```tsx
const methods = useForm({ defaultValues: { category: '' } });

<FormProvider {...methods}>
    <RHFControllerClassifierSelect
        name="category"
        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
        valueField="code"
        autoSelectFirst
    />
</FormProvider>
```

**7 ხაზი კოდი 🚀**

---

## 🎨 Props Quick Reference

### ყველა ტიპისთვის საერთო Props

```tsx
// Display
label?: string;
placeholder?: string;
error?: string;
required?: boolean;
disabled?: boolean;

// Behavior
valueField?: 'id' | 'code';        // Default: 'id'
autoSelectFirst?: boolean;         // Default: false
searchable?: boolean;              // Default: true

// Styling
className?: string;
```

---

### ტიპ-სპეციფიკური Props

```tsx
// SearchableSelect (1)
options: Array;                    // Required
value?: string | number;
onChange?: (value, option) => void;

// ClassifierSelect (2)
classifierKey: string;             // Required
autoLoad?: boolean;                // Default: true

// RHF Types (3-6)
name: string;                      // Required (Controller/FormProvider)
rules?: ValidationRules;           // Optional

// Register Types (3-4)
{...register('field')}            // Spreads name, onChange, onBlur, ref
```

---

## 🔧 Common Props Combinations

### Minimal (only required)

```tsx
// Type 1
<SearchableSelect
    options={data}
    value={value}
    onChange={setValue}
/>

// Type 2
<ClassifierSelect
    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
    value={value}
    onChange={setValue}
/>
```

---

### Recommended (production)

```tsx
// Type 1
<SearchableSelect
    options={data}
    value={value}
    onChange={setValue}
    valueField="code"
    label="კატეგორია"
    placeholder="აირჩიეთ"
    required
/>

// Type 2
<ClassifierSelect
    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
    value={value}
    onChange={setValue}
    valueField="code"
    autoSelectFirst={true}
    label="კატეგორია"
    required
/>
```

---

### Full (all features)

```tsx
<ClassifierSelect
    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
    value={value}
    onChange={setValue}
    valueField="code"
    autoSelectFirst={true}
    autoLoad={true}
    label="კატეგორია"
    placeholder="აირჩიეთ კატეგორია"
    error="შეცდომა"
    required={true}
    disabled={false}
    searchable={true}
    searchPlaceholder="ძებნა..."
    noResultsText="არ მოიძებნა"
    className="custom-class"
/>
```

---

## 📋 Validation Patterns

### React Hook Form - Controller

```tsx
<Controller
    name="category"
    control={control}
    rules={{
        required: 'აუცილებელია',
        validate: (value) => value !== 'BAD' || 'არასწორი არჩევანი',
    }}
    render={({ field, fieldState }) => (
        <ClassifierSelect
            {...field}
            error={fieldState.error?.message}
        />
    )}
/>
```

---

### React Hook Form - Register Adapter

```tsx
<RHFClassifierSelect
    {...register('category', {
        required: 'აუცილებელია',
        validate: (value) => value !== 'BAD' || 'არასწორი არჩევანი',
    })}
    error={errors.category?.message}
/>
```

---

### Zod Schema

```tsx
const schema = z.object({
    category: z.string().min(1, 'აუცილებელია'),
});

const { control } = useForm({
    resolver: zodResolver(schema),
});
```

---

## 🎯 Use Case → Type Mapping

| Use Case | Type | Code Lines | Setup Time |
|----------|------|------------|------------|
| Filter sidebar | ClassifierSelect | 3-5 | 1 min |
| Search page | ClassifierSelect | 3-5 | 1 min |
| Dashboard filters | ClassifierSelect | 3-5 | 1 min |
| Simple form | RHFControllerClassifierSelect | 6-8 | 3 min |
| CRUD form | Manual Controller | 10-15 | 5 min |
| Registration form | Manual Controller | 15-25 | 10 min |
| Edit form | Manual Controller | 15-25 | 10 min |
| Wizard form | Manual Controller | 20-40 | 20 min |
| Dependent fields | Manual Controller | 20-30 | 15 min |
| Form builder | SearchableSelect | 3-5 | 2 min |

---

## 🚀 Performance Tips

### ✅ DO

```tsx
// Use valueField="code" for strings
<ClassifierSelect valueField="code" />

// Use autoSelectFirst for better UX
<ClassifierSelect autoSelectFirst={true} />

// Use memoization for large datasets
const options = useMemo(() => largeData, [largeData]);
```

---

### ❌ DON'T

```tsx
// Don't use register directly
<ClassifierSelect {...register('field')} />  // ❌

// Don't mix ID and CODE types
const [value, setValue] = useState<string | number>('');  // ❌

// Don't load data in every render
const options = expensiveComputation();  // ❌
```

---

## 🐛 Common Mistakes

### Mistake 1: Selected text არ ჩანს

```tsx
// ❌ WRONG
<ClassifierSelect {...register('field')} />

// ✅ CORRECT
<Controller
    name="field"
    control={control}
    render={({ field }) => (
        <ClassifierSelect {...field} valueField="code" />
    )}
/>
```

---

### Mistake 2: Type mismatch

```tsx
// ❌ WRONG
options = [{ id: 1, ... }]
value = "1"  // String
valueField = "id"  // Returns number

// ✅ CORRECT
options = [{ id: 1, code: "IT", ... }]
value = "IT"  // String
valueField = "code"  // Returns string
```

---

### Mistake 3: FormProvider missing

```tsx
// ❌ WRONG
<RHFControllerClassifierSelect name="field" />  // Error!

// ✅ CORRECT
<FormProvider {...methods}>
    <RHFControllerClassifierSelect name="field" />
</FormProvider>
```

---

## 📦 Complete Setup Checklist

### Initial Setup

- [ ] Copy SearchableSelect.tsx
- [ ] Copy SearchableSelect.module.css (light mode)
- [ ] Copy ClassifierSelect.tsx
- [ ] Setup classifiers system
- [ ] Configure CLASSIFIER_KEYS

### Optional (RHF)

- [ ] Copy RHFSearchableSelect.tsx
- [ ] Copy RHFClassifierSelect.tsx
- [ ] Copy RHFControllerSearchableSelect.tsx
- [ ] Copy RHFControllerClassifierSelect.tsx

---

## 🎓 Learning Path

### Day 1: Basics
1. Learn SearchableSelect (ტიპი 1)
2. Try ClassifierSelect (ტიპი 2)
3. Build filter page

### Day 2: Forms
1. Learn Controller pattern
2. Build simple CRUD form
3. Add validation

### Day 3: Advanced
1. Dependent fields
2. Wizard form
3. Complex validation

---

## 📞 Decision Flow

```
1. იყენებ React Hook Form?
   ├─ არა → Type 1 or 2
   └─ კი → Continue

2. გჭირდება complex logic?
   ├─ კი → Manual Controller
   └─ არა → Continue

3. გინდა minimum code?
   ├─ კი → Type 6 (RHFControllerClassifierSelect)
   └─ არა → Manual Controller
```

---

## 🎯 Final Recommendations

### Production
→ **Manual Controller + ClassifierSelect**

### Simple CRUD
→ **RHFControllerClassifierSelect (Type 6)**

### Filters/Search
→ **ClassifierSelect (Type 2)**

### Prototypes
→ **RHFClassifierSelect (Type 4)**

---

## 📚 Documentation Links

- [Complete Documentation](./Complete-Documentation-All-Types.md)
- [Practical Examples](./Practical-Examples-All-Scenarios.md)
- [Bug Fixes](./Complete-Fix-Both-Issues.md)
- [ValueField Guide](./valueField-Feature-Summary.md)
- [AutoSelect Guide](SelectFirst-Examples.md)

---

**დაბეჭდე ეს გვერდი სწრაფი რეფერენსისთვის! 📄**
