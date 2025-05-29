import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Brain, Link, DollarSign, Clock, Users, Plus, Trash2 } from 'lucide-react';
import type { Study, StudyConfiguration as StudyConfig, ScreenerQuestion } from '../types/study';

interface StudyConfigurationProps {
  study: Partial<Study>;
  onConfiguration: (config: StudyConfig) => void;
}

export const StudyConfiguration: React.FC<StudyConfigurationProps> = ({ 
  study, 
  onConfiguration
}) => {
  const navigate = useNavigate();
  const [customMessage, setCustomMessage] = useState('');
  const [useAIScreener, setUseAIScreener] = useState(true);
  const [screenerQuestions, setScreenerQuestions] = useState<ScreenerQuestion[]>([]);
  const [totalRespondents, setTotalRespondents] = useState(50);
  const [surveyLength, setSurveyLength] = useState(15);
  const [compensation, setCompensation] = useState(25);
  const [liveLink, setLiveLink] = useState('');
  const [exitLinks, setExitLinks] = useState({
    complete: '',
    terminate: '',
    quotaFull: ''
  });

  const addScreenerQuestion = () => {
    const newQuestion: ScreenerQuestion = {
      id: `screener_${Date.now()}`,
      question: '',
      type: 'multiple-choice',
      options: ['Option 1', 'Option 2'],
      required: true,
      disqualifyValue: ''
    };
    setScreenerQuestions(prev => [...prev, newQuestion]);
  };

  const updateScreenerQuestion = (id: string, updates: Partial<ScreenerQuestion>) => {
    setScreenerQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, ...updates } : q)
    );
  };

  const removeScreenerQuestion = (id: string) => {
    setScreenerQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleContinue = () => {
    const config: StudyConfig = {
      totalRespondents,
      surveyLength,
      compensation,
      liveLink: liveLink || undefined,
      exitLinks,
      customMessage,
      screener: useAIScreener ? {
        id: `screener_${Date.now()}`,
        questions: [], // AI will generate these
        isAIGenerated: true
      } : screenerQuestions.length > 0 ? {
        id: `screener_${Date.now()}`,
        questions: screenerQuestions,
        isAIGenerated: false
      } : undefined
    };
    onConfiguration(config);
    navigate('/review-study');
  };

  const generateUniqueLink = (type: 'complete' | 'terminate' | 'quotaFull') => {
    const baseUrl = 'https://research.yourplatform.com/redirect';
    const studyId = study.id || 'study_123';
    const uniqueId = Math.random().toString(36).substring(2, 15);
    return `${baseUrl}/${type}/${studyId}/${uniqueId}`;
  };

  const handleGenerateExitLink = (type: 'complete' | 'terminate' | 'quotaFull') => {
    const link = generateUniqueLink(type);
    setExitLinks(prev => ({ ...prev, [type]: link }));
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Study Configuration</h1>
          <p className="text-gray-500">Set up your study parameters and messaging</p>
        </div>
      </div>

      {/* Study Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Study Type:</span>
            <p className="font-medium text-gray-900 capitalize">{study.type?.replace('-', ' ')}</p>
          </div>
          <div>
            <span className="text-gray-500">Selected Participants:</span>
            <p className="font-medium text-gray-900">{study.participants?.length || 0} participants</p>
          </div>
          <div>
            <span className="text-gray-500">Average Rating:</span>
            <p className="font-medium text-gray-900">
              {study.participants && study.participants.length > 0 
                ? (study.participants.reduce((acc, p) => acc + p.rating, 0) / study.participants.length).toFixed(1)
                : '0'
              }★
            </p>
          </div>
        </div>
      </div>

      {/* Custom Message */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Custom Message</h3>
            <p className="text-gray-500">This message will be sent to participants in their invitation email</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={6}
            className="form-input resize-none"
            placeholder="Dear participant,

We're conducting a study to improve mobile banking experiences. Your insights will help us create better financial tools for users like you.

The study will take approximately 15 minutes and involves testing a new app interface. You'll be compensated $25 for your time.

Thank you for participating!

Best regards,
Research Team"
          />
          <p className="text-xs text-gray-500">
            This message will be personalized for each participant and included in their invitation email.
          </p>
        </div>
      </div>

      {/* Screener Configuration */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Screener Questions</h3>
            <p className="text-gray-500">Filter participants before they enter the main study</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={useAIScreener}
                onChange={() => setUseAIScreener(true)}
                className="mr-2"
              />
              <span className="text-sm">Let AI create screener questions from your custom message</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!useAIScreener}
                onChange={() => setUseAIScreener(false)}
                className="mr-2"
              />
              <span className="text-sm">Create custom screener questions</span>
            </label>
          </div>

          {useAIScreener && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Brain className="text-purple-600 mt-0.5" size={16} />
                <div>
                  <h4 className="text-sm font-medium text-purple-900 mb-1">AI Screener Generation</h4>
                  <p className="text-xs text-purple-700">
                    AI will analyze your custom message and automatically create relevant screener questions 
                    to ensure participants meet your study requirements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!useAIScreener && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Custom Questions</span>
                <button
                  onClick={addScreenerQuestion}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Add Question</span>
                </button>
              </div>

              {screenerQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                    <button
                      onClick={() => removeScreenerQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateScreenerQuestion(question.id, { question: e.target.value })}
                      placeholder="Enter your question"
                      className="form-input"
                    />
                    
                    <select
                      value={question.type}
                      onChange={(e) => updateScreenerQuestion(question.id, { type: e.target.value as any })}
                      className="form-input"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="yes-no">Yes/No</option>
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                    </select>
                  </div>
                </div>
              ))}

              {screenerQuestions.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p>No screener questions added yet. Click "Add Question" to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Study Parameters */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Study Parameters</h3>
            <p className="text-gray-500">Configure study size, duration, and compensation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Respondents Needed *
            </label>
            <input
              type="number"
              value={totalRespondents}
              onChange={(e) => setTotalRespondents(Number(e.target.value))}
              min="1"
              max="1000"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Length (minutes) *
            </label>
            <input
              type="number"
              value={surveyLength}
              onChange={(e) => setSurveyLength(Number(e.target.value))}
              min="1"
              max="120"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compensation (USD) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={compensation}
                onChange={(e) => setCompensation(Number(e.target.value))}
                min="0"
                step="0.01"
                className="form-input pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Amount shown to participants after platform commission deduction
            </p>
          </div>
        </div>
      </div>

      {/* Exit Links */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Link className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exit Links</h3>
            <p className="text-gray-500">Redirect URLs for different study completion scenarios</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'complete', label: 'Complete', description: 'Participant successfully completed the study' },
            { key: 'terminate', label: 'Terminate', description: 'Participant was disqualified or failed screening' },
            { key: 'quotaFull', label: 'Quota Full', description: 'Study reached maximum respondents' }
          ].map(({ key, label, description }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={exitLinks[key as keyof typeof exitLinks]}
                  onChange={(e) => setExitLinks(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`https://yoursite.com/${key}`}
                  className="form-input flex-1"
                />
                <button
                  onClick={() => handleGenerateExitLink(key as any)}
                  className="btn-secondary text-sm"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <Link className="text-blue-600 mt-0.5" size={16} />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Unique Variable Links</h4>
              <p className="text-xs text-blue-700">
                Each participant will receive a unique link with their participant ID. 
                This ensures proper tracking and prevents duplicate responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Link */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Link className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Survey Link</h3>
            <p className="text-gray-500">Main survey link provided by your survey platform</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Survey URL (Optional)
          </label>
          <input
            type="url"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            placeholder="https://surveys.platform.com/your-survey-id"
            className="form-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            If provided, this link will be used to create unique participant URLs with tracking variables
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}; 