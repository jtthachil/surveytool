import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Filter, UserCheck, Mail, MapPin, Briefcase, Star, Clock } from 'lucide-react';
import type { Study, Participant, FilterCriteria } from '../types/study';

interface ParticipantSelectorProps {
  study: Partial<Study>;
  onParticipantsSelect: (participants: Participant[]) => void;
}

// Mock participants data
const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    demographics: { age: 28, gender: 'Female', location: 'San Francisco, CA', occupation: 'Product Designer', education: 'Bachelor\'s' },
    interests: ['UX Design', 'Mobile Apps', 'Banking', 'Technology'],
    previousStudies: 12,
    rating: 4.8,
    availability: 'high'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    demographics: { age: 34, gender: 'Male', location: 'Austin, TX', occupation: 'Software Engineer', education: 'Master\'s' },
    interests: ['Fintech', 'Mobile Development', 'User Experience'],
    previousStudies: 8,
    rating: 4.6,
    availability: 'medium'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily.johnson@email.com',
    demographics: { age: 31, gender: 'Female', location: 'New York, NY', occupation: 'Marketing Manager', education: 'Bachelor\'s' },
    interests: ['Digital Marketing', 'Consumer Behavior', 'Mobile Banking'],
    previousStudies: 15,
    rating: 4.9,
    availability: 'high'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    demographics: { age: 26, gender: 'Male', location: 'Seattle, WA', occupation: 'Data Analyst', education: 'Master\'s' },
    interests: ['Data Analysis', 'Banking', 'Technology', 'User Research'],
    previousStudies: 6,
    rating: 4.7,
    availability: 'high'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    demographics: { age: 39, gender: 'Female', location: 'Chicago, IL', occupation: 'Business Analyst', education: 'MBA' },
    interests: ['Business Analysis', 'Finance', 'Mobile Technology'],
    previousStudies: 20,
    rating: 4.8,
    availability: 'medium'
  }
];

export const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({ 
  study, 
  onParticipantsSelect
}) => {
  const navigate = useNavigate();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>(mockParticipants);
  const [aiSuggested, setAiSuggested] = useState<string[]>([]);

  useEffect(() => {
    // Simulate AI suggestions based on the study prompt
    const suggested = mockParticipants
      .filter(p => p.rating >= 4.5 && p.availability === 'high')
      .slice(0, 3)
      .map(p => p.id);
    setAiSuggested(suggested);
    setSelectedParticipants(suggested);
  }, []);

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  const handleContinue = () => {
    const selected = mockParticipants.filter(p => selectedParticipants.includes(p.id));
    onParticipantsSelect(selected);
    navigate('/configure-study');
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Select Participants</h1>
            <p className="text-gray-500">AI has suggested the best matches for your study</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <button
            onClick={handleSelectAll}
            className="btn-secondary"
          >
            {selectedParticipants.length === filteredParticipants.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* AI Suggestions Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Sparkles size={24} />
          <h2 className="text-lg font-semibold">AI Recommendations</h2>
        </div>
        <p className="text-purple-100 mb-4">
          Based on your study description: "{study.prompt?.substring(0, 100)}..."
        </p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <UserCheck size={16} />
            <span>{aiSuggested.length} participants suggested</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star size={16} />
            <span>High-rated matches</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} />
            <span>Available participants</span>
          </div>
        </div>
      </div>

      {/* Study Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Study Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Study Type:</span>
            <p className="font-medium text-gray-900 capitalize">
              {study.type?.replace('-', ' ')}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Selected Participants:</span>
            <p className="font-medium text-gray-900">{selectedParticipants.length} of {filteredParticipants.length}</p>
          </div>
          <div>
            <span className="text-gray-500">Average Rating:</span>
            <p className="font-medium text-gray-900">
              {filteredParticipants
                .filter(p => selectedParticipants.includes(p.id))
                .reduce((acc, p) => acc + p.rating, 0) / Math.max(selectedParticipants.length, 1)
                || 0
                }★
            </p>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="card">
        <div className="space-y-4">
          {filteredParticipants.map((participant) => {
            const isSelected = selectedParticipants.includes(participant.id);
            const isAISuggested = aiSuggested.includes(participant.id);
            
            return (
              <div
                key={participant.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleParticipantToggle(participant.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleParticipantToggle(participant.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                        {isAISuggested && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Sparkles size={12} className="mr-1" />
                            AI Pick
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{participant.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{participant.demographics.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase size={14} />
                          <span>{participant.demographics.occupation}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500" />
                          <span className="text-sm font-medium">{participant.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {participant.previousStudies} studies completed
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(participant.availability)}`}>
                          {participant.availability} availability
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {participant.interests.slice(0, 3).map((interest, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {interest}
                          </span>
                        ))}
                        {participant.interests.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{participant.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleContinue}
          disabled={selectedParticipants.length === 0}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with {selectedParticipants.length} Participants
        </button>
      </div>
    </div>
  );
}; 