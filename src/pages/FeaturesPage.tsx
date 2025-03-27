import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage: React.FC = () => {
  return (
    <div className="bg-indigo-800 min-h-screen text-white">
      {/* Navigation */}
      <nav className="py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-white">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.2"/>
                  <path d="M25 12L15 22L11 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="ml-2 text-2xl font-bold text-white">HabitHub</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-indigo-300 hover:text-indigo-200 text-sm font-medium">
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
        
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Started with HabitHub</h1>
          <p className="text-xl text-indigo-200 mb-12">
            Your journey to building better habits starts here. Follow these simple steps to transform your daily routine.
          </p>
        </div>
        
        {/* Features */}
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-indigo-700/50 rounded-lg p-8 backdrop-blur-sm">
              <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">1</div>
              <h2 className="text-2xl font-bold mb-4">Create Your Habits</h2>
              <p className="text-indigo-200 mb-6">
                Start by creating habits you want to develop. Choose from our curated templates or create custom habits 
                tailored to your goals. Set frequency, categories, and track your progress over time.
              </p>
              <ul className="space-y-3 text-indigo-200">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Choose from 25+ ready-made habit templates
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Set daily or weekly tracking frequency
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Organize with categories and tags
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Set specific goals for achievement
                </li>
              </ul>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white/10 shadow-xl rounded-lg overflow-hidden w-full max-w-md border border-indigo-500/20">
                <img 
                  src="/assets/feature-create-habit.png" 
                  alt="Creating a habit in HabitHub" 
                  className="w-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/4f46e5/e0e7ff?text=Create+Habits';
                    target.onerror = null;
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative flex justify-center order-last md:order-first">
              <div className="bg-white/10 shadow-xl rounded-lg overflow-hidden w-full max-w-md border border-indigo-500/20">
                <img 
                  src="/assets/feature-track-progress.png" 
                  alt="Tracking progress in HabitHub" 
                  className="w-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/4f46e5/e0e7ff?text=Track+Progress';
                    target.onerror = null;
                  }}
                />
              </div>
            </div>
            <div className="bg-indigo-700/50 rounded-lg p-8 backdrop-blur-sm">
              <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">2</div>
              <h2 className="text-2xl font-bold mb-4">Track Your Progress</h2>
              <p className="text-indigo-200 mb-6">
                Easily mark habits as complete each day. Our calendar view allows you to see your consistency 
                and build streaks that motivate you to continue your good habits.
              </p>
              <ul className="space-y-3 text-indigo-200">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  One-click habit completion
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Visual calendar tracking for patterns
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Streak counting for motivation
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Track habits for any date in the past
                </li>
              </ul>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-indigo-700/50 rounded-lg p-8 backdrop-blur-sm">
              <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">3</div>
              <h2 className="text-2xl font-bold mb-4">Analyze and Improve</h2>
              <p className="text-indigo-200 mb-6">
                Monitor your habits over time with our insightful analytics. Identify patterns, see where 
                you're succeeding, and discover areas where you can improve.
              </p>
              <ul className="space-y-3 text-indigo-200">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Visual progress metrics and charts
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Completion rate statistics
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Filter by category to focus on specific areas
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Personalized insights and suggestions
                </li>
              </ul>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white/10 shadow-xl rounded-lg overflow-hidden w-full max-w-md border border-indigo-500/20">
                <img 
                  src="/assets/feature-analytics.png" 
                  alt="Analytics in HabitHub" 
                  className="w-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/4f46e5/e0e7ff?text=Analytics';
                    target.onerror = null;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center mt-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Habits?</h2>
          <p className="text-xl text-indigo-200 mb-8">
            Join thousands of users who are already building better habits and achieving their goals.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-indigo-300 hover:bg-indigo-200"
          >
            Sign Up For Free
          </Link>
          <p className="mt-4 text-indigo-300">No credit card required</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage; 