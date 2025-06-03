import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Users, Clock, CheckCircle, AlertCircle, Wallet, CreditCard, Play, Eye } from 'lucide-react';
import type { Study, StudyType } from '../types/study';

interface DashboardProps {
  studies: Study[];
}

export const Dashboard: React.FC<DashboardProps> = ({ studies }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'status-live';
      case 'completed': return 'status-completed';
      case 'pending-review': return 'status-pending-review';
      case 'draft': return 'status-draft';
      case 'rejected': return 'status-rejected';
      default: return 'status-draft';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play size={14} />;
      case 'completed': return <CheckCircle size={14} />;
      case 'pending-review': return <Clock size={14} />;
      case 'draft': return <AlertCircle size={14} />;
      case 'rejected': return <AlertCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const stats = {
    totalStudies: studies.length,
    liveStudies: studies.filter(s => s.status === 'live').length,
    completedStudies: studies.filter(s => s.status === 'completed').length,
    totalParticipants: studies.reduce((acc, study) => acc + study.participants.length, 0),
  };

  const handleQuickStart = (type: StudyType) => {
    const prompts = {
      'online-survey': 'Create a comprehensive survey to gather insights from your target audience',
      '1-on-1-consultation': 'Schedule individual interviews for deep qualitative insights',
      'product-testing': 'Get feedback on your products from real users in controlled environments'
    };
    
    navigate('/create-study', { state: { preselectedType: type, prompt: prompts[type] } });
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-blue-100 text-lg">Ready to launch your next research study?</p>
          </div>
          <button
            onClick={() => navigate('/create-study')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span>New Research</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Studies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudies}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="icon-bg-blue">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Live Studies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.liveStudies}</p>
              <p className="text-xs text-green-600 mt-1">Currently active</p>
            </div>
            <div className="icon-bg-green">
              <Play className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedStudies}</p>
              <p className="text-xs text-blue-600 mt-1">Successfully finished</p>
            </div>
            <div className="icon-bg-purple">
              <CheckCircle className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
              <p className="text-xs text-orange-600 mt-1">Total engaged</p>
            </div>
            <div className="icon-bg-orange">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button
          onClick={() => navigate('/create-study')}
          className="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <Plus className="h-8 w-8" />
            <span className="text-blue-100 text-sm">Start Now</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Create New Study</h3>
          <p className="text-blue-100 text-sm">Launch a new research study with participants</p>
        </button>

        <button
          onClick={() => navigate('/analytics')}
          className="group p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8" />
            <span className="text-green-100 text-sm">View All</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Analytics Hub</h3>
          <p className="text-green-100 text-sm">Deep dive into your research data and insights</p>
        </button>

        <button
          onClick={() => navigate('/wallet-dashboard')}
          className="group p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8" />
            <span className="text-purple-100 text-sm">Manage</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Payment Center</h3>
          <p className="text-purple-100 text-sm">Review participant payments and wallets</p>
        </button>

        <button
          onClick={() => navigate('/participants')}
          className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-orange-100 text-sm">Browse</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Participant Pool</h3>
          <p className="text-orange-100 text-sm">Discover and manage research participants</p>
        </button>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Studies</h2>
          {studies.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No studies yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first research study. Choose from surveys, interviews, or product testing.
              </p>
              <button
                onClick={() => navigate('/create-study')}
                className="btn-primary"
              >
                Create Your First Study
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {studies.slice(0, 5).map((study) => (
                <div 
                  key={study.id} 
                  onClick={() => navigate(`/study/${study.id}`)}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      {study.type === 'online-survey' && <BarChart3 className="text-blue-600" size={24} />}
                      {study.type === '1-on-1-consultation' && <Users className="text-blue-600" size={24} />}
                      {study.type === 'product-testing' && <Eye className="text-blue-600" size={24} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {study.title || 'Untitled Study'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="capitalize">
                          {study.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span>•</span>
                        <span>{study.participants.length} participants</span>
                        <span>•</span>
                        <span>Created {study.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`status-badge ${getStatusColor(study.status)}`}>
                      {getStatusIcon(study.status)}
                      <span className="ml-1 capitalize">{study.status.replace('-', ' ')}</span>
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/study/${study.id}`);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Payment Overview</h3>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending Payments</span>
                <span className="text-sm font-medium text-yellow-600">$125.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Paid This Month</span>
                <span className="text-sm font-medium text-green-600">$850.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Participants</span>
                <span className="text-sm font-medium text-gray-900">24</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/payment-management')}
              className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Review Payments →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => handleQuickStart('online-survey')}
          className="card-hover group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <BarChart3 className="text-blue-600" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Online Survey
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create comprehensive surveys to gather insights from your target audience
            </p>
          </div>
        </div>

        <div 
          onClick={() => handleQuickStart('1-on-1-consultation')}
          className="card-hover group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Users className="text-green-600" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              1-on-1 Consultation
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Schedule individual interviews for deep qualitative insights
            </p>
          </div>
        </div>

        <div 
          onClick={() => handleQuickStart('product-testing')}
          className="card-hover group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Eye className="text-purple-600" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              Product Testing
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get feedback on your products from real users in controlled environments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 