import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, Clock, CheckCircle, AlertCircle, Play, Eye, Calendar, DollarSign, Mail, Download, Edit, Plus, X, UserPlus, FileText, Video } from 'lucide-react';
import type { Study } from '../types/study';

interface StudyDetailProps {
  studies: Study[];
}

export const StudyDetail: React.FC<StudyDetailProps> = ({ studies }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState({
    participantId: '',
    participantName: '',
    date: '',
    time: '',
    duration: '60',
    meetingType: 'video-call',
    agenda: '',
    purpose: 'follow-up'
  });
  const [notesData, setNotesData] = useState({
    participantId: '',
    participantName: '',
    title: '',
    content: '',
    sections: {
      'Survey Feedback': '',
      'Key Insights': '',
      'Follow-up Actions': '',
      'Additional Notes': ''
    }
  });
  
  const study = studies.find(s => s.id === id);

  // Mock data for participant sessions and notes
  const mockParticipantSessions: { [key: string]: Array<any> } = {
    'p1': [
      {
        id: 's1',
        date: '2024-01-25',
        time: '14:00',
        duration: 60,
        type: 'video-call',
        status: 'scheduled',
        purpose: 'follow-up',
        agenda: 'Discuss survey responses and gather additional insights'
      }
    ],
    'p2': [
      {
        id: 's2',
        date: '2024-01-20',
        time: '10:00',
        duration: 45,
        type: 'phone-call',
        status: 'completed',
        purpose: 'follow-up',
        agenda: 'Deep dive into user experience feedback'
      }
    ],
    'p3': [
      {
        id: 's3',
        date: '2024-01-22',
        time: '15:30',
        duration: 90,
        type: 'video-call',
        status: 'completed',
        purpose: 'deep-dive',
        agenda: 'Accessibility testing session and design feedback'
      }
    ],
    'p4': [
      {
        id: 's4',
        date: '2024-01-19',
        time: '09:00',
        duration: 60,
        type: 'video-call',
        status: 'completed',
        purpose: 'validation',
        agenda: 'Technical validation and bug report discussion'
      }
    ],
    'p5': [
      {
        id: 's5',
        date: '2024-01-26',
        time: '11:00',
        duration: 75,
        type: 'video-call',
        status: 'scheduled',
        purpose: 'clarification',
        agenda: 'Strategic product discussion and market positioning'
      }
    ]
  };

  const mockParticipantNotes: { [key: string]: Array<any> } = {
    'p1': [
      {
        id: 'n1',
        title: 'Survey Follow-up - Sarah Johnson',
        createdAt: '2024-01-22',
        sections: {
          'Survey Feedback': 'Very positive about the mobile app interface. Particularly liked the navigation flow and clean design. Rated overall experience 8/10. Found the onboarding process intuitive and appreciated the step-by-step guidance.',
          'Key Insights': 'Mentioned difficulty with the checkout process on smaller screens. Suggested adding a progress indicator during payment. Would like to see more customization options for the dashboard layout. Very tech-savvy user.',
          'Follow-up Actions': 'Schedule usability testing session for checkout flow. Send beta access for new dashboard features. Include in advanced user panel for future product decisions.',
          'Additional Notes': 'Highly engaged participant, good candidate for future studies. Works in UX design so provides valuable professional insights. Available for follow-up interviews. Prefers video calls over phone calls.'
        }
      }
    ],
    'p2': [
      {
        id: 'n2',
        title: 'Consultation Notes - Michael Chen',
        createdAt: '2024-01-20',
        sections: {
          'Survey Feedback': 'Detailed feedback on product features and pricing concerns. Appreciated the enterprise-focused features but felt pricing could be more transparent. Rated ease of use 7/10. Particularly liked the analytics dashboard.',
          'Key Insights': 'Enterprise features are important for his workflow. Needs better integration with existing tools (Slack, Teams). Security and compliance features are critical. Price sensitivity around premium tier.',
          'Follow-up Actions': 'Share beta access to enterprise features. Provide detailed pricing breakdown. Schedule demo of integration capabilities. Connect with enterprise sales team.',
          'Additional Notes': 'Product manager perspective very valuable. Company has 50+ employees, good potential enterprise customer. Interested in annual contracts. Decision maker for tool purchases.'
        }
      }
    ],
    'p3': [
      {
        id: 'n3',
        title: 'UX Interview - Emily Rodriguez',
        createdAt: '2024-01-18',
        sections: {
          'Survey Feedback': 'Excellent feedback on user experience elements. Loved the dark mode option and accessibility features. Rated navigation 9/10. Suggested improvements for mobile responsiveness on tablet devices.',
          'Key Insights': 'Strong advocate for accessibility in design. Uses screen reader occasionally for testing. Values keyboard navigation shortcuts. Prefers minimal, clean interfaces over feature-heavy designs.',
          'Follow-up Actions': 'Include in accessibility testing group. Share roadmap for keyboard shortcuts. Invite to participate in design review sessions.',
          'Additional Notes': 'UX researcher with 8+ years experience. Extremely thorough in feedback. Willing to do longer sessions (90+ minutes). Great advocate for inclusive design principles.'
        }
      }
    ],
    'p4': [
      {
        id: 'n4',
        title: 'Product Testing - James Wilson',
        createdAt: '2024-01-16',
        sections: {
          'Survey Feedback': 'Comprehensive testing of core features. Found several minor bugs but overall positive experience. Rated reliability 6/10 due to occasional crashes. Praised customer support responsiveness.',
          'Key Insights': 'Power user who tests edge cases thoroughly. Prefers keyboard shortcuts for efficiency. Works in a fast-paced environment where reliability is crucial. Budget-conscious but values quality.',
          'Follow-up Actions': 'Priority access to beta bug fixes. Include in power user feedback group. Consider for advisory board. Follow up on pricing tier preferences.',
          'Additional Notes': 'Software engineer background. Provides technical insights beyond typical user feedback. Available for technical interviews. Prefers asynchronous communication methods.'
        }
      }
    ],
    'p5': [
      {
        id: 'n5',
        title: 'Market Research - Lisa Zhang',
        createdAt: '2024-01-14',
        sections: {
          'Survey Feedback': 'Strategic feedback from market research perspective. Compared features with 3 competitor products. Rated competitive advantage 7/10. Highlighted unique value propositions clearly.',
          'Key Insights': 'Deep understanding of market landscape. Sees opportunity in mid-market segment. Believes pricing strategy could be more aggressive. Values data export capabilities highly.',
          'Follow-up Actions': 'Share competitive analysis results. Schedule strategic product discussion. Consider for customer advisory board. Discuss partnership opportunities.',
          'Additional Notes': 'Market research director at consulting firm. Excellent strategic insights. Interested in white-label opportunities. Decision influencer for multiple client recommendations.'
        }
      }
    ],
    'p6': [
      {
        id: 'n6',
        title: 'Feature Validation - David Kim',
        createdAt: '2024-01-12',
        sections: {
          'Survey Feedback': 'Focused feedback on new feature set. Particularly excited about automation capabilities. Rated feature completeness 8/10. Suggested additional integration options with marketing tools.',
          'Key Insights': 'Marketing operations background brings unique perspective. Needs robust reporting and analytics. Values time-saving automation features. Willing to pay premium for advanced features.',
          'Follow-up Actions': 'Priority access to marketing integrations beta. Include in automation features testing group. Schedule demo of advanced reporting. Consider for case study participation.',
          'Additional Notes': 'Marketing ops manager at growing startup. Team of 12 would be potential users. Interested in team training sessions. Strong internal advocate potential.'
        }
      }
    ]
  };

  // Handler functions
  const handleScheduleSession = (participant: any) => {
    setSelectedParticipant(participant);
    setScheduleData({
      participantId: participant.id,
      participantName: participant.name,
      date: '',
      time: '',
      duration: '60',
      meetingType: 'video-call',
      agenda: `Follow-up session with ${participant.name} regarding "${study?.title}"`,
      purpose: 'follow-up'
    });
    setShowScheduleModal(true);
  };

  const handleCreateNotes = (participant: any) => {
    setSelectedParticipant(participant);
    
    // Check if there are existing notes for this participant
    const existingNotes = mockParticipantNotes[participant.id];
    
    if (existingNotes && existingNotes.length > 0) {
      // Pre-populate with existing notes data
      const latestNote = existingNotes[0]; // Get the most recent note
      setNotesData({
        participantId: participant.id,
        participantName: participant.name,
        title: latestNote.title,
        content: '',
        sections: latestNote.sections
      });
    } else {
      // Create new empty notes
      setNotesData({
        participantId: participant.id,
        participantName: participant.name,
        title: `${study?.title} - ${participant.name}`,
        content: '',
        sections: {
          'Survey Feedback': '',
          'Key Insights': '',
          'Follow-up Actions': '',
          'Additional Notes': ''
        }
      });
    }
    
    setShowNotesModal(true);
  };

  const handleSubmitSchedule = () => {
    if (!scheduleData.date || !scheduleData.time) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate API call
    console.log('Scheduling session:', scheduleData);

    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ Session scheduled with ${scheduleData.participantName}!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    setShowScheduleModal(false);
  };

  const handleSubmitNotes = () => {
    if (!notesData.title.trim()) {
      alert('Please enter a title for the notes');
      return;
    }

    // Simulate API call
    console.log('Saving notes:', notesData);

    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ Notes saved for ${notesData.participantName}!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    setShowNotesModal(false);
  };

  const handleExport = async (format: 'json' | 'csv' = 'json') => {
    if (!study) {
      alert('No study data to export');
      return;
    }

    setExportLoading(true);
    
    try {
      let fileContent: string;
      let fileName: string;
      let mimeType: string;

      if (format === 'csv') {
        // Create CSV content
        const csvHeaders = [
          'Study ID', 'Study Title', 'Study Type', 'Status', 'Created At',
          'Participant Name', 'Participant Email', 'Rating', 'Availability',
          'Age', 'Gender', 'Location', 'Occupation'
        ];
        
        const csvRows = study.participants.map(p => [
          study.id,
          `"${study.title}"`,
          study.type,
          study.status,
          study.createdAt.toISOString().split('T')[0],
          `"${p.name}"`,
          p.email,
          p.rating,
          p.availability,
          p.demographics.age,
          p.demographics.gender,
          `"${p.demographics.location}"`,
          `"${p.demographics.occupation}"`
        ]);
        
        fileContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
        fileName = `${study.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        // Create JSON content
        const exportData = {
          study: {
            id: study.id,
            title: study.title,
            type: study.type,
            status: study.status,
            prompt: study.prompt,
            createdAt: study.createdAt.toISOString(),
            updatedAt: study.updatedAt?.toISOString(),
            launchedAt: study.launchedAt?.toISOString(),
            completedAt: study.completedAt?.toISOString(),
            createdBy: study.createdBy,
            participants: study.participants.map(p => ({
              id: p.id,
              name: p.name,
              email: p.email,
              rating: p.rating,
              availability: p.availability,
              demographics: p.demographics,
              interests: p.interests,
              previousStudies: p.previousStudies
            })),
            configuration: study.configuration
          },
          exportedAt: new Date().toISOString(),
          exportType: 'JSON',
          version: '1.0'
        };
        
        fileContent = JSON.stringify(exportData, null, 2);
        fileName = `${study.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }
      
      // Create and trigger download
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      
      // Ensure the link is added to the DOM for Firefox compatibility
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success feedback
      setTimeout(() => {
        setExportLoading(false);
        setShowExportOptions(false);
        // Create a toast-like notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            ✅ Study data exported as ${format.toUpperCase()} successfully!
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      }, 500);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportLoading(false);
      alert('Export failed. Please try again.');
    }
  };

  const handleSendInvitations = async () => {
    if (!study || study.participants.length === 0) {
      alert('No participants to send invitations to');
      return;
    }

    setInviteLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create email content based on study type
      const emailContent = {
        subject: `Invitation to participate in "${study.title}"`,
        type: study.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: study.prompt,
        compensation: study.configuration?.compensation || 0,
        duration: study.configuration?.surveyLength || 0,
        studyId: study.id
      };

      // Show success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px;">
          ✅ Invitations sent to ${study.participants.length} participants!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 4000);

      setShowInviteModal(false);
      
      console.log('Email invitations sent:', {
        recipients: study.participants.map(p => p.email),
        content: emailContent
      });
      
    } catch (error) {
      console.error('Failed to send invitations:', error);
      alert('Failed to send invitations. Please try again.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleAddParticipant = () => {
    // Navigate to participants page with add mode
    navigate('/participants?mode=add&studyId=' + study?.id);
  };

  const getSpecificTypeActions = (type: string) => {
    switch (type) {
      case '1-on-1-consultation':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-yellow-800 mb-2">Consultation Specific Actions</h4>
            <div className="space-y-2">
              <button className="btn-secondary text-sm w-full">Schedule Sessions</button>
              <button className="btn-secondary text-sm w-full">Meeting Notes Template</button>
            </div>
          </div>
        );
      case 'product-testing':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-purple-800 mb-2">Product Testing Actions</h4>
            <div className="space-y-2">
              <button className="btn-secondary text-sm w-full">Upload Test Materials</button>
              <button className="btn-secondary text-sm w-full">Set Testing Environment</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-blue-800 mb-2">Survey Actions</h4>
            <div className="space-y-2">
              <button className="btn-secondary text-sm w-full">Preview Survey</button>
              <button className="btn-secondary text-sm w-full">Question Builder</button>
            </div>
          </div>
        );
    }
  };

  if (!study) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Study not found</h3>
        <p className="text-gray-600 mb-6">The study you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

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
      case 'live': return <Play size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'pending-review': return <Clock size={16} />;
      case 'draft': return <AlertCircle size={16} />;
      case 'rejected': return <AlertCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStudyTypeIcon = (type: string) => {
    switch (type) {
      case 'online-survey': return <BarChart3 size={24} />;
      case '1-on-1-consultation': return <Users size={24} />;
      case 'product-testing': return <Eye size={24} />;
      default: return <BarChart3 size={24} />;
    }
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{study.title}</h1>
            <p className="text-gray-600 mt-1">Study Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/create-study', { state: { editMode: true, study } })}
            className="btn-secondary"
          >
            <Edit size={16} className="mr-2" />
            Edit Study
          </button>
          <button 
            onClick={() => setShowExportOptions(true)}
            disabled={exportLoading}
            className="btn-primary"
          >
            {exportLoading ? (
              <div className="loading-spinner mr-2" />
            ) : (
              <Download size={16} className="mr-2" />
            )}
            {exportLoading ? 'Exporting...' : 'Export Data'}
          </button>
        </div>
      </div>

      {/* Study Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  {getStudyTypeIcon(study.type)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{study.title}</h2>
                  <p className="text-gray-600 capitalize mt-1">
                    {study.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(study.status)}`}>
                {getStatusIcon(study.status)}
                <span className="ml-2 capitalize">{study.status.replace('-', ' ')}</span>
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{study.prompt}</p>
              </div>

              {study.configuration && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Configuration</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="text-gray-400" size={16} />
                      <span className="text-gray-600">Target: {study.configuration.totalRespondents} respondents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-gray-400" size={16} />
                      <span className="text-gray-600">Duration: {study.configuration.surveyLength} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="text-gray-400" size={16} />
                      <span className="text-gray-600">Compensation: ${study.configuration.compensation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-gray-400" size={16} />
                      <span className="text-gray-600">Created: {study.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Participants ({study.participants.length})
              </h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowAddParticipantModal(true)}
                  className="btn-secondary text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  Add Participants
                </button>
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="btn-secondary text-sm"
                >
                  <Mail size={14} className="mr-1" />
                  Send Invitations
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {study.participants.map((participant) => (
                <div key={participant.id} className="border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-600">{participant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{participant.rating}★</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        participant.availability === 'high' ? 'text-green-600 bg-green-100' :
                        participant.availability === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {participant.availability}
                      </span>
                    </div>
                  </div>
                  
                  {/* Participant Actions */}
                  <div className="px-3 pb-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleScheduleSession(participant)}
                        className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <Calendar size={14} className="mr-1" />
                        Schedule Session
                      </button>
                      <button
                        onClick={() => handleCreateNotes(participant)}
                        className="flex items-center text-sm bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <FileText size={14} className="mr-1" />
                        Meeting Notes
                      </button>
                    </div>
                    
                    {/* Show existing sessions and notes if any */}
                    {(mockParticipantSessions[participant.id] || mockParticipantNotes[participant.id]) && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex space-x-4 text-xs text-gray-600">
                          {mockParticipantSessions[participant.id] && (
                            <div className="flex items-center">
                              <Video size={12} className="mr-1" />
                              {mockParticipantSessions[participant.id].length} session(s)
                            </div>
                          )}
                          {mockParticipantNotes[participant.id] && (
                            <div className="flex items-center">
                              <FileText size={12} className="mr-1" />
                              {mockParticipantNotes[participant.id].length} note(s)
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {getSpecificTypeActions(study.type)}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-gray-900 capitalize">{study.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Participants</span>
                <span className="font-medium text-gray-900">{study.participants.length}</span>
              </div>
              {study.configuration && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Target</span>
                    <span className="font-medium text-gray-900">{study.configuration.totalRespondents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Compensation</span>
                    <span className="font-medium text-gray-900">${study.configuration.compensation}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created by</span>
                <span className="font-medium text-gray-900 text-sm">{study.createdBy}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-xs text-gray-600">{study.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
              {study.updatedAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-600">{study.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {study.launchedAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Launched</p>
                    <p className="text-xs text-gray-600">{study.launchedAt.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {study.completedAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Completed</p>
                    <p className="text-xs text-gray-600">{study.completedAt.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Send Invitations Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Invitations</h3>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Send study invitations to {study.participants.length} selected participants?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Email Preview:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Subject:</strong> Invitation to participate in "{study.title}"</p>
                  <p><strong>Type:</strong> {study.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  {study.configuration && (
                    <>
                      <p><strong>Duration:</strong> {study.configuration.surveyLength} minutes</p>
                      <p><strong>Compensation:</strong> ${study.configuration.compensation}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendInvitations}
                  disabled={inviteLoading}
                  className="btn-primary flex-1"
                >
                  {inviteLoading ? (
                    <div className="loading-spinner mr-2" />
                  ) : (
                    <Mail size={16} className="mr-2" />
                  )}
                  {inviteLoading ? 'Sending...' : 'Send Invitations'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Participants Modal */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Participants</h3>
              <button 
                onClick={() => setShowAddParticipantModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Choose how you'd like to add participants to this study:</p>
              
              <div className="space-y-3">
                <button 
                  onClick={handleAddParticipant}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserPlus className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">From Participant Pool</h4>
                      <p className="text-sm text-gray-600">Select from existing participants</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Invite by Email</h4>
                      <p className="text-sm text-gray-600">Send invitations to new participants</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <button 
                onClick={() => setShowAddParticipantModal(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Options Modal */}
      {showExportOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
              <button 
                onClick={() => setShowExportOptions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Choose the export format:</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleExport('json')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Download className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">JSON</h4>
                      <p className="text-sm text-gray-600">Export data in JSON format</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleExport('csv')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Download className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">CSV</h4>
                      <p className="text-sm text-gray-600">Export data in CSV format</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <button 
                onClick={() => setShowExportOptions(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Session - {selectedParticipant.name}</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participant</label>
                <input
                  type="text"
                  value={selectedParticipant.name}
                  className="form-input bg-gray-50 text-gray-700"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Participant is auto-selected from the study</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <select
                  value={scheduleData.purpose}
                  onChange={(e) => setScheduleData({...scheduleData, purpose: e.target.value})}
                  className="form-input"
                >
                  <option value="follow-up">Follow-up Session</option>
                  <option value="clarification">Clarification Interview</option>
                  <option value="deep-dive">Deep Dive Discussion</option>
                  <option value="validation">Validation Session</option>
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
                  onClick={handleSubmitSchedule}
                  className="btn-primary flex-1"
                  disabled={!scheduleData.date || !scheduleData.time}
                >
                  Schedule Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Notes Modal */}
      {showNotesModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {mockParticipantNotes[selectedParticipant.id] && mockParticipantNotes[selectedParticipant.id].length > 0 
                    ? `View/Edit Notes - ${selectedParticipant.name}` 
                    : `Create Notes - ${selectedParticipant.name}`}
                </h3>
                {mockParticipantNotes[selectedParticipant.id] && mockParticipantNotes[selectedParticipant.id].length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {mockParticipantNotes[selectedParticipant.id][0].createdAt}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowNotesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={notesData.title}
                  onChange={(e) => setNotesData({...notesData, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter notes title..."
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Note Sections</h4>
                {Object.entries(notesData.sections).map(([sectionTitle, sectionContent]) => (
                  <div key={sectionTitle}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{sectionTitle}</label>
                    <textarea
                      value={sectionContent}
                      onChange={(e) => setNotesData({
                        ...notesData, 
                        sections: {
                          ...notesData.sections,
                          [sectionTitle]: e.target.value
                        }
                      })}
                      className="form-input"
                      placeholder={`Enter ${sectionTitle.toLowerCase()}...`}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowNotesModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitNotes}
                  className="btn-primary flex-1"
                  disabled={!notesData.title.trim()}
                >
                  {mockParticipantNotes[selectedParticipant.id] && mockParticipantNotes[selectedParticipant.id].length > 0 
                    ? 'Update Notes' 
                    : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 