import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Question, QuestionOption } from '../types/survey';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onUpdate }) => {
  const [localQuestion, setLocalQuestion] = useState<Question>(question);

  const updateQuestion = (updates: Partial<Question>) => {
    const updatedQuestion = { ...localQuestion, ...updates };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `option_${Date.now()}`,
      text: 'New Option',
      value: `option_${Date.now()}`
    };
    const options = localQuestion.options || [];
    updateQuestion({ options: [...options, newOption] });
  };

  const updateOption = (optionId: string, updates: Partial<QuestionOption>) => {
    const options = localQuestion.options || [];
    const updatedOptions = options.map(opt => 
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    updateQuestion({ options: updatedOptions });
  };

  const removeOption = (optionId: string) => {
    const options = localQuestion.options || [];
    updateQuestion({ options: options.filter(opt => opt.id !== optionId) });
  };

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'rating', label: 'Rating Scale' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
  ];

  const needsOptions = ['multiple-choice', 'checkbox'].includes(localQuestion.type);
  const isRating = localQuestion.type === 'rating';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Question Type
          </label>
          <select
            value={localQuestion.type}
            onChange={(e) => updateQuestion({ type: e.target.value as Question['type'] })}
            className="form-input"
          >
            {questionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localQuestion.required}
              onChange={(e) => updateQuestion({ required: e.target.checked })}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-secondary-700">Required</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Question Title
        </label>
        <input
          type="text"
          value={localQuestion.title}
          onChange={(e) => updateQuestion({ title: e.target.value })}
          className="form-input"
          placeholder="Enter question title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Description (optional)
        </label>
        <textarea
          value={localQuestion.description || ''}
          onChange={(e) => updateQuestion({ description: e.target.value })}
          className="form-input"
          rows={2}
          placeholder="Add additional context or instructions"
        />
      </div>

      {(localQuestion.type === 'text' || localQuestion.type === 'textarea' || localQuestion.type === 'email' || localQuestion.type === 'number') && (
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Placeholder Text
          </label>
          <input
            type="text"
            value={localQuestion.placeholder || ''}
            onChange={(e) => updateQuestion({ placeholder: e.target.value })}
            className="form-input"
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      {isRating && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Minimum Rating
            </label>
            <input
              type="number"
              value={localQuestion.minRating || 1}
              onChange={(e) => updateQuestion({ minRating: parseInt(e.target.value) })}
              className="form-input"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Maximum Rating
            </label>
            <input
              type="number"
              value={localQuestion.maxRating || 5}
              onChange={(e) => updateQuestion({ maxRating: parseInt(e.target.value) })}
              className="form-input"
              min="2"
              max="10"
            />
          </div>
        </div>
      )}

      {needsOptions && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-secondary-700">
              Options
            </label>
            <button
              type="button"
              onClick={addOption}
              className="btn-secondary flex items-center space-x-1 text-sm"
            >
              <Plus size={16} />
              <span>Add Option</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {(localQuestion.options || []).map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <span className="text-sm text-secondary-500 w-8">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(option.id, { text: e.target.value, value: e.target.value })}
                  className="form-input flex-1"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          
          {(!localQuestion.options || localQuestion.options.length === 0) && (
            <p className="text-sm text-secondary-500 italic">
              No options added yet. Click "Add Option" to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 