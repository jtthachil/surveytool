import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Settings, GripVertical } from 'lucide-react';
import type { Survey, Question } from '../types/survey';
import { QuestionEditor } from './QuestionEditor';

interface SurveyBuilderProps {
  onSurveyCreate: (survey: Survey) => void;
  survey: Survey | null;
}

interface SurveyFormData {
  title: string;
  description: string;
  allowMultipleResponses: boolean;
  showProgressBar: boolean;
  requireEmail: boolean;
}

export const SurveyBuilder: React.FC<SurveyBuilderProps> = ({ onSurveyCreate, survey }) => {
  const [questions, setQuestions] = useState<Question[]>(survey?.questions || []);
  const [showSettings, setShowSettings] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SurveyFormData>({
    defaultValues: {
      title: survey?.title || '',
      description: survey?.description || '',
      allowMultipleResponses: survey?.settings.allowMultipleResponses || false,
      showProgressBar: survey?.settings.showProgressBar || true,
      requireEmail: survey?.settings.requireEmail || false,
    }
  });

  useEffect(() => {
    if (survey) {
      setValue('title', survey.title);
      setValue('description', survey.description);
      setValue('allowMultipleResponses', survey.settings.allowMultipleResponses);
      setValue('showProgressBar', survey.settings.showProgressBar);
      setValue('requireEmail', survey.settings.requireEmail);
      setQuestions(survey.questions);
    }
  }, [survey, setValue]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      type: 'text',
      title: 'New Question',
      description: '',
      required: false,
      placeholder: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === questionId ? updatedQuestion : q));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < questions.length - 1)
    ) {
      const newQuestions = [...questions];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newQuestions[currentIndex], newQuestions[targetIndex]] = 
      [newQuestions[targetIndex], newQuestions[currentIndex]];
      setQuestions(newQuestions);
    }
  };

  const onSubmit = (data: SurveyFormData) => {
    const newSurvey: Survey = {
      id: survey?.id || `survey_${Date.now()}`,
      title: data.title,
      description: data.description,
      questions,
      createdAt: survey?.createdAt || new Date(),
      settings: {
        allowMultipleResponses: data.allowMultipleResponses,
        showProgressBar: data.showProgressBar,
        requireEmail: data.requireEmail,
      }
    };
    onSurveyCreate(newSurvey);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-secondary-700">Survey Builder</h1>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
              Survey Title *
            </label>
            <input
              {...register('title', { required: 'Survey title is required' })}
              type="text"
              id="title"
              className="form-input"
              placeholder="Enter survey title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="form-input"
              placeholder="Describe your survey"
            />
          </div>

          {showSettings && (
            <div className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
              <h3 className="font-medium text-secondary-700 mb-4">Survey Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    {...register('allowMultipleResponses')}
                    type="checkbox"
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">Allow multiple responses</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('showProgressBar')}
                    type="checkbox"
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">Show progress bar</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('requireEmail')}
                    type="checkbox"
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">Require email address</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-700">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="card border-l-4 border-l-primary-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GripVertical size={20} className="text-secondary-400 cursor-move" />
                    <span className="text-sm font-medium text-secondary-600">Question {index + 1}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => moveQuestion(question.id, 'up')}
                      disabled={index === 0}
                      className="text-secondary-400 hover:text-secondary-600 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveQuestion(question.id, 'down')}
                      disabled={index === questions.length - 1}
                      className="text-secondary-400 hover:text-secondary-600 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <QuestionEditor
                  question={question}
                  onUpdate={(updatedQuestion: Question) => updateQuestion(question.id, updatedQuestion)}
                />
              </div>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-12 text-secondary-500">
              <p>No questions added yet. Click "Add Question" to get started.</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button type="submit" className="btn-primary">
              {survey ? 'Update Survey' : 'Create Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 