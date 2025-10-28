//frontend/src/components/SponsorshipFilters.tsx
import React, { useState } from 'react';

interface SponsorshipFiltersProps {
  onFilterChange: (filters: { status: string; date: string }) => void;
}

const SponsorshipFilters: React.FC<SponsorshipFiltersProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState('All');
  const [date, setDate] = useState('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, date });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onFilterChange({ status, date: newDate });
  };

  return (
    <div className="flex space-x-4">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={handleStatusChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option>All</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Rejected</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={handleDateChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
    </div>
  );
};

export default SponsorshipFilters;
