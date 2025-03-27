import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = React.useState<'streaks' | 'calendar' | 'stats'>('streaks');
  const features: ('streaks' | 'calendar' | 'stats')[] = ['streaks', 'calendar', 'stats'];

  // Week days array
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedFeature(current => {
        const currentIndex = features.indexOf(current);
        return features[(currentIndex + 1) % features.length];
      });
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to generate calendar days with proper offset
  const generateCalendarDays = () => {
    // Assuming it's for the current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const startingDay = firstDay.getDay(); // 0-6 (Sunday-Saturday)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Create array for empty spaces before first day
    const days = Array(startingDay).fill(null);
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  return (
    <div className="bg-indigo-800 min-h-screen text-white">
      {/* Navigation */}
      <nav className="py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="text-white bg-white/30 rounded-lg p-2 backdrop-blur-sm group-hover:bg-white/40 transition-all">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.9"/>
                  <path d="M25 12L15 22L11 18" stroke="indigo" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="ml-3 text-2xl font-bold text-white drop-shadow-lg">HabitHub</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-white hover:text-indigo-200 text-sm font-medium">
              Get Started
            </Link>
            <Link to="/mobile" className="text-white hover:text-indigo-200 text-sm font-medium">
              Mobile Apps
            </Link>
            <Link to="/about" className="text-white hover:text-indigo-200 text-sm font-medium">
              Learn More
            </Link>
          </div>
          <div>
            <Link
              to="/login"
              className="bg-white text-indigo-800 hover:bg-indigo-100 px-6 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 md:py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-indigo-400 opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-indigo-300 opacity-10"></div>
        <div className="absolute top-1/3 right-10 w-10 h-10 rounded-full bg-indigo-200 opacity-15"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 rounded-full bg-indigo-500 opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="block text-white">Transform habits</span>
                <span className="block text-indigo-300">into victories.</span>
              </h1>
              <p className="mt-6 text-lg text-indigo-200 max-w-xl">
                Start your journey to better habits today. Make every task enjoyable and track your progress along the way.
              </p>
              <div className="mt-8">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-indigo-300 hover:bg-indigo-200"
                >
                  Sign Up For Free
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Dashboard Preview</h2>
                  <div className="flex gap-2">
                    {features.map(feature => (
                      <button 
                        key={feature}
                        onClick={() => setSelectedFeature(feature)}
                        className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
                          selectedFeature === feature 
                            ? 'bg-indigo-300 text-indigo-900' 
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[300px]">
                  {/* Streaks View */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    selectedFeature === 'streaks' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}>
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Morning Exercise</span>
                          <span className="text-indigo-300">🔥 15 days</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-300 rounded-full transition-all duration-1000" 
                               style={{ width: selectedFeature === 'streaks' ? '75%' : '0%' }}></div>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Read 30 Minutes</span>
                          <span className="text-indigo-300">🔥 8 days</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-300 rounded-full transition-all duration-1000" 
                               style={{ width: selectedFeature === 'streaks' ? '60%' : '0%' }}></div>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Meditate</span>
                          <span className="text-indigo-300">🔥 21 days</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-300 rounded-full transition-all duration-1000" 
                               style={{ width: selectedFeature === 'streaks' ? '90%' : '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar View */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    selectedFeature === 'calendar' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm mb-4 text-indigo-200">November 2023</div>
                      {/* Week days header */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                          <div key={day} className="text-center text-xs text-indigo-300 font-medium h-8 flex items-center justify-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays().map((day, i) => (
                          <div 
                            key={i} 
                            className={`h-8 rounded-md flex items-center justify-center text-sm transition-all duration-300
                              ${!day ? 'bg-transparent' : 
                                day % 3 === 0 ? 'bg-indigo-300/20 hover:bg-indigo-300/30' : 
                                'bg-white/5 hover:bg-white/10'}`}
                          >
                            <span className={`${day ? '' : 'invisible'}`}>{day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats View */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    selectedFeature === 'stats' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/5 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-indigo-300">87%</div>
                          <div className="text-sm text-indigo-200">Completion</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-indigo-300">15</div>
                          <div className="text-sm text-indigo-200">Streak</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-indigo-300">5</div>
                          <div className="text-sm text-indigo-200">Habits</div>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-sm mb-2">Weekly Progress</div>
                        <div className="flex items-end h-32 gap-2">
                          {[60, 80, 40, 100, 75, 90, 85].map((height, i) => (
                            <div 
                              key={i} 
                              className="flex-1 bg-indigo-300/20 rounded-t-sm transition-all duration-1000" 
                              style={{ 
                                height: selectedFeature === 'stats' ? `${height}%` : '0%'
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-indigo-200">
                          <span>M</span>
                          <span>T</span>
                          <span>W</span>
                          <span>T</span>
                          <span>F</span>
                          <span>S</span>
                          <span>S</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Boxes */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Track Progress Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/15 transition-all group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-indigo-200">Watch your habits grow with beautiful visualizations and detailed analytics</p>
            </div>

            {/* Streak System Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/15 transition-all group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Streaks</h3>
              <p className="text-indigo-200">Stay motivated with streak tracking and achievement milestones</p>
            </div>

            {/* Customization Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/15 transition-all group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74485 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66515 20.1656 4.29 19.79C3.91435 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91435 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95231 15.6971 4.68 15.08C4.42093 14.4755 3.82758 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87231 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83435 6.74485 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83435 4.66515 4.21 4.29C4.58515 3.91435 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66485 3.91435 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95231 8.92 4.68H9C9.60447 4.42093 9.99738 3.82758 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74758 14.3955 4.34093 15 4.6C15.6171 4.87231 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83435 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83435 19.71 4.21C20.0856 4.58515 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66485 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalize Your Journey</h3>
              <p className="text-indigo-200">Create custom habits, set personal goals, and track your way</p>
            </div>
          </div>
        </div>

        {/* Add some space at the bottom */}
        <div className="h-24"></div>
      </div>
    </div>
  );
};

export default LandingPage; 