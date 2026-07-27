import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationBar } from '../components/common/NavigationBar';
import { Toaster } from '../components/ui/toaster';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavigationBar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};
