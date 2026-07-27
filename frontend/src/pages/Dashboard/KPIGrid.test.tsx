import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPIGrid } from './KPIGrid';
import { describe, it, expect } from 'vitest';
import { Complaint } from '../../features/complaints/complaintsSlice';

describe('KPIGrid', () => {
  it('renders zero counts when complaints list is empty', () => {
    render(<KPIGrid complaints={[]} />);
    
    // Total should be 0, High Severity should be 0, Pending should be 0
    // The numbers are the text contents of the elements
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(3);
  });

  it('calculates metrics correctly', () => {
    const mockComplaints: Complaint[] = [
      { id: '1', complaint_number: 'C1', severity: 'HIGH', status: 'PENDING', description: '', priority: '', created_at: '', customer_name: '', product_name: '', batch_number: '', incident_date: '' },
      { id: '2', complaint_number: 'C2', severity: 'SEVERE', status: 'OPEN', description: '', priority: '', created_at: '', customer_name: '', product_name: '', batch_number: '', incident_date: '' },
      { id: '3', complaint_number: 'C3', severity: 'LOW', status: 'PENDING', description: '', priority: '', created_at: '', customer_name: '', product_name: '', batch_number: '', incident_date: '' }
    ];
    
    render(<KPIGrid complaints={mockComplaints} />);
    
    // Total Complaints: 3
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Pending Review: 2 (PENDING)
    // High Severity and Pending Review both equal 2, so getAllByText('2') gives 2 elements
    const twos = screen.getAllByText('2');
    expect(twos.length).toBe(2);
  });
});
