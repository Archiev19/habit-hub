import React, { useState, useEffect } from 'react';
import { Habit } from '../types/habit';

export interface EditHabitFormProps {
  habit: Habit;
  onSubmit: (habitData: {
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    category?: string;
    tags?: string[];
    archived?: boolean;
    goalTarget?: number;
    goalPeriod?: 'day' | 'week' | 'month';
  }) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const FREQUENCY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
];

const GOAL_PERIOD_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

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

const EditHabitForm: React.FC<EditHabitFormProps> = ({ 
  habit,
  onSubmit, 
  onCancel, 
  onDelete
}) => {
  // Use habit data for initial values
  const [formData, setFormData] = useState({
    title: habit.title || '',
    description: habit.description || '',
    frequency: habit.frequency || 'daily',
    category: habit.category || '',
    tagsInput: habit.tags ? habit.tags.join(', ') : '',
    goalTarget: habit.goalTarget?.toString() || '',
    goalPeriod: habit.goalPeriod || 'week'
  });
  
  const [archived, setArchived] = useState(habit.archived || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Update form if props change
  useEffect(() => {
    setFormData({
      title: habit.title || '',
      description: habit.description || '',
      frequency: habit.frequency || 'daily',
      category: habit.category || '',
      tagsInput: habit.tags ? habit.tags.join(', ') : '',
      goalTarget: habit.goalTarget?.toString() || '',
      goalPeriod: habit.goalPeriod || 'week'
    });
    setArchived(habit.archived || false);
  }, [habit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      // Process tags from comma-separated string to array
      const tags = formData.tagsInput
        ? formData.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : undefined;
      
      // Convert goalTarget to number if provided
      const goalTarget = formData.goalTarget ? parseInt(formData.goalTarget, 10) : undefined;
      
      // Only include goal fields if a target is set
      const goalFields = goalTarget ? {
        goalTarget,
        goalPeriod: formData.goalPeriod as 'day' | 'week' | 'month'
      } : {};
      
      setLoading(true);
      setError(null);
      
      await onSubmit({
        title: formData.title,
        description: formData.description,
        frequency: formData.frequency as 'daily' | 'weekly',
        category: formData.category || undefined,
        tags,
        archived,
        ...goalFields
      });
      
      // Close form on success handled by parent
    } catch (error: any) {
      setError(error.message || 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveToggle = () => {
    setArchived(!archived);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Habit Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Morning Exercise"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Describe your habit..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {FREQUENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="tagsInput" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tagsInput"
              name="tagsInput"
              value={formData.tagsInput}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., health, morning, exercise"
            />
          </div>

          <div className="mb-4 bg-indigo-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-indigo-800 mb-2">Goal Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="goalTarget" className="block text-sm text-indigo-700">
                  Target Count
                </label>
                <input
                  type="number"
                  id="goalTarget"
                  name="goalTarget"
                  value={formData.goalTarget}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-indigo-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label htmlFor="goalPeriod" className="block text-sm text-indigo-700">
                  Period
                </label>
                <select
                  id="goalPeriod"
                  name="goalPeriod"
                  value={formData.goalPeriod}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-indigo-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {GOAL_PERIOD_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm text-indigo-600 mt-2">
              Set a target for how many times you want to complete this habit per period.
            </p>
          </div>

          <div className="flex items-center py-2 px-4 bg-gray-50 rounded-md">
            <input
              id="archived"
              type="checkbox"
              checked={archived}
              onChange={handleArchiveToggle}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="archived" className="ml-2 block text-sm text-gray-700">
              Archive this habit
            </label>
            <p className="ml-2 text-xs text-gray-500">
              (Archived habits are hidden from your main dashboard)
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md shadow-sm text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Habit
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Habit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditHabitForm; 