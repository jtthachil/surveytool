import React, { useMemo } from 'react';
import { Users, TrendingUp, Clock, Download } from 'lucide-react';
import type { Survey, SurveyResponse } from '../types/survey';

interface SurveyResultsProps {
  survey: Survey;
  responses: SurveyResponse[];
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({ survey, responses }) => {
  const analytics = useMemo(() => {
    const totalResponses = responses.length;
    
    const questionAnalytics = survey.questions.map(question => {
      const questionResponses = responses
        .map(r => r.answers.find(a => a.questionId === question.id))
        .filter(Boolean);
      
      const responseCount = questionResponses.length;
      
      let mostCommonAnswer: string | undefined;
      let averageRating: number | undefined;
      
      if (question.type === 'rating' && questionResponses.length > 0) {
        const ratings = questionResponses
          .map(r => Number(r!.value))
          .filter(r => !isNaN(r));
        averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      } else if (['multiple-choice', 'text', 'email'].includes(question.type)) {
        const answerCounts: Record<string, number> = {};
        questionResponses.forEach(response => {
          const value = String(response!.value);
          answerCounts[value] = (answerCounts[value] || 0) + 1;
        });
        
        mostCommonAnswer = Object.entries(answerCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0];
      }
      
      return {
        questionId: question.id,
        responseCount,
        mostCommonAnswer,
        averageRating,
      };
    });
    
    return {
      totalResponses,
      completionRate: totalResponses > 0 ? 100 : 0,
      averageTimeToComplete: 0, // Would need timestamp tracking
      questionAnalytics,
    };
  }, [survey, responses]);

  const getQuestionResponses = (questionId: string) => {
    return responses
      .map(r => r.answers.find(a => a.questionId === questionId))
      .filter(Boolean);
  };

  const exportToCSV = () => {
    const csvHeaders = ['Response ID', 'Submitted At', 'Email', ...survey.questions.map(q => q.title)];
    const csvRows = responses.map(response => [
      response.id,
      response.submittedAt.toISOString(),
      response.respondentEmail || '',
      ...survey.questions.map(question => {
        const answer = response.answers.find(a => a.questionId === question.id);
        if (answer) {
          return Array.isArray(answer.value) ? answer.value.join('; ') : String(answer.value);
        }
        return '';
      })
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-700 mb-2">{survey.title}</h1>
          <p className="text-secondary-600">Survey Results & Analytics</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={responses.length === 0}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-700">{analytics.totalResponses}</h3>
          <p className="text-secondary-600">Total Responses</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-700">{analytics.completionRate}%</h3>
          <p className="text-secondary-600">Completion Rate</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-700">{survey.questions.length}</h3>
          <p className="text-secondary-600">Questions</p>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-700 mb-2">No Responses Yet</h3>
          <p className="text-secondary-600">
            Once people start responding to your survey, you'll see the results here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Question-by-Question Analysis */}
          <div>
            <h2 className="text-2xl font-bold text-secondary-700 mb-6">Question Analysis</h2>
            <div className="space-y-6">
              {survey.questions.map((question, index) => {
                const questionStats = analytics.questionAnalytics.find(qa => qa.questionId === question.id);
                const questionResponses = getQuestionResponses(question.id);
                
                return (
                  <div key={question.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-700">
                          Q{index + 1}: {question.title}
                        </h3>
                        <p className="text-sm text-secondary-600 mt-1">
                          {questionStats?.responseCount || 0} of {responses.length} responses
                        </p>
                      </div>
                      <span className="text-sm text-secondary-500 capitalize bg-secondary-100 px-2 py-1 rounded">
                        {question.type.replace('-', ' ')}
                      </span>
                    </div>

                    {question.type === 'rating' && questionStats?.averageRating && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-secondary-600">Average Rating:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary-600">
                              {questionStats.averageRating.toFixed(1)}
                            </span>
                            <span className="text-secondary-500">
                              / {question.maxRating || 5}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {(question.type === 'multiple-choice' || question.type === 'checkbox') && question.options && (
                      <div>
                        <h4 className="font-medium text-secondary-700 mb-3">Response Distribution:</h4>
                        <div className="space-y-2">
                          {question.options.map(option => {
                            const optionCount = questionResponses.filter(response => {
                              if (Array.isArray(response!.value)) {
                                return response!.value.includes(option.value);
                              }
                              return response!.value === option.value;
                            }).length;
                            
                            const percentage = questionResponses.length > 0 
                              ? (optionCount / questionResponses.length) * 100 
                              : 0;
                            
                            return (
                              <div key={option.id} className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-secondary-700">{option.text}</span>
                                    <span className="text-sm text-secondary-600">
                                      {optionCount} ({percentage.toFixed(0)}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-secondary-200 rounded-full h-2">
                                    <div 
                                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {['text', 'textarea', 'email', 'number'].includes(question.type) && (
                      <div>
                        <h4 className="font-medium text-secondary-700 mb-3">Recent Responses:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {questionResponses.slice(0, 5).map((response, idx) => (
                            <div key={idx} className="p-2 bg-secondary-50 rounded text-sm text-secondary-700">
                              {String(response!.value)}
                            </div>
                          ))}
                          {questionResponses.length > 5 && (
                            <p className="text-sm text-secondary-500 italic">
                              And {questionResponses.length - 5} more responses...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Responses */}
          <div>
            <h2 className="text-2xl font-bold text-secondary-700 mb-6">Recent Responses</h2>
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Response ID</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Submitted</th>
                      {survey.settings.requireEmail && (
                        <th className="text-left py-3 px-4 font-medium text-secondary-700">Email</th>
                      )}
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.slice(-10).reverse().map(response => (
                      <tr key={response.id} className="border-b border-secondary-100">
                        <td className="py-3 px-4 text-sm text-secondary-600 font-mono">
                          {response.id.slice(-8)}
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-600">
                          {response.submittedAt.toLocaleDateString()} {response.submittedAt.toLocaleTimeString()}
                        </td>
                        {survey.settings.requireEmail && (
                          <td className="py-3 px-4 text-sm text-secondary-600">
                            {response.respondentEmail || 'N/A'}
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Complete
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 