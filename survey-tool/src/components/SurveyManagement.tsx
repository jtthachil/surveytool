import React, { useState } from 'react';
import { Pause, Square, Play, CheckCircle, AlertTriangle, Users, Edit, ExternalLink, Settings, Target, UserCheck, Link as LinkIcon, Copy, FileText } from 'lucide-react';

interface SurveyManagementProps {
  currentStatus: 'draft' | 'live' | 'paused' | 'ended' | 'pending-review' | 'redirect-pending' | 'redirect-confirmed' | 'pre-launch' | 'soft-launch';
  totalInvites: number;
  completed: number;
  pending: number;
  failed: number;
  optedOut: number;
  onStatusChange: (newStatus: string) => void;
  redirectLink?: string;
  redirectConfirmed?: boolean;
  softLaunchConfig?: {
    enabled: boolean;
    participantCount: number;
    isActive: boolean;
    completedAt?: Date;
  };
}

export const SurveyManagement: React.FC<SurveyManagementProps> = ({
  currentStatus,
  totalInvites,
  completed,
  pending,
  failed,
  optedOut,
  onStatusChange,
  redirectLink,
  redirectConfirmed,
  softLaunchConfig
}) => {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSoftLaunchModal, setShowSoftLaunchModal] = useState(false);
  const [showFullLaunchModal, setShowFullLaunchModal] = useState(false);
  const [showScreenerModal, setShowScreenerModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [endReason, setEndReason] = useState('');
  const [softLaunchCount, setSoftLaunchCount] = useState(softLaunchConfig?.participantCount || 10);

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

  const handleSoftLaunch = () => {
    onStatusChange('soft-launch');
    setShowSoftLaunchModal(false);
  };

  const handleFullLaunch = () => {
    onStatusChange('live');
    setShowFullLaunchModal(false);
  };

  const handleConfirmRedirect = () => {
    onStatusChange('redirect-confirmed');
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
      'pending-review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      'redirect-pending': { color: 'bg-blue-100 text-blue-800', label: 'Awaiting Redirect Link' },
      'redirect-confirmed': { color: 'bg-purple-100 text-purple-800', label: 'Redirect Confirmed' },
      'pre-launch': { color: 'bg-indigo-100 text-indigo-800', label: 'Pre-Launch Setup' },
      'soft-launch': { color: 'bg-orange-100 text-orange-800', label: 'Soft Launch Active' },
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ ${label} copied to clipboard!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        {/* Study Title Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">E-learning Platform Feedback Survey</h2>
            <p className="text-sm text-gray-500 mt-1">Jan 28, 2024 • 3:42 PM</p>
            <p className="text-sm text-gray-400">study_9</p>
          </div>
          <div className="flex items-center space-x-4">
            <StatusBadge />
            <span className="text-lg font-semibold">{totalInvites}</span>
          </div>
        </div>

        {/* Redirect Link Status */}
        {currentStatus === 'redirect-confirmed' && redirectLink && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <LinkIcon className="text-purple-600 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-2">Redirect Link Confirmed</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Client has provided and confirmed their redirect link. Ready for next steps.
                </p>
                <div className="bg-white rounded-md border border-purple-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Client Redirect URL:</p>
                      <p className="text-sm font-mono text-gray-900 break-all">{redirectLink}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(redirectLink, 'Redirect link')}
                      className="ml-3 p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-md"
                      title="Copy redirect link"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Enhanced Action Buttons */}
        <div className="space-y-6">
          {/* Redirect-confirmed status actions */}
          {currentStatus === 'redirect-confirmed' && (
        <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowLinksModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Setup Exit Links</h4>
                      <p className="text-sm text-gray-600">Configure completion, termination, and quota-full links</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowScreenerModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Setup Pre-screener</h4>
                      <p className="text-sm text-gray-600">Configure screening questions for participants</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowSoftLaunchModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 border-orange-200 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Target className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Soft Launch</h4>
                      <p className="text-sm text-gray-600">Test with limited participants first</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Full Launch</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ready to launch to all {totalInvites} selected participants.
                </p>
                <button
                  onClick={() => setShowFullLaunchModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Launch Survey
                </button>
              </div>
            </div>
          )}

          {/* Live status actions */}
          {currentStatus === 'live' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowScreenerModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Edit className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Edit Screener</h4>
                      <p className="text-sm text-gray-600">Modify screening questions mid-study</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowLinksModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Manage Links</h4>
                      <p className="text-sm text-gray-600">Update exit and redirect links</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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
            </div>
          )}

          {/* Soft launch status */}
          {currentStatus === 'soft-launch' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="text-orange-600" size={20} />
                <div>
                  <h3 className="font-semibold text-orange-900">Soft Launch Active</h3>
                  <p className="text-sm text-orange-700">
                    Survey is live for {softLaunchConfig?.participantCount || 10} participants. Monitor results before full launch.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowFullLaunchModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Full Launch ({totalInvites} participants)
                </button>
                
                <button
                  onClick={() => setShowPauseModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Soft Launch
                </button>
                
                <button
                  onClick={() => setShowScreenerModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Screener
                </button>
              </div>
            </div>
          )}

          {currentStatus === 'pending-review' && (
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

      {/* Soft Launch Modal */}
      {showSoftLaunchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Soft Launch</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Test your survey with a limited number of participants before full launch.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of participants for soft launch
                </label>
                <input
                  type="number"
                  value={softLaunchCount}
                  onChange={(e) => setSoftLaunchCount(parseInt(e.target.value) || 10)}
                  min="1"
                  max={totalInvites}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Out of {totalInvites} total selected participants
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSoftLaunchModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSoftLaunch}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Start Soft Launch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Launch Modal */}
      {showFullLaunchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Full Launch</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Launch survey to all {totalInvites} selected participants. This will make the survey fully live.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowFullLaunchModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFullLaunch}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Launch to All Participants
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screener Edit Modal */}
      {showScreenerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Edit className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentStatus === 'live' ? 'Edit Pre-screener' : 'Setup Pre-screener'}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screening Question 1
                  </label>
                  <input
                    type="text"
                    placeholder="Are you currently employed in the education sector?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Yes, full-time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Yes, part-time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="No"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disqualifying Answer
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>No</option>
                    <option>Yes, full-time</option>
                    <option>Yes, part-time</option>
                  </select>
                </div>

                {currentStatus === 'live' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        Changes to screener will only affect new participants. Existing responses remain unchanged.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowScreenerModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowScreenerModal(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  {currentStatus === 'live' ? 'Update Screener' : 'Save Screener'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Links Management Modal */}
      {showLinksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ExternalLink className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Manage Exit Links</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Complete Link
                  </label>
                  <input
                    type="url"
                    defaultValue="https://research-platform.com/complete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Where participants go after completing the survey</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Terminate Link
                  </label>
                  <input
                    type="url"
                    defaultValue="https://research-platform.com/terminate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Where participants go if they don't qualify</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quota Full Link
                  </label>
                  <input
                    type="url"
                    defaultValue="https://research-platform.com/quota-full"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Where participants go if quota is reached</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowLinksModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowLinksModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Links
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing modals... (keeping pause, end, approve modals as they were) */}
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

// Component for redirect link confirmation step
interface RedirectLinkConfirmationProps {
  onConfirm: (redirectLink: string) => void;
  onSkip: () => void;
}

export const RedirectLinkConfirmation: React.FC<RedirectLinkConfirmationProps> = ({
  onConfirm,
  onSkip
}) => {
  const [redirectLink, setRedirectLink] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (redirectLink && validateUrl(redirectLink)) {
      onConfirm(redirectLink);
    } else {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setRedirectLink(url);
    setIsValidUrl(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirect Link Setup</h1>
          <p className="text-gray-600">
            Please provide your survey redirect link to proceed with the setup.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Survey Redirect URL *
            </label>
            <input
              type="url"
              value={redirectLink}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://your-platform.com/survey/your-survey-id"
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !isValidUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {!isValidUrl && (
              <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              This is where participants will be redirected to take your survey
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Important Note</p>
                <p className="text-blue-800">
                  After providing this link, we'll set up exit links and pre-screener questions. 
                  Make sure your survey platform can receive participants from our platform.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={!redirectLink}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Redirect Link
            </button>
            <button
              onClick={onSkip}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Skip for Now
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              You can always update this link later in survey settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 