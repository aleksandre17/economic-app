# ⚡ Quick Reference Card

One-page cheat sheet for the Classifiers System.

---

## 🚀 Setup (3 Steps)

```tsx
// 1. Install
npm install zustand

// 2. Wrap App
import { ClassifierProvider } from '@/features/classifiers';

<ClassifierProvider>
  <App />
</ClassifierProvider>

// 3. Use
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';
```

---

## 📖 Hooks Quick Reference

### `useClassifier` - Zero Re-renders ⚡

```tsx
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });

// Methods
categories.getData()       // Get data (no re-render)
categories.isLoading()     // Check loading
categories.getError()      // Get error
categories.load()          // Load manually
categories.load(true)      // Force reload
categories.clear()         // Clear cache
```

**Use for:** Modals, forms, static dropdowns

---

### `useClassifierValue` - With Re-renders 🔄

```tsx
const { data, isLoading, isError, error } = useClassifierValue(
  CLASSIFIER_KEYS.CATEGORIES,
  { autoLoad: true }
);
```

**Use for:** Live-updating lists, reactive components

---

### `useClassifierPrefetch` - Prefetch on Mount 📥

```tsx
useClassifierPrefetch([
  CLASSIFIER_KEYS.POSITIONS,
  CLASSIFIER_KEYS.DEPARTMENTS,
]);
```

**Use for:** Route-based prefetching

---

## 💡 Common Patterns

### Simple Select

```tsx
const { data, isLoading } = useClassifierValue(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });

if (isLoading) return <select disabled><option>Loading...</option></select>;

return (
  <select>
    <option value="">Select</option>
    {data?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
  </select>
);
```

---

### Modal (No Re-renders)

```tsx
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });
const data = categories.getData(); // No subscription

return (
  <div className="modal">
    <select>
      {data?.map(item => <option key={item.id}>{item.name}</option>)}
    </select>
  </div>
);
```

---

### Dependent Dropdowns

```tsx
const [region, setRegion] = useState('');
const [cities, setCities] = useState([]);

const { data: regions } = useClassifierValue(CLASSIFIER_KEYS.REGIONS, { autoLoad: true });
const { data: allCities } = useClassifierValue(CLASSIFIER_KEYS.CITIES, { autoLoad: true });

useEffect(() => {
  if (region && allCities) {
    setCities(allCities.filter(city => city.parentId === region));
  }
}, [region, allCities]);
```

---

### React Hook Form

```tsx
const positions = useClassifier(CLASSIFIER_KEYS.POSITIONS, { autoLoad: true });
const { register } = useForm();

<select {...register('position')}>
  {positions.getData()?.map(item => <option key={item.id}>{item.name}</option>)}
</select>
```

---

## ⚙️ Configuration

### Define Classifiers

```typescript
// constants/classifierKeys.ts
export const CLASSIFIER_KEYS = {
  CATEGORIES: 'categories',
  POSITIONS: 'positions',
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

---

### Configure Prefetch

```tsx
<ClassifierProvider
  config={{
    immediate: ['categories', 'positions'], // Load now
    deferred: ['departments', 'regions'],   // Load after 2s
    deferredDelay: 2000,
  }}
>
  <App />
</ClassifierProvider>
```

---

## 🎯 When to Use What

| Scenario | Hook | Re-renders |
|----------|------|-----------|
| Modal | `useClassifier` | ❌ 0 |
| Form | `useClassifier` | ❌ 0 |
| Live list | `useClassifierValue` | ✅ 1 |
| Filter panel | `useClassifier` | ❌ 0 |
| Dependent select | `useClassifierValue` | ✅ 1-2 |

**Rule of thumb:** Use `useClassifier` by default (90% of cases)

---

## 🔧 Operations

### Manual Load

```tsx
await categories.load();        // Load
await categories.load(true);    // Force reload
```

---

### Clear Cache

```tsx
categories.clear();                        // Single classifier
useClassifierStore.getState().clearAll(); // All classifiers
```

---

### Check Status

```tsx
const data = categories.getData();
const loading = categories.isLoading();
const error = categories.getError();
```

---

### Store Access

```tsx
import { useClassifierStore } from '@/features/classifiers';

