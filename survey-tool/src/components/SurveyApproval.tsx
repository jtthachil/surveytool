import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, Link as LinkIcon, Users, DollarSign, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface SurveyApprovalProps {
  study: {
    id: string;
    title: string;
    prompt: string;
    type: string;
    participants: any[];
    configuration?: {
      totalRespondents: number;
      surveyLength: number;
      compensation: number;
      redirectLink?: string;
      liveLink?: string;
    };
  };
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export const SurveyApproval: React.FC<SurveyApprovalProps> = ({
  study,
  onApprove,
  onReject
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    onApprove();
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const estimatedCost = (study.configuration?.compensation || 0) * (study.configuration?.totalRespondents || 0);

  const approvalChecklist = [
    {
      label: 'Study Configuration',
      completed: true,
      description: 'Participants selected, duration and compensation set'
    },
    {
      label: 'Redirect Link',
      completed: !!study.configuration?.redirectLink,
      description: 'Client redirect URL confirmed'
    },
    {
      label: 'Live Survey Link',
      completed: !!study.configuration?.liveLink,
      description: 'Active survey URL provided'
    },
    {
      label: 'Quality Review',
      completed: false,
      description: 'Pending manual review and approval'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Ready for Approval</h1>
          <p className="text-gray-600">
            Please review the study details below and approve to proceed with setup.
          </p>
        </div>

        {/* Study Overview */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{study.title}</h2>
          <p className="text-gray-600 mb-4">{study.prompt}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="text-blue-600" size={20} />
              </div>
              <p className="text-sm text-gray-500">Study Type</p>
              <p className="font-semibold text-gray-900 capitalize">
                {study.type?.replace('-', ' ')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="text-green-600" size={20} />
              </div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="font-semibold text-gray-900">{study.participants.length} selected</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="text-purple-600" size={20} />
              </div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold text-gray-900">{study.configuration?.surveyLength || 0} min</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="text-orange-600" size={20} />
              </div>
              <p className="text-sm text-gray-500">Est. Cost</p>
              <p className="font-semibold text-gray-900">${estimatedCost}</p>
            </div>
          </div>
        </div>

        {/* Approval Checklist */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pre-Approval Checklist</h3>
          <div className="space-y-3">
            {approvalChecklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {item.completed ? <CheckCircle size={16} /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Redirect Link */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <LinkIcon className="text-purple-600 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-2">Redirect Link</h4>
                <p className="text-sm font-mono text-purple-700 break-all">
                  {study.configuration?.redirectLink || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Live Link */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Play className="text-green-600 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-2">Live Survey Link</h4>
                <p className="text-sm font-mono text-green-700 break-all">
                  {study.configuration?.liveLink || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="text-blue-900 font-medium mb-1">Review Guidelines</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Verify that both redirect and live links are valid and accessible</li>
                <li>• Ensure study description is clear and appropriate</li>
                <li>• Confirm participant selection matches study requirements</li>
                <li>• Check that compensation is fair for the survey length</li>
                <li>• Review for any compliance or quality concerns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Approval Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleApprove}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Survey
          </button>
          
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reject Survey
          </button>
          
          <button
            onClick={() => navigate('/studies')}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Back to Studies
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Reject Survey</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this survey. This feedback will be sent to the study creator.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={4}
                  placeholder="Please explain why this survey is being rejected..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Reject Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 