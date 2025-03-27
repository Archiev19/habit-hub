import React from 'react';
import useHabits from '../hooks/useHabits';
import { Habit } from '../hooks/useHabits';

interface HabitListProps {
  showArchived?: boolean;
}

const HabitList: React.FC<HabitListProps> = ({ showArchived = false }) => {
  const { habits, loading, error, toggleCompletion, archiveHabit, deleteHabit } = useHabits();

  if (loading) {
    return <div className="text-center py-4">Loading habits...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  const filteredHabits = habits.filter(habit => habit.archived === showArchived);

  if (filteredHabits.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No habits found. {!showArchived && 'Start by adding a new habit!'}
      </div>
    );
  }

  const handleToggleCompletion = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    toggleCompletion(habitId, today);
  };

  return (
    <div className="space-y-4">
      {filteredHabits.map((habit: Habit) => (
        <div
          key={habit._id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={habit.completedDates.includes(new Date().toISOString().split('T')[0])}
                onChange={() => handleToggleCompletion(habit._id)}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <h3 className="text-lg font-semibold">{habit.title}</h3>
                <p className="text-gray-600">{habit.description}</p>
                <div className="flex space-x-2 mt-1">
                  <span className="text-sm text-gray-500">{habit.category}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    Streak: {habit.streakCount}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => archiveHabit(habit._id)}
                title="Archive habit"
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path
                    fillRule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => deleteHabit(habit._id)}
                title="Delete habit"
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList; 