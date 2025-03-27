import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { preferences as preferencesApi } from '../services/firebase-api';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { UserPreferences } from '../types/habit';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Initialize with default preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    dateFormat: 'MM/DD/YYYY',
    firstDayOfWeek: 'Monday',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emailNotifications: true,
  });

  // Fetch user preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setFetchError(null);
        const data = await preferencesApi.get(user.id);
        
        if (data) {
          setPreferences({
            dateFormat: data.dateFormat || 'MM/DD/YYYY',
            firstDayOfWeek: data.firstDayOfWeek || 'Monday',
            timeZone: data.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : true,
          });
        }
      } catch (error: any) {
        console.error('Failed to fetch preferences:', error);
        setFetchError(
          error.message || 
          'Failed to load preferences. Please refresh the page to try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, [user]);

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setPreferences(prev => ({
      ...prev,
      [name]: newValue,
    }));
    setHasUnsavedChanges(true);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!user) {
      setSaveError('You must be logged in to save preferences');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await preferencesApi.update(user.id, preferences);
      setHasUnsavedChanges(false);
      setShowConfirmation(false);
    } catch (error: any) {
      console.error('Failed to save preferences:', error);
      setSaveError(
        error.message || 
        'Failed to save preferences. Please check your connection and try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigateAway = () => {
    if (hasUnsavedChanges) {
      setShowConfirmation(true);
    } else {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => navigate('/dashboard')}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmText="Leave"
        cancelText="Stay"
      />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <button
              onClick={handleNavigateAway}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fetchError ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            {fetchError}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            {/* Profile Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 text-sm text-gray-500">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1 text-sm text-gray-500">{user?.name}</div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
              <div className="space-y-6">
                {/* Date Format */}
                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    value={preferences.dateFormat}
                    onChange={handlePreferenceChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  </select>
                </div>

                {/* First Day of Week */}
                <div>
                  <label htmlFor="firstDayOfWeek" className="block text-sm font-medium text-gray-700">
                    First Day of Week
                  </label>
                  <select
                    id="firstDayOfWeek"
                    name="firstDayOfWeek"
                    value={preferences.firstDayOfWeek}
                    onChange={handlePreferenceChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                  </select>
                </div>

                {/* Email Notifications */}
                <div>
                  <div className="flex items-center">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={handlePreferenceChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                      Email Notifications
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6">
                {saveError && (
                  <div className="mb-4 bg-red-50 p-4 rounded-md text-red-700">
                    {saveError}
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    (!hasUnsavedChanges || isSaving) && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage; 