import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Complaint } from '../../features/complaints/complaintsSlice';
import { FileText, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface KPIGridProps {
  complaints: Complaint[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ complaints = [] }) => {
  const safeComplaints = complaints || [];
  const total = safeComplaints.length;
  const highSeverity = safeComplaints.filter(c => c.severity === 'HIGH' || c.severity === 'SEVERE' || c.severity === 'CRITICAL').length;
  const pendingReview = safeComplaints.filter(c => c.status === 'PENDING').length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* Total Complaints */}
      <Card className="rounded-xl border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Complaints</CardTitle>
          <div className="p-2 bg-blue-50/80 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
          </p>
        </CardContent>
      </Card>
      
      {/* High Severity */}
      <Card className="rounded-xl border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">High Severity</CardTitle>
          <div className="p-2 bg-red-50/80 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{highSeverity}</div>
          <p className="text-xs text-red-600 font-medium mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> Requires attention
          </p>
        </CardContent>
      </Card>
      
      {/* Pending Review */}
      <Card className="rounded-xl border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Pending Review</CardTitle>
          <div className="p-2 bg-amber-50/80 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{pendingReview}</div>
          <p className="text-xs text-amber-600 font-medium mt-1 flex items-center">
            -2% from last week
          </p>
        </CardContent>
      </Card>

      {/* Avg Resolution Time (Mock) */}
      <Card className="rounded-xl border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Avg Resolution</CardTitle>
          <div className="p-2 bg-emerald-50/80 rounded-lg">
            <Clock className="h-5 w-5 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">4.2 <span className="text-base font-semibold text-gray-500">days</span></div>
          <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> Faster than average
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
