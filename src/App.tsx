import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { StudyCreator } from './components/StudyCreator';
import { ParticipantSelector } from './components/ParticipantSelector';
import { StudyConfiguration } from './components/StudyConfiguration';
import { StudyReview } from './components/StudyReview';
import { Analytics } from './components/Analytics';
import { StudyAnalytics } from './components/StudyAnalytics';
import { Participants } from './components/Participants';
import { Templates } from './components/Templates';
import { StudyDetail } from './components/StudyDetail';
import { AllStudies } from './components/AllStudies';
import { Header } from './components/Header';
import type { Study, StudyType, Participant } from './types/study';

// Mock data
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
  }
];

const mockStudies: Study[] = [
  {
    id: 'study_1',
    type: 'online-survey',
    title: 'Mobile App User Experience Survey',
    prompt: 'We want to understand how users interact with our mobile app interface',
    participants: mockParticipants.slice(0, 2),
    configuration: {
      totalRespondents: 150,
      surveyLength: 15,
      compensation: 25,
      exitLinks: {
        complete: 'https://example.com/complete',
        terminate: 'https://example.com/terminate',
        quotaFull: 'https://example.com/quota-full'
      },
      customMessage: 'Thank you for participating in our research study!'
    },
    status: 'live',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    launchedAt: new Date('2024-01-16'),
    createdBy: 'john.doe@company.com'
  },
  {
    id: 'study_2',
    type: '1-on-1-consultation',
    title: 'E-commerce Checkout Flow Interview',
    prompt: 'Conduct interviews to understand pain points in our checkout process',
    participants: [mockParticipants[2]],
    configuration: {
      totalRespondents: 10,
      surveyLength: 45,
      compensation: 75,
      exitLinks: {
        complete: 'https://example.com/complete',
        terminate: 'https://example.com/terminate',
        quotaFull: 'https://example.com/quota-full'
      },
      customMessage: 'Thank you for your valuable time and insights!'
    },
    status: 'pending-review',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    createdBy: 'jane.smith@company.com'
  },
  {
    id: 'study_3',
    type: 'product-testing',
    title: 'New Feature Beta Testing',
    prompt: 'Test our new AI-powered recommendation engine with real users',
    participants: mockParticipants,
    configuration: {
      totalRespondents: 50,
      surveyLength: 30,
      compensation: 50,
      exitLinks: {
        complete: 'https://example.com/complete',
        terminate: 'https://example.com/terminate',
        quotaFull: 'https://example.com/quota-full'
      },
      customMessage: 'Thank you for helping us improve our product!'
    },
    status: 'completed',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-08'),
    createdBy: 'john.doe@company.com'
  },
  {
    id: 'study_4',
    type: 'online-survey',
    title: 'Brand Perception Study',
    prompt: 'Measure brand awareness and perception in target market',
    participants: mockParticipants.slice(0, 1),
    status: 'draft',
    createdAt: new Date('2024-01-20'),
    createdBy: 'marketing@company.com'
  },
  {
    id: 'study_5',
    type: 'online-survey',
    title: 'Customer Satisfaction Survey Q1',
    prompt: 'Quarterly customer satisfaction assessment',
    participants: mockParticipants.slice(0, 2),
    configuration: {
      totalRespondents: 200,
      surveyLength: 12,
      compensation: 20,
      exitLinks: {
        complete: 'https://example.com/complete',
        terminate: 'https://example.com/terminate',
        quotaFull: 'https://example.com/quota-full'
      },
      customMessage: 'Thank you for your feedback!'
    },
    status: 'live',
    createdAt: new Date('2024-01-18'),
    launchedAt: new Date('2024-01-19'),
    createdBy: 'customer.success@company.com'
  },
  {
    id: 'study_6',
    type: 'product-testing',
    title: 'Website Navigation Usability Test',
    prompt: 'Test new website navigation design with real users',
    participants: mockParticipants.slice(1, 3),
    configuration: {
      totalRespondents: 30,
      surveyLength: 25,
      compensation: 40,
      exitLinks: {
        complete: 'https://example.com/complete',
        terminate: 'https://example.com/terminate',
        quotaFull: 'https://example.com/quota-full'
      },
      customMessage: 'Thank you for testing our website!'
    },
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    completedAt: new Date('2024-01-07'),
    createdBy: 'ux.team@company.com'
  },
  {
    id: 'study_7',
    type: '1-on-1-consultation',
    title: 'Pricing Strategy Research',
    prompt: 'In-depth interviews about pricing preferences and willingness to pay',
    participants: [mockParticipants[0]],
    status: 'draft',
    createdAt: new Date('2024-01-22'),
    createdBy: 'pricing.team@company.com'
  },
  {
    id: 'study_8',
    type: 'online-survey',
    title: 'Social Media Usage Patterns',
    prompt: 'Understanding how our target audience uses social media platforms',
    participants: mockParticipants,
    configuration: {
      totalRespondents: 100,
      surveyLength: 18,
      compensation: 30,
      exitLinks: {
        complete: 'https://example.com/complete',
        terminate: 'https://example.com/terminate',
        quotaFull: 'https://example.com/quota-full'
      },
      customMessage: 'Thank you for sharing your social media habits!'
    },
    status: 'pending-review',
    createdAt: new Date('2024-01-14'),
    createdBy: 'social.media@company.com'
  }
];

