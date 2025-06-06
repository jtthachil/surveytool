export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface Question {
  id: string;
  type: 'text' | 'multiple-choice' | 'checkbox' | 'rating' | 'email' | 'number' | 'textarea';
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  minRating?: number;
  maxRating?: number;
  placeholder?: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  createdBy?: string;
  settings: {
    allowMultipleResponses: boolean;
    showProgressBar: boolean;
    requireEmail: boolean;
  };
}

export interface SurveyAnswer {
  questionId: string;
  value: string | string[] | number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: SurveyAnswer[];
  submittedAt: Date;
  respondentEmail?: string;
}

export interface SurveyAnalytics {
  totalResponses: number;
  completionRate: number;
  averageTimeToComplete: number;
  questionAnalytics: {
    questionId: string;
    responseCount: number;
    mostCommonAnswer?: string;
    averageRating?: number;
  }[];
} 