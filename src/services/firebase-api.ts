import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp, 
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface HabitData {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  category?: string;
  tags?: string[];
  archived?: boolean;
  goalTarget?: number;
  goalPeriod?: 'day' | 'week' | 'month';
  userId: string;
  completions?: Record<string, boolean>;
  createdAt?: any;
}

// Habit API calls
export const habits = {
  getAll: async (userId: string) => {
    try {
      const habitsQuery = query(
        collection(db, 'habits'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(habitsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting habits:', error);
      throw error;
    }
  },
  
  getById: async (id: string, userId: string) => {
    try {
      const habitDoc = await getDoc(doc(db, 'habits', id));
      
      if (!habitDoc.exists()) {
        throw new Error('Habit not found');
      }
      
      const habitData = habitDoc.data();
      
      // Security check
      if (habitData.userId !== userId) {
        throw new Error('Unauthorized access to habit');
      }
      
      return {
        id: habitDoc.id,
        ...habitData
      };
    } catch (error) {
      console.error('Error getting habit:', error);
      throw error;
    }
  },
  
  create: async (habitData: Omit<HabitData, 'createdAt'>) => {
    try {
      const newHabit = {
        ...habitData,
        completions: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'habits'), newHabit);
      
      return {
        id: docRef.id,
        ...newHabit,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  },
  
  update: async (id: string, habitData: Partial<HabitData>, userId: string) => {
    try {
      const habitRef = doc(db, 'habits', id);
      const habitSnap = await getDoc(habitRef);
      
      if (!habitSnap.exists()) {
        throw new Error('Habit not found');
      }
      
      // Security check
      if (habitSnap.data().userId !== userId) {
        throw new Error('Unauthorized access to habit');
      }
      
      const updatedData = {
        ...habitData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(habitRef, updatedData);
      
      return {
        id,
        ...habitSnap.data(),
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  },
  
  delete: async (id: string, userId: string) => {
    try {
      const habitRef = doc(db, 'habits', id);
      const habitSnap = await getDoc(habitRef);
      
      if (!habitSnap.exists()) {
        throw new Error('Habit not found');
      }
      
      // Security check
      if (habitSnap.data().userId !== userId) {
        throw new Error('Unauthorized access to habit');
      }
      
      await deleteDoc(habitRef);
      
      return { id };
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },
  
  toggleCompletion: async (id: string, userId: string, date?: string) => {
    try {
      const today = date || new Date().toISOString().split('T')[0];
      const habitRef = doc(db, 'habits', id);
      const habitSnap = await getDoc(habitRef);
      
      if (!habitSnap.exists()) {
        throw new Error('Habit not found');
      }
      
      // Security check
      if (habitSnap.data().userId !== userId) {
        throw new Error('Unauthorized access to habit');
      }
      
      const habitData = habitSnap.data();
      const completions = habitData.completions || {};
      
      // Toggle the completion status
      completions[today] = !completions[today];
      
      // Update the habit document
      await updateDoc(habitRef, { 
        completions,
        updatedAt: serverTimestamp()
      });
      
      return {
        id,
        ...habitData,
        completions,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      throw error;
    }
  }
};

// User preferences API calls
export const preferences = {
  get: async (userId: string) => {
    try {
      const prefsDoc = await getDoc(doc(db, 'preferences', userId));
      
      if (prefsDoc.exists()) {
        return prefsDoc.data();
      } else {
        // Return default preferences if not found
        return {
          dateFormat: 'MM/DD/YYYY',
          firstDayOfWeek: 'Sunday',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          emailNotifications: false
        };
      }
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  },
  
  update: async (userId: string, preferences: {
    dateFormat: string;
    firstDayOfWeek: string;
    timeZone: string;
    emailNotifications: boolean;
  }) => {
    try {
      const prefsRef = doc(db, 'preferences', userId);
      const prefsDoc = await getDoc(prefsRef);
      
      if (prefsDoc.exists()) {
        await updateDoc(prefsRef, {
          ...preferences,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create preferences document if it doesn't exist
        await updateDoc(prefsRef, {
          ...preferences,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return {
        ...preferences,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
};

export default { habits, preferences }; 