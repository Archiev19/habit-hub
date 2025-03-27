# Project Structure

This document outlines the organization of the HabitHub project codebase.

## Directory Structure

```
/
├── docs/                  # Documentation
│   ├── component-guide.md # Guidelines for creating components
│   ├── firebase-setup.md  # Firebase setup instructions
│   └── project-structure.md # This document
├── public/                # Static files
├── src/                   # Source code
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # UI components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Reusable UI components
│   ├── config/            # Configuration files
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API & utility services
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   ├── env.d.ts           # Environment variable types
│   └── main.tsx           # Entry point
├── .env.local             # Local environment variables
├── .env.production        # Production environment variables
├── index.html             # HTML entry point
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # Node-specific TypeScript configuration
├── vite.config.ts         # Vite configuration
└── firebase.json          # Firebase configuration
```

## Key Files and Directories

### Entry Points

- `index.html`: The HTML template
- `src/main.tsx`: The JavaScript entry point that renders the React app
- `src/App.tsx`: The main React component that sets up routes and providers

### Components

Components are organized into categories:

- `src/components/ui/`: Reusable UI components (buttons, cards, modals)
- `src/components/layout/`: Page layout components (header, sidebar)
- `src/components/forms/`: Form components (login form, habit form)
- Other specialized components remain in the root `components` directory

See `docs/component-guide.md` for more details on component organization.

### Pages

- `src/pages/`: Contains page-level components that are rendered by routes
  - Each page has its own directory or file
  - Pages may include page-specific components not meant for reuse

### Context

- `src/context/`: React context providers for global state management
  - `AuthContext.tsx`: Authentication state
  - `NotificationContext.tsx`: Global notifications
  - `ThemeContext.tsx`: Theme preferences

### Hooks

- `src/hooks/`: Custom React hooks
  - `useAuth.ts`: Authentication utilities
  - `useHabits.ts`: Habit data and operations
  - `useLocalStorage.ts`: Local storage utilities

### Services

- `src/services/`: API interactions and external services
  - `api.ts`: Core API client
  - `auth-service.ts`: Authentication service
  - `habit-service.ts`: Habit-related API calls
  - `firebase-service.ts`: Firebase interactions

### Types

- `src/types/`: TypeScript type definitions
  - `habit.ts`: Habit-related types
  - `user.ts`: User-related types
  - Other domain-specific types

### Utilities

- `src/utils/`: Utility functions
  - `date-utils.ts`: Date manipulation functions
  - `validation.ts`: Form validation utilities
  - Other helper functions

### Configuration

- `src/config/`: Configuration files
  - `firebase-config.ts`: Firebase configuration
  - `routes.ts`: Route definitions
  - `constants.ts`: Application constants

## Import Conventions

We use path aliases to simplify imports:

```tsx
// Instead of relative imports like:
import Button from '../../../components/ui/Button';

// Use alias imports:
import Button from '@components/ui/Button';
import { formatDate } from '@utils/date-utils';
import { User } from '@types/user';
```

## Build and Configuration Files

- `vite.config.ts`: Vite configuration including path aliases
- `tsconfig.json`: TypeScript configuration
- `package.json`: NPM dependencies and scripts

## Environment Configuration

- `.env.local`: Development environment variables
- `.env.production`: Production environment variables

## Firebase Configuration

- `firebase.json`: Firebase configuration
- `firestore.rules`: Firestore security rules
- `storage.rules`: Firebase Storage security rules 