function App() {
  const [studies, setStudies] = useState<Study[]>(mockStudies);
  const [currentStudy, setCurrentStudy] = useState<Partial<Study> | null>(null);

  const handleStudyTypeSelect = (type: StudyType, prompt: string) => {
    setCurrentStudy({
      type,
      prompt,
      id: `study_${Date.now()}`,
      createdAt: new Date(),
      status: 'draft'
    });
  };

  const handleParticipantsSelect = (participants: any[]) => {
    setCurrentStudy(prev => prev ? { ...prev, participants } : null);
  };

  const handleStudyConfiguration = (config: any) => {
    setCurrentStudy(prev => prev ? { ...prev, configuration: config } : null);
  };

  const handleStudySubmit = (study: Study) => {
    setStudies(prev => [...prev, study]);
    setCurrentStudy(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard studies={studies} />} 
            />
            <Route 
              path="/analytics" 
              element={<Analytics studies={studies} />} 
            />
            <Route 
              path="/analytics/study/:id" 
              element={<StudyAnalytics studies={studies} />} 
            />
            <Route 
              path="/participants" 
              element={<Participants />} 
            />
            <Route 
              path="/templates" 
              element={<Templates />} 
            />
            <Route 
              path="/studies" 
              element={<AllStudies studies={studies} />} 
            />
            <Route 
              path="/study/:id" 
              element={<StudyDetail studies={studies} />} 
            />
            <Route 
              path="/create-study" 
              element={
                <StudyCreator 
                  onStudyTypeSelect={handleStudyTypeSelect}
                />
              } 
            />
            <Route 
              path="/select-participants" 
              element={
                currentStudy ? (
                  <ParticipantSelector 
                    study={currentStudy}
                    onParticipantsSelect={handleParticipantsSelect}
                  />
                ) : (
                  <Navigate to="/create-study" replace />
                )
              } 
            />
            <Route 
              path="/configure-study" 
              element={
                currentStudy && currentStudy.participants ? (
                  <StudyConfiguration 
                    study={currentStudy}
                    onConfiguration={handleStudyConfiguration}
                  />
                ) : (
                  <Navigate to="/create-study" replace />
                )
              } 
            />
            <Route 
              path="/review-study" 
              element={
                currentStudy && currentStudy.configuration ? (
                  <StudyReview 
                    study={currentStudy as Study}
                    onSubmit={handleStudySubmit}
                  />
                ) : (
                  <Navigate to="/create-study" replace />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
