import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { fetchComplaints } from '../../features/complaints/complaintsSlice';
import { KPIGrid } from './KPIGrid';
import { ComplaintsTable } from './ComplaintsTable';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Complaint Dashboard</h1>
        <Button onClick={() => navigate('/complaints/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> New Complaint
        </Button>
      </div>

      <KPIGrid complaints={list} />
      
      {status === 'loading' && <p className="text-gray-500">Loading complaints...</p>}
      {status === 'failed' && <p className="text-red-500">{error}</p>}
      {status === 'succeeded' && <ComplaintsTable complaints={list} />}
    </div>
  );
};
