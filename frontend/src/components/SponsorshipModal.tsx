// frontend/src/components/SponsorshipModal.tsx
import React, { useState } from 'react';
import { Sponsorship } from '../types/types';
import { Link } from 'react-router-dom';
import Modal from './Modal';

interface SponsorshipModalProps {
  sponsorship: Sponsorship | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  userRole: string;
  onCreateSponsorship?: (data: any) => void;
}

const SponsorshipModal: React.FC<SponsorshipModalProps> = ({
  sponsorship,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onCancel,
  onComplete,
  userRole,
  onCreateSponsorship
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deliverables: ['']
  });

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    setFormData(prev => ({
      ...prev,
      deliverables: newDeliverables
    }));
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const removeDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateSponsorship) {
      onCreateSponsorship({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined
      });
    }
  };

  // If we're creating a new sponsorship (no existing sponsorship object)
  if (!sponsorship) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Create Sponsorship Offer">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Sponsorship title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe the sponsorship opportunity..."
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Budget (₹)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter budget amount"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deliverables
              </label>
              <button
                type="button"
                onClick={addDeliverable}
                className="text-sm text-primary hover:text-primary-dark"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={deliverable}
                    onChange={(e) => handleDeliverableChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={`Deliverable ${index + 1}`}
                  />
                  {formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              Send Offer
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  // If we're viewing an existing sponsorship
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sponsorship Details">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{sponsorship.title}</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{sponsorship.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">{sponsorship.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {sponsorship.budget ? `₹${sponsorship.budget}` : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(sponsorship.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(sponsorship.updatedAt)}</p>
          </div>
        </div>

        {sponsorship.deliverables && sponsorship.deliverables.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Deliverables</h4>
            <ul className="list-disc pl-5 space-y-1">
              {sponsorship.deliverables.map((deliverable, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-300">{deliverable}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons based on user role and sponsorship status */}
        <div className="flex justify-end space-x-3 pt-4">
          {userRole === "brand" && sponsorship.status === "pending" && (
            <button
              onClick={() => onCancel && onCancel(sponsorship._id)}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              Cancel Offer
            </button>
          )}

          {userRole === "brand" && sponsorship.status === "accepted" && (
            <button
              onClick={() => onComplete && onComplete(sponsorship._id)}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              Mark Complete
            </button>
          )}

          {userRole === "influencer" && sponsorship.status === "pending" && (
            <>
              <button
                onClick={() => onReject && onReject(sponsorship._id)}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
              <button
                onClick={() => onAccept && onAccept(sponsorship._id)}
                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
              >
                Accept
              </button>
            </>
          )}

          <Link 
            to={`/messages?recipient=${
              userRole === "brand" 
                ? (typeof sponsorship.influencer === 'object' ? sponsorship.influencer?._id : '') 
                : (typeof sponsorship.brand === 'object' && sponsorship.brand.user 
                    ? (typeof sponsorship.brand.user === 'object' ? sponsorship.brand.user?._id : '') 
                    : '')
            }`}
            className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition"
          >
            Message
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default SponsorshipModal;