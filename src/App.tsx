import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { StudyCreator } from './components/StudyCreator';
import { ParticipantSelector } from './components/ParticipantSelector';
import { StudyConfiguration } from './components/StudyConfiguration';
import { StudyReview } from './components/StudyReview';
import { StudySubmitted } from './components/StudySubmitted';
import { Analytics } from './components/Analytics';
import { StudyAnalytics } from './components/StudyAnalytics';
import { Participants } from './components/Participants';
import { Templates } from './components/Templates';
import { StudyDetail } from './components/StudyDetail';
import { AllStudies } from './components/AllStudies';
import { Header } from './components/Header';
import { ScreenerCreator } from './components/ScreenerCreator';
import { SurveyManagement } from './components/SurveyManagement';
import { PaymentManagement } from './components/PaymentManagement';
import { WalletDashboard } from './components/WalletDashboard';
import type { Study, StudyType, Participant, PaymentTransaction, PaymentStatus, ParticipantWallet } from './types/study';
import { generateCustomerId } from './utils/surveyLinks';

// Mock data
const mockParticipants: Participant[] = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    customerId: generateCustomerId('p1', 'study_1'),
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
    customerId: generateCustomerId('p2', 'study_1'),
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
    customerId: generateCustomerId('p3', 'study_1'),
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

// Mock payment transactions
const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: 'tx1',
    participantId: 'p1',
    studyId: 'study_1',
    customerId: mockParticipants[0].customerId!,
    amount: 25,
    status: 'pending',
    type: 'survey_completion',
    createdAt: new Date('2024-01-25'),
    surveyCompletedAt: new Date('2024-01-25'),
    studyTitle: 'Mobile App User Experience Survey',
    participantName: 'Sarah Johnson',
    participantEmail: 'sarah.johnson@email.com'
  },
  {
    id: 'tx2',
    participantId: 'p2',
    studyId: 'study_1',
    customerId: mockParticipants[1].customerId!,
    amount: 25,
    status: 'approved',
    type: 'survey_completion',
    createdAt: new Date('2024-01-24'),
    reviewedAt: new Date('2024-01-25'),
    surveyCompletedAt: new Date('2024-01-24'),
    studyTitle: 'Mobile App User Experience Survey',
    participantName: 'Michael Chen',
    participantEmail: 'michael.chen@email.com',
    reviewedBy: 'admin@company.com',
    reviewNotes: 'Quality response, approved for payment'
  },
  {
    id: 'tx3',
    participantId: 'p3',
    studyId: 'study_2',
    customerId: mockParticipants[2].customerId!,
    amount: 75,
    status: 'paid',
    type: 'survey_completion',
    createdAt: new Date('2024-01-20'),
    reviewedAt: new Date('2024-01-21'),
    paidAt: new Date('2024-01-22'),
    surveyCompletedAt: new Date('2024-01-20'),
    studyTitle: 'E-commerce Checkout Flow Interview',
    participantName: 'Emily Rodriguez',
    participantEmail: 'emily.rodriguez@email.com',
    reviewedBy: 'admin@company.com'
  },
  // Additional transactions for study_3
  {
    id: 'tx4',
    participantId: 'p1',
    studyId: 'study_3',
    customerId: generateCustomerId('p1', 'study_3'),
    amount: 50,
    status: 'pending',
    type: 'survey_completion',
    createdAt: new Date('2024-01-23'),
    surveyCompletedAt: new Date('2024-01-23'),
    studyTitle: 'New Feature Beta Testing',
    participantName: 'Sarah Johnson',
    participantEmail: 'sarah.johnson@email.com'
  },
  {
    id: 'tx5',
    participantId: 'p2',
    studyId: 'study_3',
    customerId: generateCustomerId('p2', 'study_3'),
    amount: 50,
    status: 'held',
    type: 'survey_completion',
    createdAt: new Date('2024-01-22'),
    reviewedAt: new Date('2024-01-23'),
    surveyCompletedAt: new Date('2024-01-22'),
    studyTitle: 'New Feature Beta Testing',
    participantName: 'Michael Chen',
    participantEmail: 'michael.chen@email.com',
    reviewedBy: 'admin@company.com',
    reviewNotes: 'Need additional verification for beta feedback quality'
  },
  // Additional transactions for study_5
  {
    id: 'tx6',
    participantId: 'p1',
    studyId: 'study_5',
    customerId: generateCustomerId('p1', 'study_5'),
    amount: 20,
    status: 'approved',
    type: 'survey_completion',
    createdAt: new Date('2024-01-26'),
    reviewedAt: new Date('2024-01-27'),
    surveyCompletedAt: new Date('2024-01-26'),
    studyTitle: 'Customer Satisfaction Survey Q1',
    participantName: 'Sarah Johnson',
    participantEmail: 'sarah.johnson@email.com',
    reviewedBy: 'admin@company.com',
    reviewNotes: 'Excellent feedback quality'
  },
  {
    id: 'tx7',
    participantId: 'p3',
    studyId: 'study_5',
    customerId: generateCustomerId('p3', 'study_5'),
    amount: 20,
    status: 'rejected',
    type: 'survey_completion',
    createdAt: new Date('2024-01-25'),
    reviewedAt: new Date('2024-01-26'),
    surveyCompletedAt: new Date('2024-01-25'),
    studyTitle: 'Customer Satisfaction Survey Q1',
    participantName: 'Emily Rodriguez',
    participantEmail: 'emily.rodriguez@email.com',
    reviewedBy: 'admin@company.com',
    reviewNotes: 'Incomplete responses, multiple choice questions not properly answered'
  }
];

