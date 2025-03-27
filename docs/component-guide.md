# Component Guide

This document provides guidelines for creating and organizing components in the HabitHub application.

## Component Organization

Components are organized into three main categories:

### 1. UI Components (`src/components/ui/`)

UI components are the basic building blocks of the interface. They are:
- Reusable across multiple parts of the application
- Generally stateless (or contain minimal internal state)
- Focused on visual presentation rather than business logic

Examples:
- `Button.tsx`
- `Card.tsx`
- `Modal.tsx`
- `NotificationToast.tsx`
- `ConfirmationDialog.tsx`

### 2. Layout Components (`src/components/layout/`)

Layout components define the overall structure of pages and sections:
- Handle the arrangement of other components
- Define responsive behavior
- May include navigation elements

Examples:
- `Header.tsx`
- `Footer.tsx`
- `Sidebar.tsx`
- `PageContainer.tsx`

### 3. Form Components (`src/components/forms/`)

Form components handle user input:
- Include form validation logic
- Manage form state
- Handle form submission

Examples:
- `AddHabitForm.tsx`
- `EditHabitForm.tsx`
- `AuthForm.tsx`

### Other Components

Components that don't fit into the above categories remain in the root of the `components` directory:
- Domain-specific components like `HabitList.tsx`
- Complex, specialized components like `HabitAnalytics.tsx`
- Feature-specific components like `CalendarView.tsx`

## Component Naming Conventions

- Component files should use **PascalCase** (e.g., `ButtonGroup.tsx`)
- Component names should be descriptive and clear about their purpose
- Prefer more specific names over generic ones (e.g., `HabitCard` instead of just `Card`)

## Creating New Components

### Steps to Create a New Component

1. Identify which category the component belongs to
2. Create a new file in the appropriate directory
3. Use TypeScript for all components
4. Define props using interfaces
5. Include JSDoc comments to document the component and its props

### Component Template

```tsx
import React from 'react';

/**
 * Props for the ComponentName component
 */
interface ComponentNameProps {
  /** Description of propOne */
  propOne: string;
  /** Description of propTwo */
  propTwo?: number;
}

/**
 * Description of what the component does
 */
const ComponentName: React.FC<ComponentNameProps> = ({ propOne, propTwo = 0 }) => {
  return (
    <div className="component-class">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

## Component Best Practices

### Reusability

- Make components as reusable as possible
- Use props for configurable aspects of the component
- Avoid hardcoding values that might need to change

### Composition

- Prefer composition over inheritance
- Break complex components into smaller, focused components
- Use children props for flexible content

```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content goes here</CardBody>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

### State Management

- Keep state as close as possible to where it's used
- Use context for state that needs to be shared across multiple components
- Consider using custom hooks for complex state logic

### Performance

- Memoize expensive calculations using `useMemo`
- Memoize callback functions using `useCallback`
- Use React.memo for pure components that render often with the same props

### Accessibility

- Use semantic HTML elements (`button` instead of `div` for clickable elements)
- Include proper ARIA attributes when necessary
- Ensure keyboard navigation works correctly
- Maintain proper contrast ratios for text

### Testing

- Write tests for all components
- Test behavior, not implementation details
- Include tests for edge cases and error states

## Example Component Structure

```
src/
└── components/
    ├── ui/
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Modal.tsx
    │   └── NotificationToast.tsx
    ├── layout/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   └── Sidebar.tsx
    ├── forms/
    │   ├── AddHabitForm.tsx
    │   ├── EditHabitForm.tsx
    │   └── AuthForm.tsx
    ├── HabitList.tsx
    ├── HabitItem.tsx
    ├── CalendarView.tsx
    ├── StreakSummary.tsx
    └── HabitAnalytics.tsx
``` 