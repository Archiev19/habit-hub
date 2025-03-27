import React from 'react';
import { calculateGoalProgress, getGoalMessage } from '../utils/goalCalculator';

interface GoalProgressProps {
  completedDates: string[];
  goalTarget?: number; 
  goalPeriod?: 'day' | 'week' | 'month';
  frequency: 'daily' | 'weekly';
}

const GoalProgress: React.FC<GoalProgressProps> = ({ 
  completedDates, 
  goalTarget, 
  goalPeriod,
  frequency 
}) => {
  // If no goal is set, don't render anything
  if (!goalTarget || !goalPeriod) {
    return null;
  }

  const progress = calculateGoalProgress(completedDates, goalTarget, goalPeriod);
  const goalMessage = getGoalMessage(progress);

  return (
    <div className="mt-3 border-t pt-3 border-gray-100">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">Goal Progress:</span>
          <span className="ml-1 text-sm font-semibold">
            {progress.currentCount}/{progress.targetCount} {goalPeriod === 'day' ? 'today' : goalPeriod === 'week' ? 'this week' : 'this month'}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          progress.isCompleted 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {progress.isCompleted ? 'Completed' : `${progress.completionPercentage}%`}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${progress.isCompleted ? 'bg-green-500' : 'bg-primary-600'}`}
          style={{ width: `${progress.completionPercentage}%` }}
        />
      </div>
      
      {/* Goal message */}
      <p className="mt-1 text-xs text-gray-500">{goalMessage}</p>
      
      {/* Suggested rhythm based on frequency and goals */}
      {!progress.isCompleted && (
        <p className="mt-1 text-xs text-gray-400">
          {frequency === 'daily' && goalPeriod === 'week' ? 
            `Try to complete this ${Math.ceil(goalTarget / 7)} times per day to reach your weekly goal.` :
            frequency === 'daily' && goalPeriod === 'month' ? 
            `Try to complete this ${Math.ceil(goalTarget / 30)} times per day to reach your monthly goal.` : ''}
        </p>
      )}
    </div>
  );
};

export default GoalProgress; 