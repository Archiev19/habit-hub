import React from 'react';
import { Link } from 'react-router-dom';

const MobileAppsPage: React.FC = () => {
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
            <Link to="/features" className="text-white hover:text-indigo-200 text-sm font-medium">
              Get Started
            </Link>
            <Link to="/mobile" className="text-indigo-300 hover:text-indigo-200 text-sm font-medium">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">HabitHub Mobile Apps</h1>
          <p className="text-xl text-indigo-200 mb-12">
            Coming soon to iOS and Android! Track your habits on the go with our mobile applications.
          </p>
          
          <div className="bg-indigo-700/50 rounded-lg p-8 backdrop-blur-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Join the Waitlist</h2>
            <p className="text-indigo-200 mb-6">
              Be the first to know when our mobile apps launch. Sign up to receive early access and exclusive features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2 bg-white/20 rounded-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-indigo-300 text-indigo-900 font-bold py-2 px-6 rounded-md hover:bg-indigo-200">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppsPage; 