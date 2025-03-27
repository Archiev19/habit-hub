import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { habits as habitsApi } from '../services/firebase-api';
import AddHabitForm from '../components/AddHabitForm';
import EditHabitForm from '../components/EditHabitForm';
import StreakSummary from '../components/StreakSummary';
import GoalProgress from '../components/GoalProgress';
import { calculateStreak, calculateLongestStreak } from '../utils/streakCalculator';
import { AddHabitModal } from '../components/AddHabitModal';
import { HabitAnalytics } from '../components/HabitAnalytics';
import Header from '../components/Header';
import { Habit } from '../types/habit';
import CalendarView from '../components/CalendarView';

// For development/testing without backend - Set to false to use real Firebase
const USE_MOCK_DATA = false;

// Predefined categories for selection (should match those in AddHabitForm)
const CATEGORIES = [
  'Health',
  'Fitness',
  'Productivity',
  'Personal Development',
  'Learning',
  'Finance',
  'Social',
  'Creativity',
  'Mindfulness',
  'Other'
];

// Mock habits for development
const MOCK_HABITS: Habit[] = [
  {
    id: 'habit1',
    title: 'Morning Exercise',
    description: 'Do 15 minutes of exercise every morning',
    frequency: 'daily',
    completions: {
      '2023-06-10': true,
      '2023-06-11': true
    },
    userId: 'mockUserId',
    archived: false,
    goalTarget: 5,
    goalPeriod: 'week',
    category: 'Fitness',
    tags: ['health', 'morning-routine', 'exercise']
  },
  {
    id: 'habit2',
    title: 'Read a Book',
    description: 'Read at least 10 pages of a book',
    frequency: 'daily',
    completions: {
      '2023-06-11': true
    },
    userId: 'mockUserId',
    archived: false,
    goalTarget: 1,
    goalPeriod: 'day',
    category: 'Learning',
    tags: ['reading', 'personal-development']
  },
  {
    id: 'habit3',
    title: 'Weekly Review',
    description: 'Review goals and progress for the week',
    frequency: 'weekly',
    completions: {
      '2023-06-05': true
    },
    userId: 'mockUserId',
    archived: false,
    goalTarget: 1,
    goalPeriod: 'week',
    category: 'Productivity',
    tags: ['planning', 'reflection']
  },
  {
    id: 'habit4',
    title: 'Meditation Practice',
    description: 'Practice meditation for 10 minutes',
    frequency: 'daily',
    completions: {
      '2023-05-20': true,
      '2023-05-21': true,
      '2023-05-22': true
    },
    userId: 'mockUserId',
    archived: true,
    goalTarget: 3,
    goalPeriod: 'week',
    category: 'Mindfulness',
    tags: ['mental-health', 'wellness']
  }
];

// Helper to convert Firestore data format to UI format
const prepareHabitForUI = (habit: Habit): Habit => {
  // Extract completed dates from completions object
  const completedDates = habit.completions ? 
    Object.entries(habit.completions)
      .filter(([_, isCompleted]) => isCompleted)
      .map(([date]) => date) 
    : [];
    
  // Calculate streaks
  const streakCount = calculateStreak(completedDates, habit.frequency);
  const longestStreak = calculateLongestStreak(completedDates, habit.frequency);
  
  return {
    ...habit,
    completedDates,
    streakCount,
    longestStreak
  };
};

