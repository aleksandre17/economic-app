# 📦 Installation Guide

Complete installation instructions for Checkbox Components.

## Prerequisites

- React 18+
- TypeScript 4.9+
- React Hook Form 7+

## Installation Steps

### 1. Install Dependencies

```bash
npm install react-hook-form zod @hookform/resolvers/zod
```

Or with yarn:
```bash
yarn add react-hook-form zod @hookform/resolvers/zod
```

Or with pnpm:
```bash
pnpm add react-hook-form zod @hookform/resolvers/zod
```

### 2. Copy Component Files

Copy the `components` folder to your project:

```
your-project/
├── src/
│   └── shared/
│       └── components/
│           └── ui/
│               └── Checkbox/          ← Copy here
│                   ├── Checkbox.tsx
│                   ├── Checkbox.module.css
│                   ├── FormCheckbox.tsx
│                   ├── CheckboxGroup.tsx
│                   ├── CheckboxGroup.module.css
│                   ├── FormCheckboxGroup.tsx
│                   └── index.ts
```

### 3. Copy Hooks (Optional)

If you want to use the `useCheckboxItems` helper:

```
your-project/
├── src/
│   └── hooks/
│       └── useCheckboxItems.ts        ← Copy here
```

### 4. Setup CSS Variables

Add these CSS custom properties to your global stylesheet (e.g., `globals.css` or `index.css`):

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

    /* Border radius */
    --radius-md: 6px;
    --radius-lg: 8px;
}
```

**Note:** Adjust these values to match your design system!

### 5. Import and Use

```typescript
import { FormCheckbox } from '@/shared/components/ui/Checkbox';
// or
import { FormCheckbox } from './shared/components/ui/Checkbox';
```

## Verification

Create a test component to verify installation:

```typescript
// test/CheckboxTest.tsx
import { useForm } from 'react-hook-form';
import { FormCheckbox } from '@/shared/components/ui/Checkbox';

export function CheckboxTest() {
    const { control } = useForm();
    
    return (
        <FormCheckbox
            name="test"
            control={control}
            label="Test checkbox"
        />
    );
}
```

If you see a checkbox with proper styling, installation is complete! ✅

## Troubleshooting

### CSS Variables Not Working

**Problem:** Checkboxes have no styling or wrong colors

**Solution:** Ensure CSS variables are defined in your global stylesheet and that it's imported in your app entry point:

```typescript
// main.tsx or index.tsx
import './globals.css'; // or './index.css'
```

### Module Not Found

**Problem:** `Cannot find module '@/shared/components/ui/Checkbox'`

**Solution:** Check your TypeScript path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Type Errors

**Problem:** TypeScript errors about `Control` or `Path` types

**Solution:** Ensure you're using React Hook Form v7+:

```bash
npm list react-hook-form
```

If version is < 7, upgrade:
```bash
npm install react-hook-form@latest
```

## Next Steps

- Read [QUICKSTART.md](./docs/QUICKSTART.md) for usage examples
- Check [docs/EXAMPLES.md](./docs/EXAMPLES.md) for patterns
- See [docs/API.md](./docs/API.md) for complete reference

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the examples folder
3. Ensure all dependencies are installed
4. Verify CSS variables are defined

---

**Installation complete! Start building forms with professional checkboxes! 🎉**
