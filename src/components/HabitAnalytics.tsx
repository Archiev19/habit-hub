import React, { useMemo, useState } from 'react';
import { Habit } from '../types/habit';

interface HabitAnalyticsProps {
  habits: Habit[];
}

interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completionRate: number;
  mostConsistentHabit: {
    title: string;
    rate: number;
  } | null;
  categoryBreakdown: {
    [key: string]: number;
  };
  weekdayCompletion: {
    [key: string]: number;
  };
}

export const HabitAnalytics: React.FC<HabitAnalyticsProps> = ({ habits }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const stats = useMemo(() => {
    const activeHabits = habits.filter(habit => !habit.archived);
    
    // Calculate completion rate for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    const recentCompletions = activeHabits.reduce((total, habit) => {
      return total + (habit.completedDates?.filter(date => date >= thirtyDaysAgoStr)?.length || 0);
    }, 0);
    
    const totalPossibleCompletions = activeHabits.length * 30;
    const completionRate = totalPossibleCompletions > 0 
      ? (recentCompletions / totalPossibleCompletions) * 100 
      : 0;

    // Find most consistent habit
    const habitConsistency = activeHabits.map(habit => {
      const completionRate = (habit.completedDates?.filter(date => date >= thirtyDaysAgoStr)?.length || 0) / 30;
      return {
        title: habit.title,
        rate: completionRate * 100
      };
    });

    const mostConsistentHabit = habitConsistency.length > 0
      ? habitConsistency.reduce((prev, current) => 
          current.rate > prev.rate ? current : prev
        )
      : null;

    // Calculate category breakdown
    const categoryBreakdown = activeHabits.reduce((acc, habit) => {
      const category = habit.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate weekday completion patterns
    const weekdayCompletion = activeHabits.reduce((acc, habit) => {
      habit.completedDates?.forEach(dateStr => {
        const date = new Date(dateStr);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        acc[weekday] = (acc[weekday] || 0) + 1;
      });
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      completionRate: Math.round(completionRate),
      mostConsistentHabit,
      categoryBreakdown,
      weekdayCompletion
    };
  }, [habits]);

  const InfoTooltip = () => (
    <div 
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] w-96 p-6 bg-white rounded-lg shadow-xl border border-gray-200 text-sm"
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <button 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(false);
        }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative">
        <h4 className="font-medium text-gray-900 text-lg mb-4">Understanding Your Analytics</h4>
        <ul className="space-y-4">
          <li>
            <span className="font-medium text-gray-800">Overall Stats:</span>
            <ul className="ml-4 mt-2 space-y-2">
              <li>• Total Habits: All habits you've created</li>
              <li>• Active Habits: Currently tracked habits (not archived)</li>
              <li>• 30-Day Completion Rate: Percentage of habit completions in the last month</li>
            </ul>
          </li>
          <li>
            <span className="font-medium text-gray-800">Most Consistent Habit:</span>
            <p className="mt-1 ml-4">The habit you complete most regularly, with its success rate</p>
          </li>
          <li>
            <span className="font-medium text-gray-800">Category Breakdown:</span>
            <p className="mt-1 ml-4">Distribution of your habits across different categories</p>
          </li>
          <li>
            <span className="font-medium text-gray-800">Completion by Day:</span>
            <p className="mt-1 ml-4">Shows which days of the week you're most successful at completing habits</p>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-indigo-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-indigo-900">Habit Analytics</h2>
          <div className="relative">
            <button
              className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showInfo && <InfoTooltip />}
      
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Stats */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-indigo-800 mb-4">Overall Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-indigo-600">Total Habits</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.totalHabits}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600">Active Habits</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.activeHabits}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600">30-Day Completion Rate</p>
                  <p className="text-2xl font-bold text-indigo-700">{stats.completionRate}%</p>
                </div>
              </div>
            </div>

            {/* Most Consistent Habit */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-indigo-800 mb-4">Most Consistent Habit</h3>
              {stats.mostConsistentHabit ? (
                <div>
                  <p className="text-sm text-indigo-600">Habit</p>
                  <p className="text-xl font-semibold text-indigo-900">{stats.mostConsistentHabit.title}</p>
                  <p className="text-sm text-indigo-600 mt-2">Completion Rate</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {Math.round(stats.mostConsistentHabit.rate)}%
                  </p>
                </div>
              ) : (
                <p className="text-indigo-500">No habit data available</p>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-indigo-800 mb-4">Category Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-indigo-700">{category}</span>
                    <span className="text-sm font-medium text-indigo-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Weekday Patterns */}
            <div className="bg-indigo-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-medium text-indigo-800 mb-4">Completion by Day of Week</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                  const completions = stats.weekdayCompletion[day] || 0;
                  const maxCompletions = Math.max(...Object.values(stats.weekdayCompletion), 1);
                  const height = maxCompletions > 0 ? (completions / maxCompletions) * 100 : 0;
                  const isHovered = hoveredDay === day;
                  
                  return (
                    <div 
                      key={day} 
                      className="flex flex-col items-center"
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <div className="relative w-full">
                        <div className="w-full h-32 bg-indigo-100 rounded-lg relative overflow-hidden group">
                          <div 
                            className={`absolute bottom-0 w-full bg-indigo-600 transition-all duration-300 ${
                              isHovered ? 'bg-indigo-700' : ''
                            }`}
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                        {isHovered && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white p-2 rounded shadow-lg text-xs">
                              <div className="font-bold text-indigo-800">{completions} completions</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-xs mt-2 text-indigo-600 font-medium">{day.slice(0, 3)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 