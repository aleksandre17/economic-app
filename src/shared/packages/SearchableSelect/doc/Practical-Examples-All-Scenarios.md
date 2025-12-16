# 🎨 SearchableSelect - პრაქტიკული მაგალითები

**რეალური სცენარები ყველა ტიპისთვის**

---

## 📋 სცენარები

1. [Simple Form - No React Hook Form](#scenario-1)
2. [Registration Form - React Hook Form](#scenario-2)
3. [Edit Form - Load Existing Data](#scenario-3)
4. [Dependent Fields](#scenario-4)
5. [Wizard / Multi-Step Form](#scenario-5)
6. [Search & Filter Page](#scenario-6)
7. [Dashboard Filters](#scenario-7)
8. [Dynamic Form Builder](#scenario-8)

---

<a name="scenario-1"></a>
## 🎯 სცენარი 1: Simple Form (No React Hook Form)

**Use Case:** Employee filter sidebar

**რომელი ტიპი:** ClassifierSelect (ტიპი 2)

---

### Code

```tsx
import React, { useState } from 'react';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

export function EmployeeFilterSidebar() {
    const [filters, setFilters] = useState({
        category: '',
        position: '',
        department: '',
        region: '',
    });

    const handleSearch = () => {
        console.log('Searching with filters:', filters);
        // Call API with filters
        searchEmployees(filters);
    };

    const handleReset = () => {
        setFilters({
            category: '',
            position: '',
            department: '',
            region: '',
        });
    };

    return (
        <div className="sidebar">
            <h3>ფილტრები</h3>

            {/* Category */}
            <ClassifierSelect
                classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                value={filters.category}
                onChange={(value) => setFilters({ ...filters, category: value })}
                valueField="code"
                label="კატეგორია"
                placeholder="ყველა"
            />

            {/* Position */}
            <ClassifierSelect
                classifierKey={CLASSIFIER_KEYS.POSITIONS}
                value={filters.position}
                onChange={(value) => setFilters({ ...filters, position: value })}
                valueField="code"
                label="პოზიცია"
                placeholder="ყველა"
            />

            {/* Department */}
            <ClassifierSelect
                classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                value={filters.department}
                onChange={(value) => setFilters({ ...filters, department: value })}
                valueField="code"
                label="დეპარტამენტი"
                placeholder="ყველა"
            />

            {/* Region */}
            <ClassifierSelect
                classifierKey={CLASSIFIER_KEYS.REGIONS}
                value={filters.region}
                onChange={(value) => setFilters({ ...filters, region: value })}
                valueField="code"
                label="რეგიონი"
                placeholder="ყველა"
            />

            <div className="buttons">
                <button onClick={handleSearch}>ძებნა</button>
                <button onClick={handleReset}>გასუფთავება</button>
            </div>
        </div>
    );
}
```

---

### რატომ ეს ტიპი?

✅ არ საჭიროებს validation  
✅ არ საჭიროებს form submission  
✅ Auto data loading  
✅ Simple state management  

---

<a name="scenario-2"></a>
## 🎯 სცენარი 2: Registration Form

**Use Case:** New employee registration

**რომელი ტიპი:** Manual Controller + ClassifierSelect

---

### Code

```tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

// Validation schema
const employeeSchema = z.object({
    firstName: z.string().min(2, 'სახელი აუცილებელია'),
    lastName: z.string().min(2, 'გვარი აუცილებელია'),
    personalId: z.string().length(11, 'პირადი ნომერი უნდა იყოს 11 ციფრი'),
    category: z.string().min(1, 'კატეგორია აუცილებელია'),
    position: z.string().min(1, 'პოზიცია აუცილებელია'),
    department: z.string().min(1, 'დეპარტამენტი აუცილებელია'),
    startDate: z.string().min(1, 'დაწყების თარიღი აუცილებელია'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function EmployeeRegistrationForm() {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            personalId: '',
            category: '',
            position: '',
            department: '',
            startDate: '',
        },
    });

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            console.log('Submitting:', data);
            
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed');

            alert('თანამშრომელი წარმატებით დაემატა!');
            reset();
        } catch (error) {
            console.error('Error:', error);
            alert('შეცდომა დამატებისას!');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            <h2>ახალი თანამშრომლის რეგისტრაცია</h2>

            {/* Personal Info */}
            <div className="form-section">
                <h3>პირადი ინფორმაცია</h3>

                <div className="form-field">
                    <label>სახელი *</label>
                    <input
                        {...register('firstName')}
                        placeholder="სახელი"
                    />
                    {errors.firstName && (
                        <span className="error">{errors.firstName.message}</span>
                    )}
                </div>

                <div className="form-field">
                    <label>გვარი *</label>
                    <input
                        {...register('lastName')}
                        placeholder="გვარი"
                    />
                    {errors.lastName && (
                        <span className="error">{errors.lastName.message}</span>
                    )}
                </div>

                <div className="form-field">
                    <label>პირადი ნომერი *</label>
                    <input
                        {...register('personalId')}
                        placeholder="01234567890"
                        maxLength={11}
                    />
                    {errors.personalId && (
                        <span className="error">{errors.personalId.message}</span>
                    )}
                </div>
            </div>

            {/* Work Info */}
            <div className="form-section">
                <h3>სამსახურებრივი ინფორმაცია</h3>

                {/* Category */}
                <div className="form-field">
                    <Controller
                        name="category"
                        control={control}
                        render={({ field, fieldState }) => (
                            <ClassifierSelect
                                classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                valueField="code"
                                autoSelectFirst={true}
                                error={fieldState.error?.message}
                                label="კატეგორია"
                                placeholder="აირჩიეთ კატეგორია"
                                required
                            />
                        )}
                    />
                </div>

                {/* Position */}
                <div className="form-field">
                    <Controller
                        name="position"
                        control={control}
                        render={({ field, fieldState }) => (
                            <ClassifierSelect
                                classifierKey={CLASSIFIER_KEYS.POSITIONS}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                valueField="code"
                                autoSelectFirst={true}
                                error={fieldState.error?.message}
                                label="პოზიცია"
                                placeholder="აირჩიეთ პოზიცია"
                                required
                            />
                        )}
                    />
                </div>

                {/* Department */}
                <div className="form-field">
                    <Controller
                        name="department"
                        control={control}
                        render={({ field, fieldState }) => (
                            <ClassifierSelect
                                classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                valueField="code"
                                autoSelectFirst={true}
                                error={fieldState.error?.message}
                                label="დეპარტამენტი"
                                placeholder="აირჩიეთ დეპარტამენტი"
                                required
                            />
                        )}
                    />
                </div>

                {/* Start Date */}
                <div className="form-field">
                    <label>დაწყების თარიღი *</label>
                    <input
                        type="date"
                        {...register('startDate')}
                    />
                    {errors.startDate && (
                        <span className="error">{errors.startDate.message}</span>
                    )}
                </div>
            </div>

            {/* Submit */}
            <div className="form-actions">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                >
                    {isSubmitting ? 'მიმდინარეობს...' : 'რეგისტრაცია'}
                </button>
                
                <button
                    type="button"
                    onClick={() => reset()}
                    className="btn-secondary"
                >
                    გასუფთავება
                </button>
            </div>
        </form>
    );
}
```

---

### რატომ ეს ტიპი?

✅ Production-ready  
✅ Full validation  
✅ Maximum flexibility  
✅ Auto data loading  
✅ Type-safe  

---

<a name="scenario-3"></a>
## 🎯 სცენარი 3: Edit Form

**Use Case:** Edit existing employee

**რომელი ტიპი:** Manual Controller + ClassifierSelect

---

### Code

```tsx
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

export function EmployeeEditForm() {
    const { id } = useParams();
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            category: '',
            position: '',
            department: '',
        },
    });

    // Load existing data
    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const response = await fetch(`/api/employees/${id}`);
                const data = await response.json();
                
                // Populate form
                reset({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    category: data.categoryCode,     // CODE not ID!
                    position: data.positionCode,
                    department: data.departmentCode,
                });
            } catch (error) {
                console.error('Failed to load employee:', error);
            }
        };

        if (id) {
            loadEmployee();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed');

            alert('ცვლილებები შენახულია!');
        } catch (error) {
            console.error('Error:', error);
            alert('შეცდომა!');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>თანამშრომლის რედაქტირება</h2>

            <input {...register('firstName')} placeholder="სახელი" />
            <input {...register('lastName')} placeholder="გვარი" />

            <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        value={field.value}
                        onChange={field.onChange}
                        valueField="code"
                        error={fieldState.error?.message}
                        label="კატეგორია"
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
                        valueField="code"
                        error={fieldState.error?.message}
                        label="პოზიცია"
                    />
                )}
            />

            <Controller
                name="department"
                control={control}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                        value={field.value}
                        onChange={field.onChange}
                        valueField="code"
                        error={fieldState.error?.message}
                        label="დეპარტამენტი"
                    />
                )}
            />

            <button type="submit">შენახვა</button>
        </form>
    );
}
```

---

### რატომ ეს ტიპი?

✅ Loads existing values  
✅ Validation  
✅ Full control  
✅ Type-safe  

---

<a name="scenario-4"></a>
## 🎯 სცენარი 4: Dependent Fields

**Use Case:** Category → Position filtering

**რომელი ტიპი:** Manual Controller + SearchableSelect

---

### Code

```tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { SearchableSelect, ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

export function DependentFieldsForm() {
    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            category: '',
            position: '',
        },
    });

    const [positions, setPositions] = useState([]);
    const selectedCategory = watch('category');

    // Load positions when category changes
    useEffect(() => {
        if (selectedCategory) {
            loadPositions(selectedCategory);
        } else {
            setPositions([]);
            setValue('position', ''); // Clear position
        }
    }, [selectedCategory, setValue]);

    const loadPositions = async (categoryCode) => {
        try {
            const response = await fetch(`/api/positions?category=${categoryCode}`);
            const data = await response.json();
            setPositions(data);
        } catch (error) {
            console.error('Failed to load positions:', error);
            setPositions([]);
        }
    };

    const onSubmit = (data) => {
        console.log('Submitted:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Dependent Fields Example</h2>

            {/* Category - Independent */}
            <Controller
                name="category"
                control={control}
                rules={{ required: 'აუცილებელია' }}
                render={({ field, fieldState }) => (
                    <ClassifierSelect
                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                        value={field.value}
                        onChange={(value) => {
                            field.onChange(value);
                            // Position will be cleared by useEffect
                        }}
                        valueField="code"
                        error={fieldState.error?.message}
                        label="კატეგორია"
                        required
                    />
                )}
            />

            {/* Position - Dependent on Category */}
            <Controller
                name="position"
                control={control}
                rules={{ required: 'აუცილებელია' }}
                render={({ field, fieldState }) => (
                    <SearchableSelect
                        options={positions}
                        value={field.value}
                        onChange={field.onChange}
                        valueField="code"
                        disabled={!selectedCategory || positions.length === 0}
                        error={fieldState.error?.message}
                        label="პოზიცია"
                        placeholder={
                            !selectedCategory
                                ? 'ჯერ აირჩიეთ კატეგორია'
                                : positions.length === 0
                                ? 'იტვირთება...'
                                : 'აირჩიეთ პოზიცია'
                        }
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

### რატომ ეს ტიპი?

✅ Dynamic data loading  
✅ Field clearing  
✅ Conditional enabling  
✅ Full control  

---

<a name="scenario-5"></a>
## 🎯 სცენარი 5: Wizard Form

**Use Case:** Multi-step registration

**რომელი ტიპი:** Manual Controller + ClassifierSelect

---

### Code

```tsx
import React, { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

export function WizardForm() {
    const [step, setStep] = useState(1);
    const methods = useForm({
        defaultValues: {
            // Step 1
            firstName: '',
            lastName: '',
            personalId: '',
            // Step 2
            category: '',
            position: '',
            department: '',
            // Step 3
            startDate: '',
            salary: '',
        },
    });

    const { control, register, handleSubmit, trigger } = methods;

    const nextStep = async () => {
        // Validate current step
        const fieldsToValidate = {
            1: ['firstName', 'lastName', 'personalId'],
            2: ['category', 'position', 'department'],
            3: ['startDate', 'salary'],
        };

        const isValid = await trigger(fieldsToValidate[step]);
        
        if (isValid) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const onSubmit = (data) => {
        console.log('Final submission:', data);
        // Submit to API
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="wizard">
                    <div className="wizard-steps">
                        <div className={step >= 1 ? 'active' : ''}>1. პირადი</div>
                        <div className={step >= 2 ? 'active' : ''}>2. სამსახური</div>
                        <div className={step >= 3 ? 'active' : ''}>3. ხელფასი</div>
                    </div>

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="wizard-content">
                            <h3>პირადი ინფორმაცია</h3>
                            <input {...register('firstName', { required: true })} placeholder="სახელი" />
                            <input {...register('lastName', { required: true })} placeholder="გვარი" />
                            <input {...register('personalId', { required: true })} placeholder="პირადი ნომერი" />
                        </div>
                    )}

                    {/* Step 2: Work Info */}
                    {step === 2 && (
                        <div className="wizard-content">
                            <h3>სამსახურებრივი ინფორმაცია</h3>

                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <ClassifierSelect
                                        classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                                        {...field}
                                        valueField="code"
                                        autoSelectFirst={true}
                                        label="კატეგორია"
                                    />
                                )}
                            />

                            <Controller
                                name="position"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <ClassifierSelect
                                        classifierKey={CLASSIFIER_KEYS.POSITIONS}
                                        {...field}
                                        valueField="code"
                                        autoSelectFirst={true}
                                        label="პოზიცია"
                                    />
                                )}
                            />

                            <Controller
                                name="department"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <ClassifierSelect
                                        classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                                        {...field}
                                        valueField="code"
                                        autoSelectFirst={true}
                                        label="დეპარტამენტი"
                                    />
                                )}
                            />
                        </div>
                    )}

                    {/* Step 3: Salary Info */}
                    {step === 3 && (
                        <div className="wizard-content">
                            <h3>ხელფასი</h3>
                            <input type="date" {...register('startDate', { required: true })} />
                            <input type="number" {...register('salary', { required: true })} placeholder="ხელფასი" />
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="wizard-nav">
                        {step > 1 && (
                            <button type="button" onClick={prevStep}>
                                უკან
                            </button>
                        )}
                        
                        {step < 3 ? (
                            <button type="button" onClick={nextStep}>
                                შემდეგი
                            </button>
                        ) : (
                            <button type="submit">
                                დასრულება
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}
```

---

### რატომ ეს ტიპი?

✅ Step validation  
✅ FormProvider for shared state  
✅ Auto-select for faster flow  
✅ Full control  

---

<a name="scenario-6"></a>
## 🎯 სცენარი 6: Search Page

**Use Case:** Employee search/filter page

**რომელი ტიპი:** ClassifierSelect (ტიპი 2)

---

### Code

```tsx
import React, { useState, useEffect } from 'react';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

export function EmployeeSearchPage() {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        position: '',
        department: '',
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Auto-search when filters change
    useEffect(() => {
        const timer = setTimeout(() => {
            searchEmployees();
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [filters]);

    const searchEmployees = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/employees/search?${params}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            position: '',
            department: '',
        });
    };

    return (
        <div className="search-page">
            {/* Filters */}
            <div className="filters-panel">
                <h3>ძებნა და ფილტრაცია</h3>

                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="სახელი, გვარი, პირადი ნომერი..."
                />

                <ClassifierSelect
                    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                    value={filters.category}
                    onChange={(value) => setFilters({ ...filters, category: value })}
                    valueField="code"
                    label="კატეგორია"
                    placeholder="ყველა"
                />

                <ClassifierSelect
                    classifierKey={CLASSIFIER_KEYS.POSITIONS}
                    value={filters.position}
                    onChange={(value) => setFilters({ ...filters, position: value })}
                    valueField="code"
                    label="პოზიცია"
                    placeholder="ყველა"
                />

                <ClassifierSelect
                    classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                    value={filters.department}
                    onChange={(value) => setFilters({ ...filters, department: value })}
                    valueField="code"
                    label="დეპარტამენტი"
                    placeholder="ყველა"
                />

                <button onClick={clearFilters}>გასუფთავება</button>
            </div>

            {/* Results */}
            <div className="results-panel">
                <div className="results-header">
                    <h3>შედეგები ({results.length})</h3>
                    {loading && <span>იტვირთება...</span>}
                </div>

                <div className="results-list">
                    {results.map((employee) => (
                        <div key={employee.id} className="result-item">
                            <div>{employee.firstName} {employee.lastName}</div>
                            <div>{employee.position}</div>
                            <div>{employee.department}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
```

---

### რატომ ეს ტიპი?

✅ No validation needed  
✅ Simple state  
✅ Auto data loading  
✅ Fast implementation  

---

<a name="scenario-7"></a>
## 🎯 სცენარი 7: Dashboard Filters

**Use Case:** Analytics dashboard

**რომელი ტიპი:** ClassifierSelect (ტიპი 2)

---

### Code

```tsx
import React, { useState } from 'react';
import { ClassifierSelect } from '@/shared/components/SearchableSelect';
import { CLASSIFIER_KEYS } from '@/features/classifiers';

export function AnalyticsDashboard() {
    const [filters, setFilters] = useState({
        period: 'month',
        department: '',
        category: '',
    });

    return (
        <div className="dashboard">
            {/* Filter Bar */}
            <div className="dashboard-filters">
                <select
                    value={filters.period}
                    onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                >
                    <option value="week">კვირა</option>
                    <option value="month">თვე</option>
                    <option value="year">წელი</option>
                </select>

                <ClassifierSelect
                    classifierKey={CLASSIFIER_KEYS.DEPARTMENTS}
                    value={filters.department}
                    onChange={(value) => setFilters({ ...filters, department: value })}
                    valueField="code"
                    placeholder="ყველა დეპარტამენტი"
                />

                <ClassifierSelect
                    classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                    value={filters.category}
                    onChange={(value) => setFilters({ ...filters, category: value })}
                    valueField="code"
                    placeholder="ყველა კატეგორია"
                />
            </div>

            {/* Charts */}
            <div className="dashboard-charts">
                {/* Charts render based on filters */}
            </div>
        </div>
    );
}
```

---

<a name="scenario-8"></a>
## 🎯 სცენარი 8: Dynamic Form Builder

**Use Case:** Admin creates custom forms

**რომელი ტიპი:** SearchableSelect (ტიპი 1)

---

### Code

```tsx
import React, { useState } from 'react';
import { SearchableSelect } from '@/shared/components/SearchableSelect';

const fieldTypes = [
    { id: 'text', name: 'ტექსტი', code: 'TEXT' },
    { id: 'number', name: 'რიცხვი', code: 'NUMBER' },
    { id: 'date', name: 'თარიღი', code: 'DATE' },
    { id: 'select', name: 'სელექტი', code: 'SELECT' },
];

export function FormBuilder() {
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState({
        name: '',
        type: '',
        required: false,
    });

    const addField = () => {
        if (newField.name && newField.type) {
            setFields([...fields, { ...newField, id: Date.now() }]);
            setNewField({ name: '', type: '', required: false });
        }
    };

    return (
        <div className="form-builder">
            <h2>ფორმის შექმნა</h2>

            {/* Add Field */}
            <div className="add-field">
                <input
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="ველის სახელი"
                />

                <SearchableSelect
                    options={fieldTypes}
                    value={newField.type}
                    onChange={(value) => setNewField({ ...newField, type: value })}
                    valueField="code"
                    placeholder="ტიპი"
                />

                <label>
                    <input
                        type="checkbox"
                        checked={newField.required}
                        onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    />
                    აუცილებელი
                </label>

                <button onClick={addField}>დამატება</button>
            </div>

            {/* Fields List */}
            <div className="fields-list">
                {fields.map((field) => (
                    <div key={field.id} className="field-item">
                        <span>{field.name}</span>
                        <span>{field.type}</span>
                        {field.required && <span>*</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

---

## 🎉 დასკვნა

**ყოველი სცენარისთვის არის იდეალური ტიპი:**

| სცენარი | ტიპი | რატომ |
|---------|------|-------|
| Simple filters | ClassifierSelect | No validation needed |
| Registration form | Manual Controller | Full control, validation |
| Edit form | Manual Controller | Load existing data |
| Dependent fields | Manual Controller | Dynamic logic |
| Wizard | Manual Controller | Step validation |
| Search page | ClassifierSelect | Simple, fast |
| Dashboard | ClassifierSelect | No validation |
| Form builder | SearchableSelect | Hardcoded options |

---

**აირჩიე სწორი ტიპი შენი use case-ისთვის! 🚀**
