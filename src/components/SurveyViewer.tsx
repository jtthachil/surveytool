import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import type { Survey, SurveyResponse, SurveyAnswer } from '../types/survey';

interface SurveyViewerProps {
  survey: Survey;
  onSurveyResponse: (response: SurveyResponse) => void;
}

export const SurveyViewer: React.FC<SurveyViewerProps> = ({ survey, onSurveyResponse }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  const nextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const onSubmit = (data: any) => {
    const answers: SurveyAnswer[] = survey.questions.map(question => ({
      questionId: question.id,
      value: data[question.id] || (question.type === 'checkbox' ? [] : '')
    }));

    const response: SurveyResponse = {
      id: `response_${Date.now()}`,
      surveyId: survey.id,
      answers,
      submittedAt: new Date(),
      respondentEmail: survey.settings.requireEmail ? data.email : undefined
    };

    onSurveyResponse(response);
    setSubmitted(true);
  };

  const renderQuestion = () => {
    const question = currentQuestion;
    
    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <input
            {...register(question.id, { 
              required: question.required ? 'This field is required' : false,
              pattern: question.type === 'email' ? {
                value: /^\S+@\S+$/i,
                message: 'Please enter a valid email'
              } : undefined
            })}
            type={question.type}
            className="form-input"
            placeholder={question.placeholder}
          />
        );
        
      case 'number':
        return (
          <input
            {...register(question.id, { 
              required: question.required ? 'This field is required' : false,
              valueAsNumber: true
            })}
            type="number"
            className="form-input"
            placeholder={question.placeholder}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            {...register(question.id, { 
              required: question.required ? 'This field is required' : false 
            })}
            className="form-input"
            rows={4}
            placeholder={question.placeholder}
          />
        );
        
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  {...register(question.id, { 
                    required: question.required ? 'Please select an option' : false 
                  })}
                  type="radio"
                  value={option.value}
                  className="form-radio text-primary-600 focus:ring-primary-500"
                />
                <span className="text-secondary-700">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  {...register(question.id)}
                  type="checkbox"
                  value={option.value}
                  className="form-checkbox text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className="text-secondary-700">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      case 'rating':
        const minRating = question.minRating || 1;
        const maxRating = question.maxRating || 5;
        const ratings = Array.from({ length: maxRating - minRating + 1 }, (_, i) => minRating + i);
        
        return (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary-600">{minRating}</span>
            <div className="flex space-x-2">
              {ratings.map(rating => (
                <label key={rating} className="cursor-pointer">
                  <input
                    {...register(question.id, { 
                      required: question.required ? 'Please select a rating' : false 
                    })}
                    type="radio"
                    value={rating}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-full border-2 border-secondary-300 flex items-center justify-center font-medium transition-colors hover:border-primary-500 ${
                    watch(question.id) == rating ? 'bg-primary-500 text-white border-primary-500' : 'text-secondary-600'
                  }`}>
                    {rating}
                  </div>
                </label>
              ))}
            </div>
            <span className="text-sm text-secondary-600">{maxRating}</span>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-700 mb-2">Thank You!</h2>
          <p className="text-secondary-600">
            Your response has been submitted successfully. We appreciate your feedback.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-700 mb-4">{survey.title}</h1>
          {survey.description && (
            <p className="text-secondary-600 text-lg">{survey.description}</p>
          )}
        </div>

        {survey.settings.showProgressBar && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-secondary-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {survey.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {survey.settings.requireEmail && currentQuestionIndex === 0 && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address *
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email'
                  }
                })}
                type="email"
                className="form-input"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
              )}
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-700 mb-4">
              {currentQuestion.title}
            </h2>
            {currentQuestion.description && (
              <p className="text-secondary-600 mb-4">{currentQuestion.description}</p>
            )}
            
            {renderQuestion()}
            
            {errors[currentQuestion.id] && (
              <p className="mt-2 text-sm text-red-600">
                {errors[currentQuestion.id]?.message as string}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevQuestion}
              disabled={isFirstQuestion}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isFirstQuestion 
                  ? 'text-secondary-400 cursor-not-allowed' 
                  : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            {isLastQuestion ? (
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <Send size={20} />
                <span>Submit Survey</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={nextQuestion}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}; 