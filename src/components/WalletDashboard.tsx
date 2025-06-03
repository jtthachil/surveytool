import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Eye,
  CreditCard,
  BarChart3,
  RefreshCw,
  Plus,
  ExternalLink,
  FileText,
  Mail,
  User,
  Copy,
  X
} from 'lucide-react';
import type { ParticipantWallet, PaymentStatus, PaymentTransaction } from '../types/study';

interface WalletDashboardProps {
  participantWallets: ParticipantWallet[];
  onExportTransactions: () => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
  participantWallets,
  onExportTransactions
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'participant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const allTransactions = participantWallets.flatMap(w => w.transactions);
    const totalEarnings = participantWallets.reduce((sum, w) => sum + w.totalEarnings, 0);
    const totalPending = participantWallets.reduce((sum, w) => sum + w.pendingPayments, 0);
    const totalPaid = participantWallets.reduce((sum, w) => sum + w.paidAmount, 0);
    const totalHeld = participantWallets.reduce((sum, w) => sum + w.heldAmount, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyPaid = allTransactions
      .filter(tx => tx.paidAt && tx.paidAt >= thisMonth)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const avgTransactionAmount = allTransactions.length > 0 
      ? totalEarnings / allTransactions.length 
      : 0;

    const pendingTransactions = allTransactions.filter(tx => tx.status === 'pending').length;

    return {
      totalEarnings,
      totalPending,
      totalPaid,
      totalHeld,
      monthlyPaid,
      avgTransactionAmount,
      totalParticipants: participantWallets.length,
      pendingTransactions,
      totalTransactions: allTransactions.length
    };
  }, [participantWallets]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let transactions = participantWallets.flatMap(wallet => 
      wallet.transactions.map(tx => ({
        ...tx,
        participantWallet: wallet
      }))
    );

    // Apply search filter
    if (searchTerm) {
      transactions = transactions.filter(tx =>
        tx.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.studyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      transactions = transactions.filter(tx => tx.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const daysAgo = new Date();
      
      switch (dateRange) {
        case '7d':
          daysAgo.setDate(now.getDate() - 7);
          break;
        case '30d':
          daysAgo.setDate(now.getDate() - 30);
          break;
        case '90d':
          daysAgo.setDate(now.getDate() - 90);
          break;
      }
      
      transactions = transactions.filter(tx => tx.createdAt >= daysAgo);
    }

    // Apply sorting
    transactions.sort((a, b) => {
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

    return transactions;
  }, [participantWallets, searchTerm, statusFilter, dateRange, sortBy, sortOrder]);

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'approved': return <CheckCircle size={16} className="text-blue-500" />;
      case 'paid': return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected': return <AlertCircle size={16} className="text-red-500" />;
      case 'held': return <Pause size={16} className="text-orange-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'held': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportTransactions = (format: 'csv' | 'json' = 'csv') => {
    const dataToExport = filteredTransactions.map(tx => ({
      TransactionID: tx.id,
      ParticipantName: tx.participantName,
      ParticipantEmail: tx.participantEmail,
      StudyTitle: tx.studyTitle,
      Amount: tx.amount,
      Status: tx.status,
      CreatedDate: tx.createdAt.toISOString().split('T')[0],
      CompletedDate: tx.surveyCompletedAt?.toISOString().split('T')[0] || '',
      ReviewedDate: tx.reviewedAt?.toISOString().split('T')[0] || '',
      PaidDate: tx.paidAt?.toISOString().split('T')[0] || '',
      ReviewNotes: tx.reviewNotes || ''
    }));

    let fileContent: string;
    let fileName: string;
    let mimeType: string;

    if (format === 'csv') {
      const headers = Object.keys(dataToExport[0] || {});
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');
      
      fileContent = csvContent;
      fileName = `payment_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else {
      fileContent = JSON.stringify(dataToExport, null, 2);
      fileName = `payment_transactions_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ Transactions exported as ${format.toUpperCase()}!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Center</h1>
          <p className="text-gray-600 mt-1">Manage participant payments and transaction history</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button
            onClick={() => navigate('/payment-management')}
            className="btn-primary flex items-center space-x-2"
          >
            <CreditCard size={16} />
            <span>Payment Management</span>
          </button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.totalPending.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.pendingTransactions} transactions</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Paid This Month</p>
              <p className="text-2xl font-bold text-green-600">${stats.monthlyPaid.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                Current month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Participants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
              <p className="text-xs text-gray-500 mt-1">With transactions</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Transaction</p>
              <p className="text-2xl font-bold text-gray-900">${stats.avgTransactionAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalTransactions} total</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search participants, studies, or transaction IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full sm:w-80"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
              className="form-input"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="held">Held</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
              className="form-input"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'participant')}
              className="form-input text-sm"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="participant">Participant</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              {sortOrder === 'asc' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions ({filteredTransactions.length})
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study
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
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{transaction.studyTitle}</div>
                    <div className="text-sm text-gray-500">ID: {transaction.studyId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{transaction.createdAt.toLocaleDateString()}</div>
                    <div className="text-xs">{transaction.createdAt.toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/study/${transaction.studyId}`)}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Study"
                      >
                        <Eye size={16} />
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

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No payment transactions have been recorded yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Transactions</h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Export {filteredTransactions.length} filtered transactions
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleExportTransactions('csv')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">CSV Format</h4>
                      <p className="text-sm text-gray-600">Spreadsheet-compatible format</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleExportTransactions('json')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">JSON Format</h4>
                      <p className="text-sm text-gray-600">Developer-friendly format</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <button 
                onClick={() => setShowExportModal(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 