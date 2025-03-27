import React from 'react';

interface Habit {
  _id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  streakCount: number;
  longestStreak?: number;
  category?: string;
  tags?: string[];
  archived?: boolean;
}

interface StreakSummaryProps {
  habits: Habit[];
}

const StreakSummary: React.FC<StreakSummaryProps> = ({ habits }) => {
  // Calculate total active habits (non-archived)
  const activeHabits = habits.filter(habit => !habit.archived);
  
  // Find habit with longest current streak
  const habitWithLongestCurrentStreak = habits
    .filter(habit => !habit.archived)
    .reduce((prev, current) => 
      (current.streakCount > (prev?.streakCount || 0)) ? current : prev, 
      null as Habit | null
    );
  
  // Find habit with longest overall streak
  const habitWithLongestOverallStreak = habits
    .reduce((prev, current) => 
      ((current.longestStreak || 0) > (prev?.longestStreak || 0)) ? current : prev, 
      null as Habit | null
    );
  
  // Calculate how many habits are completed today
  const today = new Date().toISOString().split('T')[0];
  const habitsCompletedToday = activeHabits.filter(habit => 
    habit.completedDates && habit.completedDates.includes(today)
  ).length;
  
  // Calculate completion rate for today
  const completionRate = activeHabits.length > 0 
    ? Math.round((habitsCompletedToday / activeHabits.length) * 100)
    : 0;
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Streak Stats</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Today's completion */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700">Today's Progress</h4>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">{habitsCompletedToday}/{activeHabits.length}</p>
              <p className="text-xs text-gray-500">habits completed</p>
            </div>
            {activeHabits.length > 0 && (
              <div className="w-16 h-16 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="#E5E7EB" 
                    strokeWidth="3" 
                  />
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="#4F46E5" 
                    strokeWidth="3" 
                    strokeDasharray={`${completionRate}, 100`} 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold">{completionRate}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Active Habits */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700">Active Habits</h4>
          <p className="mt-2 text-2xl font-bold text-primary-600">{activeHabits.length}</p>
          <p className="text-xs text-gray-500">
            {habits.length - activeHabits.length} archived
          </p>
        </div>
        
        {/* Current longest streak */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700">Current Best Streak</h4>
          {habitWithLongestCurrentStreak ? (
            <div>
              <p className="mt-2 text-2xl font-bold text-primary-600">
                {habitWithLongestCurrentStreak.streakCount} {habitWithLongestCurrentStreak.frequency === 'daily' ? 'days' : 'weeks'}
              </p>
              <p className="text-xs text-gray-500 truncate" title={habitWithLongestCurrentStreak.title}>
                {habitWithLongestCurrentStreak.title}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No active streaks</p>
          )}
        </div>
        
        {/* All-time longest streak */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700">All-time Best Streak</h4>
          {habitWithLongestOverallStreak && habitWithLongestOverallStreak.longestStreak ? (
            <div>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                {habitWithLongestOverallStreak.longestStreak} {habitWithLongestOverallStreak.frequency === 'daily' ? 'days' : 'weeks'}
              </p>
              <p className="text-xs text-gray-500 truncate" title={habitWithLongestOverallStreak.title}>
                {habitWithLongestOverallStreak.title}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No streaks yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreakSummary; 