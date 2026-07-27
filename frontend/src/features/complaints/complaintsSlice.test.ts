import { describe, it, expect, vi } from 'vitest';
import reducer, { clearCurrentComplaint, fetchComplaints, saveComplaint } from './complaintsSlice';
import api from '../../services/api';

vi.mock('../../services/api');

describe('complaintsSlice', () => {
  const initialState = {
    list: [],
    currentComplaint: null,
    status: 'idle' as const,
    error: null,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearCurrentComplaint', () => {
    const state = {
      ...initialState,
      currentComplaint: { id: '1', complaint_number: 'C1', description: 'test', severity: 'LOW', priority: 'LOW', status: 'OPEN', created_at: '', customer_name: '', product_name: '', batch_number: '', incident_date: '' },
    };
    expect(reducer(state, clearCurrentComplaint())).toEqual(initialState);
  });

  it('should handle fetchComplaints.pending', () => {
    const action = { type: fetchComplaints.pending.type };
    const state = reducer(initialState, action);
    expect(state.status).toEqual('loading');
  });

  it('should handle fetchComplaints.fulfilled', () => {
    const mockComplaints = [{ id: '1', complaint_number: 'C1' }];
    const action = { type: fetchComplaints.fulfilled.type, payload: mockComplaints };
    const state = reducer(initialState, action);
    expect(state.status).toEqual('succeeded');
    expect(state.list).toEqual(mockComplaints);
  });

  it('should handle fetchComplaints.rejected', () => {
    const action = { type: fetchComplaints.rejected.type, error: { message: 'Network error' } };
    const state = reducer(initialState, action);
    expect(state.status).toEqual('failed');
    expect(state.error).toEqual('Network error');
  });

  it('should handle saveComplaint.fulfilled', () => {
    const newComplaint = { id: '2', complaint_number: 'C2' };
    const action = { type: saveComplaint.fulfilled.type, payload: newComplaint };
    const state = reducer(initialState, action);
    expect(state.list).toContain(newComplaint);
  });
});
