import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CalendarView from '../components/CalendarView';
import useHabits from '../hooks/useHabits';
import dayjs from 'dayjs';

const CalendarPage: React.FC = () => {
  const { 
    habits, 
    toggleCompletion, 
    loading, 
    error 
  } = useHabits();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Check if this is the first time visiting the calendar page
  useEffect(() => {
    const hasSeenCalendarTutorial = localStorage.getItem('calendarTutorialSeen');
    if (!hasSeenCalendarTutorial) {
      setShowTutorial(true);
      localStorage.setItem('calendarTutorialSeen', 'true');
    }
  }, []);

  // All unique categories from habits
  const categories = React.useMemo(() => {
    const categorySet = new Set<string>();
    habits.forEach(habit => {
      if (habit.category) {
        categorySet.add(habit.category);
      }
    });
    return Array.from(categorySet);
  }, [habits]);
  
  // Filter habits by selected category
  const filteredHabits = React.useMemo(() => {
    // Show all habits (including archived)
    if (!selectedCategory) return habits;
    return habits.filter(habit => habit.category === selectedCategory);
  }, [habits, selectedCategory]);

  const handleToggleCompletion = (date: string, habitId: string) => {
    toggleCompletion(habitId, date);
  };

  const handleCloseIntroduction = () => {
    setShowTutorial(false);
  };

  if (loading) {
    return <div className="p-4">Loading habits...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading habits: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Habit Calendar</h1>
        <Link 
          to="/dashboard" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </Link>
      </div>
      
      {/* Main tutorial that appears on first visit */}
      {showTutorial && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-blue-800 mb-2">Welcome to the Calendar View! 📅</h2>
              <div className="text-blue-700 space-y-2">
                <p><strong>Here's how to use it:</strong></p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong>View habits by day:</strong> Click on any day to see which habits were completed.
                  </li>
                  <li>
                    <strong>Toggle completion:</strong> Select a habit to mark it as complete/incomplete for a specific day.
                  </li>
                  <li>
                    <strong>Multi-day mode:</strong> In the habit popup, select a habit under "Multi-day selection mode" to toggle the same habit across multiple days quickly.
                    <div className="ml-6 mt-1 text-sm bg-blue-100 p-2 rounded">
                      <p className="font-medium">💡 Pro tip:</p>
                      <p>This is perfect for filling in missed days or marking multiple days at once!</p>
                    </div>
                  </li>
                  <li>
                    <strong>Navigate months:</strong> Use the arrows to view different months or click "Today" to return to the current month.
                  </li>
                  <li>
                    <strong>Filter by category:</strong> Use the category buttons below to focus on specific habit types.
                  </li>
                </ol>
              </div>
            </div>
            <button 
              className="text-blue-700 hover:text-blue-900"
              onClick={handleCloseIntroduction}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-right">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleCloseIntroduction}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      {/* Category filter */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded ${
              selectedCategory === null 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Habits ({habits.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1 rounded ${
                selectedCategory === category 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({habits.filter(h => h.category === category).length})
            </button>
          ))}
        </div>
      </div>
      
      {/* Calendar and habits display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView 
            habits={filteredHabits}
            onDateClick={handleToggleCompletion}
          />
        </div>
        
        <div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Your Habits ({filteredHabits.length})</h2>
            
            {filteredHabits.length > 0 ? (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                {filteredHabits.map(habit => {
                  const isCompletedToday = habit.completedDates?.some(date => 
                    dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                  );
                  
                  return (
                    <div 
                      key={habit._id}
                      className={`p-3 rounded border ${
                        habit.archived 
                          ? 'border-gray-200 bg-gray-50' 
                          : isCompletedToday 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div 
                          className={`w-4 h-4 mt-1 rounded-full ${
                            isCompletedToday ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-medium ${habit.archived ? 'text-gray-500' : 'text-gray-800'}`}>
                                {habit.title}
                                {habit.archived && <span className="ml-2 text-xs text-gray-500">(Archived)</span>}
                              </h3>
                              {habit.category && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                  {habit.category}
                                </span>
                              )}
                            </div>
                            
                            {!habit.archived && (
                              <button 
                                className={`px-2 py-1 text-xs rounded ${
                                  isCompletedToday 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => toggleCompletion(
                                  habit._id, 
                                  dayjs().format('YYYY-MM-DD')
                                )}
                              >
                                {isCompletedToday ? 'Completed Today ✓' : 'Mark Today'}
                              </button>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {habit.completedDates?.length || 0} total completions
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No habits found for this category.</p>
                <p className="text-sm mt-2">Try selecting a different category or create new habits.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick help button that can re-open the tutorial */}
      <div className="fixed bottom-4 right-4">
        <button 
          className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700"
          onClick={() => setShowTutorial(true)}
          title="Show calendar help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CalendarPage; 