import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Complaint } from '../../features/complaints/complaintsSlice';
import { FileText, AlertTriangle, Clock } from 'lucide-react';

interface KPIGridProps {
  complaints: Complaint[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ complaints = [] }) => {
  const safeComplaints = complaints || [];
  const total = safeComplaints.length;
  const highSeverity = safeComplaints.filter(c => c.severity === 'HIGH' || c.severity === 'SEVERE').length;
  const pendingReview = safeComplaints.filter(c => c.status === 'PENDING').length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Complaints</CardTitle>
          <FileText className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">High Severity</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highSeverity}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReview}</div>
        </CardContent>
      </Card>
    </div>
  );
};
