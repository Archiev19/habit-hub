import React from 'react';
import { HABIT_TEMPLATES, HabitTemplate } from '../utils/habitTemplates';

interface HabitTemplateSelectorProps {
  onSelectTemplate: (template: HabitTemplate | null) => void;
}

export const HabitTemplateSelector: React.FC<HabitTemplateSelectorProps> = ({ onSelectTemplate }) => {
  const categories = Array.from(new Set(HABIT_TEMPLATES.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">
              {category}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HABIT_TEMPLATES.filter(t => t.category === category).map(template => (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-500"
                >
                  <span className="text-2xl mr-3">{template.icon}</span>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-800">
                      {template.title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {template.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 