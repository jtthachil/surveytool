import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Users, Star, MapPin, Briefcase, GraduationCap, Calendar, CheckSquare, Square, Eye, Mail, Phone, ArrowLeft, Plus } from 'lucide-react';
import type { Participant } from '../types/study';

interface ParticipantsProps {
  participants?: Participant[];
}

// Extended mock participants data
const mockParticipants: Participant[] = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    demographics: {
      age: 28,
      gender: 'Female',
      location: 'New York, NY',
      occupation: 'Software Engineer',
      income: '$80,000 - $100,000',
      education: 'Bachelor\'s Degree'
    },
    interests: ['Technology', 'Gaming', 'Fitness'],
    previousStudies: 3,
    rating: 4.8,
    availability: 'high'
  },
  {
    id: 'p2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    demographics: {
      age: 35,
      gender: 'Male',
      location: 'San Francisco, CA',
      occupation: 'Product Manager',
      income: '$100,000 - $120,000',
      education: 'Master\'s Degree'
    },
    interests: ['Technology', 'Design', 'Travel'],
    previousStudies: 7,
    rating: 4.9,
    availability: 'medium'
  },
  {
    id: 'p3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    demographics: {
      age: 22,
      gender: 'Female',
      location: 'Austin, TX',
      occupation: 'Marketing Coordinator',
      income: '$40,000 - $60,000',
      education: 'Bachelor\'s Degree'
    },
    interests: ['Social Media', 'Photography', 'Fashion'],
    previousStudies: 2,
    rating: 4.7,
    availability: 'high'
  },
  {
    id: 'p4',
    name: 'David Park',
    email: 'david.park@email.com',
    demographics: {
      age: 31,
      gender: 'Male',
      location: 'Seattle, WA',
      occupation: 'UX Designer',
      income: '$70,000 - $90,000',
      education: 'Bachelor\'s Degree'
    },
    interests: ['Design', 'Art', 'Music'],
    previousStudies: 5,
    rating: 4.6,
    availability: 'medium'
  },
  {
    id: 'p5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    demographics: {
      age: 42,
      gender: 'Female',
      location: 'Chicago, IL',
      occupation: 'Business Analyst',
      income: '$60,000 - $80,000',
      education: 'Master\'s Degree'
    },
    interests: ['Business', 'Finance', 'Cooking'],
    previousStudies: 12,
    rating: 4.9,
    availability: 'low'
  },
  {
    id: 'p6',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    demographics: {
      age: 26,
      gender: 'Male',
      location: 'Miami, FL',
      occupation: 'Sales Representative',
      income: '$45,000 - $65,000',
      education: 'Associate Degree'
    },
    interests: ['Sports', 'Travel', 'Music'],
    previousStudies: 1,
    rating: 4.5,
    availability: 'high'
  }
];

