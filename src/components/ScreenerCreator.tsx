import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Eye, GripVertical, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScreenerQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'single-choice' | 'text' | 'number';
  options: string[];
  required: boolean;
}

interface ScreenerCreatorProps {
  onBack?: () => void;
  onSave?: (screenerData: any) => void;
}

export const ScreenerCreator: React.FC<ScreenerCreatorProps> = ({
  onBack,
  onSave
}) => {
  const navigate = useNavigate();
  const [screenerTitle] = useState('Create a screener');
  const [screenerDescription] = useState('Shortlist participants further using a screener');
  const [isAIGenerated, setIsAIGenerated] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  
  const [questions, setQuestions] = useState<ScreenerQuestion[]>([
    {
      id: 'q1',
      question: 'What is your primary job role?',
      type: 'single-choice',
      options: [
        'Pharmaceutical Marketing',
        'Advertising',
        'Media Planning',
        'Accounting',
        'Sales',
        'Engineering'
      ],
      required: true
    }
  ]);

  const addQuestion = () => {
    const newQuestion: ScreenerQuestion = {
      id: `q${Date.now()}`,
      question: '',
      type: 'single-choice',
      options: ['Option 1', 'Option 2'],
      required: true
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<ScreenerQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOption = `Option ${question.options.length + 1}`;
      updateQuestion(questionId, {
        options: [...question.options, newOption]
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSave = () => {
    const screenerData = {
      questions,
      isAIGenerated,
      title: screenerTitle,
      description: screenerDescription
    };
    
    if (onSave) {
      onSave(screenerData);
    } else {
      // Default navigation back to study creation flow
      navigate('/configure-study');
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Screener Preview</h3>
              <p className="text-sm text-gray-600 mt-1">How participants will see this screener</p>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{screenerTitle}</h2>
            <p className="text-gray-600">{screenerDescription}</p>
          </div>
          
          {questions.map((question, index) => (
            <div key={question.id} className="mb-6">
              <div className="flex items-center mb-3">
                <span className="text-sm font-medium text-gray-500 mr-2">{index + 1}.</span>
                <h3 className="font-medium text-gray-900">{question.question}</h3>
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              
              <div className="space-y-2 ml-6">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={question.id}
                      className="mr-3 text-blue-600"
                      disabled
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Skip screener & continue
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save & continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="text-sm text-gray-500">
                <span>Brief</span>
                <span className="mx-2">›</span>
                <span>Participants</span>
                <span className="mx-2">›</span>
                <span className="text-gray-900 font-medium">Screener</span>
                <span className="mx-2">›</span>
                <span>Details</span>
                <span className="mx-2">›</span>
                <span>Launch research</span>
              </nav>
            </div>
            
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{screenerTitle}</h1>
            <p className="text-gray-600">{screenerDescription}</p>
          </div>

          {/* AI Generation Toggle */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generation Method</h3>
              {isAIGenerated && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI generated
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isAIGenerated}
                  onChange={() => setIsAIGenerated(true)}
                  className="mr-3"
                />
                <div>
                  <span className="font-medium">AI Generated Questions</span>
                  <p className="text-sm text-gray-600">Let AI create screener questions from your custom message</p>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isAIGenerated}
                  onChange={() => setIsAIGenerated(false)}
                  className="mr-3"
                />
                <div>
                  <span className="font-medium">Custom Questions</span>
                  <p className="text-sm text-gray-600">Create custom screener questions</p>
                </div>
              </label>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={addQuestion}
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add new question
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Click on each question to edit the question.</p>
            </div>

            <div className="p-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-6 mb-6 last:mb-0"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 mr-3">{index + 1}.</span>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        className="text-lg font-medium text-gray-900 border-none outline-none bg-transparent flex-1"
                        placeholder="Enter your question"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 ml-8">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center group">
                        <input
                          type="radio"
                          name={question.id}
                          className="mr-3"
                          disabled
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Enter option"
                        />
                        {question.options.length > 2 && (
                          <button
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      onClick={() => addOption(question.id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700 ml-6"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add option
                    </button>
                  </div>

                  {/* Skip Logic */}
                  <div className="mt-4 ml-8">
                    <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Add Skip logic
                    </button>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No screener questions added yet. Click "Add Question" to get started.</p>
                  <button
                    onClick={addQuestion}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first question
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Skip screener & continue
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Save & continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <PreviewModal />}
    </div>
  );
}; 