const DashboardPage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    category: '',
    searchTerm: '',
  });
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  // Categories for habit filtering
  const filterCategories = ['health', 'productivity', 'learning', 'personal'];
  
  // Get all unique tags from habits for tag filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    
    // Ensure habits exists and is an array before iterating
    if (habits && Array.isArray(habits) && habits.length > 0) {
      habits.forEach(habit => {
        if (habit && habit.tags && Array.isArray(habit.tags) && habit.tags.length > 0) {
          habit.tags.forEach(tag => tags.add(tag));
        }
      });
    }
    return Array.from(tags);
  }, [habits]);

  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);

  const fetchHabits = async () => {
    try {
      if (!user) {
        if (USE_MOCK_DATA) {
          // Use mock data even if no user (for demo purposes)
          const processedHabits = MOCK_HABITS.map(prepareHabitForUI);
          setHabits(processedHabits);
          setFilteredHabits(processedHabits.filter(habit => !habit.archived));
        } else {
          setHabits([]);
        }
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      let habitsData;
      
      if (USE_MOCK_DATA) {
        // Use mock data for development
        habitsData = MOCK_HABITS;
      } else {
        // Use Firebase in production
        habitsData = await habitsApi.getAll(user.id);
      }
      
      // Convert to UI format with calculated streaks
      const processedHabits = habitsData.map(prepareHabitForUI);
      
      setHabits(processedHabits);
      setFilteredHabits(processedHabits.filter(habit => !habit.archived));
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      setError('Failed to load habits. Please try again.');
      
      // Fallback to mock data in case of error
      if (USE_MOCK_DATA) {
        const processedMockHabits = MOCK_HABITS.map(prepareHabitForUI);
        setHabits(processedMockHabits);
        setFilteredHabits(processedMockHabits.filter(habit => !habit.archived));
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and archive status whenever habits, filters, or showArchived change
  useEffect(() => {
    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      setFilteredHabits([]);
      return;
    }
    
    let result = [...habits];
    
    // Filter by archive status first
    if (!showArchived) {
      result = result.filter(habit => !habit.archived);
    }
    
    // Then apply other filters
    // Filter by category
    if (filters.category) {
      result = result.filter(habit => habit.category === filters.category);
    }
    
    // Filter by search term (check title, description, and tags)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(habit => 
        habit.title.toLowerCase().includes(searchLower) || 
        (habit.description && habit.description.toLowerCase().includes(searchLower)) ||
        (habit.tags && habit.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    setFilteredHabits(result);
  }, [habits, filters, showArchived]);

  useEffect(() => {
    // Initialize with mock data immediately
    if (USE_MOCK_DATA) {
      const processedMockHabits = MOCK_HABITS.map(prepareHabitForUI);
      setHabits(processedMockHabits);
      setFilteredHabits(processedMockHabits.filter(habit => !habit.archived));
      setLoading(false);
    }
    
    fetchHabits();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      searchTerm: '',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleShowArchived = () => {
    setShowArchived(prev => !prev);
  };

  const handleAddHabit = async (habitData: {
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    category?: string;
    tags?: string[];
    goalTarget?: number;
    goalPeriod?: 'day' | 'week' | 'month';
  }) => {
    try {
      if (!user && !USE_MOCK_DATA) {
        showNotification('Please log in to add habits', 'error');
        return;
      }
      
      if (USE_MOCK_DATA) {
        // Create a mock habit with a random ID
        const newHabit: Habit = {
          id: `habit${Date.now()}`,
          title: habitData.title,
          description: habitData.description,
          frequency: habitData.frequency,
          category: habitData.category,
          tags: habitData.tags || [],
          userId: user?.id || 'mockUserId',
          archived: false,
          goalTarget: habitData.goalTarget,
          goalPeriod: habitData.goalPeriod,
          completions: {},
          createdAt: new Date().toISOString()
        };
        
        // Process habit for UI display (add streak info)
        const processedHabit = prepareHabitForUI(newHabit);
        
        setHabits(prev => [processedHabit, ...prev]);
        setShowAddForm(false);
        setIsAddHabitModalOpen(false);
        showNotification('Habit added successfully!', 'success');
        return;
      }
      
      const newHabit = await habitsApi.create({
        ...habitData,
        userId: user!.id,
        archived: false,
      });
      
      // Convert to UI format
      const processedHabit = prepareHabitForUI(newHabit as Habit);
      
      setHabits(prev => [processedHabit, ...prev]);
      setShowAddForm(false);
      setIsAddHabitModalOpen(false);
      showNotification('Habit added successfully!', 'success');
    } catch (error: any) {
      console.error('Error adding habit:', error);
      showNotification(error.message || 'Failed to add habit', 'error');
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleUpdateHabit = async (habitId: string, habitData: { 
    title?: string; 
    description?: string; 
    frequency?: 'daily' | 'weekly';
    category?: string;
    tags?: string[];
    archived?: boolean;
    goalTarget?: number;
    goalPeriod?: 'day' | 'week' | 'month';
  }) => {
    try {
      if (!user && !USE_MOCK_DATA) {
        showNotification('Please log in to update habits', 'error');
        return;
      }
      
      if (USE_MOCK_DATA) {
        // Update a mock habit
        setHabits(prev => 
          prev.map(h => h.id === habitId ? { ...h, ...habitData } : h)
        );
        
        setEditingHabit(null);
        
        if (habitData.archived) {
          showNotification('Habit archived successfully!', 'success');
        } else {
          showNotification('Habit updated successfully!', 'success');
        }
        return;
      }
      
      const updatedHabit = await habitsApi.update(habitId, habitData, user!.id);
      
      // Convert to UI format
      const processedHabit = prepareHabitForUI(updatedHabit as Habit);
      
      setHabits(prev => 
        prev.map(h => h.id === habitId ? processedHabit : h)
      );
      
      setEditingHabit(null);
      
      if (habitData.archived) {
        showNotification('Habit archived successfully!', 'success');
      } else {
        showNotification('Habit updated successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Error updating habit:', error);
      showNotification(error.message || 'Failed to update habit', 'error');
    }
  };

  const confirmDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setHabitToDelete(habitId);
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      if (!user && !USE_MOCK_DATA) {
        showNotification('Please log in to delete habits', 'error');
        return;
      }
      
      if (USE_MOCK_DATA) {
        // Delete a mock habit
        setHabits(prev => prev.filter(h => h.id !== habitId));
        showNotification('Habit deleted successfully!', 'success');
        return;
      }
      
      await habitsApi.delete(habitId, user!.id);
      
      setHabits(prev => prev.filter(h => h.id !== habitId));
      showNotification('Habit deleted successfully!', 'success');
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      showNotification(error.message || 'Failed to delete habit', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setHabitToDelete(null);
    }
  };

  const handleToggleCompletion = async (habitId: string, date: string = new Date().toISOString().split('T')[0]) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      
      if (!habit) {
        console.error('Habit not found');
        return;
      }
      
      if (!user && !USE_MOCK_DATA) {
        showNotification('Please log in to track habits', 'error');
        return;
      }
      
      // Get current completion status for the date
      const isCompleted = habit.completions?.[date] || false;
      
      if (USE_MOCK_DATA) {
        // Update a mock habit's completion status
        setHabits(prev => 
          prev.map(h => {
            if (h.id === habitId) {
              const newCompletions = { ...h.completions } || {};
              
              if (isCompleted) {
                delete newCompletions[date];
              } else {
                newCompletions[date] = true;
              }
              
              const updatedHabit = {
                ...h,
                completions: newCompletions
              };
              
              return prepareHabitForUI(updatedHabit);
            }
            return h;
          })
        );
        
        isCompleted 
          ? showNotification('Habit marked as incomplete', 'info')
          : showNotification('Habit completed! Great job!', 'success');
        
        return;
      }
      
      const updatedHabit = await habitsApi.toggleCompletion(habitId, user!.id, date);
      
      // Convert to UI format
      const processedHabit = prepareHabitForUI(updatedHabit as Habit);
      
      setHabits(prev => 
        prev.map(h => h.id === habitId ? processedHabit : h)
      );
      
      isCompleted 
        ? showNotification('Habit marked as incomplete', 'info')
        : showNotification('Habit completed! Great job!', 'success');
      
    } catch (error: any) {
      console.error('Error toggling habit completion:', error);
      showNotification(error.message || 'Failed to update habit completion', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const today = new Date().toISOString().split('T')[0];

  const renderHabitItem = (habit: Habit) => {
    // Check if the habit has the completedDates property
    const completedDates = habit.completedDates || [];
    
    return (
      <li key={habit.id} className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => handleToggleCompletion(habit.id)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  habit.completions && habit.completions[today]
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {habit.completions && habit.completions[today] && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-indigo-600 truncate">{habit.title}</p>
                {habit.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">{habit.description}</p>
                )}
                {habit.tags && habit.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {habit.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {habit.streakCount !== undefined && habit.streakCount > 0 && (
                <div className="flex items-center">
                  <span className="text-orange-500">🔥</span>
                  <span className="ml-1 text-sm text-gray-500">{habit.streakCount}</span>
                </div>
              )}
              <div className="flex items-center">
                <button
                  onClick={() => handleEditHabit(habit)}
                  className="ml-2 text-indigo-600 hover:text-indigo-900"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => confirmDeleteHabit(habit.id)}
                  className="ml-2 text-red-600 hover:text-red-900"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Show progress if goal is set */}
          {habit.goalTarget && habit.goalPeriod && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress towards {habit.goalTarget} times per {habit.goalPeriod}</span>
                <span>
                  {completedDates.filter(date => {
                    const dateObj = new Date(date);
                    const today = new Date();
                    
                    switch(habit.goalPeriod) {
                      case 'day':
                        return dateObj.toDateString() === today.toDateString();
                      case 'week':
                        const startOfWeek = new Date(today);
                        startOfWeek.setDate(today.getDate() - today.getDay());
                        return dateObj >= startOfWeek;
                      case 'month':
                        return dateObj.getMonth() === today.getMonth() &&
                               dateObj.getFullYear() === today.getFullYear();
                      default:
                        return false;
                    }
                  }).length} / {habit.goalTarget}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ 
                    width: `${Math.min(
                      (completedDates.filter(date => {
                        const dateObj = new Date(date);
                        const today = new Date();
                        
                        switch(habit.goalPeriod) {
                          case 'day':
                            return dateObj.toDateString() === today.toDateString();
                          case 'week':
                            const startOfWeek = new Date(today);
                            startOfWeek.setDate(today.getDate() - today.getDay());
                            return dateObj >= startOfWeek;
                          case 'month':
                            return dateObj.getMonth() === today.getMonth() &&
                                  dateObj.getFullYear() === today.getFullYear();
                          default:
                            return false;
                        }
                      }).length / habit.goalTarget) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Latest completions */}
          {completedDates.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {completedDates.slice(-5).map(date => (
                <span key={date} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  {formatDate(date)}
                </span>
              ))}
              {completedDates.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{completedDates.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </li>
    );
  };

  const viewModes = [
    { id: 'list', label: 'List View', icon: 'list' },
    { id: 'calendar', label: 'Calendar View', icon: 'calendar' }
  ];
  const [viewMode, setViewMode] = useState('list');
  
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
            <p className="mt-1 text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {viewModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => handleViewModeChange(mode.id)}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    viewMode === mode.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsAddHabitModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Habit
            </button>
          </div>
        </div>

        {/* Overall Habit Summary Dashboard */}
        <div className="mb-6 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-indigo-800 mb-2">Total Habits</h3>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-indigo-600">{habits.length}</span>
                  <span className="ml-2 text-sm text-indigo-500">
                    ({habits.filter(h => !h.archived).length} active)
                  </span>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-indigo-800 mb-2">Habit Completion</h3>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-indigo-700">Today</span>
                    <span className="font-medium text-indigo-900">
                      {habits.filter(h => !h.archived && h.completions && h.completions[today]).length} / {habits.filter(h => !h.archived).length}
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${habits.filter(h => !h.archived).length > 0 
                          ? (habits.filter(h => !h.archived && h.completions && h.completions[today]).length / habits.filter(h => !h.archived).length) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-indigo-800 mb-2">Longest Streak</h3>
                {habits.length > 0 ? (
                  <div className="flex items-center">
                    <span className="text-orange-500 text-2xl mr-2">🔥</span>
                    <div>
                      <div className="text-xl font-bold text-indigo-600">
                        {Math.max(...habits.map(h => h.longestStreak || 0))} days
                      </div>
                      <div className="text-sm text-indigo-500">
                        {habits.reduce((max, h) => h.longestStreak && h.longestStreak > max.streak ? { streak: h.longestStreak, title: h.title } : max, { streak: 0, title: '' }).title}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-indigo-500">No habits tracked yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Habit Analytics Component */}
        <div className="mb-6">
          <HabitAnalytics habits={habits} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main content - Habit list */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and filter */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search title, description, tags..."
                  />
                </div>
                <div className="mt-3 md:mt-0 md:ml-4 flex items-center space-x-3">
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              
              {/* Tag filters if there are tags */}
              {allTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        searchTerm: tag
                      }))}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        filters.searchTerm === tag
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Habit List or Calendar View based on selected view mode */}
            {loading ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 flex justify-center">
                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : !habits || habits.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <p className="text-gray-500">You haven't created any habits yet.</p>
                <button 
                  onClick={() => setIsAddHabitModalOpen(true)} 
                  className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Your First Habit
                </button>
              </div>
            ) : filteredHabits.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <p className="text-gray-500">No habits match your filters.</p>
                <button 
                  onClick={clearFilters} 
                  className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'list' ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredHabits.map(renderHabitItem)}
                </ul>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Calendar View</h3>
                <div className="overflow-x-auto">
                  <CalendarView habits={filteredHabits} onToggleCompletion={handleToggleCompletion} />
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar - Stats and summaries */}
          <div className="space-y-6">
            {/* Streaks summary */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Streak Summary</h2>
              {habits.length === 0 ? (
                <p className="text-gray-500 text-sm">Start tracking habits to see your streaks!</p>
              ) : (
                <div className="space-y-4">
                  {habits
                    .filter(h => !h.archived && h.streakCount && h.streakCount > 0)
                    .sort((a, b) => (b.streakCount || 0) - (a.streakCount || 0))
                    .slice(0, 3)
                    .map(habit => (
                      <div key={habit.id} className="flex items-center justify-between">
                        <span className="text-sm truncate">{habit.title}</span>
                        <div className="flex items-center">
                          <span className="text-orange-500 mr-1">🔥</span>
                          <span className="text-sm text-gray-500">{habit.streakCount} days</span>
                        </div>
                      </div>
                    ))
                  }
                  
                  {habits.filter(h => !h.archived && h.streakCount && h.streakCount > 0).length === 0 && (
                    <p className="text-gray-500 text-sm">Complete habits consistently to build streaks!</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Tag cloud or categories */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Habit Categories</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(category => 
                  habits.some(h => h.category === category)
                ).map(category => (
                  <button
                    key={category}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      category
                    }))}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      filters.category === category
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                
                {habits.length === 0 && (
                  <p className="text-gray-500 text-sm">Add habits with categories to see them here!</p>
                )}
              </div>
            </div>
            
            {/* Show/Hide archived */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Archived Habits</h2>
                <button
                  onClick={toggleShowArchived}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  {showArchived ? 'Hide Archived' : 'Show Archived'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddHabitModal
        isOpen={isAddHabitModalOpen}
        onClose={() => setIsAddHabitModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      {/* Edit Habit Modal */}
      {editingHabit && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setEditingHabit(null)} />
          
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-lg w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Habit</h2>
                  <button
                    onClick={() => setEditingHabit(null)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <EditHabitForm
                    habit={editingHabit}
                    onSubmit={(data) => handleUpdateHabit(editingHabit.id, data)}
                    onCancel={() => setEditingHabit(null)}
                    onDelete={() => {
                      if (window.confirm('Are you sure you want to delete this habit?')) {
                        handleDeleteHabit(editingHabit.id);
                        setEditingHabit(null);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete habit?</h3>
            <p className="text-gray-500 mb-5">
              Are you sure you want to delete this habit? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setHabitToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => habitToDelete && handleDeleteHabit(habitToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 