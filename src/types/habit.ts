/**
 * Types for habit tracking functionality
 */

/**
 * Represents a habit that a user tracks
 */
export interface Habit {
  /** Unique identifier for the habit */
  id: string;
  
  /** Title of the habit */
  title: string;
  
  /** Optional description of the habit */
  description?: string;
  
  /** How often the habit should be performed */
  frequency: 'daily' | 'weekly';
  
  /** Array of dates when the habit was completed (ISO date strings) */
  completedDates?: string[];
  
  /** Current streak count for the habit */
  streakCount?: number;
  
  /** Longest streak achieved for this habit */
  longestStreak?: number;
  
  /** Category the habit belongs to */
  category?: string;
  
  /** Tags associated with the habit */
  tags?: string[];
  
  /** Whether the habit is archived */
  archived?: boolean;
  
  /** Target number for goal completion */
  goalTarget?: number;
  
  /** Time period for the goal */
  goalPeriod?: 'day' | 'week' | 'month';
  
  /** ID of the user who owns this habit */
  userId: string;
  
  /** Record of completions by date */
  completions?: Record<string, boolean>;

  /** When the habit was created */
  createdAt?: string;
}

/**
 * Data required to create a new habit
 */
export type NewHabitData = Omit<Habit, 'id' | 'userId'>;

/**
 * Habit data that can be updated
 */
export type UpdateHabitData = Partial<Habit>;

/**
 * Frequency options for habits
 */
export type HabitFrequency = 'daily' | 'weekly';

/**
 * Goal period options for habits
 */
export type GoalPeriod = 'day' | 'week' | 'month';

/**
 * Category for organizing habits
 */
export interface HabitCategory {
  id: string;
  name: string;
  color?: string;
}

/**
 * User preference settings for habits
 */
export interface UserPreferences {
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY';
  firstDayOfWeek: 'Sunday' | 'Monday';
  timeZone: string;
  emailNotifications: boolean;
} 