import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Pharma Complaint AI
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-800">Admin User</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
