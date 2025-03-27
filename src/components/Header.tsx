import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  user?: {
    name: string;
  } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="relative">
              <svg
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="4"
                  className="fill-[#4338ca]"
                />
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  className="fill-[#4f46e5]"
                />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 ml-2">HabitHub</h1>
          </Link>
        </div>
        {user ? (
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>{user.name}</span>
            </Link>
            <Link
              to="/settings"
              className="text-gray-600 hover:text-gray-900"
            >
              Settings
            </Link>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header; 