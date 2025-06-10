# shadcn/ui Migration Guide

## Overview
This document outlines the migration from custom components to shadcn/ui components in the garage management UI project.

## Components Migrated

### ✅ Completed Migrations

#### 1. **Badge** (`src/components/ui/badge.tsx`)
- **Old**: `src/components/common/Badge.tsx`
- **New**: shadcn/ui Badge with custom variants
- **Changes**: 
  - Added custom variants: `success`, `warning`, `info`
  - Maintained icon support
  - Uses `class-variance-authority` for styling

#### 2. **Button** (`src/components/ui/button.tsx`)
- **Old**: `src/components/common/Button.tsx`
- **New**: shadcn/ui Button with custom variants
- **Changes**:
  - Added custom variants: `primary`, `danger`, `success`, `warning`
  - Maintained `isLoading`, `icon`, `fullWidth` props
  - Uses Radix UI Slot for composition

#### 3. **Card** (`src/components/ui/card.tsx`)
- **Old**: `src/components/common/Card.tsx`
- **New**: shadcn/ui Card with composition pattern
- **Changes**:
  - Split into `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`
  - More flexible composition-based API

#### 4. **Input** (`src/components/ui/input.tsx`)
- **Old**: `src/components/common/Input.tsx`
- **New**: shadcn/ui Input with enhanced features
- **Changes**:
  - Maintained `leftIcon`, `rightIcon`, `onRightIconClick` props
  - Added proper accessibility attributes
  - Enhanced styling with shadcn/ui design tokens

#### 5. **Select** (`src/components/ui/select.tsx`)
- **Old**: `src/components/common/Select.tsx`
- **New**: shadcn/ui Select with Radix UI primitives
- **Changes**:
  - Uses Radix UI Select primitives
  - Better accessibility and keyboard navigation
  - Composition-based API with `SelectTrigger`, `SelectContent`, `SelectItem`

#### 6. **Dialog** (`src/components/ui/dialog.tsx`)
- **Old**: `src/components/common/Modal.tsx`
- **New**: shadcn/ui Dialog with Radix UI primitives
- **Changes**:
  - Uses Radix UI Dialog primitives
  - Better accessibility and focus management
  - Composition-based API

#### 7. **Tabs** (`src/components/ui/tabs.tsx`)
- **Old**: `src/components/common/Tabs.tsx`
- **New**: shadcn/ui Tabs with Radix UI primitives
- **Changes**:
  - Uses Radix UI Tabs primitives
  - Better accessibility and keyboard navigation
  - Simplified API

#### 8. **Toast** (`src/components/ui/toast.tsx`)
- **Old**: `src/components/common/Notification.tsx`
- **New**: shadcn/ui Toast with Radix UI primitives
- **Changes**:
  - Uses Radix UI Toast primitives
  - Better accessibility and animations
  - Custom variants for different notification types

#### 9. **Table** (`src/components/ui/table.tsx`)
- **Old**: `src/components/common/Table.tsx`
- **New**: shadcn/ui Table with composition pattern
- **Changes**:
  - Split into `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
  - More flexible composition-based API
  - Better accessibility

#### 10. **Calendar** (`src/components/ui/calendar.tsx`)
- **Old**: `src/components/common/Calendar.tsx`
- **New**: Custom Calendar using shadcn/ui patterns
- **Changes**:
  - Maintained existing functionality
  - Uses shadcn/ui Button components for navigation
  - Enhanced styling with design tokens

### 🔄 Components to Keep (No Migration Needed)

#### 1. **ErrorBoundary** (`src/components/common/ErrorBoundary.tsx`)
- **Reason**: React pattern, not a UI component
- **Status**: Keep as-is

#### 2. **FeatureGate** (`src/components/common/FeatureGate.tsx`)
- **Reason**: Business logic component, not a UI component
- **Status**: Keep as-is

#### 3. **AutoFocusInput** (`src/components/common/AutoFocusInput.tsx`)
- **Reason**: Simple wrapper component
- **Status**: Keep as-is

#### 4. **Spinner** (`src/components/common/Spinner.tsx`)
- **Reason**: Simple loading component, works well as-is
- **Status**: Keep as-is (or optionally migrate to shadcn/ui Loader)

## Dependencies Added

```json
{
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "react-day-picker": "^8.10.0"
}
```

## Utility Functions

### `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Migration Steps for Existing Code

### 1. Update Imports
Replace old component imports with new shadcn/ui components:

```typescript
// Old
import Button from '../common/Button'
import Input from '../common/Input'

// New
import { Button } from '../ui/button'
import { Input } from '../ui/input'
```

### 2. Update Component Usage

#### Badge
```typescript
// Old
<Badge variant="primary" label="Status" />

// New
<Badge variant="default">Status</Badge>
```

#### Button
```typescript
// Old
<Button variant="primary" isLoading={true}>Submit</Button>

// New
<Button variant="primary" isLoading={true}>Submit</Button>
// API remains the same!
```

#### Card
```typescript
// Old
<Card title="Title" subtitle="Subtitle">
  Content
</Card>

// New
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

#### Select
```typescript
// Old
<Select options={options} onChange={handleChange} />

// New
<Select onValueChange={handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    {options.map(option => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### Modal/Dialog
```typescript
// Old
<Modal isOpen={isOpen} onClose={onClose} title="Title">
  Content
</Modal>

// New
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content
  </DialogContent>
</Dialog>
```

## Benefits of Migration

1. **Better Accessibility**: All shadcn/ui components are built on Radix UI primitives with excellent accessibility
2. **Consistent Design**: Unified design system with consistent spacing, colors, and typography
3. **Type Safety**: Better TypeScript support with proper type definitions
4. **Maintainability**: Easier to maintain and update with a standardized component library
5. **Performance**: Optimized components with proper React patterns
6. **Customization**: Easy to customize while maintaining consistency

## Next Steps

1. **Update existing component usage** throughout the codebase
2. **Add CSS variables** for design tokens in `index.css`
3. **Test all components** to ensure functionality is preserved
4. **Update documentation** for new component APIs
5. **Consider migrating Spinner** to shadcn/ui Loader if needed

## Notes

- All new components maintain backward compatibility where possible
- Custom variants have been added to match existing design requirements
- The migration is gradual - old components can coexist with new ones during transition
- Performance impact is minimal as shadcn/ui components are lightweight 