# 📦 Checkbox Components Library

Professional checkbox component library for React with React Hook Form integration, auto-sync capabilities, and full TypeScript support.

## ✨ Features

- ✅ **Native HTML checkbox** with custom styling
- ✅ **React Hook Form integration** - Seamless form handling
- ✅ **Automatic state synchronization** - No manual sync needed
- ✅ **Full TypeScript support** - Type-safe components
- ✅ **Responsive design** - Mobile-first, touch-friendly
- ✅ **Accessible** - WCAG 2.1 AA compliant
- ✅ **Group management** - Organize related checkboxes
- ✅ **Dynamic rendering** - Generate from data arrays

## 📦 Installation

### 1. Copy Files

Copy the following folders to your project:
```
src/shared/components/ui/Checkbox/  (from ./components/)
src/hooks/                          (from ./hooks/)
```

### 2. Install Dependencies

```bash
npm install react-hook-form zod @hookform/resolvers/zod
```

### 3. Setup CSS Variables

Add these variables to your global CSS:

```css
:root {
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;

    /* Text sizes */
    --text-sm: 14px;
    --text-base: 16px;
    --text-lg: 18px;

    /* Font weights */
    --font-semibold: 600;
    --font-bold: 700;

    /* Colors */
    --color-primary: #2563eb;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --bg-secondary: #f9fafb;
    --border-primary: #e5e7eb;

    /* Radius */
    --radius-md: 6px;
    --radius-lg: 8px;
}
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { FormCheckbox } from '@/shared/components/ui/Checkbox';
import { useForm } from 'react-hook-form';

function App() {
    const { control } = useForm();
    
    return (
        <FormCheckbox
            name="acceptTerms"
            control={control}
            label="Accept terms and conditions"
        />
    );
}
```

### Grouped Checkboxes

```typescript
import { CheckboxGroup, FormCheckbox } from '@/shared/components/ui/Checkbox';

function NotificationSettings() {
    const { control } = useForm();

    return (
        <CheckboxGroup
            title="Notification Preferences"
            description="Choose how you want to be notified"
        >
            <FormCheckbox
                name="emailNotif"
                control={control}
                label="Email notifications"
            />
            <FormCheckbox
                name="smsNotif"
                control={control}
                label="SMS notifications"
            />
        </CheckboxGroup>
    );
}
```

### Dynamic Items

```typescript
import { FormCheckboxGroup } from '@/shared/components/ui/Checkbox';

function FeatureSelection() {
    const { control } = useForm();

    const features = [
        { value: 'analytics', label: 'Advanced Analytics' },
        { value: 'api', label: 'API Access' },
    ];

    return (
        <FormCheckboxGroup
            control={control}
            name=""
            items={features}
            title="Select Features"
        />
    );
}
```

## 📚 Components

| Component | Description | Use Case |
|-----------|-------------|----------|
| **Checkbox** | Base standalone checkbox | Custom forms, non-RHF scenarios |
| **FormCheckbox** | React Hook Form integrated | Standard forms with validation |
| **CheckboxGroup** | Visual grouping container | Organizing related checkboxes |
| **FormCheckboxGroup** | Dynamic checkbox generation | Generate from data arrays |
| **FormCheckboxArray** | Array field support | Multiple selection lists |
| **SearchableCheckboxGroup** | With search functionality | Large lists (10+ items) |

## 📖 Documentation

- [API Reference](./docs/API.md) - Complete API documentation
- [Examples](./docs/EXAMPLES.md) - Usage examples and patterns
- [Best Practices](./docs/BEST_PRACTICES.md) - Guidelines and tips

## 🎯 Key Features

### Auto-Sync with Context

```typescript
// Automatically syncs with survey context
<FormCheckbox
    name="planOneYearGrowth"
    control={control}
    label="1 year growth plan"
/>
// No manual onChange needed - automatically updates context!
```

### Type-Safe

```typescript
interface FormData {
    newsletter: boolean;
    terms: boolean;
}

// ✅ Type-safe - autocomplete works
<FormCheckbox<FormData>
    name="newsletter"  // ✅ Autocomplete
    control={control}
/>

// ❌ TypeScript error
<FormCheckbox<FormData>
    name="nonExistent"  // ❌ Error
    control={control}
/>
```

### Validation

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    acceptTerms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms',
    }),
});

const { control } = useForm({
    resolver: zodResolver(schema),
});

<FormCheckbox
    name="acceptTerms"
    control={control}
    label="Accept terms"
    required
/>
// Error automatically displayed!
```

## 🎨 Customization

### Override Styles

```css
/* Custom checkbox styling */
.customCheckbox .checkboxSection {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 2px solid #667eea;
    padding: 20px;
}

.customCheckbox .labelText {
    color: white;
    font-weight: 600;
}
```

```typescript
<Checkbox
    className="customCheckbox"
    label="Custom styled checkbox"
/>
```

### Theme Support

```css
/* Dark mode */
[data-theme="dark"] {
    --color-primary: #3b82f6;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --bg-secondary: #111827;
    --border-primary: #374151;
}
```

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Touch-friendly (44px minimum targets)
- ✅ Fluid typography with `clamp()`
- ✅ Responsive spacing
- ✅ Works on all screen sizes

## ♿ Accessibility

- ✅ Keyboard navigation (Space, Tab)
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ ARIA attributes
- ✅ Touch-friendly targets
- ✅ Error announcements

## 🔧 Troubleshooting

### Checkbox not checking
**Solution:** Use controlled component properly
```typescript
// ✅ Correct
<Checkbox checked={value} onChange={setValue} />

// ❌ Wrong
<Checkbox checked={value} defaultChecked={true} />
```

### State not persisting
**Solution:** Ensure context sync or use useSyncedForm hook

### TypeScript errors
**Solution:** Ensure correct field name type
```typescript
<FormCheckbox<FormData>
    name="fieldName"  // Must match FormData keys
    control={control}
/>
```

## 📝 License

MIT

## 🤝 Support

For detailed documentation, examples, and best practices, see the `docs/` folder.

## 🎉 Version

**v1.0.0** - Initial Release

---

**Made with ❤️ for professional React applications**