const store = useClassifierStore.getState();
store.loadClassifier('categories');
store.loadMultiple(['categories', 'positions']);
store.clearAll();
```

---

## 🐛 Troubleshooting

### Data not loading?

```tsx
// ✅ Add autoLoad
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });

// ✅ Or load manually
useEffect(() => {
  categories.load();
}, []);
```

---

### Stale data?

```tsx
// ✅ Force reload
categories.load(true);

// ✅ Bump version
version: '1.0.1' // in CLASSIFIER_CONFIGS
```

---

### Too many re-renders?

```tsx
// ❌ Wrong
const { data } = useClassifierValue(CLASSIFIER_KEYS.CATEGORIES);

// ✅ Correct
const categories = useClassifier(CLASSIFIER_KEYS.CATEGORIES, { autoLoad: true });
const data = categories.getData();
```

---

## 📊 Performance Tips

1. **Use `useClassifier` by default** (no re-renders)
2. **Prefetch on app start** (instant UX)
3. **Prefetch on route change** (data ready)
4. **Memoize filtered data** (avoid recalculation)
5. **Clear unused data** (free memory)

---

## 🎨 TypeScript

```typescript
import type { ClassifierItem } from '@/features/classifiers';

const data: ClassifierItem[] | null = categories.getData();

data?.forEach((item: ClassifierItem) => {
  console.log(item.id, item.name);
});
```

---

## 📝 Type Definition

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

---

## 🔍 Debugging

### Browser DevTools

```
Console → Should see:
🚀 ClassifierProvider: Starting prefetch
⚡ Loading immediate classifiers: categories, positions
🌐 Fetching classifier: categories
✅ Fetched classifier: categories (10 items)
💾 Saved classifier: categories

Application → Local Storage → Should see:
classifier:categories
classifier:positions
```

---

### Check Cache

```tsx
import { classifierCache, classifierStorage } from '@/features/classifiers';

console.log(classifierCache.getStats());
console.log(classifierStorage.getStorageInfo());
```

---

## 📦 API Response Format

```json
[
  {
    "id": 1,
    "name": "Category 1",
    "code": "CAT1",
    "parentId": null,
    "isActive": true
  }
]
```

**Required:** `id`, `name`  
**Optional:** `code`, `parentId`, `isActive`, `metadata`

---

## 🎯 TTL Recommendations

```typescript
{
  ttl: 30 * 24 * 60 * 60 * 1000, // 30 days - static (countries)
  ttl: 7 * 24 * 60 * 60 * 1000,  // 7 days - semi-static (categories)
  ttl: 1 * 24 * 60 * 60 * 1000,  // 1 day - dynamic (teams)
  ttl: 1 * 60 * 60 * 1000,       // 1 hour - very dynamic
}
```

---

## ⚡ Cache Flow

```
Request → Zustand Store → Memory Cache → LocalStorage → API
          (instant)       (<1ms)         (2-5ms)        (200ms)
```

---

## 🚀 Quick Start Checklist

- [ ] Install zustand
- [ ] Copy files to `src/features/classifiers/`
- [ ] Configure classifiers in `classifierKeys.ts`
- [ ] Set API base URL in `.env`
- [ ] Wrap app with `ClassifierProvider`
- [ ] Use in components
- [ ] Test in browser

---

## 📚 Documentation Files

- `README.md` - Full documentation
- `SETUP-GUIDE.md` - Step-by-step setup
- `EXAMPLES.md` - Code examples
- `SOURCE-CODE.md` - All source files
- `API-INTEGRATION.md` - Backend guide

---

## 💡 Pro Tips

1. Always use `CLASSIFIER_KEYS` constants (no typos)
2. Configure appropriate TTL based on data volatility
3. Use prefetching for better UX
4. Monitor cache size in production
5. Clear cache on version bump

---

## 🎯 Key Features

✅ 3-tier caching (Memory → LocalStorage → API)  
✅ Auto-prefetch on app start  
✅ Zero re-renders option  
✅ Request deduplication  
✅ TTL management  
✅ Version control  
✅ TypeScript support  
✅ 100% tested  

---

**Print this page for quick reference! 📄**
