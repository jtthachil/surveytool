export type StudyType = 'online-survey' | '1-on-1-consultation' | 'product-testing';

export type StudyStatus = 'draft' | 'pending-review' | 'approved' | 'live' | 'paused' | 'completed' | 'rejected';

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'held' | 'paid';

export type TransactionType = 'survey_completion' | 'bonus_payment' | 'refund' | 'adjustment';

export interface PaymentTransaction {
  id: string;
  participantId: string;
  studyId: string;
  customerId: string;
  amount: number;
  status: PaymentStatus;
  type: TransactionType;
  createdAt: Date;
  reviewedAt?: Date;
  paidAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  surveyCompletedAt: Date;
  studyTitle: string;
  participantName: string;
  participantEmail: string;
}

export interface ParticipantWallet {
  participantId: string;
  totalEarnings: number;
  pendingPayments: number;
  paidAmount: number;
  heldAmount: number;
  transactions: PaymentTransaction[];
  lastPaymentDate?: Date;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  customerId?: string; // Unique customer ID for tracking
  demographics: {
    age?: number;
    gender?: string;
    location?: string;
    occupation?: string;
    income?: string;
    education?: string;
  };
  interests: string[];
  previousStudies: number;
  rating: number;
  availability: 'high' | 'medium' | 'low';
  wallet?: ParticipantWallet;
}

export interface FilterCriteria {
  ageRange?: { min: number; max: number };
  gender?: string[];
  location?: string[];
  occupation?: string[];
  income?: string[];
  education?: string[];
  interests?: string[];
  previousStudies?: { min: number; max: number };
  rating?: { min: number; max: number };
  availability?: string[];
}

export interface Screener {
  id: string;
  questions: ScreenerQuestion[];
  isAIGenerated: boolean;
}

export interface ScreenerQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'yes-no' | 'text' | 'number';
  options?: string[];
  required: boolean;
  disqualifyValue?: string;
}

export interface ExitLinks {
  complete: string;
  terminate: string;
  quotaFull: string;
}

export interface StudyConfiguration {
  totalRespondents: number;
  surveyLength: number; // in minutes
  compensation: number;
  liveLink?: string;
  exitLinks: ExitLinks;
  screener?: Screener;
  customMessage: string;
}

export interface Study {
  id: string;
  type: StudyType;
  title: string;
  prompt: string;
  participants: Participant[];
  configuration?: StudyConfiguration;
  status: StudyStatus;
  createdAt: Date;
  updatedAt?: Date;
  approvedAt?: Date;
  launchedAt?: Date;
  completedAt?: Date;
  createdBy: string;
  reviewNotes?: string;
}

export interface StudyInvitation {
  id: string;
  studyId: string;
  participantId: string;
  uniqueLink: string;
  sentAt: Date;
  openedAt?: Date;
  completedAt?: Date;
  status: 'sent' | 'opened' | 'completed' | 'terminated' | 'quota-full';
} 