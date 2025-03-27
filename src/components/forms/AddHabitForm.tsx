import React, { useState } from 'react';
import { Habit } from '../../types/habit';
import useHabits from '../../hooks/useHabits';
import { useNotification } from '../../context/NotificationContext';

interface AddHabitFormProps {
  onClose: () => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onClose }) => {
  const { addHabit } = useHabits();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    category: '',
    tags: '',
    goalTarget: '',
    goalPeriod: 'day',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setFormError('Habit title is required');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const goalTarget = formData.goalTarget ? parseInt(formData.goalTarget, 10) : undefined;
      
      const newHabit: Omit<Habit, 'id' | 'userId'> = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        frequency: formData.frequency as 'daily' | 'weekly',
        category: formData.category.trim() || undefined,
        tags: formData.tags.trim() ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
        goalTarget: isNaN(goalTarget!) ? undefined : goalTarget,
        goalPeriod: formData.goalPeriod as 'day' | 'week' | 'month',
        archived: false,
      };
      
      await addHabit(newHabit);
      showNotification('Habit created successfully', 'success');
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'Failed to create habit. Please try again.');
      console.error('Error creating habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div>
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Habit Title *
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="e.g., Morning Meditation"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter a description of your habit..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <div className="mt-1">
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="e.g., Health, Productivity"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="e.g., morning, mindfulness, health (comma separated)"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="goalTarget" className="block text-sm font-medium text-gray-700">
            Goal Target
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="goalTarget"
              id="goalTarget"
              min="1"
              value={formData.goalTarget}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g., 5"
            />
          </div>
        </div>
        <div>
          <label htmlFor="goalPeriod" className="block text-sm font-medium text-gray-700">
            Goal Period
          </label>
          <div className="mt-1">
            <select
              id="goalPeriod"
              name="goalPeriod"
              value={formData.goalPeriod}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm; 