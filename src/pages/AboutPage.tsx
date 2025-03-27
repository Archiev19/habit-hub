import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
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
            <Link to="/mobile" className="text-white hover:text-indigo-200 text-sm font-medium">
              Mobile Apps
            </Link>
            <Link to="/about" className="text-indigo-300 hover:text-indigo-200 text-sm font-medium">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About HabitHub</h1>
          <p className="text-xl text-indigo-200 mb-12">
            Our mission is to help people build better habits and live more intentional lives.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="bg-indigo-700/50 rounded-lg p-8 backdrop-blur-sm mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <div className="text-indigo-200 space-y-4">
              <p>
                HabitHub began as a personal quest to find a simpler way to track daily routines and hobbies. 
                Like many of us, I found myself juggling multiple habit-tracking apps, sticky notes, and journals, 
                but none of them quite captured the simplicity and flexibility I was looking for.
              </p>
              <p>
                What started as a minimalist solution to my own needs has evolved into something that I believe 
                everyone can benefit from. The goal was simple: create a habit tracking experience that's both 
                beautiful and effortless, where the focus remains on building better habits, not managing a complex app.
              </p>
              <p>
                Whether you're trying to read more books, exercise regularly, or practice a new skill, HabitHub is 
                designed to be your gentle companion on the journey of self-improvement. It's not about perfection – 
                it's about progress, one small step at a time.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-indigo-700/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">Simplicity</h3>
              <p className="text-indigo-200">
                We believe in keeping things simple and focused, helping you build habits without the complexity.
              </p>
            </div>
            <div className="bg-indigo-700/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">💫</div>
              <h3 className="text-xl font-bold mb-2">Progress</h3>
              <p className="text-indigo-200">
                Every small step counts. We help you celebrate the journey, not just the destination.
              </p>
            </div>
            <div className="bg-indigo-700/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Support</h3>
              <p className="text-indigo-200">
                Building habits is personal, but you're not alone. We're here to support your journey.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-indigo-300 hover:bg-indigo-200"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 