import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Complaint } from '../../features/complaints/complaintsSlice';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface ComplaintsTableProps {
  complaints: Complaint[];
}

export const ComplaintsTable: React.FC<ComplaintsTableProps> = ({ complaints }) => {
  const [activeTab, setActiveTab] = useState('all');

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'SEVERE':
      case 'CRITICAL':
        return <Badge className="bg-red-500 hover:bg-red-600">CRITICAL</Badge>;
      case 'HIGH':
        return <Badge className="bg-orange-500 hover:bg-orange-600">HIGH</Badge>;
      case 'MODERATE':
      case 'MEDIUM':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">MEDIUM</Badge>;
      default:
        return <Badge className="bg-green-500 hover:bg-green-600">LOW</Badge>;
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'pending') return c.status === 'PENDING';
    if (activeTab === 'high') return c.severity === 'HIGH' || c.severity === 'SEVERE' || c.severity === 'CRITICAL';
    return true;
  });

  if (complaints.length === 0) {
    return (
      <Card className="p-12 text-center text-gray-500 border-dashed border-2">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
             <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No complaints found</h3>
          <p className="text-sm text-gray-500 mb-4">You don't have any complaints logged in the system yet.</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Create New Complaint</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search, Filter, and Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-gray-100 p-1 h-10 rounded-lg">
            <TabsTrigger value="all" className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">All Complaints</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Pending Review</TabsTrigger>
            <TabsTrigger value="high" className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">High Severity</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search complaints..." 
                className="pl-9 border-gray-200 border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled
              />
            </div>
            <Button variant="outline" className="h-[38px] rounded-lg bg-white border-gray-200 shadow-sm hover:bg-gray-50 text-gray-700 font-medium">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filters
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
            <Table>
              <TableHeader className="bg-gray-50/80 border-b border-gray-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-3.5 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Complaint ID</TableHead>
                  <TableHead className="py-3.5 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Date Logged</TableHead>
                  <TableHead className="py-3.5 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Product</TableHead>
                  <TableHead className="py-3.5 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Batch No.</TableHead>
                  <TableHead className="py-3.5 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Severity</TableHead>
                  <TableHead className="py-3.5 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Status</TableHead>
                  <TableHead className="py-3.5 text-right font-semibold text-gray-600 uppercase tracking-wider text-[11px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                      No complaints match the selected filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints.map((c) => (
                    <TableRow key={c.id} className="hover:bg-blue-50/30 transition-colors duration-150 border-b border-gray-100 last:border-0 group">
                      <TableCell className="py-3.5 font-medium text-gray-900">{c.complaint_number}</TableCell>
                      <TableCell className="py-3.5 text-gray-600 text-sm">{c.incident_date || 'N/A'}</TableCell>
                      <TableCell className="py-3.5 text-gray-700 text-sm font-medium">{c.product_name || 'N/A'}</TableCell>
                      <TableCell className="py-3.5 text-gray-600 font-mono text-sm">{c.batch_number || 'N/A'}</TableCell>
                      <TableCell className="py-3.5">{getSeverityBadge(c.severity)}</TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination Footer */}
            {filteredComplaints.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-3">
                <span className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{filteredComplaints.length}</span> of <span className="font-medium text-gray-900">{filteredComplaints.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border-gray-200" disabled>
                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border-gray-200" disabled>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
