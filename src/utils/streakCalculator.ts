/**
 * Utility functions for calculating streaks for habits
 */

/**
 * Calculate the current streak for a daily habit
 * A streak is consecutive days of completion without missing a day
 * 
 * @param completedDates Array of ISO date strings when the habit was completed
 * @returns Current streak count
 */
export const calculateDailyStreak = (completedDates: string[]): number => {
  if (!completedDates.length) return 0;
  
  // Sort dates in descending order (newest first)
  const sortedDates = [...completedDates]
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime())
    .map(date => date.toISOString().split('T')[0]);
  
  // Get today and yesterday in ISO format
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Check if the habit was completed today or yesterday
  // If not completed either day, the streak is 0
  const hasCompletedTodayOrYesterday = sortedDates.includes(today) || sortedDates.includes(yesterday);
  if (!hasCompletedTodayOrYesterday) return 0;
  
  let currentStreak = 0;
  let currentDate = new Date();
  
  // Calculate streak by checking consecutive days backward from today/yesterday
  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];
    
    // If the current date is completed, increase streak
    if (sortedDates.includes(dateString)) {
      currentStreak++;
      // Move to the previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If today wasn't completed but yesterday was, start counting from yesterday
      if (currentStreak === 0 && dateString === today && sortedDates.includes(yesterday)) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      // Break the loop if we find a day that wasn't completed
      break;
    }
  }
  
  return currentStreak;
};

/**
 * Calculate the current streak for a weekly habit
 * A streak is consecutive weeks of completion without missing a week
 * 
 * @param completedDates Array of ISO date strings when the habit was completed
 * @returns Current streak count
 */
export const calculateWeeklyStreak = (completedDates: string[]): number => {
  if (!completedDates.length) return 0;
  
  // Convert string dates to actual Date objects and sort
  const dates = completedDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  // Group dates by week (Sunday to Saturday)
  const weekMap = new Map<string, boolean>();
  
  dates.forEach(date => {
    // Get the week start (Sunday) for each date
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Move to the Sunday of the week
    
    const weekKey = weekStart.toISOString().split('T')[0];
    weekMap.set(weekKey, true);
  });
  
  // Get current week's Sunday
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  
  // Get last week's Sunday
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  
  // Check if current week or last week was completed
  // If neither, streak is 0
  const currentWeekKey = currentWeekStart.toISOString().split('T')[0];
  const lastWeekKey = lastWeekStart.toISOString().split('T')[0];
  
  const hasCompletedCurrentOrLastWeek = weekMap.has(currentWeekKey) || weekMap.has(lastWeekKey);
  if (!hasCompletedCurrentOrLastWeek) return 0;
  
  let streak = 0;
  let checkWeek = new Date(today);
  let checkWeekStart: Date;
  
  // If current week isn't completed but last week was, start from last week
  if (!weekMap.has(currentWeekKey) && weekMap.has(lastWeekKey)) {
    checkWeek = new Date(lastWeekStart);
  }
  
  // Calculate streak by checking consecutive weeks backward
  while (true) {
    checkWeekStart = new Date(checkWeek);
    checkWeekStart.setDate(checkWeek.getDate() - checkWeek.getDay());
    
    const weekKey = checkWeekStart.toISOString().split('T')[0];
    
    if (weekMap.has(weekKey)) {
      streak++;
      // Move to the previous week
      checkWeek.setDate(checkWeek.getDate() - 7);
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Calculate streak based on habit frequency
 * 
 * @param completedDates Array of ISO date strings when the habit was completed
 * @param frequency 'daily' or 'weekly'
 * @returns Current streak count
 */
export const calculateStreak = (completedDates: string[], frequency: 'daily' | 'weekly'): number => {
  if (frequency === 'daily') {
    return calculateDailyStreak(completedDates);
  } else {
    return calculateWeeklyStreak(completedDates);
  }
};

/**
 * Get longest streak for a habit
 * 
 * @param completedDates Array of ISO date strings when the habit was completed
 * @param frequency 'daily' or 'weekly'
 * @returns Longest streak achieved
 */
export const calculateLongestStreak = (completedDates: string[], frequency: 'daily' | 'weekly'): number => {
  if (!completedDates.length) return 0;
  
  // Sort dates in ascending order
  const sortedDates = [...completedDates]
    .map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime())
    .map(date => date.toISOString().split('T')[0]);
  
  if (frequency === 'daily') {
    let longestStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      
      // Check if dates are consecutive
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day, continue streak
        currentStreak++;
      } else {
        // Break in streak, reset counter
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    // Check final streak
    longestStreak = Math.max(longestStreak, currentStreak);
    return longestStreak;
  } else {
    // For weekly streaks
    // Group by week
    const weekMap = new Map<number, boolean>();
    
    sortedDates.forEach(dateStr => {
      const date = new Date(dateStr);
      // Get year and week number
      const yearWeek = getYearAndWeek(date);
      weekMap.set(yearWeek, true);
    });
    
    // Sort week numbers
    const sortedWeeks = Array.from(weekMap.keys()).sort();
    
    let longestStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedWeeks.length; i++) {
      const prevWeek = sortedWeeks[i - 1];
      const currWeek = sortedWeeks[i];
      
      // Check if weeks are consecutive
      if (currWeek - prevWeek === 1) {
        // Consecutive week, continue streak
        currentStreak++;
      } else {
        // Break in streak, reset counter
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    // Check final streak
    longestStreak = Math.max(longestStreak, currentStreak);
    return longestStreak;
  }
};

/**
 * Helper function to get a unique number representing year and week
 * Format: YYYYWW (e.g., 202352 for week 52 of 2023)
 */
const getYearAndWeek = (date: Date): number => {
  const year = date.getFullYear();
  
  // Get the first day of the year
  const firstDayOfYear = new Date(year, 0, 1);
  
  // Calculate the week number
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  
  return year * 100 + weekNumber;
}; 