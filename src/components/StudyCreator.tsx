import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, Eye, Sparkles, FileText, Clock } from 'lucide-react';
import type { StudyType } from '../types/study';

interface StudyCreatorProps {
  onStudyTypeSelect: (type: StudyType, prompt: string) => void;
}

export const StudyCreator: React.FC<StudyCreatorProps> = ({ onStudyTypeSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState<StudyType | null>(null);
  const [prompt, setPrompt] = useState('');
  const [studyTitle, setStudyTitle] = useState('');
  const [showTemplateInfo, setShowTemplateInfo] = useState(false);

  // Handle template usage and preselected type from Dashboard
  useEffect(() => {
    if (location.state) {
      const { template, preselectedType, prompt: prefilledPrompt, editMode, study } = location.state;
      
      if (template) {
        setSelectedType(template.studyType);
        setPrompt(template.description);
        setStudyTitle(template.name);
        setShowTemplateInfo(true);
      } else if (preselectedType) {
        setSelectedType(preselectedType);
        if (prefilledPrompt) {
          setPrompt(prefilledPrompt);
        }
      } else if (editMode && study) {
        setSelectedType(study.type);
        setPrompt(study.prompt);
        setStudyTitle(study.title);
      }
    }
  }, [location.state]);

  const studyTypes = [
    {
      type: 'online-survey' as StudyType,
      title: 'Online Survey',
      description: 'Create comprehensive surveys to gather quantitative and qualitative insights from your target audience',
      icon: BarChart3,
      color: 'blue',
      features: ['Multiple question types', 'Logic branching', 'Real-time analytics', 'Custom branding'],
      timeRange: '5-30 minutes',
      participantRange: '50-500 participants'
    },
    {
      type: '1-on-1-consultation' as StudyType,
      title: '1-on-1 Consultation',
      description: 'Schedule individual interviews for deep qualitative insights and personalized feedback',
      icon: Users,
      color: 'green',
      features: ['Video calls', 'Session recording', 'Scheduling integration', 'Interview templates'],
      timeRange: '30-90 minutes',
      participantRange: '5-20 participants'
    },
    {
      type: 'product-testing' as StudyType,
      title: 'Product Testing',
      description: 'Get feedback on your products from real users in controlled testing environments',
      icon: Eye,
      color: 'purple',
      features: ['Prototype testing', 'User journey mapping', 'Usability metrics', 'A/B testing'],
      timeRange: '15-60 minutes',
      participantRange: '10-50 participants'
    }
  ];

  const handleContinue = () => {
    if (selectedType && prompt.trim()) {
      onStudyTypeSelect(selectedType, prompt.trim());
      navigate('/select-participants');
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'border-2 transition-all duration-200 cursor-pointer';
    
    if (isSelected) {
      switch (color) {
        case 'blue': return `${baseClasses} border-blue-500 bg-blue-50`;
        case 'green': return `${baseClasses} border-green-500 bg-green-50`;
        case 'purple': return `${baseClasses} border-purple-500 bg-purple-50`;
        default: return `${baseClasses} border-gray-300 bg-white`;
      }
    } else {
      return `${baseClasses} border-gray-200 bg-white hover:border-gray-300 hover:shadow-md`;
    }
  };

  const getIconColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStudyTypeSpecificContent = (type: StudyType) => {
    switch (type) {
      case '1-on-1-consultation':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-yellow-800 mb-2">Consultation Study Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Schedule 45-60 minutes per session for meaningful conversations</li>
              <li>• Prepare open-ended questions to encourage detailed responses</li>
              <li>• Consider follow-up sessions for complex topics</li>
              <li>• Record sessions (with permission) for detailed analysis</li>
            </ul>
          </div>
        );
      case 'product-testing':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-purple-800 mb-2">Product Testing Best Practices</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Provide clear instructions and testing scenarios</li>
              <li>• Test with realistic user environments and devices</li>
              <li>• Observe user behavior without leading them</li>
              <li>• Collect both qualitative feedback and usage metrics</li>
            </ul>
          </div>
        );
      default:
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-blue-800 mb-2">Survey Design Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep questions clear and unbiased</li>
              <li>• Mix different question types for better insights</li>
              <li>• Test your survey before launching</li>
              <li>• Consider mobile-friendly design</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {location.state?.editMode ? 'Edit Study' : 'Create New Research'}
          </h1>
          <p className="text-gray-500">Choose the type of study you want to conduct</p>
        </div>
      </div>

      {/* Template Info Banner */}
      {showTemplateInfo && location.state?.template && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="text-green-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-green-900 mb-1">Using Template: {location.state.template.name}</h4>
              <p className="text-sm text-green-700">
                This template has been used {location.state.template.uses} times with a {location.state.template.rating}★ rating.
                You can customize it below to fit your specific needs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Study Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {studyTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.type;
          
          return (
            <div
              key={type.type}
              onClick={() => setSelectedType(type.type)}
              className={`rounded-xl p-6 ${getColorClasses(type.color, isSelected)}`}
            >
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-lg bg-${type.color}-100 flex items-center justify-center`}>
                  <Icon size={32} className={getIconColorClass(type.color)} />
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{type.timeRange}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{type.participantRange}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${type.color}-500`}></div>
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <div className={`w-6 h-6 mx-auto rounded-full bg-${type.color}-500 flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Study Details Section */}
      {selectedType && (
        <div className="card space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Study Details</h2>
              <p className="text-gray-500">Provide details to help AI find the perfect participants</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Study Title *
              </label>
              <input
                id="title"
                type="text"
                value={studyTitle}
                onChange={(e) => setStudyTitle(e.target.value)}
                className="form-input"
                placeholder={`Enter a descriptive title for your ${selectedType.replace('-', ' ')} study`}
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Study Description *
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="form-textarea resize-none"
                placeholder={`Describe your ${selectedType.replace('-', ' ')} study. For example:
                
"We're testing a new mobile banking app interface to understand user preferences for navigation and transaction flows. Looking for participants aged 25-45 who use mobile banking regularly and have experience with financial apps."`}
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific about your target audience, study goals, and any particular requirements. 
                This helps our AI match you with the most relevant participants.
              </p>
            </div>
          </div>

          {getStudyTypeSpecificContent(selectedType)}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="text-blue-600 mt-0.5" size={16} />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">AI will help you find:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Participants matching your demographic criteria</li>
                  <li>• Users with relevant experience and interests</li>
                  <li>• Candidates with appropriate availability</li>
                  <li>• Quality participants based on past study performance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/templates')}
                className="btn-secondary"
              >
                <FileText size={16} className="mr-2" />
                Browse Templates
              </button>
            </div>
            <button
              onClick={handleContinue}
              disabled={!prompt.trim() || !studyTitle.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Participant Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 