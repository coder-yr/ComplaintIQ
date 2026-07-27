import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Complaint } from '../../features/complaints/complaintsSlice';
import { Card } from '../../components/ui/card';

interface ComplaintsTableProps {
  complaints: Complaint[];
}

export const ComplaintsTable: React.FC<ComplaintsTableProps> = ({ complaints }) => {
  
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

  if (complaints.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500">
        No complaints found. Click 'New Complaint' to start.
      </Card>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.complaint_number}</TableCell>
              <TableCell>{c.incident_date || 'N/A'}</TableCell>
              <TableCell>{c.product_name || 'N/A'}</TableCell>
              <TableCell>{c.batch_number || 'N/A'}</TableCell>
              <TableCell>{getSeverityBadge(c.severity)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={c.status === 'PENDING' ? 'text-orange-500' : 'text-gray-500'}>
                  {c.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
