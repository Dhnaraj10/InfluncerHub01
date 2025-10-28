//frontend/src/components/SearchFilters.tsx
import React from 'react';

const SearchFilters: React.FC = () => {
  return (
    <div className="flex space-x-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option>All</option>
          <option>Fashion</option>
          <option>Gaming</option>
          <option>Food</option>
        </select>
      </div>
      <div>
        <label htmlFor="followers" className="block text-sm font-medium text-gray-700">
          Followers
        </label>
        <select
          id="followers"
          name="followers"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option>Any</option>
          <option>1k-10k</option>
          <option>10k-100k</option>
          <option>100k+</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
