# 🚀 Quick Start Guide

Get started with Checkbox Components in 5 minutes!

## 📦 Step 1: Install

```bash
npm install react-hook-form zod @hookform/resolvers/zod
```

## 📁 Step 2: Copy Files

Copy these folders to your project:
- `components/` → `src/shared/components/ui/Checkbox/`
- `hooks/` → `src/hooks/`

## 🎨 Step 3: Setup CSS Variables

Add to your global CSS file:

```css
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --color-primary: #2563eb;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --bg-secondary: #f9fafb;
    --border-primary: #e5e7eb;
    --radius-md: 6px;
    --font-semibold: 600;
}
```

## ✅ Step 4: Use in Your Form

```typescript
import { useForm } from 'react-hook-form';
import { FormCheckbox } from '@/shared/components/ui/Checkbox';

function MyForm() {
    const { control, handleSubmit } = useForm();

    return (
        <form onSubmit={handleSubmit(console.log)}>
            <FormCheckbox
                name="acceptTerms"
                control={control}
                label="Accept terms and conditions"
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

## 🎯 Common Patterns

### Single Checkbox
```typescript
<FormCheckbox
    name="newsletter"
    control={control}
    label="Subscribe to newsletter"
    helperText="Monthly updates"
/>
```

### Grouped Checkboxes
```typescript
<CheckboxGroup title="Notifications">
    <FormCheckbox name="email" control={control} label="Email" />
    <FormCheckbox name="sms" control={control} label="SMS" />
</CheckboxGroup>
```

### Dynamic from Data
```typescript
const items = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
];

<FormCheckboxGroup
    control={control}
    name=""
    items={items}
    title="Select Options"
/>
```

### With Validation
```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    terms: z.boolean().refine(v => v === true, {
        message: 'Required',
    }),
});

const { control } = useForm({
    resolver: zodResolver(schema),
});

<FormCheckbox
    name="terms"
    control={control}
    label="Accept terms"
    required
/>
```

## 🎉 That's it!

You're ready to use professional checkboxes in your forms.

**Next steps:**
- See [EXAMPLES.md](./EXAMPLES.md) for more patterns
- Check [API.md](./API.md) for complete reference
- Read [BEST_PRACTICES.md](./BEST_PRACTICES.md) for tips
