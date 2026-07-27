import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { NewComplaintPage } from './NewComplaintPage';
import { vi, describe, it, expect } from 'vitest';

describe('NewComplaintPage', () => {
  it('renders the initial form', () => {
    renderWithProviders(<NewComplaintPage />);
    expect(screen.getByText('Ingest New Complaint')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paste the customer complaint email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze with AI' })).toBeDisabled();
  });

  it('enables the analyze button when text is entered', () => {
    renderWithProviders(<NewComplaintPage />);
    const textarea = screen.getByPlaceholderText(/Paste the customer complaint email/i);
    fireEvent.change(textarea, { target: { value: 'This is a complaint' } });
    
    const button = screen.getByRole('button', { name: 'Analyze with AI' });
    expect(button).toBeEnabled();
  });

  it('displays progress bar when isProcessing is true', async () => {
    const { store } = renderWithProviders(<NewComplaintPage />);
    
    // Dispatch after mount to avoid useEffect reset
    store.dispatch({ type: 'ai/analyzeDocument/pending' });
    
    expect(await screen.findByText('AI Pipeline Progress')).toBeInTheDocument();
    expect(screen.getByText('Uploading Complaint')).toBeInTheDocument();
  });

  it('displays error message when error is present', async () => {
    const { store } = renderWithProviders(<NewComplaintPage />);
    
    // Dispatch error
    store.dispatch({ type: 'ai/analyzeDocument/rejected', error: { message: 'API failed' } });
    
    expect(await screen.findByText('Analysis Failed')).toBeInTheDocument();
    expect(screen.getByText('API failed')).toBeInTheDocument();
  });
});
