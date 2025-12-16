# 🚀 Setup Guide - Classifiers System

Complete step-by-step installation and configuration guide.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ React 18+
- ✅ TypeScript (recommended)
- ✅ Node.js 16+
- ✅ npm/yarn/pnpm

---

## 📦 Step 1: Install Dependencies

```bash
# Using npm
npm install zustand

# Using yarn
yarn add zustand

# Using pnpm
pnpm add zustand
```

---

## 📁 Step 2: Create File Structure

Create the following folder structure in your project:

```
src/
└── features/
    └── classifiers/
        ├── api/
        ├── storage/
        ├── cache/
        ├── store/
        ├── provider/
        ├── hooks/
        ├── types/
        ├── constants/
        └── index.ts
```

Commands:
```bash
cd src/features
mkdir -p classifiers/{api,storage,cache,store,provider,hooks,types,constants}
touch classifiers/index.ts
```

---

## 📝 Step 3: Copy Source Files

Copy the following files from the provided package:

### Types
```bash
# Copy to: src/features/classifiers/types/classifier.types.ts
```

### Constants
```bash
# Copy to: src/features/classifiers/constants/classifierKeys.ts
```

### API Layer
```bash
# Copy to: src/features/classifiers/api/apiClient.ts
# Copy to: src/features/classifiers/api/classifiersApi.ts
```

### Storage Layer
```bash
# Copy to: src/features/classifiers/storage/storageKeys.ts
# Copy to: src/features/classifiers/storage/classifiersStorage.ts
```

### Cache Layer
```bash
# Copy to: src/features/classifiers/cache/classifierCache.ts
```

### Store
```bash
# Copy to: src/features/classifiers/store/classifierStore.ts
```

### Provider
```bash
# Copy to: src/features/classifiers/provider/prefetchConfig.ts
# Copy to: src/features/classifiers/provider/ClassifierProvider.tsx
```

### Hooks
```bash
# Copy to: src/features/classifiers/hooks/useClassifier.ts
# Copy to: src/features/classifiers/hooks/useClassifierValue.ts
# Copy to: src/features/classifiers/hooks/useClassifierPrefetch.ts
```

### Public API
```bash
# Copy to: src/features/classifiers/index.ts
```

---

## ⚙️ Step 4: Configure Environment

Create or update your `.env` file:

```env
# .env
VITE_API_BASE_URL=https://api.yourapp.com
```

Or if using Create React App:
```env
# .env
REACT_APP_API_BASE_URL=https://api.yourapp.com
```

---

## 🔧 Step 5: Configure Your Classifiers

Edit `src/features/classifiers/constants/classifierKeys.ts`:

```typescript
export const CLASSIFIER_KEYS = {
  // Add your classifiers here
  CATEGORIES: 'categories',
  POSITIONS: 'positions',
  DEPARTMENTS: 'departments',
  EDUCATION_LEVELS: 'education_levels',
  EMPLOYMENT_TYPES: 'employment_types',
  REGIONS: 'regions',
  INDUSTRIES: 'industries',
} as const;

export const CLASSIFIER_CONFIGS = {
  [CLASSIFIER_KEYS.CATEGORIES]: {
    key: CLASSIFIER_KEYS.CATEGORIES,
    endpoint: '/api/classifiers/categories',
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    version: '1.0.0',
  },
  [CLASSIFIER_KEYS.POSITIONS]: {
    key: CLASSIFIER_KEYS.POSITIONS,
    endpoint: '/api/classifiers/positions',
    ttl: 24 * 60 * 60 * 1000,
    version: '1.0.0',
  },
  [CLASSIFIER_KEYS.DEPARTMENTS]: {
    key: CLASSIFIER_KEYS.DEPARTMENTS,
    endpoint: '/api/classifiers/departments',
    ttl: 12 * 60 * 60 * 1000, // 12 hours
    version: '1.0.0',
  },
  // Add more configurations...
};
```

---

## 🎨 Step 6: Wrap Your App

Update `src/App.tsx`:

```tsx
import React from 'react';
import { ClassifierProvider } from '@/features/classifiers';
import { MainApp } from './MainApp';

function App() {
  return (
    <ClassifierProvider
      config={{
        // Load critical data immediately
        immediate: ['categories', 'positions'],
        
        // Load non-critical data after 2 seconds
        deferred: ['departments', 'regions', 'industries'],
        
        deferredDelay: 2000,
        enabled: true,
      }}
    >
      <MainApp />
    </ClassifierProvider>
  );
}

export default App;
```

