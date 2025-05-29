import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart3, Users, Eye, Calendar, Clock, Play, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import type { Study } from '../types/study';

interface AllStudiesProps {
  studies: Study[];
}

export const AllStudies: React.FC<AllStudiesProps> = ({ studies }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

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

  const filteredAndSortedStudies = studies
    .filter(study => {
      const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
      const matchesType = typeFilter === 'all' || study.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'participants':
          return b.participants.length - a.participants.length;
        default:
          return 0;
      }
    });

  const statusCounts = {
    all: studies.length,
    live: studies.filter(s => s.status === 'live').length,
    'pending-review': studies.filter(s => s.status === 'pending-review').length,
    completed: studies.filter(s => s.status === 'completed').length,
    draft: studies.filter(s => s.status === 'draft').length,
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Studies</h1>
          <p className="text-gray-600 mt-1">Manage and view all your research studies</p>
        </div>
        <button 
          onClick={() => navigate('/create-study')}
          className="btn-primary"
        >
          <Plus size={16} className="mr-2" />
          New Study
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                statusFilter === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} ({count})
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search studies by title, description, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-sm max-w-xs"
          >
            <option value="all">All Types</option>
            <option value="online-survey">Online Survey</option>
            <option value="1-on-1-consultation">1-on-1 Consultation</option>
            <option value="product-testing">Product Testing</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input text-sm max-w-xs"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="participants">Most Participants</option>
          </select>
        </div>
      </div>

      {/* Studies List */}
      <div className="space-y-4">
        {filteredAndSortedStudies.map((study) => (
          <div 
            key={study.id} 
            onClick={() => navigate(`/study/${study.id}`)}
            className="card hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  {study.type === 'online-survey' && <BarChart3 className="text-blue-600" size={24} />}
                  {study.type === '1-on-1-consultation' && <Users className="text-blue-600" size={24} />}
                  {study.type === 'product-testing' && <Eye className="text-blue-600" size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {study.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {study.prompt}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className="capitalize">
                            {study.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{study.participants.length} participants</span>
                        </div>
                        {study.configuration && (
                          <>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{study.configuration.surveyLength}m</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>${study.configuration.compensation}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>Created {study.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`status-badge ${getStatusColor(study.status)}`}>
                          {getStatusIcon(study.status)}
                          <span className="ml-1 capitalize">{study.status.replace('-', ' ')}</span>
                        </span>
                        <span className="text-xs text-gray-500">by {study.createdBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/study/${study.id}`);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedStudies.length === 0 && (
        <div className="text-center py-16">
          <BarChart3 className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No studies found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters to find studies.</p>
          <button 
            onClick={() => navigate('/create-study')}
            className="btn-primary"
          >
            Create New Study
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-500">
        Showing {filteredAndSortedStudies.length} of {studies.length} studies
      </div>
    </div>
  );
}; 