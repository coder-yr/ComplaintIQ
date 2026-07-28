import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { fetchComplaints } from '../../features/complaints/complaintsSlice';
import { KPIGrid } from './KPIGrid';
import { ComplaintsTable } from './ComplaintsTable';
import { DashboardCharts } from './DashboardCharts';
import { Button } from '../../components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, status, error } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchComplaints());
    }
  }, [status, dispatch]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 pb-12">
      {/* Hero / Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">{today}</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, QA Team</h1>
          <p className="text-sm text-gray-500 mt-1">Here is the latest overview of your complaint investigations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <Bell className="h-5 w-5" />
          </Button>
          <Button onClick={() => navigate('/complaints/new')} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 h-11 text-base shadow-sm hover:shadow-md transition-all duration-150">
            <Plus className="mr-2 h-5 w-5" /> New Complaint
          </Button>
        </div>
      </div>

      <KPIGrid complaints={list} />
      
      {status === 'succeeded' && list.length > 0 && (
        <DashboardCharts complaints={list} />
      )}
      
      {status === 'loading' && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">
          Failed to load complaints: {error}
        </div>
      )}
      
      {status === 'succeeded' && (
        <div className="pt-2">
          <ComplaintsTable complaints={list} />
        </div>
      )}
    </div>
  );
};
