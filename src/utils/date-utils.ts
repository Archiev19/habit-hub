/**
 * Date utility functions for the application
 */
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isBetween from 'dayjs/plugin/isBetween';
import { UserPreferences } from '../types/habit';

// Initialize dayjs plugins
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isBetween);

/**
 * Format a date according to user preferences
 * @param date Date to format
 * @param preferences User preferences
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, preferences?: UserPreferences): string {
  const dateObj = dayjs(date);
  const format = preferences?.dateFormat === 'DD/MM/YYYY' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
  return dateObj.format(format);
}

/**
 * Get the current date as an ISO string (YYYY-MM-DD)
 * @returns Current date in ISO format
 */
export function getTodayISOString(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * Get ISO string (YYYY-MM-DD) for a given date
 * @param date Date to convert
 * @returns Date in ISO format
 */
export function getISODateString(date: Date | string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

/**
 * Get the day of the week (0-6) for a given date
 * @param date Date to check
 * @param preferences User preferences for first day of week
 * @returns Day of the week (0-6), adjusted for user preferences
 */
export function getDayOfWeek(date: Date | string, preferences?: UserPreferences): number {
  const dateObj = dayjs(date);
  // If first day of week is Monday, adjust the day number
  if (preferences?.firstDayOfWeek === 'Monday') {
    // Convert Sunday (0) to 6, and other days to day-1
    return dateObj.day() === 0 ? 6 : dateObj.day() - 1;
  }
  return dateObj.day();
}

/**
 * Get week number for a given date
 * @param date Date to check
 * @param preferences User preferences
 * @returns Week number (1-53)
 */
export function getWeekNumber(date: Date | string, preferences?: UserPreferences): number {
  const dateObj = dayjs(date);
  // Use ISO week if first day of week is Monday
  if (preferences?.firstDayOfWeek === 'Monday') {
    return dateObj.isoWeek();
  }
  return dateObj.week();
}

/**
 * Check if a date is today
 * @param date Date to check
 * @returns Whether the date is today
 */
export function isDateToday(date: Date | string): boolean {
  return dayjs(date).isToday();
}

/**
 * Check if a date is yesterday
 * @param date Date to check
 * @returns Whether the date is yesterday
 */
export function isDateYesterday(date: Date | string): boolean {
  return dayjs(date).isYesterday();
}

/**
 * Get dates for the current week
 * @param preferences User preferences
 * @returns Array of dates for the current week as ISO strings
 */
export function getCurrentWeekDates(preferences?: UserPreferences): string[] {
  const dates: string[] = [];
  const today = dayjs();
  const firstDayOfWeek = preferences?.firstDayOfWeek === 'Monday' ? 1 : 0;
  
  // Adjust the start date based on the first day of week preference
  let startOfWeek = today.day(firstDayOfWeek);
  
  // If today is before the start of the week, go back a week
  if (today.isBefore(startOfWeek)) {
    startOfWeek = startOfWeek.subtract(7, 'day');
  }
  
  // Generate 7 dates starting from the start of the week
  for (let i = 0; i < 7; i++) {
    dates.push(startOfWeek.add(i, 'day').format('YYYY-MM-DD'));
  }
  
  return dates;
}

/**
 * Calculate the difference in days between two dates
 * @param dateA First date
 * @param dateB Second date
 * @returns Difference in days (positive if dateA is after dateB)
 */
export function daysBetween(dateA: Date | string, dateB: Date | string): number {
  return dayjs(dateA).diff(dayjs(dateB), 'day');
}

/**
 * Check if a date is within a range
 * @param date Date to check
 * @param start Start of range
 * @param end End of range
 * @param inclusivity Inclusivity of the range
 * @returns Whether the date is within the range
 */
export function isDateInRange(
  date: Date | string,
  start: Date | string,
  end: Date | string,
  inclusivity: '()' | '[]' | '[)' | '(]' = '[]'
): boolean {
  return dayjs(date).isBetween(start, end, 'day', inclusivity);
}

/**
 * Get a human-readable relative time string
 * @param date Date to format
 * @returns Relative time string (e.g., "Today", "Yesterday", "3 days ago")
 */
export function getRelativeTimeString(date: Date | string): string {
  const dateObj = dayjs(date);
  
  if (dateObj.isToday()) {
    return 'Today';
  }
  
  if (dateObj.isYesterday()) {
    return 'Yesterday';
  }
  
  const daysAgo = dayjs().diff(dateObj, 'day');
  
  if (daysAgo < 7) {
    return `${daysAgo} days ago`;
  }
  
  if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${weeksAgo} ${weeksAgo === 1 ? 'week' : 'weeks'} ago`;
  }
  
  if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${monthsAgo} ${monthsAgo === 1 ? 'month' : 'months'} ago`;
  }
  
  const yearsAgo = Math.floor(daysAgo / 365);
  return `${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ago`;
} 