export const Participants: React.FC<ParticipantsProps> = ({ participants = mockParticipants }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    gender: 'all',
    ageRange: 'all',
    location: 'all',
    availability: 'all',
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    duration: '60',
    meetingType: 'video-call',
    agenda: ''
  });
  const [notesTemplate, setNotesTemplate] = useState({
    title: '',
    sections: ['Introduction', 'Key Discussion Points', 'Action Items', 'Next Steps']
  });
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    occupation: '',
    location: '',
    interests: ''
  });

  // Check if we're in add mode from study detail
  const isAddMode = searchParams.get('mode') === 'add';
  const studyId = searchParams.get('studyId');

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.demographics.occupation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = filters.gender === 'all' || participant.demographics.gender === filters.gender;
    const matchesAvailability = filters.availability === 'all' || participant.availability === filters.availability;
    const matchesRating = participant.rating >= filters.minRating;

    return matchesSearch && matchesGender && matchesAvailability && matchesRating;
  });

  const toggleSelectParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedParticipants(filteredParticipants.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedParticipants([]);
  };

  const handleAddToStudy = () => {
    if (selectedParticipants.length > 0 && studyId) {
      // Simulate adding participants to study
      alert(`Added ${selectedParticipants.length} participants to study!`);
      navigate(`/study/${studyId}`);
    }
  };

  const handleCreateParticipant = () => {
    // Simulate creating new participant
    console.log('Creating participant:', newParticipant);
    alert('New participant created successfully!');
    setShowAddModal(false);
    setNewParticipant({
      name: '',
      email: '',
      occupation: '',
      location: '',
      interests: ''
    });
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewProfile = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowProfileModal(true);
  };

  const handleContact = (participant: Participant) => {
    setSelectedParticipant(participant);
    setContactSubject(`Research Opportunity - ${participant.name}`);
    setContactMessage(`Hi ${participant.name.split(' ')[0]},\n\nI hope this message finds you well. I'm reaching out regarding a research opportunity that might interest you.\n\nBest regards,\nResearch Team`);
    setShowContactModal(true);
  };

  const handleSendMessage = () => {
    if (!selectedParticipant || !contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    // Simulate sending message
    console.log('Sending message:', {
      to: selectedParticipant.email,
      subject: contactSubject,
      message: contactMessage
    });

    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ Message sent to ${selectedParticipant.name}!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    setShowContactModal(false);
    setContactMessage('');
    setContactSubject('');
  };

  const handleScheduleSession = () => {
    if (!selectedParticipant) {
      alert('Please select a participant');
      return;
    }
    
    if (!scheduleData.date || !scheduleData.time) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate scheduling session
    console.log('Scheduling session:', {
      participant: selectedParticipant,
      schedule: scheduleData
    });

    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ Session scheduled with ${selectedParticipant?.name}!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    setShowScheduleModal(false);
    setSelectedParticipant(null);
    setScheduleData({
      date: '',
      time: '',
      duration: '60',
      meetingType: 'video-call',
      agenda: ''
    });
  };

  const handleCreateNotesTemplate = () => {
    if (!notesTemplate.title.trim()) {
      alert('Please enter a template title');
      return;
    }

    // Simulate creating notes template
    console.log('Creating notes template:', notesTemplate);

    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ Meeting notes template "${notesTemplate.title}" created!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    setShowNotesModal(false);
    setNotesTemplate({
      title: '',
      sections: ['Introduction', 'Key Discussion Points', 'Action Items', 'Next Steps']
    });
  };

  const addNotesSection = () => {
    setNotesTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, '']
    }));
  };

  const updateNotesSection = (index: number, value: string) => {
    setNotesTemplate(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => i === index ? value : section)
    }));
  };

  const removeNotesSection = (index: number) => {
    setNotesTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  // Mock session data
  const mockSessions = [
    {
      id: 's1',
      participantId: 'p1',
      participantName: 'Sarah Johnson',
      date: '2024-01-20',
      time: '14:00',
      duration: 60,
      type: 'video-call',
      status: 'scheduled'
    },
    {
      id: 's2',
      participantId: 'p2',
      participantName: 'Michael Chen',
      date: '2024-01-22',
      time: '10:00',
      duration: 45,
      type: 'phone-call',
      status: 'completed'
    }
  ];

  // Mock note templates
  const mockNoteTemplates = [
    {
      id: 't1',
      title: 'User Interview Template',
      sections: ['Background Questions', 'Product Experience', 'Pain Points', 'Feature Requests', 'Wrap-up'],
      createdAt: new Date('2024-01-15')
    },
    {
      id: 't2',
      title: 'Usability Testing Template',
      sections: ['Pre-test Questions', 'Task Observations', 'Post-task Questions', 'Overall Feedback', 'Recommendations'],
      createdAt: new Date('2024-01-10')
    }
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isAddMode && (
            <button 
              onClick={() => navigate(`/study/${studyId}`)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAddMode ? 'Add Participants to Study' : 'Participants'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAddMode ? 'Select participants to add to your study' : 'Manage your research participant database'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {!isAddMode && (
            <>
              <button className="btn-secondary">
                <Mail size={16} className="mr-2" />
                Send Invitation
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                <Plus size={16} className="mr-2" />
                Add Participant
              </button>
            </>
          )}
          {isAddMode && selectedParticipants.length > 0 && (
            <button 
              onClick={handleAddToStudy}
              className="btn-primary"
            >
              Add {selectedParticipants.length} to Study
            </button>
          )}
        </div>
      </div>

      {/* Selection Summary for Add Mode */}
      {isAddMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">
                {selectedParticipants.length} participants selected
              </h3>
              <p className="text-sm text-blue-700">
                Choose participants that match your study requirements
              </p>
            </div>
            <div className="flex space-x-2">
              <button onClick={selectAll} className="btn-secondary text-sm">
                Select All ({filteredParticipants.length})
              </button>
              <button onClick={deselectAll} className="btn-secondary text-sm">
                Deselect All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search participants by name, email, or occupation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select 
                value={filters.gender}
                onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                className="form-input text-sm"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select 
                value={filters.availability}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                className="form-input text-sm"
              >
                <option value="all">All Availability</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select 
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                className="form-input text-sm"
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>

              <button 
                onClick={() => setFilters({ gender: 'all', ageRange: 'all', location: 'all', availability: 'all', minRating: 0 })}
                className="btn-outline text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Participants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParticipants.map((participant) => {
          const isSelected = selectedParticipants.includes(participant.id);
          
          return (
            <div 
              key={participant.id} 
              className={`${isSelected ? 'participant-card-selected' : 'participant-card'} ${isAddMode ? 'cursor-pointer' : ''}`}
              onClick={() => isAddMode && toggleSelectParticipant(participant.id)}
            >
              {/* Selection indicator for add mode */}
              {isAddMode && (
                <div className="absolute top-4 right-4">
                  {isSelected ? (
                    <CheckSquare className="text-blue-600" size={20} />
                  ) : (
                    <Square className="text-gray-400" size={20} />
                  )}
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{participant.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{participant.email}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase size={14} className="mr-2" />
                      <span className="truncate">{participant.demographics.occupation}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2" />
                      <span className="truncate">{participant.demographics.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Star size={14} className="mr-1 text-yellow-400 fill-current" />
                        <span>{participant.rating}</span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(participant.availability)}`}>
                        {participant.availability}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {!isAddMode && (
                <div className="mt-4 flex items-center space-x-2">
                  <button className="btn-secondary text-xs flex-1" onClick={(e) => { e.stopPropagation(); handleViewProfile(participant); }}>
                    <Eye size={12} className="mr-1" />
                    View Profile
                  </button>
                  <button className="btn-secondary text-xs flex-1" onClick={(e) => { e.stopPropagation(); handleContact(participant); }}>
                    <Mail size={12} className="mr-1" />
                    Contact
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredParticipants.length === 0 && (
        <div className="text-center py-16">
          <Users className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No participants found</h3>
          {!isAddMode && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add New Participant
            </button>
          )}
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Participant</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
                  className="form-input"
                  placeholder="Enter participant's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newParticipant.email}
                  onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
                  className="form-input"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input
                  type="text"
                  value={newParticipant.occupation}
                  onChange={(e) => setNewParticipant({...newParticipant, occupation: e.target.value})}
                  className="form-input"
                  placeholder="Enter occupation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newParticipant.location}
                  onChange={(e) => setNewParticipant({...newParticipant, location: e.target.value})}
                  className="form-input"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma separated)</label>
                <input
                  type="text"
                  value={newParticipant.interests}
                  onChange={(e) => setNewParticipant({...newParticipant, interests: e.target.value})}
                  className="form-input"
                  placeholder="Technology, Design, Travel"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateParticipant}
                  className="btn-primary flex-1"
                  disabled={!newParticipant.name || !newParticipant.email}
                >
                  Add Participant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Participant Profile</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p>{selectedParticipant.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p>{selectedParticipant.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <p>{selectedParticipant.demographics.age}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <p>{selectedParticipant.demographics.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <p>{selectedParticipant.demographics.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <p>{selectedParticipant.demographics.occupation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income</label>
                <p>{selectedParticipant.demographics.income}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <p>{selectedParticipant.demographics.education}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Send Message to {selectedParticipant.name}</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="form-input"
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="form-input"
                  placeholder="Enter message"
                  rows={4}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="btn-primary flex-1"
                  disabled={!contactSubject.trim() || !contactMessage.trim()}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isAddMode && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Session Management</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="btn-secondary text-sm w-full"
              >
                <Calendar className="mr-2" size={16} />
                Schedule Sessions
              </button>
              <button 
                onClick={() => setShowNotesModal(true)}
                className="btn-secondary text-sm w-full"
              >
                <Eye className="mr-2" size={16} />
                Meeting Notes Template
              </button>
            </div>
            
            {/* Recent Sessions */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Recent Sessions</h4>
              <div className="space-y-2">
                {mockSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{session.participantName}</div>
                      <div className="text-xs text-gray-600">{session.date} at {session.time}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed' ? 'text-green-600 bg-green-100' :
                      session.status === 'scheduled' ? 'text-blue-600 bg-blue-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note Templates */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Note Templates</h4>
              <div className="space-y-2">
                {mockNoteTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{template.title}</div>
                      <div className="text-xs text-gray-600">{template.sections.length} sections</div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Session</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Participant *</label>
                <select
                  value={selectedParticipant?.id || ''}
                  onChange={(e) => {
                    const participant = mockParticipants.find(p => p.id === e.target.value);
                    setSelectedParticipant(participant || null);
                  }}
                  className="form-input"
                >
                  <option value="">Choose a participant...</option>
                  {mockParticipants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name} - {participant.email}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select which participant to schedule the session with</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select
                  value={scheduleData.duration}
                  onChange={(e) => setScheduleData({...scheduleData, duration: e.target.value})}
                  className="form-input"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                <select
                  value={scheduleData.meetingType}
                  onChange={(e) => setScheduleData({...scheduleData, meetingType: e.target.value})}
                  className="form-input"
                >
                  <option value="video-call">Video Call</option>
                  <option value="phone-call">Phone Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                <textarea
                  value={scheduleData.agenda}
                  onChange={(e) => setScheduleData({...scheduleData, agenda: e.target.value})}
                  className="form-input"
                  placeholder="Enter meeting agenda..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleSession}
                  className="btn-primary flex-1"
                  disabled={!selectedParticipant || !scheduleData.date || !scheduleData.time}
                >
                  Schedule Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Notes Template Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create Notes Template</h3>
              <button 
                onClick={() => setShowNotesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Title *</label>
                <input
                  type="text"
                  value={notesTemplate.title}
                  onChange={(e) => setNotesTemplate({...notesTemplate, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter template title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sections</label>
                <div className="space-y-2">
                  {notesTemplate.sections.map((section, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => updateNotesSection(index, e.target.value)}
                        className="form-input flex-1"
                        placeholder={`Section ${index + 1}...`}
                      />
                      {notesTemplate.sections.length > 1 && (
                        <button
                          onClick={() => removeNotesSection(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addNotesSection}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Section
                </button>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowNotesModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateNotesTemplate}
                  className="btn-primary flex-1"
                  disabled={!notesTemplate.title.trim()}
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 