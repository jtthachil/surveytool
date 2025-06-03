import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  User, 
  Calendar, 
  MessageSquare, 
  Download, 
  Filter, 
  Search,
  Eye,
  Edit,
  Mail,
  AlertTriangle,
  Pause,
  ArrowLeft,
  BarChart3,
  FileText,
  RefreshCw,
  X,
  Copy,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PaymentTransaction, PaymentStatus } from '../types/study';

interface PaymentManagementProps {
  studyId?: string;
  studyTitle?: string;
  transactions: PaymentTransaction[];
  onUpdatePayment: (transactionId: string, status: PaymentStatus, notes?: string) => void;
  onBulkUpdate: (transactionIds: string[], status: PaymentStatus, notes?: string) => void;
}

interface GroupedTransactions {
  studyId: string;
  studyTitle: string;
  transactions: PaymentTransaction[];
  totalAmount: number;
  pendingCount: number;
  approvedCount: number;
  paidCount: number;
  rejectedCount: number;
  heldCount: number;
  remarks?: string;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({
  studyId,
  studyTitle,
  transactions,
  onUpdatePayment,
  onBulkUpdate
}) => {
  const navigate = useNavigate();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all');
  const [selectedStudy, setSelectedStudy] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'participant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedStudies, setExpandedStudies] = useState<Set<string>>(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<PaymentStatus>('approved');
  const [bulkNotes, setBulkNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<PaymentStatus>('approved');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStudyBulkModal, setShowStudyBulkModal] = useState(false);
  const [selectedStudyForBulk, setSelectedStudyForBulk] = useState<GroupedTransactions | null>(null);
  const [studyBulkAction, setStudyBulkAction] = useState<PaymentStatus>('approved');
  const [studyBulkNotes, setStudyBulkNotes] = useState('');

  // Mock survey remarks - in real app, this would come from props or API
  const surveyRemarks: Record<string, string> = {
    'study_1': 'High priority study - expedite payments for quick completion',
    'study_2': 'Interview study - verify attendance before approving payments',
    'study_3': 'Beta testing - additional validation required for feature feedback quality'
  };

  // Group transactions by study
  const groupedTransactions = useMemo((): GroupedTransactions[] => {
    const groups = transactions.reduce((acc, transaction) => {
      const key = transaction.studyId;
      if (!acc[key]) {
        acc[key] = {
          studyId: transaction.studyId,
          studyTitle: transaction.studyTitle,
          transactions: [],
          totalAmount: 0,
          pendingCount: 0,
          approvedCount: 0,
          paidCount: 0,
          rejectedCount: 0,
          heldCount: 0,
          remarks: surveyRemarks[transaction.studyId]
        };
      }
      
      acc[key].transactions.push(transaction);
      acc[key].totalAmount += transaction.amount;
      
      switch (transaction.status) {
        case 'pending': acc[key].pendingCount++; break;
        case 'approved': acc[key].approvedCount++; break;
        case 'paid': acc[key].paidCount++; break;
        case 'rejected': acc[key].rejectedCount++; break;
        case 'held': acc[key].heldCount++; break;
      }
      
      return acc;
    }, {} as Record<string, GroupedTransactions>);

    return Object.values(groups).sort((a, b) => a.studyTitle.localeCompare(b.studyTitle));
  }, [transactions]);

  // Filter and sort transactions
  const filteredGroupedTransactions = useMemo(() => {
    let filtered = groupedTransactions;

    // Filter by selected study
    if (selectedStudy !== 'all') {
      filtered = filtered.filter(group => group.studyId === selectedStudy);
    }

    // Filter each group's transactions
    filtered = filtered.map(group => {
      let groupTransactions = group.transactions;

      // Apply search filter
      if (searchTerm) {
        groupTransactions = groupTransactions.filter(tx =>
          tx.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        groupTransactions = groupTransactions.filter(tx => tx.status === filterStatus);
      }

      // Apply sorting
      groupTransactions.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'date':
            comparison = a.createdAt.getTime() - b.createdAt.getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'participant':
            comparison = a.participantName.localeCompare(b.participantName);
            break;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      return {
        ...group,
        transactions: groupTransactions
      };
    }).filter(group => group.transactions.length > 0); // Only show groups with transactions

    return filtered;
  }, [groupedTransactions, searchTerm, filterStatus, selectedStudy, sortBy, sortOrder]);

  const toggleStudyExpansion = (studyId: string) => {
    setExpandedStudies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studyId)) {
        newSet.delete(studyId);
      } else {
        newSet.add(studyId);
      }
      return newSet;
    });
  };

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAllInStudy = (studyTransactions: PaymentTransaction[]) => {
    const studyTransactionIds = studyTransactions.map(t => t.id);
    const allSelected = studyTransactionIds.every(id => selectedTransactions.includes(id));
    
    if (allSelected) {
      setSelectedTransactions(prev => prev.filter(id => !studyTransactionIds.includes(id)));
    } else {
      setSelectedTransactions(prev => [...new Set([...prev, ...studyTransactionIds])]);
    }
  };

  const handleReviewTransaction = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    setReviewNotes(transaction.reviewNotes || '');
    setReviewAction(transaction.status === 'pending' ? 'approved' : transaction.status);
    setShowReviewModal(true);
  };

  const handleViewDetails = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleSubmitReview = () => {
    if (selectedTransaction) {
      onUpdatePayment(selectedTransaction.id, reviewAction, reviewNotes);
      setShowReviewModal(false);
      setSelectedTransaction(null);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          ✅ Payment ${reviewAction} successfully!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleBulkAction = () => {
    if (selectedTransactions.length > 0) {
      onBulkUpdate(selectedTransactions, bulkAction, bulkNotes);
      setShowBulkModal(false);
      setSelectedTransactions([]);
      setBulkNotes('');
      
      // Show success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          ✅ ${selectedTransactions.length} payments ${bulkAction} successfully!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleOpenStudyBulkModal = (study: GroupedTransactions) => {
    setSelectedStudyForBulk(study);
    setStudyBulkAction('approved');
    setStudyBulkNotes('');
    setShowStudyBulkModal(true);
  };

  const handleStudyBulkAction = () => {
    if (selectedStudyForBulk) {
      const transactionIds = selectedStudyForBulk.transactions.map(tx => tx.id);
      onBulkUpdate(transactionIds, studyBulkAction, studyBulkNotes);
      setShowStudyBulkModal(false);
      setSelectedStudyForBulk(null);
      setStudyBulkNotes('');
      
      // Show success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          ✅ All ${transactionIds.length} payments in "${selectedStudyForBulk.studyTitle}" ${studyBulkAction} successfully!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleExportPayments = () => {
    const allTransactions = filteredGroupedTransactions.flatMap(group => 
      group.transactions.map(tx => ({
        ...tx,
        studyTitle: group.studyTitle,
        studyRemarks: group.remarks || ''
      }))
    );

    const csvHeaders = [
      'Transaction ID',
      'Study Title',
      'Study ID',
      'Study Remarks',
      'Participant Name',
      'Participant Email',
      'Customer ID',
      'Amount',
      'Status',
      'Created Date',
      'Survey Completed',
      'Reviewed Date',
      'Paid Date',
      'Review Notes'
    ];
    
    const csvData = allTransactions.map(tx => [
      tx.id,
      tx.studyTitle,
      tx.studyId,
      tx.studyRemarks,
      tx.participantName,
      tx.participantEmail,
      tx.customerId,
      tx.amount,
      tx.status,
      tx.createdAt.toISOString().split('T')[0],
      tx.surveyCompletedAt?.toISOString().split('T')[0] || '',
      tx.reviewedAt?.toISOString().split('T')[0] || '',
      tx.paidAt?.toISOString().split('T')[0] || '',
      tx.reviewNotes || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_management_by_study_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: XCircle },
      held: { color: 'bg-orange-100 text-orange-800', label: 'On Hold', icon: Pause },
      paid: { color: 'bg-blue-100 text-blue-800', label: 'Paid', icon: DollarSign }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const allTransactions = filteredGroupedTransactions.flatMap(g => g.transactions);
    return {
      totalStudies: filteredGroupedTransactions.length,
      totalTransactions: allTransactions.length,
      totalAmount: allTransactions.reduce((sum, t) => sum + t.amount, 0),
      pending: allTransactions.filter(t => t.status === 'pending').length,
      approved: allTransactions.filter(t => t.status === 'approved').length,
      rejected: allTransactions.filter(t => t.status === 'rejected').length,
      held: allTransactions.filter(t => t.status === 'held').length,
      paid: allTransactions.filter(t => t.status === 'paid').length,
      pendingAmount: allTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
      approvedAmount: allTransactions.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.amount, 0)
    };
  }, [filteredGroupedTransactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Management by Study</h1>
            <p className="text-gray-600 mt-1">Manage payments organized by individual studies</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportPayments}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button
            onClick={() => navigate('/wallet-dashboard')}
            className="btn-primary flex items-center space-x-2"
          >
            <BarChart3 size={16} />
            <span>Wallet Dashboard</span>
          </button>
        </div>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Studies</p>
              <p className="text-xl font-semibold text-gray-900">{overallStats.totalStudies}</p>
              <p className="text-xs text-gray-500">{overallStats.totalTransactions} transactions</p>
            </div>
            <Folder className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-gray-900">{overallStats.pending}</p>
              <p className="text-xs text-yellow-600">${overallStats.pendingAmount.toFixed(2)}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-semibold text-gray-900">{overallStats.approved}</p>
              <p className="text-xs text-green-600">${overallStats.approvedAmount.toFixed(2)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-xl font-semibold text-gray-900">{overallStats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Hold</p>
              <p className="text-xl font-semibold text-gray-900">{overallStats.held}</p>
            </div>
            <Pause className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-xl font-semibold text-gray-900">{overallStats.paid}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search participants, emails, or transaction IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full sm:w-80"
              />
            </div>
            
            <select
              value={selectedStudy}
              onChange={(e) => setSelectedStudy(e.target.value)}
              className="form-input"
            >
              <option value="all">All Studies</option>
              {groupedTransactions.map(group => (
                <option key={group.studyId} value={group.studyId}>
                  {group.studyTitle}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | 'all')}
              className="form-input"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="held">On Hold</option>
              <option value="paid">Paid</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'participant')}
              className="form-input"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="participant">Sort by Participant</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary text-sm"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {selectedTransactions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedTransactions.length} selected
              </span>
              <button
                onClick={() => setShowBulkModal(true)}
                className="btn-primary text-sm"
              >
                Bulk Action
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grouped Transactions by Study */}
      <div className="space-y-4">
        {filteredGroupedTransactions.map((group) => (
          <div key={group.studyId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Study Header */}
            <div 
              className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleStudyExpansion(group.studyId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    {expandedStudies.has(group.studyId) ? 
                      <ChevronDown size={20} /> : 
                      <ChevronRight size={20} />
                    }
                  </button>
                  <div className="flex items-center space-x-2">
                    {expandedStudies.has(group.studyId) ? 
                      <FolderOpen className="text-blue-600" size={20} /> : 
                      <Folder className="text-blue-600" size={20} />
                    }
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.studyTitle}</h3>
                      <p className="text-sm text-gray-500">Study ID: {group.studyId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${group.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{group.transactions.length} transactions</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {group.pendingCount} pending
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {group.approvedCount} approved
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {group.paidCount} paid
                    </span>
                  </div>

                  {/* Study-level bulk actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenStudyBulkModal(group);
                      }}
                      className="btn-secondary text-xs px-3 py-1 flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-300"
                      title="Bulk actions for this study"
                    >
                      <Edit size={14} />
                      <span>Bulk Actions</span>
                    </button>
                    
                    {group.pendingCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const pendingTransactions = group.transactions.filter(tx => tx.status === 'pending').map(tx => tx.id);
                          onBulkUpdate(pendingTransactions, 'approved', `Bulk approved all pending payments for ${group.studyTitle}`);
                          
                          // Show success notification
                          const notification = document.createElement('div');
                          notification.innerHTML = `
                            <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                              ✅ ${pendingTransactions.length} pending payments approved for "${group.studyTitle}"!
                            </div>
                          `;
                          document.body.appendChild(notification);
                          setTimeout(() => {
                            if (document.body.contains(notification)) {
                              document.body.removeChild(notification);
                            }
                          }, 3000);
                        }}
                        className="btn-primary text-xs px-3 py-1 flex items-center space-x-1"
                        title="Quick approve all pending payments"
                      >
                        <CheckCircle size={14} />
                        <span>Approve All ({group.pendingCount})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {group.remarks && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="text-blue-600 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Study Remarks:</p>
                      <p className="text-sm text-blue-700">{group.remarks}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Transactions Table */}
            {expandedStudies.has(group.studyId) && (
              <div className="overflow-x-auto">
                <div className="px-6 py-3 bg-gray-25 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={group.transactions.every(tx => selectedTransactions.includes(tx.id)) && group.transactions.length > 0}
                      onChange={() => handleSelectAllInStudy(group.transactions)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Select all in this study
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/study/${group.studyId}`)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Study Details →
                  </button>
                </div>
                
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {group.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedTransactions.includes(transaction.id)}
                            onChange={() => handleSelectTransaction(transaction.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {transaction.participantName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {transaction.participantName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.participantEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${transaction.amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.customerId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{transaction.createdAt.toLocaleDateString()}</div>
                          <div className="text-xs">
                            Completed: {transaction.surveyCompletedAt?.toLocaleDateString() || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(transaction)}
                              className="text-blue-600 hover:text-blue-700"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleReviewTransaction(transaction)}
                              className="text-green-600 hover:text-green-700"
                              title="Review Payment"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.id);
                                // Show notification
                                const notification = document.createElement('div');
                                notification.innerHTML = `
                                  <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                                    ✅ Transaction ID copied!
                                  </div>
                                `;
                                document.body.appendChild(notification);
                                setTimeout(() => {
                                  if (document.body.contains(notification)) {
                                    document.body.removeChild(notification);
                                  }
                                }, 2000);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy Transaction ID"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {group.transactions.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No transactions match the current filters for this study.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredGroupedTransactions.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No studies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || selectedStudy !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No payment transactions have been recorded yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Bulk Action Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Action</h3>
              <button 
                onClick={() => setShowBulkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Apply action to {selectedTransactions.length} selected transactions
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value as PaymentStatus)}
                  className="form-input"
                >
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                  <option value="held">Put on Hold</option>
                  <option value="paid">Mark as Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={bulkNotes}
                  onChange={(e) => setBulkNotes(e.target.value)}
                  className="form-input"
                  rows={3}
                  placeholder="Add notes for this bulk action..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowBulkModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkAction}
                  className="btn-primary flex-1"
                >
                  Apply to {selectedTransactions.length} Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Transaction Modal */}
      {showReviewModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Payment</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Study Context */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Study Context</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Study:</span>
                    <p className="font-medium text-blue-900">{selectedTransaction.studyTitle}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Study ID:</span>
                    <p className="font-medium font-mono text-xs text-blue-900">{selectedTransaction.studyId}</p>
                  </div>
                </div>
                {surveyRemarks[selectedTransaction.studyId] && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <span className="text-blue-700 text-sm font-medium">Study Remarks:</span>
                    <p className="text-blue-700 text-sm mt-1">{surveyRemarks[selectedTransaction.studyId]}</p>
                  </div>
                )}
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Transaction Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Participant:</span>
                    <p className="font-medium">{selectedTransaction.participantName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <p className="font-medium">${selectedTransaction.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Customer ID:</span>
                    <p className="font-medium font-mono text-xs">{selectedTransaction.customerId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Survey Completed:</span>
                    <p className="font-medium">
                      {selectedTransaction.surveyCompletedAt?.toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select
                  value={reviewAction}
                  onChange={(e) => setReviewAction(e.target.value as PaymentStatus)}
                  className="form-input"
                >
                  <option value="approved">Approve Payment</option>
                  <option value="rejected">Reject Payment</option>
                  <option value="held">Put on Hold</option>
                  <option value="paid">Mark as Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="form-input"
                  rows={4}
                  placeholder="Add notes about your review decision..."
                />
              </div>
              
              {selectedTransaction.reviewNotes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Previous Review Notes</h5>
                  <p className="text-sm text-blue-700">{selectedTransaction.reviewNotes}</p>
                  {selectedTransaction.reviewedBy && (
                    <p className="text-xs text-blue-600 mt-2">
                      Reviewed by {selectedTransaction.reviewedBy} on{' '}
                      {selectedTransaction.reviewedAt?.toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitReview}
                  className="btn-primary flex-1"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Study Information */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Study Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-700">Title:</span>
                    <p className="font-medium text-blue-900">{selectedTransaction.studyTitle}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Study ID:</span>
                    <p className="font-medium font-mono text-xs text-blue-900">{selectedTransaction.studyId}</p>
                  </div>
                  {surveyRemarks[selectedTransaction.studyId] && (
                    <div>
                      <span className="text-blue-700">Remarks:</span>
                      <p className="text-blue-700 mt-1">{surveyRemarks[selectedTransaction.studyId]}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Participant Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">{selectedTransaction.participantName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedTransaction.participantEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Customer ID:</span>
                      <p className="font-medium font-mono text-xs">{selectedTransaction.customerId}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-medium text-lg">${selectedTransaction.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium capitalize">{selectedTransaction.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Survey Completed:</span>{' '}
                      {selectedTransaction.surveyCompletedAt?.toLocaleDateString() || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Transaction Created:</span>{' '}
                      {selectedTransaction.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  {selectedTransaction.reviewedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">
                        <span className="font-medium">Reviewed:</span>{' '}
                        {selectedTransaction.reviewedAt.toLocaleDateString()}
                        {selectedTransaction.reviewedBy && (
                          <span className="text-gray-500"> by {selectedTransaction.reviewedBy}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedTransaction.paidAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="text-sm">
                        <span className="font-medium">Paid:</span>{' '}
                        {selectedTransaction.paidAt.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedTransaction.reviewNotes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Review Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedTransaction.reviewNotes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study-level Bulk Action Modal */}
      {showStudyBulkModal && selectedStudyForBulk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Study Bulk Action</h3>
              <button 
                onClick={() => setShowStudyBulkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Study Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Folder className="text-blue-600" size={16} />
                  <h4 className="font-medium text-blue-900">{selectedStudyForBulk.studyTitle}</h4>
                </div>
                <p className="text-sm text-blue-700">Study ID: {selectedStudyForBulk.studyId}</p>
                {selectedStudyForBulk.remarks && (
                  <p className="text-sm text-blue-600 mt-2 italic">"{selectedStudyForBulk.remarks}"</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Apply action to all transactions in this study:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Transactions:</span>
                    <p className="font-medium">{selectedStudyForBulk.transactions.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Amount:</span>
                    <p className="font-medium">${selectedStudyForBulk.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Pending:</span>
                    <p className="font-medium text-yellow-600">{selectedStudyForBulk.pendingCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Approved:</span>
                    <p className="font-medium text-green-600">{selectedStudyForBulk.approvedCount}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action for All Transactions</label>
                <select
                  value={studyBulkAction}
                  onChange={(e) => setStudyBulkAction(e.target.value as PaymentStatus)}
                  className="form-input"
                >
                  <option value="approved">Approve All</option>
                  <option value="rejected">Reject All</option>
                  <option value="held">Put All on Hold</option>
                  <option value="paid">Mark All as Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes for Study</label>
                <textarea
                  value={studyBulkNotes}
                  onChange={(e) => setStudyBulkNotes(e.target.value)}
                  className="form-input"
                  rows={3}
                  placeholder={`Add notes for bulk ${studyBulkAction} action on "${selectedStudyForBulk.studyTitle}"...`}
                />
              </div>

              {/* Warning for destructive actions */}
              {(studyBulkAction === 'rejected' || studyBulkAction === 'held') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                    <div>
                      <h5 className="font-medium text-yellow-900">⚠️ Bulk {studyBulkAction === 'rejected' ? 'Rejection' : 'Hold'} Warning</h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        This will {studyBulkAction === 'rejected' ? 'reject' : 'put on hold'} ALL {selectedStudyForBulk.transactions.length} payments in this study. 
                        {studyBulkAction === 'rejected' && ' Rejected payments cannot be automatically approved again.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowStudyBulkModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStudyBulkAction}
                  className={`flex-1 ${
                    studyBulkAction === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                    studyBulkAction === 'held' ? 'bg-orange-600 hover:bg-orange-700' :
                    'btn-primary'
                  } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200`}
                >
                  {studyBulkAction === 'approved' && `✅ Approve All ${selectedStudyForBulk.transactions.length} Payments`}
                  {studyBulkAction === 'rejected' && `❌ Reject All ${selectedStudyForBulk.transactions.length} Payments`}
                  {studyBulkAction === 'held' && `⏸️ Hold All ${selectedStudyForBulk.transactions.length} Payments`}
                  {studyBulkAction === 'paid' && `💰 Mark All ${selectedStudyForBulk.transactions.length} as Paid`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 