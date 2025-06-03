import React from 'react';
import { Calendar, Clock, DollarSign, Users, CheckCircle } from 'lucide-react';

interface EmailNotificationProps {
  recipientName: string;
  studyTitle: string;
  studyType: string;
  payout: number;
  dueDate: string;
  studyLength: number;
  eligibilityCriteria: string[];
  onTakeStudy?: () => void;
  onClose?: () => void;
}

export const EmailNotification: React.FC<EmailNotificationProps> = ({
  recipientName,
  studyTitle,
  studyType,
  payout,
  dueDate,
  studyLength,
  eligibilityCriteria,
  onTakeStudy,
  onClose
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-sm font-bold mr-3">
              CX
            </div>
            <span className="text-lg font-semibold text-gray-900">CleverX</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Hi {recipientName},</p>
          <p className="text-gray-700">
            Congratulations! You've got a new screener request for a study from{' '}
            <strong>Vaishali Srivastava.</strong>
          </p>
        </div>
      </div>

      {/* Study Details */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Study type</label>
              <p className="text-gray-900">{studyType}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Study title</label>
              <p className="text-gray-900 font-medium">{studyTitle}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Payout</label>
              <p className="text-gray-900 font-semibold">${payout}</p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Due date</label>
              <p className="text-gray-900">{dueDate}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Study length</label>
              <p className="text-gray-900">{studyLength} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-3">Eligibility</label>
          <p className="text-gray-700 mb-4">
            The professional taking the survey must meet either the following criteria:
          </p>
          
          <div className="space-y-2">
            {eligibilityCriteria.map((criteria, index) => (
              <div key={index} className="flex items-start">
                <span className="text-gray-600 mr-2 mt-1">{index + 1}.</span>
                <p className="text-gray-700">{criteria}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onTakeStudy}
            className="w-full bg-pink-600 text-white px-6 py-3 rounded-md font-medium hover:bg-pink-700 transition-colors"
          >
            Take study
          </button>
        </div>
      </div>
    </div>
  );
};

// Email Preview Component for showing in the system
export const EmailPreview: React.FC<{
  study: any;
  participant: any;
  onSend?: () => void;
  onClose?: () => void;
}> = ({ study, participant, onSend, onClose }) => {
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
            recipientName={participant?.name || 'Mark'}
            studyTitle={study?.title || 'US Marketing and Advertising Media Strategy'}
            studyType={study?.type || 'Online Survey'}
            payout={study?.configuration?.compensation || 50}
            dueDate="April 3rd, 4:56 AM EDT"
            studyLength={study?.configuration?.surveyLength || 15}
            eligibilityCriteria={eligibilityCriteria}
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