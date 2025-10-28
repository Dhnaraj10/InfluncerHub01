// frontend/src/pages/MySponsorships.tsx
import React, { useState } from 'react';
import SponsorshipList from '../components/SponsorshipList';
import SponsorshipFilters from '../components/SponsorshipFilters';

const MySponsorships: React.FC = () => {
  const [filters, setFilters] = useState({ status: 'All', date: '' });

  const handleFilterChange = (newFilters: { status: string; date: string }) => {
    setFilters(newFilters);
    // In a real application, you would likely trigger a data fetch here
    // based on the new filters to update the SponsorshipList.
    console.log('Filters changed:', newFilters);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Sponsorships</h1>
      <div className="mb-8">
        <SponsorshipFilters onFilterChange={handleFilterChange} />
      </div>
      <div>
        <SponsorshipList />
      </div>
    </div>
  );
};

export default MySponsorships;