---

## ✅ Step 7: Verify Installation

Create a test component:

```tsx
// src/components/TestClassifier.tsx
import React from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

export const TestClassifier: React.FC = () => {
  const { data, isLoading, isError } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );

  console.log('Classifier data:', data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      <h3>Test Classifier</h3>
      <p>Loaded {data?.length || 0} items</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```

Add to your app:
```tsx
import { TestClassifier } from './components/TestClassifier';

function MainApp() {
  return (
    <div>
      <TestClassifier />
    </div>
  );
}
```

---

## 🔍 Step 8: Check Browser Console

Open DevTools and check:

1. **Console Logs:**
   ```
   🚀 ClassifierProvider: Starting prefetch
   ⚡ Loading immediate classifiers: categories, positions
   🌐 Fetching classifier: categories
   ✅ Fetched classifier: categories (10 items)
   💾 Saved classifier: categories
   ```

2. **Network Tab:**
   - Should see API calls to `/api/classifiers/*`
   - Only **one call per classifier** (deduplication working)

3. **Application Tab → Local Storage:**
   - Should see entries like `classifier:categories`

---

## 🎯 Step 9: Usage in Components

### Simple Select
```tsx
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

function CategorySelect() {
  const { data, isLoading } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );

  if (isLoading) return <select disabled><option>Loading...</option></select>;

  return (
    <select>
      <option value="">Select category</option>
      {data?.map(item => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  );
}
```

### Modal (No Re-renders)
```tsx
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

function AddEmployeeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });
  const data = categories.getData(); // No re-render

  return (
    <div className="modal">
      <select>
        {data?.map(item => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Issue 1: Module Not Found

```
Error: Cannot find module '@/features/classifiers'
```

**Solution:** Check TypeScript path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Or use relative import:
```tsx
import { useClassifier } from '../features/classifiers';
```

---

### Issue 2: API Calls Not Working

```
Network Error: Failed to fetch
```

**Solution:** Check:
1. API base URL in `.env`
2. CORS configuration on backend
3. Network tab for actual request URL
4. Backend endpoint returns correct data format

Expected API response format:
```json
[
  {
    "id": 1,
    "name": "Category 1",
    "code": "CAT1"
  },
  {
    "id": 2,
    "name": "Category 2",
    "code": "CAT2"
  }
]
```

---

### Issue 3: Data Not Showing

```
Select is empty, no errors in console
```

**Solution:**
1. Add `autoLoad: true` option
2. Check browser DevTools → Application → Local Storage
3. Clear cache and reload:
   ```tsx
   const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES);
   categories.clear(); // Clear cache
   categories.load();  // Reload
   ```

---

### Issue 4: TypeScript Errors

```
Property 'name' does not exist on type 'ClassifierItem'
```

**Solution:** Check that `ClassifierItem` type matches your API response:

```typescript
// If your API returns different fields, update the type:
export interface ClassifierItem {
  id: string | number;
  name: string; // Or 'title', 'label', etc.
  code?: string;
  // Add custom fields
  customField?: string;
}
```

Or use transformer:
```typescript
{
  [CLASSIFIER_KEYS.CATEGORIES]: {
    endpoint: '/api/classifiers/categories',
    transform: (data) => {
      return data.map(item => ({
        id: item.id,
        name: item.title, // Map 'title' to 'name'
        code: item.code,
      }));
    },
  },
}
```

---

## 🎓 Next Steps

1. ✅ Read [README.md](./README.md) for full documentation
2. ✅ Check [EXAMPLES.md](./EXAMPLES.md) for more use cases
3. ✅ Explore DevTools to see caching in action
4. ✅ Implement in your components
5. ✅ Monitor performance in production

---

## 📞 Support

If you encounter issues:

1. Check troubleshooting section above
2. Review browser console logs
3. Verify API responses
4. Check network tab
5. Review code examples

---

## 🎉 Success!

You've successfully set up the Classifiers System! Your app now has:

- ✅ Automatic caching
- ✅ Auto-prefetching
- ✅ Zero unnecessary re-renders
- ✅ Request deduplication
- ✅ Persistent storage

Enjoy building! 🚀
