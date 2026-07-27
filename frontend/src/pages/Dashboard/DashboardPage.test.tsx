import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { DashboardPage } from './DashboardPage';
import { vi, describe, it, expect } from 'vitest';

describe('DashboardPage', () => {
  it('renders loading state', () => {
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        complaints: {
          list: [],
          currentComplaint: null,
          status: 'loading',
          error: null
        }
      } as any
    });
    
    expect(screen.getByText('Loading complaints...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        complaints: {
          list: [],
          currentComplaint: null,
          status: 'failed',
          error: 'Network Error'
        }
      } as any
    });
    
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });

  it('renders table when succeeded', () => {
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        complaints: {
          list: [
            { id: '1', complaint_number: 'C1', severity: 'LOW', status: 'PENDING', description: '', priority: '', created_at: '', customer_name: 'John', product_name: '', batch_number: '', incident_date: '' }
          ],
          currentComplaint: null,
          status: 'succeeded',
          error: null
        }
      } as any
    });
    
    // Check if the KPI grid and Complaints table are rendered
    expect(screen.getByText('C1')).toBeInTheDocument();
  });
});
