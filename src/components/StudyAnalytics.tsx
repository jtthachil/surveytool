import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Users, Target, Download, Clock, MapPin } from 'lucide-react';
import type { Study } from '../types/study';

interface StudyAnalyticsProps {
  studies: Study[];
}

export const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({ studies }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  
  const study = studies.find(s => s.id === id);

  if (!study) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Study not found</h3>
        <button onClick={() => navigate('/analytics')} className="btn-primary">
          Back to Analytics
        </button>
      </div>
    );
  }

  // Mock advanced analytics data
  const analytics = {
    totalResponses: study.participants.length,
    completionRate: Math.floor(Math.random() * 30) + 70,
    avgTime: Math.floor(Math.random() * 10) + 8,
    dropoffRate: Math.floor(Math.random() * 15) + 5,
    satisfactionScore: 4.2 + Math.random() * 0.6,
    responsesByDay: [
      { day: 'Mon', responses: 12 },
      { day: 'Tue', responses: 19 },
      { day: 'Wed', responses: 15 },
      { day: 'Thu', responses: 22 },
      { day: 'Fri', responses: 18 },
      { day: 'Sat', responses: 8 },
      { day: 'Sun', responses: 6 },
    ],
    timeSpentBySection: [
      { section: 'Introduction', avgTime: 1.2 },
      { section: 'Demographics', avgTime: 2.8 },
      { section: 'Main Questions', avgTime: 5.4 },
      { section: 'Feedback', avgTime: 1.9 },
    ],
    demographicsBreakdown: {
      age: [
        { range: '18-24', count: 8, percentage: 32 },
        { range: '25-34', count: 12, percentage: 48 },
        { range: '35-44', count: 3, percentage: 12 },
        { range: '45+', count: 2, percentage: 8 },
      ],
      gender: [
        { type: 'Female', count: 14, percentage: 56 },
        { type: 'Male', count: 10, percentage: 40 },
        { type: 'Other', count: 1, percentage: 4 },
      ],
      location: study.participants.reduce((acc, p) => {
        const city = p.demographics.location?.split(',')[0];
        if (city) {
          acc[city] = (acc[city] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    }
  };

  const ResponsesByDayChart = () => (
    <div className="h-64 p-4">
      <div className="flex items-end space-x-2 h-full">
        {analytics.responsesByDay.map((data) => (
          <div key={data.day} className="flex-1 flex flex-col items-center">
            <div 
              className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(data.responses / 25) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 font-medium">{data.day}</div>
            <div className="text-xs text-gray-500">{data.responses}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const TimeSpentChart = () => (
    <div className="h-64 p-4">
      <div className="space-y-4">
        {analytics.timeSpentBySection.map((section) => (
          <div key={section.section} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 truncate">{section.section}</div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(section.avgTime / 6) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900 w-12">{section.avgTime}m</div>
          </div>
        ))}
      </div>
    </div>
  );

  const DemographicsChart = ({ data, title, colors }: { data: any[], title: string, colors: string[] }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">{title}</h4>
      {data.map((item, index) => (
        <div key={item.range || item.type} className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div 
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm text-gray-700">{item.range || item.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{item.count}</span>
            <span className="text-xs text-gray-500">({item.percentage}%)</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/analytics')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{study.title} - Analytics</h1>
            <p className="text-gray-600 mt-1">Detailed performance metrics and insights</p>
          </div>
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
          </select>
          <button className="btn-secondary py-2 px-4 text-sm">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalResponses}</p>
            </div>
            <div className="icon-bg-blue">
              <Users className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
            </div>
            <div className="icon-bg-green">
              <Target className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgTime}m</p>
            </div>
            <div className="icon-bg-orange">
              <Clock className="text-orange-600" size={20} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Drop-off Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.dropoffRate}%</p>
            </div>
            <div className="icon-bg-purple">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.satisfactionScore.toFixed(1)}</p>
            </div>
            <div className="icon-bg-green">
              <BarChart3 className="text-green-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Responses by Day</h3>
          <ResponsesByDayChart />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Spent by Section</h3>
          <TimeSpentChart />
        </div>
      </div>

      {/* Demographics and Participant Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
          <DemographicsChart 
            data={analytics.demographicsBreakdown.age}
            title=""
            colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <DemographicsChart 
            data={analytics.demographicsBreakdown.gender}
            title=""
            colors={['#8B5CF6', '#06B6D4', '#84CC16']}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographicsBreakdown.location)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([city, count]) => (
                <div key={city} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin size={14} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{city}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Participant List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Participant Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Participant</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Demographics</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Completion</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Time Spent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
              </tr>
            </thead>
            <tbody>
              {study.participants.map((participant) => (
                <tr key={participant.id} className="border-b border-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{participant.name}</div>
                      <div className="text-sm text-gray-500">{participant.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      <div>{participant.demographics.age} years, {participant.demographics.gender}</div>
                      <div className="flex items-center mt-1">
                        <MapPin size={12} className="mr-1" />
                        {participant.demographics.location}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor(Math.random() * 30) + 70}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {Math.floor(Math.random() * 10) + 5}m
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-medium text-gray-900">{participant.rating}</span>
                    </div>
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