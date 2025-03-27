import React, { useState } from 'react';
import { HabitTemplate } from '../utils/habitTemplates';
import { HabitTemplateSelector } from './HabitTemplateSelector';
import AddHabitForm from './AddHabitForm';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habitData: {
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    category?: string;
    tags?: string[];
    goalTarget?: number;
    goalPeriod?: 'day' | 'week' | 'month';
  }) => Promise<void>;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null | undefined>(undefined);

  if (!isOpen) return null;

  const handleTemplateSelect = (template: HabitTemplate | null) => {
    setSelectedTemplate(template);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(undefined);
  };

  const handleSubmit = async (habitData: any) => {
    await onAddHabit(habitData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedTemplate !== undefined ? 'Create New Habit' : 'Choose a Template'}
              </h2>
              <div className="flex items-center gap-4">
                {selectedTemplate === undefined && (
                  <button
                    onClick={() => handleTemplateSelect(null)}
                    className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
                  >
                    Create Custom Habit
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedTemplate !== undefined ? (
                <div>
                  <button
                    onClick={handleBackToTemplates}
                    className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Templates
                  </button>
                  <AddHabitForm
                    initialValues={selectedTemplate ? {
                      title: selectedTemplate.title,
                      description: selectedTemplate.description,
                      frequency: selectedTemplate.frequency,
                      category: selectedTemplate.category,
                      tags: selectedTemplate.tags,
                      goalTarget: selectedTemplate.goalTarget,
                      goalPeriod: selectedTemplate.goalPeriod
                    } : undefined}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                  />
                </div>
              ) : (
                <HabitTemplateSelector onSelectTemplate={handleTemplateSelect} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 