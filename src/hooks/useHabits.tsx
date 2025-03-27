import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { habits as habitsApi } from '../services/firebase-api';
import { Habit, NewHabitData, UpdateHabitData } from '../types/habit';

// Helper to convert Firestore data format to UI format
const prepareHabitForUI = (habit: any): Habit => {
  // Extract completed dates from completions object
  const completedDates = habit.completions ? 
    Object.entries(habit.completions)
      .filter(([_, isCompleted]) => isCompleted)
      .map(([date]) => date) 
    : [];
  
  return {
    ...habit,
    completedDates
  };
};

/**
 * Custom hook for managing habits
 * Provides functions for fetching, creating, updating, and deleting habits
 */
const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    fetchHabits();
  }, [user]);

  /**
   * Fetches all habits for the current user
   */
  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setHabits([]);
        return;
      }
      
      const habitsData = await habitsApi.getAll(user.id);
      const processedHabits = habitsData.map(prepareHabitForUI);
      setHabits(processedHabits);
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      setError('Failed to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds a new habit for the current user
   * @param habitData - The habit data to create
   * @returns The newly created habit
   */
  const addHabit = async (habitData: NewHabitData) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const newHabit = await habitsApi.create({
        ...habitData,
        userId: user.id
      });
      
      const processedHabit = prepareHabitForUI(newHabit);
      setHabits(prev => [processedHabit, ...prev]);
      
      return processedHabit;
    } catch (error: any) {
      console.error('Error adding habit:', error);
      setError('Failed to add habit. Please try again.');
      throw error;
    }
  };

  /**
   * Updates an existing habit
   * @param habitId - The ID of the habit to update
   * @param habitData - The habit data to update
   * @returns The updated habit
   */
  const updateHabit = async (habitId: string, habitData: UpdateHabitData) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const updatedHabit = await habitsApi.update(habitId, habitData, user.id);
      
      const processedHabit = prepareHabitForUI(updatedHabit);
      setHabits(habits.map(habit => 
        habit.id === habitId ? processedHabit : habit
      ));
      
      return processedHabit;
    } catch (error: any) {
      console.error('Error updating habit:', error);
      setError('Failed to update habit. Please try again.');
      throw error;
    }
  };

  /**
   * Deletes a habit
   * @param habitId - The ID of the habit to delete
   * @returns True if deletion was successful
   */
  const deleteHabit = async (habitId: string) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await habitsApi.delete(habitId, user.id);
      setHabits(habits.filter(habit => habit.id !== habitId));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit. Please try again.');
      throw error;
    }
  };

  /**
   * Toggles the completion status of a habit for a specific date
   * @param habitId - The ID of the habit
   * @param date - The date to toggle completion for
   * @returns The updated habit
   */
  const toggleCompletion = async (habitId: string, date: string) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const updatedHabit = await habitsApi.toggleCompletion(habitId, user.id, date);
      
      const processedHabit = prepareHabitForUI(updatedHabit);
      setHabits(habits.map(habit => 
        habit.id === habitId ? processedHabit : habit
      ));
      
      return processedHabit;
    } catch (error: any) {
      console.error('Error toggling habit completion:', error);
      setError('Failed to toggle habit completion. Please try again.');
      throw error;
    }
  };

  /**
   * Archives a habit
   * @param habitId - The ID of the habit to archive
   * @returns The updated habit
   */
  const archiveHabit = async (habitId: string) => {
    return updateHabit(habitId, { archived: true });
  };

  /**
   * Unarchives a habit
   * @param habitId - The ID of the habit to unarchive
   * @returns The updated habit
   */
  const unarchiveHabit = async (habitId: string) => {
    return updateHabit(habitId, { archived: false });
  };

  return {
    habits,
    loading,
    error,
    fetchHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    archiveHabit,
    unarchiveHabit
  };
};

export default useHabits; 