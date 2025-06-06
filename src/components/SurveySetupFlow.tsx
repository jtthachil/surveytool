import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';

interface SurveySetupFlowProps {
  study: {
    id: string;
    title: string;
    redirectLink?: string;
    configuration?: {
      totalRespondents: number;
      compensation: number;
      surveyLength: number;
    };
  };
  onComplete: () => void;
}

type SetupStep = 'live-link' | 'exit-links' | 'screener' | 'confirmation';

export const SurveySetupFlow: React.FC<SurveySetupFlowProps> = ({
  study,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('live-link');
  const [setupData, setSetupData] = useState({
    liveLink: '',
    exitLinks: {
      complete: '',
      terminate: '',
      quotaFull: ''
    },
    screener: {
      question: '',
      options: ['', '', ''],
      disqualifyingAnswer: ''
    }
  });
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'live-link':
        if (setupData.liveLink && validateUrl(setupData.liveLink)) {
          setCurrentStep('exit-links');
          setIsValidUrl(true);
        } else {
          setIsValidUrl(false);
        }
        break;
      case 'exit-links':
        setCurrentStep('screener');
        break;
      case 'screener':
        setCurrentStep('confirmation');
        break;
      case 'confirmation':
        onComplete();
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'exit-links':
        setCurrentStep('live-link');
        break;
      case 'screener':
        setCurrentStep('exit-links');
        break;
      case 'confirmation':
        setCurrentStep('screener');
        break;
    }
  };

  const updateSetupData = (key: string, value: any) => {
    setSetupData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const steps = [
    { id: 'live-link', label: 'Live Survey Link', icon: ExternalLink },
    { id: 'exit-links', label: 'Exit Links', icon: LinkIcon },
    { id: 'screener', label: 'Pre-screener', icon: LinkIcon },
    { id: 'confirmation', label: 'Final Review', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'live-link':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="text-green-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Live Survey Link</h2>
              <p className="text-gray-600">
                Provide your live survey URL where participants will complete the survey
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Survey URL *
              </label>
              <input
                type="url"
                value={setupData.liveLink}
                onChange={(e) => {
                  updateSetupData('liveLink', e.target.value);
                  setIsValidUrl(true);
                }}
                placeholder="https://your-survey-platform.com/live-survey/survey-id"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isValidUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {!isValidUrl && (
                <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                We'll add tracking parameters to this URL for each participant
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="text-blue-900 font-medium mb-1">URL Parameters</p>
                  <p className="text-blue-800">
                    We'll automatically append <code className="bg-blue-100 px-1 rounded">?participant_id=ABC123</code> and other tracking parameters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exit-links':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="text-blue-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Exit Links</h2>
              <p className="text-gray-600">
                Configure where participants are redirected based on survey completion status
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Complete Link *
                </label>
                <input
                  type="url"
                  value={setupData.exitLinks.complete}
                  onChange={(e) => updateSetupData('exitLinks', { ...setupData.exitLinks, complete: e.target.value })}
                  placeholder="https://your-platform.com/survey-complete"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Where participants go after completing the survey</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Terminate Link *
                </label>
                <input
                  type="url"
                  value={setupData.exitLinks.terminate}
                  onChange={(e) => updateSetupData('exitLinks', { ...setupData.exitLinks, terminate: e.target.value })}
                  placeholder="https://your-platform.com/survey-terminate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Where participants go if they don't qualify</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quota Full Link *
                </label>
                <input
                  type="url"
                  value={setupData.exitLinks.quotaFull}
                  onChange={(e) => updateSetupData('exitLinks', { ...setupData.exitLinks, quotaFull: e.target.value })}
                  placeholder="https://your-platform.com/quota-full"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Where participants go if quota is reached</p>
              </div>
            </div>
          </div>
        );

      case 'screener':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="text-purple-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Pre-screener Setup</h2>
              <p className="text-gray-600">
                Create a screening question to qualify participants before they enter your survey
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screening Question *
                </label>
                <input
                  type="text"
                  value={setupData.screener.question}
                  onChange={(e) => updateSetupData('screener', { ...setupData.screener, question: e.target.value })}
                  placeholder="Are you currently employed in the education sector?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options
                </label>
                <div className="space-y-2">
                  {setupData.screener.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...setupData.screener.options];
                        newOptions[index] = e.target.value;
                        updateSetupData('screener', { ...setupData.screener, options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disqualifying Answer
                </label>
                <select 
                  value={setupData.screener.disqualifyingAnswer}
                  onChange={(e) => updateSetupData('screener', { ...setupData.screener, disqualifyingAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select disqualifying answer...</option>
                  {setupData.screener.options.filter(opt => opt.trim()).map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Participants selecting this answer will be terminated</p>
              </div>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Final Review</h2>
              <p className="text-gray-600">
                Review your setup before proceeding to survey management
              </p>
            </div>

            <div className="space-y-4">
              {/* Redirect Link */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-purple-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 mb-2">✅ Redirect Link</h4>
                    <p className="text-sm font-mono text-purple-700 break-all">{study.redirectLink}</p>
                  </div>
                </div>
              </div>

              {/* Live Link */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-green-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Live Survey Link</h4>
                    <p className="text-sm font-mono text-green-700 break-all">{setupData.liveLink}</p>
                  </div>
                </div>
              </div>

              {/* Exit Links */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-blue-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">✅ Exit Links Configured</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p><strong>Complete:</strong> {setupData.exitLinks.complete}</p>
                      <p><strong>Terminate:</strong> {setupData.exitLinks.terminate}</p>
                      <p><strong>Quota Full:</strong> {setupData.exitLinks.quotaFull}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screener */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-yellow-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-2">✅ Pre-screener Configured</h4>
                    <p className="text-sm text-yellow-700 mb-1"><strong>Question:</strong> {setupData.screener.question}</p>
                    <p className="text-xs text-yellow-600"><strong>Disqualifying answer:</strong> {setupData.screener.disqualifyingAnswer}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="text-green-900 font-medium mb-1">Ready to Launch</p>
                  <p className="text-green-800">
                    Your survey is now fully configured and ready for soft launch or full deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'live-link':
        return setupData.liveLink && validateUrl(setupData.liveLink);
      case 'exit-links':
        return setupData.exitLinks.complete && setupData.exitLinks.terminate && setupData.exitLinks.quotaFull;
      case 'screener':
        return setupData.screener.question && setupData.screener.disqualifyingAnswer;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with study info */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{study.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Survey Setup Flow</p>
            </div>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Redirect Confirmed
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const IconComponent = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100 text-green-600' : 
                      isCurrent ? 'bg-blue-100 text-blue-600' : 
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle size={20} /> : <IconComponent size={20} />}
                    </div>
                    <p className={`text-xs mt-2 text-center ${
                      isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 'live-link'}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={handleNextStep}
              disabled={!canProceed()}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentStep === 'confirmation' ? 'Complete Setup' : 'Next'}
              {currentStep !== 'confirmation' && <ArrowRight className="ml-2" size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 