// Mock participant wallets
const mockParticipantWallets: ParticipantWallet[] = [
  {
    participantId: 'p1',
    totalEarnings: 170,
    pendingPayments: 75, // tx1 (25) + tx4 (50)
    paidAmount: 70, // Previous transactions
    heldAmount: 0,
    transactions: [
      // Current transactions
      mockPaymentTransactions[0], // tx1 - pending
      mockPaymentTransactions[3], // tx4 - pending  
      mockPaymentTransactions[5], // tx6 - approved
      // Previous paid transactions
      {
        ...mockPaymentTransactions[0],
        id: 'tx1b',
        amount: 50,
        status: 'paid',
        createdAt: new Date('2024-01-20'),
        paidAt: new Date('2024-01-21'),
        studyTitle: 'Previous Study',
        studyId: 'study_old_1'
      },
      {
        ...mockPaymentTransactions[0],
        id: 'tx1c',
        amount: 20,
        status: 'paid',
        createdAt: new Date('2024-01-15'),
        paidAt: new Date('2024-01-16'),
        studyTitle: 'Another Study',
        studyId: 'study_old_2'
      }
    ],
    lastPaymentDate: new Date('2024-01-21')
  },
  {
    participantId: 'p2',
    totalEarnings: 200,
    pendingPayments: 0,
    paidAmount: 125,
    heldAmount: 75, // tx5 (50) + previous held (25)
    transactions: [
      mockPaymentTransactions[1], // tx2 - approved (but not yet paid)
      mockPaymentTransactions[4], // tx5 - held
      // Previous transactions
      {
        ...mockPaymentTransactions[1],
        id: 'tx2b',
        amount: 75,
        status: 'paid',
        createdAt: new Date('2024-01-18'),
        paidAt: new Date('2024-01-19'),
        studyTitle: 'Product Testing Study',
        studyId: 'study_old_3'
      },
      {
        ...mockPaymentTransactions[1],
        id: 'tx2c',
        amount: 25,
        status: 'held',
        createdAt: new Date('2024-01-22'),
        reviewNotes: 'Quality review required',
        studyTitle: 'Recent Survey',
        studyId: 'study_old_4'
      },
      {
        ...mockPaymentTransactions[1],
        id: 'tx2d',
        amount: 50,
        status: 'paid',
        createdAt: new Date('2024-01-10'),
        paidAt: new Date('2024-01-11'),
        studyTitle: 'Early Study',
        studyId: 'study_old_5'
      }
    ],
    lastPaymentDate: new Date('2024-01-19')
  },
  {
    participantId: 'p3',
    totalEarnings: 75,
    pendingPayments: 0,
    paidAmount: 75,
    heldAmount: 0,
    transactions: [
      mockPaymentTransactions[2], // tx3 - paid
      mockPaymentTransactions[6]  // tx7 - rejected (doesn't count toward paid amount)
    ],
    lastPaymentDate: new Date('2024-01-22')
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
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(mockPaymentTransactions);
  const [participantWallets, setParticipantWallets] = useState<ParticipantWallet[]>(mockParticipantWallets);

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

  const handleUpdatePayment = (transactionId: string, status: PaymentStatus, notes?: string) => {
    setPaymentTransactions(prev => prev.map(tx => 
      tx.id === transactionId 
        ? { 
            ...tx, 
            status, 
            reviewedAt: new Date(),
            reviewNotes: notes,
            reviewedBy: 'admin@company.com',
            ...(status === 'paid' && { paidAt: new Date() })
          }
        : tx
    ));
    
    // Update wallet data accordingly
    setParticipantWallets(prev => prev.map(wallet => {
      const transaction = wallet.transactions.find(tx => tx.id === transactionId);
      if (transaction) {
        const updatedTransactions = wallet.transactions.map(tx => 
          tx.id === transactionId 
            ? { 
                ...tx, 
                status, 
                reviewedAt: new Date(),
                reviewNotes: notes,
                reviewedBy: 'admin@company.com',
                ...(status === 'paid' && { paidAt: new Date() })
              }
            : tx
        );
        
        // Recalculate wallet amounts
        const pending = updatedTransactions.filter(tx => tx.status === 'pending').reduce((sum, tx) => sum + tx.amount, 0);
        const paid = updatedTransactions.filter(tx => tx.status === 'paid').reduce((sum, tx) => sum + tx.amount, 0);
        const held = updatedTransactions.filter(tx => tx.status === 'held').reduce((sum, tx) => sum + tx.amount, 0);
        
        return {
          ...wallet,
          transactions: updatedTransactions,
          pendingPayments: pending,
          paidAmount: paid,
          heldAmount: held,
          ...(status === 'paid' && { lastPaymentDate: new Date() })
        };
      }
      return wallet;
    }));
  };

  const handleBulkUpdatePayments = (transactionIds: string[], status: PaymentStatus, notes?: string) => {
    transactionIds.forEach(id => handleUpdatePayment(id, status, notes));
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
            <Route 
              path="/screener-creator" 
              element={<ScreenerCreator />} 
            />
            <Route 
              path="/survey-management/:id" 
              element={
                <SurveyManagement 
                  studyId="study_1"
                  currentStatus="live"
                  totalInvites={20}
                  completed={0}
                  pending={20}
                  failed={0}
                  optedOut={0}
                  onStatusChange={(newStatus) => {
                    console.log('Status changed to:', newStatus);
                  }}
                />
              } 
            />
            <Route 
              path="/payment-management" 
              element={
                <PaymentManagement 
                  transactions={paymentTransactions}
                  onUpdatePayment={handleUpdatePayment}
                  onBulkUpdate={handleBulkUpdatePayments}
                />
              } 
            />
            <Route 
              path="/wallet-dashboard" 
              element={
                <WalletDashboard 
                  participantWallets={participantWallets}
                  onExportTransactions={() => {
                    console.log('Exporting transactions...');
                    // Export functionality would go here
                  }}
                />
              } 
            />
            <Route 
              path="/study-submitted" 
              element={<StudySubmitted />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
