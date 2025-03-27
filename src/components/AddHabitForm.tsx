import React, { useState } from 'react';

interface AddHabitFormProps {
  onSubmit: (habitData: { 
    title: string; 
    description: string; 
    frequency: 'daily' | 'weekly';
    category?: string;
    tags?: string[];
    goalTarget?: number;
    goalPeriod?: 'day' | 'week' | 'month';
  }) => Promise<void>;
  onCancel: () => void;
  initialValues?: {
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    category?: string;
    tags?: string[];
    goalTarget?: number;
    goalPeriod?: 'day' | 'week' | 'month';
  };
}

// Predefined categories for selection
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

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    frequency: initialValues?.frequency || 'daily' as 'daily' | 'weekly',
    category: initialValues?.category || '',
    tagsInput: initialValues?.tags?.join(', ') || '', // For handling tag input as comma-separated string
    goalTarget: initialValues?.goalTarget?.toString() || '',
    goalPeriod: initialValues?.goalPeriod || 'week'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    // Process tags from comma-separated string to array
    const tags = formData.tagsInput
      ? formData.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : undefined;
    
    // Process goal target
    const goalTarget = formData.goalTarget ? parseInt(formData.goalTarget, 10) : undefined;
    
    // Check if goalTarget is a valid number
    if (formData.goalTarget && (isNaN(goalTarget as number) || goalTarget as number <= 0)) {
      setError('Goal target must be a positive number');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        title: formData.title,
        description: formData.description,
        frequency: formData.frequency,
        category: formData.category || undefined,
        tags,
        goalTarget,
        goalPeriod: goalTarget ? formData.goalPeriod as 'day' | 'week' | 'month' : undefined
      });
    } catch (error: any) {
      setError(error.message || 'Failed to create habit');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {initialValues ? 'Edit Habit' : 'Create New Habit'}
      </h2>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Morning Exercise"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Do 15 minutes of exercise every morning"
          />
        </div>
        
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tagsInput" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            id="tagsInput"
            name="tagsInput"
            value={formData.tagsInput}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter tags separated by commas"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate tags with commas (e.g., morning, health, fitness)
          </p>
        </div>
        
        {/* Goal setting section */}
        <div className="p-4 bg-gray-50 rounded-md border border-gray-300">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Set Goal (Optional)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="goalTarget" className="block text-sm font-medium text-gray-700">
                Target Completions
              </label>
              <input
                type="number"
                id="goalTarget"
                name="goalTarget"
                value={formData.goalTarget}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., 5"
              />
              <p className="mt-1 text-xs text-gray-500">
                Example: Complete this habit 5 times per week
              </p>
            </div>
            
            <div>
              <label htmlFor="goalPeriod" className="block text-sm font-medium text-gray-700">
                Time Period
              </label>
              <select
                id="goalPeriod"
                name="goalPeriod"
                value={formData.goalPeriod}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialValues ? 'Save Changes' : 'Create Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm; 