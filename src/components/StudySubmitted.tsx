import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, Users, DollarSign, Calendar, Eye, BarChart3, ArrowRight, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import type { Study } from '../types/study';

interface StudySubmittedProps {
  study?: Study;
}

export const StudySubmitted: React.FC<StudySubmittedProps> = ({ study: propStudy }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [study, setStudy] = useState<Study | null>(propStudy || location.state?.study || null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call to check status
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    
    // In real app, this would update the study status from API
    if (study) {
      setStudy({
        ...study,
        status: Math.random() > 0.7 ? 'live' : 'pending-review'
      });
    }
  };

  const copyStudyId = () => {
    if (study?.id) {
      navigator.clipboard.writeText(study.id);
      // Show toast notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          ✅ Study ID copied to clipboard!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
    }
  };

  if (!study) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Study not found</h3>
        <p className="text-gray-600 mb-6">Unable to load study details.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const estimatedCost = study.configuration 
    ? study.participants.length * study.configuration.compensation 
    : 0;

  const isLive = study.status === 'live';
  const isPending = study.status === 'pending-review';

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-animation">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Study Successfully Submitted!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          "{study.title}" has been submitted for review
        </p>
        
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isLive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isLive ? <CheckCircle size={16} className="mr-2" /> : <Clock size={16} className="mr-2" />}
            {isLive ? 'Live & Active' : 'Under Review'}
          </span>
          <button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh status"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Study Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="text-blue-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{study.participants.length}</h3>
          <p className="text-sm text-gray-600">Participants Selected</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${estimatedCost}</h3>
          <p className="text-sm text-gray-600">Estimated Cost</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="text-purple-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{study.configuration?.surveyLength || 0}</h3>
          <p className="text-sm text-gray-600">Minutes Duration</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="text-orange-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{study.configuration?.totalRespondents || 0}</h3>
          <p className="text-sm text-gray-600">Target Responses</p>
        </div>
      </div>

      {/* Study Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Study ID</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-900">{study.id}</span>
                <button
                  onClick={copyStudyId}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Copy Study ID"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Study Type</span>
              <span className="text-sm text-gray-900 capitalize">
                {study.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Created</span>
              <span className="text-sm text-gray-900">
                {study.createdAt.toLocaleDateString()} at {study.createdAt.toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Created By</span>
              <span className="text-sm text-gray-900">{study.createdBy}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            {isLive ? (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Study is Live!</h4>
                    <p className="text-sm text-gray-600">Participant invitations have been sent automatically.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Monitor Responses</h4>
                    <p className="text-sm text-gray-600">Track participant progress in real-time from your dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <BarChart3 size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Analyze Results</h4>
                    <p className="text-sm text-gray-600">Access insights and analytics as responses come in.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <Clock size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Under Review (24-48 hours)</h4>
                    <p className="text-sm text-gray-600">Our team will review your study configuration and participants.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Automatic Invitations</h4>
                    <p className="text-sm text-gray-600">Once approved, invitations will be sent to all participants.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notification</h4>
                    <p className="text-sm text-gray-600">You'll receive confirmation when your study goes live.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Ready to track your study?</h3>
            <p className="text-sm text-gray-600">
              {isLive ? 'Monitor responses and manage participants' : 'Set up tracking and prepare for launch'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/study/${study.id}`)}
              className="btn-primary flex items-center space-x-2"
            >
              <Eye size={16} />
              <span>View Study Details</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/analytics')}
          className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-blue-600" size={20} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Analytics</h4>
            <p className="text-sm text-gray-600">View all study insights</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/participants')}
          className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="text-green-600" size={20} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Participants</h4>
            <p className="text-sm text-gray-600">Manage participant pool</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/wallet-dashboard')}
          className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <DollarSign className="text-purple-600" size={20} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Payments</h4>
            <p className="text-sm text-gray-600">Review compensation</p>
          </div>
        </button>
      </div>
    </div>
  );
}; 