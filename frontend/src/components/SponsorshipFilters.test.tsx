//frontend/src/components/SponsorshipFilters.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SponsorshipFilters from './SponsorshipFilters';

describe('SponsorshipFilters', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  test('renders status and date filters', () => {
    render(<SponsorshipFilters onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
  });

  test('calls onFilterChange with correct status when status changes', () => {
    render(<SponsorshipFilters onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: 'Completed' } });

    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'Completed', date: '' });
  });

  test('calls onFilterChange with correct date when date changes', () => {
    render(<SponsorshipFilters onFilterChange={mockOnFilterChange} />);

    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: '2023-01-15' } });

    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'All', date: '2023-01-15' });
  });

  test('calls onFilterChange with both status and date when both change', () => {
    render(<SponsorshipFilters onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: 'Active' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'Active', date: '' });

    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: '2023-02-20' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'Active', date: '2023-02-20' });

    expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
  });
});
