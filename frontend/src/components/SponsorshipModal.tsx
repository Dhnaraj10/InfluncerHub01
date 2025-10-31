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
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe the sponsorship opportunity"
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
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add
              </button>
            </div>
            
            <div className="space-y-3 mt-2">
              {formData.deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">{index + 1}.</span>
                    </div>
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => handleDeliverableChange(index, e.target.value)}
                      className="w-full pl-8 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={`Deliverable #${index + 1}`}
                    />
                  </div>
                  {formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="px-3 py-2.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg"
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{sponsorship.title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {userRole === 'brand' 
              ? `For: ${typeof sponsorship.influencer === 'object' ? sponsorship.influencer.handle : 'N/A'}` 
              : (
                <span>
                  From: {
                    typeof sponsorship.brand === 'object' 
                      ? (
                        <Link 
                          to={`/brand/${sponsorship.brand._id}`} 
                          className="text-indigo-600 hover:text-indigo-900 hover:underline"
                        >
                          {sponsorship.brand.name || "Unknown Brand"}
                        </Link>
                      )
                      : sponsorship.brand
                  }
                </span>
              )
            }
          </p>
        </div>

        <div className="flex items-center">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            sponsorship.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            sponsorship.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            sponsorship.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            sponsorship.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            sponsorship.status === 'cancelled' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Budget:</span> 
            {sponsorship.budget ? ` ₹${sponsorship.budget.toLocaleString()}` : ' Not specified'}
          </p>
        </div>

        {sponsorship.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Description</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{sponsorship.description}</p>
          </div>
        )}

        {sponsorship.deadline && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Deadline</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(sponsorship.deadline)}</p>
          </div>
        )}

        {sponsorship.deliverables && sponsorship.deliverables.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Deliverables</h4>
            <ul className="list-disc pl-5 space-y-1">
              {sponsorship.deliverables.map((item, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>Created: {formatDate(sponsorship.createdAt)}</span>
          <span>Updated: {formatDate(sponsorship.updatedAt)}</span>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {userRole === 'influencer' && sponsorship.status === 'pending' && onReject && onAccept && (
            <>
              <button
                type="button"
                onClick={() => onReject(sponsorship._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => onAccept(sponsorship._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Accept
              </button>
            </>
          )}

          {userRole === 'brand' && sponsorship.status === 'accepted' && onComplete && (
            <button
              type="button"
              onClick={() => onComplete(sponsorship._id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Mark as Completed
            </button>
          )}

          {userRole === 'brand' && sponsorship.status === 'pending' && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(sponsorship._id)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SponsorshipModal;