//frontend/src/pages/DeleteAccount.tsx
import React from 'react';

const DeleteAccount: React.FC = () => {
  const handleDelete = () => {
    // In a real application, you would have account deletion logic here
    alert('Account deleted successfully!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Delete Account</h1>
      <p className="mb-4">
        Are you sure you want to delete your account? This action cannot be undone.
      </p>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleDelete}
      >
        Delete My Account
      </button>
    </div>
  );
};

export default DeleteAccount;
