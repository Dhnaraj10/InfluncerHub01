// frontend/src/pages/Settings.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <ul className="space-y-4">
        <li>
          <Link to="/profile" className="text-blue-500 hover:underline">
            Edit Profile
          </Link>
        </li>
        <li>
          <Link to="/delete-account" className="text-red-500 hover:underline">
            Delete Account
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Settings;
