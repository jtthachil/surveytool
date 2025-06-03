import React from 'react';
import { CheckCircle } from 'lucide-react';

interface EmailNotificationProps {
  notifications: Array<{
    id: string;
    studyTitle: string;
    participantCount: number;
    eligibilityCriteria: string[];
    requestedDate: Date;
    priority: 'high' | 'medium' | 'low';
    payout?: number;
    studyLength?: number;
  }>;
}

export const EmailNotification: React.FC<EmailNotificationProps> = ({
  notifications
}) => {
  const notification = notifications[0]; // Use first notification for display
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-t-lg">
        <h2 className="text-xl font-bold">🎉 Congratulations!</h2>
        <p className="text-pink-100 mt-1">You have a new screener request</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Hi there,</p>
          <p className="text-gray-700">
            Congratulations! You've got a new screener request for a study from{' '}
            <span className="font-semibold text-gray-900">AkquaintX team</span>.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Study Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Study title</label>
              <p className="text-gray-900 font-medium">{notification.studyTitle}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Payout</label>
              <p className="text-gray-900 font-semibold">${notification.payout || 50}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Due date</label>
              <p className="text-gray-900">{notification.requestedDate.toDateString()}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Study length</label>
              <p className="text-gray-900">{notification.studyLength || 15} min</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h4>
          
          <div className="space-y-2">
            {notification.eligibilityCriteria.map((criteria, index) => (
              <div key={index} className="flex items-start">
                <span className="text-gray-600 mr-2 mt-1">{index + 1}.</span>
                <span className="text-gray-700">{criteria}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            className="w-full bg-pink-600 text-white px-6 py-3 rounded-md font-medium hover:bg-pink-700 transition-colors"
          >
            Take the Screener 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

// Email notification wrapper for study detail display
export const EmailNotificationModal: React.FC<{
  study?: any;
  onSend?: () => void;
  onClose?: () => void;
}> = ({ study, onSend, onClose }) => {
  const eligibilityCriteria = [
    'Job role: Advertising/Marketing.',
    'Company Type: Agency/ Marketer (Business/ Brand)',
    'Must be involved in Digital advertising/ CTV/ OTT.',
    'Must be involved in digital: display, video, native, audio, CTV/OTT, or Mobile apps.',
    'Total Digital Advertising spend in the past 12 months must be $1M+.',
    'Must be Buying programmatically.',
    'Company/ Agency must have worked with DSPs to manage programmatic campaigns over the past 12 months.'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Email Preview</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <EmailNotification
            notifications={[
              {
                id: '1',
                studyTitle: study?.title || 'US Marketing and Advertising Media Strategy',
                participantCount: 0,
                eligibilityCriteria: eligibilityCriteria,
                requestedDate: new Date(),
                priority: 'high',
                payout: 50,
                studyLength: 15
              }
            ]}
          />
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

// Study Request Notification Badge Component
export const StudyRequestBadge: React.FC<{
  count: number;
  onClick?: () => void;
}> = ({ count, onClick }) => {
  if (count === 0) return null;
  
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
    >
      <CheckCircle className="h-4 w-4 mr-1" />
      {count} New Study Request{count > 1 ? 's' : ''}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}; 