# API Reference

This document provides a reference for the API services used in HabitHub.

## Authentication API

### `authService`

Handles user authentication operations.

#### Methods

##### `signUp(email: string, password: string): Promise<User>`

Registers a new user with email and password.

**Parameters:**
- `email`: User's email address
- `password`: User's password

**Returns:** Promise resolving to a User object

**Example:**
```typescript
import { authService } from '@services/auth-service';

try {
  const user = await authService.signUp('user@example.com', 'password123');
  console.log('User created:', user);
} catch (error) {
  console.error('Registration failed:', error);
}
```

##### `signIn(email: string, password: string): Promise<User>`

Signs in an existing user with email and password.

**Parameters:**
- `email`: User's email address
- `password`: User's password

**Returns:** Promise resolving to a User object

**Example:**
```typescript
import { authService } from '@services/auth-service';

try {
  const user = await authService.signIn('user@example.com', 'password123');
  console.log('User signed in:', user);
} catch (error) {
  console.error('Login failed:', error);
}
```

##### `signOut(): Promise<void>`

Signs out the current user.

**Returns:** Promise that resolves when sign out is complete

**Example:**
```typescript
import { authService } from '@services/auth-service';

try {
  await authService.signOut();
  console.log('User signed out successfully');
} catch (error) {
  console.error('Sign out failed:', error);
}
```

##### `getCurrentUser(): User | null`

Gets the currently authenticated user.

**Returns:** Current User object or null if no user is authenticated

**Example:**
```typescript
import { authService } from '@services/auth-service';

const currentUser = authService.getCurrentUser();
if (currentUser) {
  console.log('Current user:', currentUser.email);
} else {
  console.log('No user is signed in');
}
```

## Habits API

### `habitService`

Handles habit-related operations.

#### Methods

##### `getHabits(userId: string): Promise<Habit[]>`

Retrieves all habits for a specific user.

**Parameters:**
- `userId`: ID of the user whose habits to retrieve

**Returns:** Promise resolving to an array of Habit objects

**Example:**
```typescript
import { habitService } from '@services/habit-service';

try {
  const habits = await habitService.getHabits('user123');
  console.log('User habits:', habits);
} catch (error) {
  console.error('Failed to fetch habits:', error);
}
```

##### `createHabit(habit: Omit<Habit, 'id'>): Promise<Habit>`

Creates a new habit.

**Parameters:**
- `habit`: Habit object without ID

**Returns:** Promise resolving to the created Habit with ID

**Example:**
```typescript
import { habitService } from '@services/habit-service';

try {
  const newHabit = await habitService.createHabit({
    userId: 'user123',
    title: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    frequency: 'daily',
    tags: ['health', 'mindfulness'],
    timeOfDay: 'morning',
    createdAt: new Date(),
    streakCount: 0,
    completions: []
  });
  console.log('Habit created:', newHabit);
} catch (error) {
  console.error('Failed to create habit:', error);
}
```

##### `updateHabit(id: string, habitData: Partial<Habit>): Promise<Habit>`

Updates an existing habit.

**Parameters:**
- `id`: ID of the habit to update
- `habitData`: Partial Habit object with fields to update

**Returns:** Promise resolving to the updated Habit

**Example:**
```typescript
import { habitService } from '@services/habit-service';

try {
  const updatedHabit = await habitService.updateHabit('habit123', {
    title: 'Updated Habit Title',
    description: 'New description'
  });
  console.log('Habit updated:', updatedHabit);
} catch (error) {
  console.error('Failed to update habit:', error);
}
```

##### `deleteHabit(id: string): Promise<void>`

Deletes a habit.

**Parameters:**
- `id`: ID of the habit to delete

**Returns:** Promise that resolves when deletion is complete

**Example:**
```typescript
import { habitService } from '@services/habit-service';

try {
  await habitService.deleteHabit('habit123');
  console.log('Habit deleted successfully');
} catch (error) {
  console.error('Failed to delete habit:', error);
}
```

##### `completeHabit(id: string, date: Date = new Date()): Promise<Habit>`

Marks a habit as completed for a specific date.

**Parameters:**
- `id`: ID of the habit to mark as complete
- `date`: Date of completion (defaults to current date)

**Returns:** Promise resolving to the updated Habit

**Example:**
```typescript
import { habitService } from '@services/habit-service';

try {
  const updatedHabit = await habitService.completeHabit('habit123');
  console.log('Habit marked as complete:', updatedHabit);
} catch (error) {
  console.error('Failed to complete habit:', error);
}
```

## User Preferences API

### `preferencesService`

Handles user preferences operations.

#### Methods

##### `getUserPreferences(userId: string): Promise<UserPreferences>`

Retrieves preferences for a specific user.

**Parameters:**
- `userId`: ID of the user whose preferences to retrieve

**Returns:** Promise resolving to a UserPreferences object

**Example:**
```typescript
import { preferencesService } from '@services/preferences-service';

try {
  const preferences = await preferencesService.getUserPreferences('user123');
  console.log('User preferences:', preferences);
} catch (error) {
  console.error('Failed to fetch preferences:', error);
}
```

##### `updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences>`

Updates preferences for a specific user.

**Parameters:**
- `userId`: ID of the user whose preferences to update
- `preferences`: Partial UserPreferences object with fields to update

**Returns:** Promise resolving to the updated UserPreferences

**Example:**
```typescript
import { preferencesService } from '@services/preferences-service';

try {
  const updatedPreferences = await preferencesService.updateUserPreferences('user123', {
    theme: 'dark',
    reminderTime: '09:00'
  });
  console.log('Preferences updated:', updatedPreferences);
} catch (error) {
  console.error('Failed to update preferences:', error);
}
```

## Analytics API

### `analyticsService`

Handles habit analytics operations.

#### Methods

##### `getHabitStats(habitId: string): Promise<HabitStats>`

Retrieves statistics for a specific habit.

**Parameters:**
- `habitId`: ID of the habit to get statistics for

**Returns:** Promise resolving to a HabitStats object

**Example:**
```typescript
import { analyticsService } from '@services/analytics-service';

try {
  const stats = await analyticsService.getHabitStats('habit123');
  console.log('Habit statistics:', stats);
} catch (error) {
  console.error('Failed to fetch habit stats:', error);
}
```

##### `getUserStats(userId: string): Promise<UserStats>`

Retrieves aggregated statistics for all habits of a user.

**Parameters:**
- `userId`: ID of the user to get statistics for

**Returns:** Promise resolving to a UserStats object

**Example:**
```typescript
import { analyticsService } from '@services/analytics-service';

try {
  const stats = await analyticsService.getUserStats('user123');
  console.log('User statistics:', stats);
} catch (error) {
  console.error('Failed to fetch user stats:', error);
}
```

## Error Handling

All API methods throw appropriate errors that can be caught and handled:

```typescript
import { habitService } from '@services/habit-service';
import { ApiError } from '@types/errors';

try {
  const habits = await habitService.getHabits('user123');
  console.log('User habits:', habits);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.code}): ${error.message}`);
    // Handle specific error codes
    if (error.code === 'not_found') {
      // Handle not found error
    } else if (error.code === 'permission_denied') {
      // Handle permission denied error
    }
  } else {
    console.error('Unknown error:', error);
  }
}
``` 