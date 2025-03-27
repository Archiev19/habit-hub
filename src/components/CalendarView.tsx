import React, { useState, useMemo } from 'react';
import { Habit } from '../types/habit';

interface CalendarViewProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string, date: string) => Promise<void>;
  month?: number; // 0-11 (January is 0)
  year?: number;
}

// Helper function to generate a consistent color from habit ID
const getHabitColor = (habitId: string) => {
  // Use the habit ID to generate a consistent hash
  let hash = 0;
  for (let i = 0; i < habitId.length; i++) {
    hash = habitId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // List of distinct colors for better readability
  const colors = [
    'bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-red-500', 
    'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 
    'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 
    'bg-sky-500', 'bg-blue-500', 'bg-violet-500', 'bg-fuchsia-500'
  ];
  
  // Use hash to select a color
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

const CalendarView: React.FC<CalendarViewProps> = ({ 
  habits, 
  onToggleCompletion,
  month: propMonth,
  year: propYear 
}) => {
  const today = new Date();
  const [month, setMonth] = useState(propMonth !== undefined ? propMonth : today.getMonth());
  const [year, setYear] = useState(propYear !== undefined ? propYear : today.getFullYear());
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [showMultiDayHelp, setShowMultiDayHelp] = useState(false);

  // Filter out archived habits
  const activeHabits = useMemo(() => {
    return habits.filter(habit => !habit.archived);
  }, [habits]);

  // Get days in month (1-31)
  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [month, year]);

  // Get day of week for first day of month (0-6, where 0 is Sunday)
  const firstDayOfMonth = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [month, year]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: Array<number | null> = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add cells for all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  // Get month name
  const monthName = useMemo(() => {
    return new Date(year, month, 1).toLocaleString('default', { month: 'long' });
  }, [month, year]);

  // Map of completed dates for quick lookup
  const habitCompletionMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    
    activeHabits.forEach(habit => {
      const completedDates = habit.completedDates || [];
      completedDates.forEach(dateStr => {
        // Parse the date string (assuming format YYYY-MM-DD)
        const dateParts = dateStr.split('-').map(part => parseInt(part, 10));
        if (dateParts.length !== 3) return; // Invalid date format
        
        const dateYear = dateParts[0];
        const dateMonth = dateParts[1] - 1; // JS months are 0-indexed
        const dateDay = dateParts[2];
        
        // Check if date is in the current month/year
        if (dateMonth === month && dateYear === year) {
          if (!map[dateDay]) {
            map[dateDay] = new Set();
          }
          map[dateDay].add(habit.id);
        }
      });
    });
    
    return map;
  }, [activeHabits, month, year]);

  // Cache habit colors for consistent display
  const habitColorMap = useMemo(() => {
    const colorMap: Record<string, string> = {};
    
    activeHabits.forEach(habit => {
      colorMap[habit.id] = getHabitColor(habit.id);
    });
    
    return colorMap;
  }, [activeHabits]);

  // Navigate to previous month
  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // This function handles day clicks for multi-mode or to open the habit selector
  const handleDayClick = (day: number) => {
    if (!day) return;
    
    // If a habit is selected for multi-day toggle, toggle it directly
    if (selectedHabit) {
      // Create a date that won't be affected by timezone issues
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onToggleCompletion(selectedHabit, dateStr);
    } else {
      // Only show the habit selection popup if we're not in multi-day mode
      setHoveredDay(day);
    }
  };

  // Handle habit selection from the popup
  const handleHabitSelect = (day: number, habitId: string) => {
    // Create a date that won't be affected by timezone issues
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onToggleCompletion(habitId, dateStr);
    
    // If we're not in multi-day mode, close the popup after selection
    if (!selectedHabit) {
      setHoveredDay(null);
    }
  };

  // Select a habit for multi-day toggling
  const handleSelectHabitForToggling = (habitId: string) => {
    // If selecting a habit for the first time, show the help tooltip
    if (!selectedHabit && !localStorage.getItem('multiDayHelpSeen')) {
      setShowMultiDayHelp(true);
      localStorage.setItem('multiDayHelpSeen', 'true');
    }
    
    setSelectedHabit(habitId === selectedHabit ? null : habitId);
    setHoveredDay(null);
  };

  // Format for day number display
  const getDayNumberClass = (day: number) => {
    const isToday = today.getDate() === day && 
                   today.getMonth() === month && 
                   today.getFullYear() === year;
    
    const isSelected = day === hoveredDay;
    
    // Check if the selected habit is completed on this day
    const isSelectedHabitCompleted = selectedHabit && 
                                    habitCompletionMap[day]?.has(selectedHabit);
    
    return `h-10 w-10 rounded-full flex items-center justify-center ${
      isToday ? 'border-2 border-indigo-500' : ''
    } ${isSelected ? 'bg-gray-100' : ''} ${
      selectedHabit && isSelectedHabitCompleted ? 'bg-indigo-100' : ''
    }`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden relative">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthName} {year}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={previousMonth}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Previous month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => {
                setMonth(today.getMonth());
                setYear(today.getFullYear());
              }}
              className="px-2 py-1 text-xs rounded hover:bg-gray-100"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Next month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {selectedHabit && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium mb-1">Multi-day mode: <strong>{activeHabits.find(h => h.id === selectedHabit)?.title}</strong></p>
                <p className="text-xs">Click on any day to toggle completion for this habit. Days where this habit is completed will be highlighted.</p>
              </div>
              <div className="flex items-center">
                <button
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded mr-2"
                  onClick={() => setSelectedHabit(null)}
                >
                  Exit multi-day mode
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Multi-day help tooltip that appears when user first selects a habit */}
        {showMultiDayHelp && (
          <div className="absolute bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-md z-20 top-24 left-1/2 transform -translate-x-1/2 max-w-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-800 font-medium mb-1">💡 Multi-day selection active</p>
                <p className="text-yellow-700 text-sm">Now you can click on multiple days to toggle this habit's completion status.</p>
                <p className="text-yellow-700 text-sm mt-1">Click "Exit multi-day mode" when finished.</p>
              </div>
              <button 
                onClick={() => setShowMultiDayHelp(false)}
                className="text-yellow-500 hover:text-yellow-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Calendar header (day names) */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className={`grid grid-cols-7 gap-1 ${selectedHabit ? 'cursor-cell' : ''}`}>
          {calendarDays.map((day, index) => {
            // Skip rendering interactive elements for empty cells
            if (!day) {
              return (
                <div 
                  key={index} 
                  className="min-h-[60px] p-1 border border-gray-100 bg-gray-50"
                />
              );
            }
            
            // For days in the month, render with click handlers
            const isCurrentHabitCompleted = selectedHabit && habitCompletionMap[day]?.has(selectedHabit);
            
            return (
              <div 
                key={index} 
                className={`min-h-[60px] p-1 border border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  isCurrentHabitCompleted ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleDayClick(day)}
              >
                {/* Day number */}
                <div className={getDayNumberClass(day)}>
                  {day}
                </div>
                
                {/* Habit completion indicators with unique colors per habit */}
                {habitCompletionMap[day] && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.from(habitCompletionMap[day]).map(habitId => {
                      const habit = activeHabits.find(h => h.id === habitId);
                      const habitColor = habitColorMap[habitId] || 'bg-gray-500';
                      
                      return (
                        <div
                          key={habitId}
                          className={`w-3 h-3 rounded-full ${habitColor} ${
                            selectedHabit === habitId ? 'ring-2 ring-indigo-200' : ''
                          }`}
                          title={habit?.title}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Habit selection popup */}
      {hoveredDay !== null && (
        <div className="absolute p-3 bg-white shadow-lg rounded-lg border border-gray-200 z-10" 
             style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="mb-2 font-medium text-gray-700">
            {new Date(year, month, hoveredDay).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric' 
            })}
          </div>
          
          {activeHabits.length > 0 ? (
            <>
              <div className="mb-2 text-sm font-medium text-gray-500">Select a habit to toggle:</div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {activeHabits.map(habit => {
                  const isCompleted = habitCompletionMap[hoveredDay]?.has(habit.id);
                  const habitColor = habitColorMap[habit.id] || 'bg-gray-500';
                  
                  return (
                    <div 
                      key={habit.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleHabitSelect(hoveredDay, habit.id)}
                    >
                      <div className={`w-4 h-4 rounded-full mr-2 ${isCompleted ? habitColor : 'bg-gray-300'}`}></div>
                      <div className="flex-1">{habit.title}</div>
                      <div className="ml-auto text-xs text-gray-500">
                        {isCompleted ? 'Completed' : 'Not completed'}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <div className="text-xs font-medium text-gray-500">Multi-day selection mode:</div>
                </div>
                <p className="text-xs text-gray-500 my-1">Select a habit first, then click multiple days to toggle that habit.</p>
                <div className="space-y-1">
                  {activeHabits.map(habit => {
                    const habitColor = habitColorMap[habit.id] || 'bg-gray-500';
                    
                    return (
                      <button 
                        key={habit.id}
                        className={`flex items-center w-full text-left px-2 py-1 text-sm rounded ${
                          selectedHabit === habit.id 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleSelectHabitForToggling(habit.id)}
                      >
                        <div className={`w-3 h-3 rounded-full mr-2 ${habitColor}`}></div>
                        {habit.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-3 text-gray-500">
              <p>No habits available to toggle.</p>
              <p className="text-xs mt-1">Try creating a habit first.</p>
            </div>
          )}
          
          <button 
            className="mt-3 w-full py-1 text-sm text-gray-600 hover:text-gray-800 text-center"
            onClick={() => setHoveredDay(null)}
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Legend with colored dots */}
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          {activeHabits.length > 0 && (
            <div className="flex items-center flex-col gap-1">
              <div className="text-xs font-medium mb-1">Habit Colors:</div>
              <div className="flex flex-wrap gap-2">
                {activeHabits.map(habit => (
                  <div key={habit.id} className="flex items-center" title={habit.title}>
                    <div className={`w-3 h-3 rounded-full ${habitColorMap[habit.id]} mr-1`}></div>
                    <span className="truncate max-w-[80px]">{habit.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedHabit && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full ring-2 ring-indigo-200 mr-1"></div>
              <span>Selected Habit</span>
            </div>
          )}
          
          {selectedHabit && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 border border-blue-100 mr-1"></div>
              <span>Day with Selected Habit</span>
            </div>
          )}
          
          <div className="flex items-center">
            <div className="h-6 w-6 border-2 border-indigo-500 rounded-full flex items-center justify-center mr-1 text-[8px]">1</div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;