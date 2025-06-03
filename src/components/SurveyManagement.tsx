import React, { useState } from 'react';
import { Pause, Square, Play, CheckCircle, AlertTriangle } from 'lucide-react';

interface SurveyManagementProps {
  currentStatus: 'draft' | 'live' | 'paused' | 'ended';
  totalInvites: number;
  completed: number;
  pending: number;
  failed: number;
  optedOut: number;
  onStatusChange: (newStatus: 'live' | 'paused' | 'ended') => void;
}

export const SurveyManagement: React.FC<SurveyManagementProps> = ({
  currentStatus,
  totalInvites,
  completed,
  pending,
  failed,
  optedOut,
  onStatusChange
}) => {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [endReason, setEndReason] = useState('');

  const handlePauseSurvey = () => {
    onStatusChange('paused');
    setShowPauseModal(false);
    setPauseReason('');
  };

  const handleEndSurvey = () => {
    onStatusChange('ended');
    setShowEndModal(false);
    setEndReason('');
  };

  const handleApproveSurvey = () => {
    onStatusChange('live');
    setShowApproveModal(false);
  };

  const getCompletionPercentage = () => {
    return totalInvites > 0 ? Math.round((completed / totalInvites) * 100) : 0;
  };

  const getPendingPercentage = () => {
    return totalInvites > 0 ? Math.round((pending / totalInvites) * 100) : 0;
  };

  const getFailedPercentage = () => {
    return totalInvites > 0 ? Math.round((failed / totalInvites) * 100) : 0;
  };

  const getOptedOutPercentage = () => {
    return totalInvites > 0 ? Math.round((optedOut / totalInvites) * 100) : 0;
  };

  const StatusBadge = () => {
    const statusConfig = {
      live: { color: 'bg-green-100 text-green-800', label: 'Live' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      paused: { color: 'bg-orange-100 text-orange-800', label: 'Paused' },
      ended: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
    };

    const config = statusConfig[currentStatus];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const statusColors = {
    live: { color: 'bg-green-100 text-green-800', label: 'Live' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
    paused: { color: 'bg-orange-100 text-orange-800', label: 'Paused' },
    ended: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        {/* Study Title Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">The future of securities processing</h2>
            <p className="text-sm text-gray-500 mt-1">Mar 16, 7:53 PM</p>
            <p className="text-sm text-gray-400">67d6deecf7d49799ca97115</p>
          </div>
          <div className="flex items-center space-x-4">
            <StatusBadge />
            <span className="text-lg font-semibold">{totalInvites}</span>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalInvites}</div>
            <div className="text-sm text-gray-600">Total invites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-xs text-gray-500">{getCompletionPercentage()}%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-xs text-gray-500">{getPendingPercentage()}%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
            <div className="text-xs text-gray-500">{getFailedPercentage()}%</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completed</span>
              <span className="text-gray-900">{completed} ({getCompletionPercentage()}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Pending</span>
              <span className="text-gray-900">{pending} ({getPendingPercentage()}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${getPendingPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Failed</span>
              <span className="text-gray-900">{failed} ({getFailedPercentage()}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${getFailedPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Opted-out</span>
              <span className="text-gray-900">{optedOut} ({getOptedOutPercentage()}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${getOptedOutPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {currentStatus === 'live' && (
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pause survey</h3>
                <p className="text-sm text-gray-600 mb-3">
                  In paused state, new participants cannot take the survey. You can always resume it from here
                </p>
                <button
                  onClick={() => setShowPauseModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Survey
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">End survey</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Close your survey. This action is irreversible and any participants pending will not be able to take it anymore.
                </p>
                <button
                  onClick={() => setShowEndModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End survey
                </button>
              </div>
            </div>
          )}

          {currentStatus === 'pending' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Approve survey and make it live</h3>
              <p className="text-sm text-gray-600 mb-3">This action is irreversible.</p>
              <button
                onClick={() => setShowApproveModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve survey
              </button>
            </div>
          )}

          {currentStatus === 'paused' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Resume survey</h3>
              <p className="text-sm text-gray-600 mb-3">
                Resume your paused survey. Participants will be able to take the survey again.
              </p>
              <button
                onClick={() => onStatusChange('live')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Resume Survey
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pause Survey Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Pause Survey</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to pause this survey? Participants will not be able to access it until you resume.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for pausing (optional)
                </label>
                <textarea
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  placeholder="Enter reason for pausing the survey..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPauseModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePauseSurvey}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Pause Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End Survey Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">End Survey</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to end this survey? This action is irreversible and any pending participants will not be able to complete it.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for ending (optional)
                </label>
                <textarea
                  value={endReason}
                  onChange={(e) => setEndReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  placeholder="Enter reason for ending the survey..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndSurvey}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  End Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Survey Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Approve Survey</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to approve and make this survey live? This action is irreversible.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveSurvey}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 