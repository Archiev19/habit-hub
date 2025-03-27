import { Habit } from '../hooks/useHabits';

export interface HabitTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  frequency: 'daily' | 'weekly';
  goalTarget?: number;
  goalPeriod?: 'day' | 'week' | 'month';
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: 'morning-exercise',
    title: 'Morning Exercise',
    description: 'Start your day with energizing physical activity',
    icon: '🏃‍♂️',
    category: 'Fitness',
    tags: ['health', 'morning-routine', 'exercise'],
    frequency: 'daily',
    goalTarget: 5,
    goalPeriod: 'week'
  },
  {
    id: 'meditation',
    title: 'Daily Meditation',
    description: 'Practice mindfulness and reduce stress',
    icon: '🧘‍♂️',
    category: 'Mindfulness',
    tags: ['mental-health', 'wellness', 'mindfulness'],
    frequency: 'daily',
    goalTarget: 1,
    goalPeriod: 'day'
  },
  {
    id: 'reading',
    title: 'Reading Time',
    description: 'Read books to expand knowledge and imagination',
    icon: '📚',
    category: 'Learning',
    tags: ['education', 'personal-development', 'reading'],
    frequency: 'daily',
    goalTarget: 30,
    goalPeriod: 'week'
  },
  {
    id: 'water-intake',
    title: 'Stay Hydrated',
    description: 'Drink water regularly throughout the day',
    icon: '💧',
    category: 'Health',
    tags: ['health', 'wellness', 'hydration'],
    frequency: 'daily',
    goalTarget: 8,
    goalPeriod: 'day'
  },
  {
    id: 'gratitude-journal',
    title: 'Gratitude Journal',
    description: "Write down things you are grateful for",
    icon: '📔',
    category: 'Personal Development',
    tags: ['mindfulness', 'journaling', 'mental-health'],
    frequency: 'daily',
    goalTarget: 1,
    goalPeriod: 'day'
  },
  {
    id: 'coding-practice',
    title: 'Coding Practice',
    description: 'Improve programming skills with regular practice',
    icon: '💻',
    category: 'Learning',
    tags: ['education', 'programming', 'skills'],
    frequency: 'daily',
    goalTarget: 5,
    goalPeriod: 'week'
  }
];

export function createHabitFromTemplate(templateId: string) {
  const template = HABIT_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  return {
    title: template.title,
    description: template.description,
    category: template.category,
    tags: template.tags,
    frequency: template.frequency,
    goalTarget: template.goalTarget,
    goalPeriod: template.goalPeriod
  };
}

export const getHabitTemplateById = (id: string): HabitTemplate | undefined => {
  return HABIT_TEMPLATES.find(template => template.id === id);
};

export const getHabitTemplatesByCategory = (category: string): HabitTemplate[] => {
  return HABIT_TEMPLATES.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = new Set(HABIT_TEMPLATES.map(template => template.category));
  return Array.from(categories);
};

export default HABIT_TEMPLATES; 