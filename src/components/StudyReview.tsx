import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Users, DollarSign, Clock, Star } from 'lucide-react';
import type { Study } from '../types/study';

interface StudyReviewProps {
  study: Study;
  onSubmit: (study: Study) => void;
}

export const StudyReview: React.FC<StudyReviewProps> = ({ study, onSubmit }) => {
  const navigate = useNavigate();
  const [studyTitle, setStudyTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!studyTitle.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalStudy: Study = {
      ...study,
      title: studyTitle.trim(),
      status: 'pending-review',
      updatedAt: new Date(),
      createdBy: 'john.researcher@company.com' // This would come from auth context
    };
    
    onSubmit(finalStudy);
    
    // Navigate to success page with study data
    navigate('/study-submitted', { state: { study: finalStudy } });
    setIsSubmitting(false);
  };

  const estimatedCost = study.configuration 
    ? study.participants.length * study.configuration.compensation 
    : 0;

  const completionChecklist = [
    { 
      label: 'Study type selected', 
      completed: !!study.type, 
      description: study.type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    },
    { 
      label: 'Participants selected', 
      completed: study.participants.length > 0, 
      description: `${study.participants.length} participants chosen` 
    },
    { 
      label: 'Study configuration completed', 
      completed: !!study.configuration, 
      description: study.configuration ? 'All parameters set' : 'Configuration missing' 
    },
    { 
      label: 'Custom message written', 
      completed: !!study.configuration?.customMessage, 
      description: study.configuration?.customMessage ? 'Message ready for participants' : 'No custom message' 
    },
    { 
      label: 'Exit links configured', 
      completed: !!(study.configuration?.exitLinks.complete && study.configuration?.exitLinks.terminate && study.configuration?.exitLinks.quotaFull), 
      description: 'Redirect URLs set' 
    }
  ];

  const allCompleted = completionChecklist.every(item => item.completed);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review & Submit</h1>
          <p className="text-gray-500">Review your study details before submitting for approval</p>
        </div>
      </div>

      {/* Completion Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Study Readiness</h3>
          {allCompleted ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle size={20} />
              <span className="font-medium">Ready to Submit</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle size={20} />
              <span className="font-medium">Review Required</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {completionChecklist.map((item, index) => (
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

      {/* Study Title */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Title</h3>
        <div className="space-y-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Give your study a descriptive title *
          </label>
          <input
            id="title"
            type="text"
            value={studyTitle}
            onChange={(e) => setStudyTitle(e.target.value)}
            placeholder="e.g., Mobile Banking App Usability Study"
            className="form-input"
            maxLength={100}
          />
          <p className="text-xs text-gray-500">
            This title will be used for internal tracking and participant communications
          </p>
        </div>
      </div>

      {/* Study Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="text-blue-600" size={20} />
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
            <p className="font-semibold text-gray-900">{study.participants.length}</p>
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

      {/* Participant Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Participants</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Selected:</span>
              <p className="font-medium text-gray-900">{study.participants.length} participants</p>
            </div>
            <div>
              <span className="text-gray-500">Average Rating:</span>
              <p className="font-medium text-gray-900">
                {study.participants.length > 0 
                  ? (study.participants.reduce((acc, p) => acc + p.rating, 0) / study.participants.length).toFixed(1)
                  : '0'
                }★
              </p>
            </div>
            <div>
              <span className="text-gray-500">High Availability:</span>
              <p className="font-medium text-gray-900">
                {study.participants.filter(p => p.availability === 'high').length} participants
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Participant Preview</h4>
            <div className="space-y-2">
              {study.participants.slice(0, 3).map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                    <p className="text-xs text-gray-500">{participant.demographics.occupation} • {participant.demographics.location}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500" />
                    <span className="text-xs font-medium">{participant.rating}</span>
                  </div>
                </div>
              ))}
              {study.participants.length > 3 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  +{study.participants.length - 3} more participants
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Respondents</h4>
            <p className="text-2xl font-bold text-blue-600">{study.configuration?.totalRespondents || 0}</p>
            <p className="text-sm text-gray-500">Target participants</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
            <p className="text-2xl font-bold text-green-600">{study.configuration?.surveyLength || 0} min</p>
            <p className="text-sm text-gray-500">Estimated time</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Compensation</h4>
            <p className="text-2xl font-bold text-purple-600">${study.configuration?.compensation || 0}</p>
            <p className="text-sm text-gray-500">Per participant</p>
          </div>
        </div>

        {study.configuration?.screener && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Screener Configuration</h4>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                study.configuration.screener.isAIGenerated 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {study.configuration.screener.isAIGenerated ? 'AI Generated' : 'Custom Questions'}
              </span>
              <span className="text-sm text-gray-500">
                {study.configuration.screener.questions.length} question(s)
              </span>
            </div>
            <button
              onClick={() => navigate('/screener-creator')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit Screener →
            </button>
          </div>
        )}

        {study.configuration?.customMessage && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Custom Message</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{study.configuration.customMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Submission Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-medium text-yellow-900 mb-2">Review Process</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Your study will be submitted to the backend team for review. Once approved, 
              participant invitations will be automatically sent out.
            </p>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Review typically takes 24-48 hours</li>
              <li>• You'll be notified of approval or any required changes</li>
              <li>• Participant emails will be sent automatically upon approval</li>
              <li>• You can track study progress in your dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!studyTitle.trim() || !allCompleted || isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              <span>Submit for Review</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}; 