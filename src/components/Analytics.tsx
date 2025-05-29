import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Clock, Filter, Download, ArrowRight } from 'lucide-react';
import type { Study } from '../types/study';

interface AnalyticsProps {
  studies: Study[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ studies }) => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [selectedStudyType, setSelectedStudyType] = useState('all');

  const filteredStudies = studies.filter(study => {
    if (selectedStudyType === 'all') return true;
    return study.type === selectedStudyType;
  });

  const metrics = {
    totalResponses: filteredStudies.reduce((acc, study) => acc + study.participants.length, 0),
    avgCompletionRate: 85.6,
    avgSurveyTime: 12.3,
    totalCompensation: filteredStudies.reduce((acc, study) => 
      acc + (study.configuration?.compensation || 0) * study.participants.length, 0
    )
  };

  const studyPerformance = filteredStudies.map(study => ({
    ...study,
    completionRate: Math.floor(Math.random() * 30) + 70, // Mock completion rate
    avgTime: Math.floor(Math.random() * 10) + 8, // Mock average time
    responses: study.participants.length
  }));

  // Mock chart data
  const chartData = {
    responseTrends: [
      { month: 'Jan', responses: 45 },
      { month: 'Feb', responses: 52 },
      { month: 'Mar', responses: 61 },
      { month: 'Apr', responses: 58 },
      { month: 'May', responses: 67 },
      { month: 'Jun', responses: 74 },
    ],
    studyTypes: [
      { type: 'Online Survey', count: studies.filter(s => s.type === 'online-survey').length, color: '#3B82F6' },
      { type: '1-on-1 Consultation', count: studies.filter(s => s.type === '1-on-1-consultation').length, color: '#10B981' },
      { type: 'Product Testing', count: studies.filter(s => s.type === 'product-testing').length, color: '#F59E0B' },
    ]
  };

  const handleStudyClick = (studyId: string) => {
    navigate(`/analytics/study/${studyId}`);
  };

  const ResponseTrendsChart = () => (
    <div className="h-64 p-4">
      <div className="flex items-end space-x-4 h-full">
        {chartData.responseTrends.map((data) => (
          <div key={data.month} className="flex-1 flex flex-col items-center">
            <div 
              className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(data.responses / 80) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 font-medium">{data.month}</div>
            <div className="text-xs text-gray-500">{data.responses}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const StudyTypeChart = () => {
    const total = chartData.studyTypes.reduce((acc, item) => acc + item.count, 0);
    let cumulativePercentage = 0;

    return (
      <div className="h-64 flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" strokeWidth="20" />
            {chartData.studyTypes.map((item) => {
              const percentage = (item.count / total) * 100;
              const strokeDasharray = (percentage / 100) * (2 * Math.PI * 80);
              const strokeDashoffset = -cumulativePercentage * (2 * Math.PI * 80) / 100;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={item.type}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={`${strokeDasharray} ${2 * Math.PI * 80}`}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 100 100)"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Studies</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {chartData.studyTypes.map((item) => (
            <div key={item.type} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700">{item.type} ({item.count})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-gray-600 mt-1">Track the performance of your research studies</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="form-input py-2 text-sm"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button className="btn-secondary py-2 px-4 text-sm">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Filter size={20} className="text-gray-400" />
          <select 
            value={selectedStudyType}
            onChange={(e) => setSelectedStudyType(e.target.value)}
            className="form-input py-2 text-sm max-w-xs"
          >
            <option value="all">All Study Types</option>
            <option value="online-survey">Online Survey</option>
            <option value="1-on-1-consultation">1-on-1 Consultation</option>
            <option value="product-testing">Product Testing</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalResponses}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +12.5% vs last period
              </p>
            </div>
            <div className="icon-bg-blue">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.avgCompletionRate}%</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +3.2% vs last period
              </p>
            </div>
            <div className="icon-bg-green">
              <BarChart3 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Survey Time</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.avgSurveyTime}m</p>
              <p className="text-xs text-orange-600 mt-1 flex items-center">
                <Clock size={12} className="mr-1" />
                -1.8% vs last period
              </p>
            </div>
            <div className="icon-bg-orange">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Compensation</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalCompensation}</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +8.7% vs last period
              </p>
            </div>
            <div className="icon-bg-purple">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Trends</h3>
          <ResponseTrendsChart />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Type Distribution</h3>
          <StudyTypeChart />
        </div>
      </div>

      {/* Study Performance Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Study Performance</h3>
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
            View All Studies
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Study Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Responses</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Completion Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studyPerformance.map((study) => (
                <tr key={study.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{study.title}</div>
                    <div className="text-sm text-gray-500">Created {study.createdAt.toLocaleDateString()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 capitalize">
                      {study.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{study.responses}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${study.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{study.completionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{study.avgTime}m</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`status-badge ${
                      study.status === 'live' ? 'status-live' :
                      study.status === 'completed' ? 'status-completed' :
                      study.status === 'pending-review' ? 'status-pending-review' :
                      study.status === 'draft' ? 'status-draft' : 'status-rejected'
                    }`}>
                      {study.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleStudyClick(study.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
                    >
                      View Analytics
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 