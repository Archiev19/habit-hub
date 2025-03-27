/**
 * Utility functions for calculating goal progress
 */

interface GoalProgressResult {
  currentCount: number;
  targetCount: number;
  completionPercentage: number;
  remainingCount: number;
  isCompleted: boolean;
  periodLabel: string;
  daysLeft?: number;
}

/**
 * Calculate the progress of a habit goal
 * 
 * @param completedDates Array of ISO date strings when the habit was completed
 * @param goalTarget Target number of completions
 * @param goalPeriod Time period for the goal ('day', 'week', 'month')
 * @returns Object with progress metrics
 */
export const calculateGoalProgress = (
  completedDates: string[],
  goalTarget: number,
  goalPeriod: 'day' | 'week' | 'month'
): GoalProgressResult => {
  if (!completedDates || !goalTarget || !goalPeriod) {
    return {
      currentCount: 0,
      targetCount: 0,
      completionPercentage: 0,
      remainingCount: 0,
      isCompleted: false,
      periodLabel: ''
    };
  }

  const today = new Date();
  let startDate: Date;
  let endDate: Date;
  let periodLabel: string;
  
  // Calculate the current period's start and end dates
  switch (goalPeriod) {
    case 'day':
      // For daily goals, the period is just today
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = 'Today';
      break;
      
    case 'week':
      // For weekly goals, get the start of the week (Sunday)
      // and end of the week (Saturday)
      startDate = new Date(today);
      const dayOfWeek = startDate.getDay(); // 0 = Sunday, 6 = Saturday
      startDate.setDate(startDate.getDate() - dayOfWeek); // Go back to Sunday
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); // Go forward to Saturday
      endDate.setHours(23, 59, 59, 999);
      periodLabel = 'This week';
      break;
      
    case 'month':
      // For monthly goals, get the start of the month
      // and end of the month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = 'This month';
      break;
      
    default:
      startDate = new Date(today);
      endDate = new Date(today);
      periodLabel = 'Today';
  }
  
  // Count completions within the current period
  const filteredDates = completedDates.filter(dateStr => {
    const date = new Date(dateStr);
    return date >= startDate && date <= endDate;
  });
  
  const currentCount = filteredDates.length;
  const completionPercentage = Math.min(100, Math.round((currentCount / goalTarget) * 100));
  const remainingCount = Math.max(0, goalTarget - currentCount);
  const isCompleted = currentCount >= goalTarget;
  
  // Calculate days left in the period
  const daysLeft = goalPeriod !== 'day' 
    ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  return {
    currentCount,
    targetCount: goalTarget,
    completionPercentage,
    remainingCount,
    isCompleted,
    periodLabel,
    daysLeft
  };
};

/**
 * Get a description of what's needed to achieve the goal
 */
export const getGoalMessage = (progress: GoalProgressResult): string => {
  if (progress.isCompleted) {
    return `Goal completed! You've reached your target of ${progress.targetCount} for ${progress.periodLabel.toLowerCase()}.`;
  }
  
  if (progress.daysLeft === 0) {
    return `${progress.remainingCount} more needed today to reach your goal.`;
  }
  
  return `${progress.remainingCount} more needed over the next ${progress.daysLeft} day${progress.daysLeft !== 1 ? 's' : ''} to reach your goal.`;
}; 