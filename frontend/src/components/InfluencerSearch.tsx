//frontend/src/components/InfluencerSearch.tsx
import React, { useState } from 'react';

interface InfluencerSearchProps {
  onSearch: (query: string) => void;
}

const InfluencerSearch: React.FC<InfluencerSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="border rounded-l py-2 px-4 w-full"
        placeholder="Search for influencers..."
        value={query}
        onChange={handleInputChange}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default InfluencerSearch;
