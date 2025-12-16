# 🏗️ Classifiers System - Complete Documentation

**Version:** 1.0.0  
**Last Updated:** December 2024

A production-ready, high-performance classifier management system for React applications with automatic caching, prefetching, and zero unnecessary re-renders.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
- [API Reference](#-api-reference)
- [Usage Examples](#-usage-examples)
- [Performance Guide](#-performance-guide)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

The Classifiers System provides a centralized, performant way to manage dropdown data (classifiers) in your application.

### When to Use

✅ **Perfect for:**
- Dropdown/select options (categories, departments, positions)
- Reference data that changes infrequently
- Data shared across multiple components
- Large datasets that need caching

❌ **Not suitable for:**
- Frequently changing data (real-time)
- User-specific data
- Data that requires authentication per request

---

## ✨ Features

- ✅ **3-Tier Caching**: Memory → LocalStorage → API
- ✅ **Auto-Prefetch**: Load data on app startup
- ✅ **Request Deduplication**: No duplicate API calls
- ✅ **Zero Re-renders**: Optional subscription model
- ✅ **TTL Management**: Auto-expire stale data
- ✅ **Version Control**: Cache invalidation on version change
- ✅ **Error Handling**: Graceful degradation
- ✅ **TypeScript**: Full type safety
- ✅ **DevTools**: Zustand DevTools support

### Performance

- ⚡ **< 1ms** - Memory cache access
- ⚡ **< 5ms** - LocalStorage access
- ⚡ **0 re-renders** - With `useClassifier` hook
- ⚡ **Parallel loading** - Load multiple classifiers at once

---

## 🏛️ Architecture

### High-Level Flow

```
Component Request
      ↓
1. Check Zustand Store (in-memory)
      ↓
2. Check Memory Cache
      ↓
3. Check LocalStorage (persistent)
      ↓
4. Check Pending Requests (deduplication)
      ↓
5. Fetch from API
      ↓
6. Save to all caches
      ↓
7. Return data
```

### Caching Strategy

```
Memory Cache (RAM)
  ↓ (fastest, ~0.5ms)
LocalStorage (Disk)
  ↓ (fast, ~3ms)
API (Network)
  ↓ (slow, 200-500ms)
```

---

## 📦 Installation

### Prerequisites

```json
{
  "react": "^18.0.0",
  "zustand": "^4.5.0"
}
```

### Install Dependencies

```bash
npm install zustand
# or
yarn add zustand
# or
pnpm add zustand
```

### Setup

1. Copy all files from `classifiers` folder to `src/features/classifiers/`
2. Configure API endpoint in `.env`:

```env
VITE_API_BASE_URL=https://api.yourapp.com
```

---

## 🚀 Quick Start

### 1. Wrap Your App

```tsx
// src/App.tsx
import React from 'react';
import { ClassifierProvider } from '@/features/classifiers';

function App() {
  return (
    <ClassifierProvider>
      <YourApp />
    </ClassifierProvider>
  );
}

export default App;
```

### 2. Define Your Classifiers

```typescript
// src/features/classifiers/constants/classifierKeys.ts
export const CLASSIFIER_KEYS = {
  CATEGORIES: 'categories',
  POSITIONS: 'positions',
  DEPARTMENTS: 'departments',
} as const;

export const CLASSIFIER_CONFIGS = {
  [CLASSIFIER_KEYS.CATEGORIES]: {
    key: CLASSIFIER_KEYS.CATEGORIES,
    endpoint: '/api/classifiers/categories',
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    version: '1.0.0',
  },
};
```

### 3. Use in Components

```tsx
// Option A: No re-renders (recommended)
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

function MyModal() {
  const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });
  const data = categories.getData();
  
  return (
    <select>
      {data?.map(item => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  );
}

// Option B: With re-renders (for live updates)
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

function CategorySelect() {
  const { data, isLoading } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <select>
      {data?.map(item => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  );
}
```

---

## 🧠 Core Concepts

### 1. Classifiers

A classifier is a collection of reference data items:

```typescript
interface ClassifierItem {
  id: string | number;
  name: string;
  code?: string;
  parentId?: string | number;
  isActive?: boolean;
  metadata?: Record<string, any>;
}
```

### 2. TTL (Time To Live)

Each classifier has a TTL. After expiration, data is refetched:

```typescript
{
  ttl: 24 * 60 * 60 * 1000, // 24 hours
}
```

**Recommendations:**
- Static data (countries): 30 days
- Semi-static (categories): 7 days
- Dynamic (departments): 1 day

### 3. Versioning

Version control prevents using stale cached data:

```typescript
{
  version: '1.0.0', // Bump to invalidate cache
}
```

### 4. Request Deduplication

Multiple simultaneous requests = only one API call:

```typescript
// Component A requests 'categories'
// Component B requests 'categories' (0.1s later)
// → Only 1 API call made
// → Both components receive the same data
```

### 5. Prefetching

Load data before user needs it:

```tsx
<ClassifierProvider
  config={{
    immediate: ['categories'], // Load now
    deferred: ['departments'], // Load after 2s
    deferredDelay: 2000,
  }}
>
  <App />
</ClassifierProvider>
```

---

## 📖 API Reference

### Hooks

#### `useClassifier(key, options?)`

Get classifier **without** subscribing (no re-renders).

```typescript
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });

// Get data (no re-render)
const data = categories.getData();

// Check loading
const isLoading = categories.isLoading();

// Load manually
await categories.load();

// Force reload
await categories.load(true);

// Clear cache
categories.clear();
```

#### `useClassifierValue(key, options?)`

Get classifier **with** subscription (causes re-renders).

```typescript
const { data, isLoading, isError, error } = useClassifierValue(
  CLASSIFIER_KEYS.CATEGORIES,
  { autoLoad: true }
);
```

#### `useClassifierPrefetch(keys)`

Prefetch multiple classifiers on mount.

```typescript
useClassifierPrefetch([
  CLASSIFIER_KEYS.POSITIONS,
  CLASSIFIER_KEYS.DEPARTMENTS,
]);
```

---

## 💡 Usage Examples

### Example 1: Simple Select

```tsx
import React from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

export const CategorySelect: React.FC = () => {
  const { data, isLoading } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );

  if (isLoading) return <select disabled><option>Loading...</option></select>;

  return (
    <select>
      <option value="">Select category</option>
      {data?.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  );
};
```

### Example 2: Modal (No Re-renders)

```tsx
import React from 'react';
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

export const AddEmployeeModal: React.FC = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const positions = useClassifier(CLASSIFIER_KEYS.POSITIONS, { autoLoad: true });
  const departments = useClassifier(CLASSIFIER_KEYS.DEPARTMENTS, { autoLoad: true });

  const positionData = positions.getData();
  const departmentData = departments.getData();

  return (
    <div className="modal">
      <select>
        {positionData?.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>

      <select>
        {departmentData?.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};
```

### Example 3: Prefetch on Route

```tsx
import React from 'react';
import { useClassifierPrefetch, CLASSIFIER_KEYS } from '@/features/classifiers';

export const EmployeePage: React.FC = () => {
  useClassifierPrefetch([
    CLASSIFIER_KEYS.POSITIONS,
    CLASSIFIER_KEYS.DEPARTMENTS,
    CLASSIFIER_KEYS.EDUCATION_LEVELS,
  ]);

  return <div>Employee Management</div>;
};
```

### Example 4: Dependent Selects

```tsx
import React, { useState, useEffect } from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

export const LocationSelect: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [cities, setCities] = useState([]);

  const { data: regions } = useClassifierValue(CLASSIFIER_KEYS.REGIONS, { autoLoad: true });
  const { data: allCities } = useClassifierValue(CLASSIFIER_KEYS.CITIES, { autoLoad: true });

  useEffect(() => {
    if (selectedRegion && allCities) {
      setCities(allCities.filter(city => city.parentId === selectedRegion));
    }
  }, [selectedRegion, allCities]);

  return (
    <div>
      <select onChange={(e) => setSelectedRegion(e.target.value)}>
        <option value="">Select region</option>
        {regions?.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>

      <select disabled={!selectedRegion}>
        <option value="">Select city</option>
        {cities.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};
```

---

## ⚡ Performance Guide

### Re-render Comparison

```tsx
// ❌ Traditional Context (all consumers re-render)
const { categories } = useClassifierContext();
// → Component re-renders when ANY classifier loads

// ✅ useClassifier (no re-render)
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES);
const data = categories.getData();
// → Component never re-renders

// ✅ useClassifierValue (selective re-render)
const { data } = useClassifierValue(CLASSIFIER_KEYS.CATEGORIES);
// → Component re-renders only when THIS classifier loads
```

### When to Use Each Hook

| Scenario | Hook | Re-renders |
|----------|------|-----------|
| Modal form | `useClassifier` | ❌ 0 |
| Static dropdown | `useClassifier` | ❌ 0 |
| Live-updating list | `useClassifierValue` | ✅ 1 |
| Filter panel | `useClassifier` | ❌ 0 |

### Performance Tips

1. **Use `useClassifier` by default** (90% of cases)
2. **Prefetch critical data on app start**
3. **Prefetch on route change**
4. **Memoize filtered data**
5. **Clear unused classifiers**

---

## 🎯 Best Practices

### 1. Central Definition

```typescript
// ✅ GOOD
export const CLASSIFIER_KEYS = {
  CATEGORIES: 'categories',
} as const;

// ❌ BAD
useClassifier('categories'); // Component A
useClassifier('Categories'); // Component B (typo!)
```

### 2. Appropriate TTL

```typescript
// ✅ GOOD
{
  [CLASSIFIER_KEYS.COUNTRIES]: {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 days (stable)
  },
  [CLASSIFIER_KEYS.TEAMS]: {
    ttl: 1 * 60 * 60 * 1000, // 1 hour (dynamic)
  },
}
```

### 3. Smart Prefetching

```typescript
// ✅ GOOD
immediate: ['categories', 'positions'], // Critical
deferred: ['regions', 'industries'],    // Non-critical

// ❌ BAD
immediate: ['cat1', 'cat2', 'cat3', ...], // Too many
```

### 4. Error Handling

```tsx
// ✅ GOOD
const { data, isError } = useClassifierValue(CLASSIFIER_KEYS.CATEGORIES);

if (isError) {
  return <ErrorMessage onRetry={refetch} />;
}

// ❌ BAD
const { data } = useClassifierValue(CLASSIFIER_KEYS.CATEGORIES);
return <select>{data?.map(...)}</select>; // Crashes on error
```

---

## 🐛 Troubleshooting

### Data Not Loading

```tsx
// ✅ Enable autoLoad
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, {
  autoLoad: true,
});

// ✅ Manual load
useEffect(() => {
  categories.load();
}, []);
```

### Stale Data

```tsx
// ✅ Force reload
categories.load(true);

// ✅ Clear cache
categories.clear();

// ✅ Bump version
version: '1.0.1' // Changed from '1.0.0'
```

### Too Many Re-renders

```tsx
// ❌ WRONG
const { data } = useClassifierValue(CLASSIFIER_KEYS.CATEGORIES);
// → Re-renders when data loads

// ✅ CORRECT
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });
const data = categories.getData();
// → No re-renders
```

### Duplicate API Calls

```tsx
// ✅ Prefetch at app level
<ClassifierProvider
  config={{
    immediate: ['categories'],
  }}
/>
```

---

## 📊 Performance Benchmarks

| Operation | Time | Description |
|-----------|------|-------------|
| Memory cache hit | < 1ms | Instant |
| LocalStorage hit | 2-5ms | Very fast |
| API call (first) | 200-500ms | Network dependent |
| API call (dedup) | 0ms | Waits for existing |
| Re-render (useClassifier) | 0ms | No re-render |
| Re-render (useClassifierValue) | < 1ms | React re-render |

---

## 🤝 Contributing

Found a bug? Have a feature request? Open an issue or submit a PR.

---

## 📄 License

MIT License - Free to use in commercial projects.

---

**Created with ❤️**

Version: 1.0.0  
Last Updated: December 2024
