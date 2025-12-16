# 💡 Examples - Classifiers System

Real-world examples and code snippets for common use cases.

---

## 📑 Table of Contents

1. [Basic Examples](#basic-examples)
2. [Form Examples](#form-examples)
3. [Advanced Patterns](#advanced-patterns)
4. [Performance Optimization](#performance-optimization)
5. [Error Handling](#error-handling)
6. [Testing](#testing)

---

## 🎯 Basic Examples

### Example 1: Simple Dropdown

```tsx
// components/CategorySelect.tsx
import React from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

interface CategorySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  placeholder = 'Select category',
}) => {
  const { data, isLoading, isError } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );

  if (isLoading) {
    return (
      <select disabled className="loading">
        <option>Loading...</option>
      </select>
    );
  }

  if (isError) {
    return (
      <select disabled className="error">
        <option>Error loading categories</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="category-select"
    >
      <option value="">{placeholder}</option>
      {data?.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
};
```

**Usage:**
```tsx
function MyForm() {
  const [category, setCategory] = useState('');

  return (
    <CategorySelect
      value={category}
      onChange={setCategory}
      placeholder="აირჩიეთ კატეგორია"
    />
  );
}
```

---

### Example 2: Multiple Selects

```tsx
// components/EmployeeFilters.tsx
import React, { useState } from 'react';
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

export const EmployeeFilters: React.FC = () => {
  const [filters, setFilters] = useState({
    position: '',
    department: '',
    educationLevel: '',
  });

  // Load all classifiers (no re-renders)
  const positions = useClassifier(CLASSIFIER_KEYS.POSITIONS, { autoLoad: true });
  const departments = useClassifier(CLASSIFIER_KEYS.DEPARTMENTS, { autoLoad: true });
  const educationLevels = useClassifier(CLASSIFIER_KEYS.EDUCATION_LEVELS, { autoLoad: true });

  const handleChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Position:</label>
        <select
          value={filters.position}
          onChange={(e) => handleChange('position', e.target.value)}
        >
          <option value="">All</option>
          {positions.getData()?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Department:</label>
        <select
          value={filters.department}
          onChange={(e) => handleChange('department', e.target.value)}
        >
          <option value="">All</option>
          {departments.getData()?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Education:</label>
        <select
          value={filters.educationLevel}
          onChange={(e) => handleChange('educationLevel', e.target.value)}
        >
          <option value="">All</option>
          {educationLevels.getData()?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
```

---

### Example 3: Dependent Dropdowns (Cascade)

```tsx
// components/LocationSelect.tsx
import React, { useState, useEffect } from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';
import type { ClassifierItem } from '@/features/classifiers';

export const LocationSelect: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState<ClassifierItem[]>([]);

  const { data: regions } = useClassifierValue(
    CLASSIFIER_KEYS.REGIONS,
    { autoLoad: true }
  );

  const { data: cities } = useClassifierValue(
    CLASSIFIER_KEYS.CITIES,
    { autoLoad: true }
  );

  // Filter cities based on selected region
  useEffect(() => {
    if (selectedRegion && cities) {
      const filtered = cities.filter(
        (city) => city.parentId === selectedRegion
      );
      setAvailableCities(filtered);
      setSelectedCity(''); // Reset city selection
    } else {
      setAvailableCities([]);
      setSelectedCity('');
    }
  }, [selectedRegion, cities]);

  return (
    <div className="location-select">
      {/* Region Select */}
      <div>
        <label>Region:</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">Select region</option>
          {regions?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      {/* City Select (dependent on region) */}
      <div>
        <label>City:</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedRegion}
        >
          <option value="">Select city</option>
          {availableCities.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div className="selection-summary">
          Selected: Region {selectedRegion}, City {selectedCity}
        </div>
      )}
    </div>
  );
};
```

---

## 📝 Form Examples

### Example 4: React Hook Form Integration

```tsx
// components/EmployeeForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  department: z.string().min(1, 'Department is required'),
  educationLevel: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export const EmployeeForm: React.FC = () => {
  const positions = useClassifier(CLASSIFIER_KEYS.POSITIONS, { autoLoad: true });
  const departments = useClassifier(CLASSIFIER_KEYS.DEPARTMENTS, { autoLoad: true });
  const educationLevels = useClassifier(CLASSIFIER_KEYS.EDUCATION_LEVELS, { autoLoad: true });

  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = (data: EmployeeFormData) => {
    console.log('Form data:', data);
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name:</label>
        <input {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div>
        <label>Position:</label>
        <select {...register('position')}>
          <option value="">Select position</option>
          {positions.getData()?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        {errors.position && <span className="error">{errors.position.message}</span>}
      </div>

      <div>
        <label>Department:</label>
        <select {...register('department')}>
          <option value="">Select department</option>
          {departments.getData()?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        {errors.department && <span className="error">{errors.department.message}</span>}
      </div>

      <div>
        <label>Education Level:</label>
        <select {...register('educationLevel')}>
          <option value="">Select education level</option>
          {educationLevels.getData()?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

---

### Example 5: Modal Form (Zero Re-renders)

```tsx
// components/AddEmployeeModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  // ✅ No re-renders - perfect for modals
  const positions = useClassifier(CLASSIFIER_KEYS.POSITIONS, { autoLoad: true });
  const departments = useClassifier(CLASSIFIER_KEYS.DEPARTMENTS, { autoLoad: true });

  const { register, handleSubmit, reset } = useForm();

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const positionData = positions.getData();
  const departmentData = departments.getData();
  const isLoading = positions.isLoading() || departments.isLoading();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Employee</h2>
          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-field">
            <label>Name:</label>
            <input {...register('name', { required: true })} />
          </div>

          <div className="form-field">
            <label>Position:</label>
            <select {...register('position', { required: true })} disabled={isLoading}>
              <option value="">Select position</option>
              {positionData?.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Department:</label>
            <select {...register('department', { required: true })} disabled={isLoading}>
              <option value="">Select department</option>
              {departmentData?.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

## 🚀 Advanced Patterns

### Example 6: Searchable Select

```tsx
// components/SearchableSelect.tsx
import React, { useState, useMemo } from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

interface SearchableSelectProps {
  classifierKey: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  classifierKey,
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useClassifierValue(classifierKey, { autoLoad: true });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      item.name.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const handleSelect = (itemId: string) => {
    onChange?.(itemId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedItem = data?.find((item) => String(item.id) === value);

  return (
    <div className="searchable-select">
      <div className="select-input" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedItem?.name || placeholder}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="options">
            {isLoading && <div className="loading">Loading...</div>}
            
            {filteredData.map((item) => (
              <div
                key={item.id}
                className={`option ${value === String(item.id) ? 'selected' : ''}`}
                onClick={() => handleSelect(String(item.id))}
              >
                {item.name}
                {item.code && <span className="code">({item.code})</span>}
              </div>
            ))}

            {!isLoading && filteredData.length === 0 && (
              <div className="no-results">No results found</div>
            )}
          </div>

          <div className="footer">
            Found: {filteredData.length} / {data?.length || 0}
          </div>
        </div>
      )}
    </div>
  );
};
```

---

### Example 7: Hierarchical Tree

```tsx
// components/CategoryTree.tsx
import React, { useState } from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';
import type { ClassifierItem } from '@/features/classifiers';

interface TreeNodeProps {
  item: ClassifierItem;
  allItems: ClassifierItem[];
  level: number;
  onSelect?: (item: ClassifierItem) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ item, allItems, level, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const children = allItems.filter((child) => child.parentId === item.id);
  const hasChildren = children.length > 0;

  return (
    <div style={{ marginLeft: level * 20 }}>
      <div className="tree-node">
        {hasChildren && (
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '−' : '+'}
          </button>
        )}
        <span onClick={() => onSelect?.(item)}>{item.name}</span>
      </div>

      {isExpanded && children.map((child) => (
        <TreeNode
          key={child.id}
          item={child}
          allItems={allItems}
          level={level + 1}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export const CategoryTree: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ClassifierItem | null>(null);

  const { data, isLoading } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );

  if (isLoading) return <div>Loading tree...</div>;

  const rootItems = data?.filter((item) => !item.parentId) || [];

  return (
    <div className="category-tree">
      <h3>Category Hierarchy</h3>
      
      {rootItems.map((root) => (
        <TreeNode
          key={root.id}
          item={root}
          allItems={data || []}
          level={0}
          onSelect={setSelectedItem}
        />
      ))}

      {selectedItem && (
        <div className="selected-info">
          Selected: {selectedItem.name} (ID: {selectedItem.id})
        </div>
      )}
    </div>
  );
};
```

---

### Example 8: Auto-refresh with Polling

```tsx
// components/LiveDataSelect.tsx
import React, { useEffect } from 'react';
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

export const LiveDataSelect: React.FC = () => {
  const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });

  // Refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing categories...');
      categories.load(true); // Force reload
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const data = categories.getData();
  const isLoading = categories.isLoading();

  return (
    <div>
      <select disabled={isLoading}>
        <option value="">Select category</option>
        {data?.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      {isLoading && <span className="spinner">🔄</span>}
    </div>
  );
};
```

---

## ⚡ Performance Optimization

### Example 9: Route-based Prefetching

```tsx
// pages/EmployeePage.tsx
import React from 'react';
import { useClassifierPrefetch, CLASSIFIER_KEYS } from '@/features/classifiers';
import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeList } from '../components/EmployeeList';

export const EmployeePage: React.FC = () => {
  // Prefetch classifiers when user navigates to this page
  useClassifierPrefetch([
    CLASSIFIER_KEYS.POSITIONS,
    CLASSIFIER_KEYS.DEPARTMENTS,
    CLASSIFIER_KEYS.EDUCATION_LEVELS,
    CLASSIFIER_KEYS.EMPLOYMENT_TYPES,
  ]);

  return (
    <div className="employee-page">
      <h1>Employee Management</h1>
      
      {/* Data is already loaded - instant render */}
      <EmployeeForm />
      <EmployeeList />
    </div>
  );
};
```

---

### Example 10: Lazy Component with Prefetch

```tsx
// App.tsx
import React, { lazy, Suspense } from 'react';
import { useClassifierPrefetch, CLASSIFIER_KEYS } from '@/features/classifiers';

const EmployeePage = lazy(() => import('./pages/EmployeePage'));

export const App: React.FC = () => {
  // Prefetch data before lazy component loads
  useClassifierPrefetch([
    CLASSIFIER_KEYS.POSITIONS,
    CLASSIFIER_KEYS.DEPARTMENTS,
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeePage />
    </Suspense>
  );
};
```

---

## 🛡️ Error Handling

### Example 11: Error Boundary

```tsx
// components/ClassifierErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ClassifierErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Classifier error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h3>Error loading classifiers</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage:**
```tsx
<ClassifierErrorBoundary>
  <CategorySelect />
</ClassifierErrorBoundary>
```

---

### Example 12: Retry with Exponential Backoff

```tsx
// hooks/useClassifierWithRetry.ts
import { useState, useEffect } from 'react';
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

export function useClassifierWithRetry(
  key: string,
  maxRetries: number = 3
) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const classifier = useClassifier(key);

  useEffect(() => {
    const loadWithRetry = async () => {
      for (let i = 0; i <= maxRetries; i++) {
        try {
          setIsRetrying(i > 0);
          await classifier.load();
          setRetryCount(i);
          return; // Success
        } catch (error) {
          if (i === maxRetries) {
            console.error(`Failed after ${maxRetries} retries:`, error);
            break;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, i) * 1000;
          console.log(`Retry ${i + 1}/${maxRetries} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      setIsRetrying(false);
    };

    loadWithRetry();
  }, [key, maxRetries]);

  return {
    data: classifier.getData(),
    isLoading: classifier.isLoading(),
    isRetrying,
    retryCount,
  };
}
```

---

## 🧪 Testing

### Example 13: Unit Test (Jest + React Testing Library)

```tsx
// __tests__/CategorySelect.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CategorySelect } from '../components/CategorySelect';
import { ClassifierProvider } from '@/features/classifiers';

// Mock API
jest.mock('@/features/classifiers/api/classifiersApi', () => ({
  classifiersApi: {
    fetchClassifier: jest.fn(() => Promise.resolve([
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ])),
  },
}));

describe('CategorySelect', () => {
  it('renders loading state initially', () => {
    render(
      <ClassifierProvider>
        <CategorySelect />
      </ClassifierProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders options after loading', async () => {
    render(
      <ClassifierProvider>
        <CategorySelect />
      </ClassifierProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('calls onChange when option selected', async () => {
    const handleChange = jest.fn();

    render(
      <ClassifierProvider>
        <CategorySelect onChange={handleChange} />
      </ClassifierProvider>
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '1' } });
    });

    expect(handleChange).toHaveBeenCalledWith('1');
  });
});
```

---

## 🎨 Styling Examples

### Example 14: Styled Components

```tsx
// components/StyledSelect.tsx
import styled from 'styled-components';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

export const StyledCategorySelect: React.FC = () => {
  const { data, isLoading } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );

  return (
    <SelectWrapper>
      <Select disabled={isLoading}>
        <option value="">Select category</option>
        {data?.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </Select>
      {isLoading && <LoadingSpinner>⏳</LoadingSpinner>}
    </SelectWrapper>
  );
};
```

---

## 🎯 Summary

These examples cover:

✅ Basic dropdowns  
✅ Form integration  
✅ Modal forms  
✅ Dependent selects  
✅ Searchable selects  
✅ Hierarchical data  
✅ Performance optimization  
✅ Error handling  
✅ Testing  
✅ Styling  

Mix and match patterns based on your needs!

---

**Need more examples?** Check the README.md for additional documentation.
