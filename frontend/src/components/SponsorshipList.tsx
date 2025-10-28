//frontend/src/components/SponsorshipList.tsx
import React from 'react';

interface Sponsorship {
  id: number;
  name: string;
  status: string;
  budget: number;
}

const sponsorships: Sponsorship[] = [
  { id: 1, name: 'Awesome Product', status: 'Active', budget: 5000 },
  { id: 2, name: 'Cool Service', status: 'Pending', budget: 2500 },
  { id: 3, name: 'Great Brand', status: 'Completed', budget: 10000 },
];

const SponsorshipList: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Sponsorships</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sponsorships.map((sponsorship) => (
            <tr key={sponsorship.id}>
              <td className="px-6 py-4 whitespace-nowrap">{sponsorship.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sponsorship.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">${sponsorship.budget}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SponsorshipList;
