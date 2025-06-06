import React, { useState } from 'react';
import { Link as LinkIcon, CheckCircle, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface LiveLinkRequestProps {
  redirectLink?: string;
  onLiveLinkSubmit: (liveLink: string) => void;
  onSkip: () => void;
}

export const LiveLinkRequest: React.FC<LiveLinkRequestProps> = ({
  redirectLink,
  onLiveLinkSubmit,
  onSkip
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [liveLink, setLiveLink] = useState('');
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
    if (liveLink && validateUrl(liveLink)) {
      onLiveLinkSubmit(liveLink);
    } else {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setLiveLink(url);
    setIsValidUrl(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ Link copied to clipboard!
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Survey Link Required</h1>
          <p className="text-gray-600">
            Now we need your live survey link to complete the setup and send to participants.
          </p>
        </div>

        {/* Confirmed Redirect Link */}
        {redirectLink && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-600 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-2">✅ Redirect Link Confirmed</h3>
                <div className="bg-white rounded-md border border-green-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Confirmed Redirect URL:</p>
                      <p className="text-sm font-mono text-gray-900 break-all">{redirectLink}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(redirectLink)}
                      className="ml-3 p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-md"
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

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Live Survey URL *
            </label>
            <input
              type="url"
              value={liveLink}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://your-survey-platform.com/live-survey/survey-id"
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                !isValidUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {!isValidUrl && (
              <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              This is the actual live survey link where participants will complete your survey
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Important Information</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• This live link will be used to create unique participant URLs</li>
                  <li>• We'll add tracking parameters to monitor survey completion</li>
                  <li>• After providing this link, your survey will be ready for approval</li>
                  <li>• Make sure your survey is fully set up and tested on your platform</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <LinkIcon className="text-yellow-600 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="text-yellow-900 font-medium mb-1">URL Parameters</p>
                <p className="text-yellow-800">
                  We'll automatically append participant tracking parameters like <code className="bg-yellow-100 px-1 rounded">?participant_id=ABC123</code> to ensure proper tracking.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={!liveLink}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Live Link
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