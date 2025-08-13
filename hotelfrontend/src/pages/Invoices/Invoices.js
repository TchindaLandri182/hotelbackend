import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Invoices = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        const mockInvoices = [
          {
            _id: '1',
            stay: {
              _id: '1',
              client: { firstName: 'John', lastName: 'Doe' },
              room: { roomNumber: '101' },
              startDate: '2024-01-15T00:00:00Z',
              endDate: '2024-01-20T00:00:00Z'
            },
            totalAmount: 500,
            issueDate: '2024-01-20T00:00:00Z',
            paymentStatus: 'paid',
            payments: [
              {
                amountPaid: 500,
                datePaid: '2024-01-20T10:00:00Z',
                method: 'card'
              }
            ],
            createdAt: '2024-01-20T10:30:00Z'
          },
          {
            _id: '2',
            stay: {
              _id: '2',
              client: { firstName: 'Marie', lastName: 'Dubois' },
              room: { roomNumber: '102' },
              startDate: '2024-01-18T00:00:00Z',
              endDate: '2024-01-25T00:00:00Z'
            },
            totalAmount: 750,
            issueDate: '2024-01-25T00:00:00Z',
            paymentStatus: 'partially_paid',
            payments: [
              {
                amountPaid: 300,
                datePaid: '2024-01-25T14:00:00Z',
                method: 'cash'
              }
            ],
            createdAt: '2024-01-25T14:30:00Z'
          },
          {
            _id: '3',
            stay: {
              _id: '3',
              client: { firstName: 'Hans', lastName: 'Mueller' },
              room: { roomNumber: '201' },
              startDate: '2024-01-22T00:00:00Z',
              endDate: '2024-01-28T00:00:00Z'
            },
            totalAmount: 1200,
            issueDate: '2024-01-28T00:00:00Z',
            paymentStatus: 'pending',
            payments: [],
            createdAt: '2024-01-28T11:00:00Z'
          }
        ];
        
        setInvoices(mockInvoices);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTotalPaid = (payments) => {
    return payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.stay.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.stay.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.stay.room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || invoice.paymentStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('invoices.confirm_delete'))) {
      setInvoices(invoices.filter(invoice => invoice._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('invoices.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage billing and payment tracking
          </p>
        </div>
        {hasPermission(5001) && (
          <Link
            to="/invoices/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('invoices.create_invoice')}</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">{t('common.all')} Status</option>
              <option value="pending">{t('invoices.pending')}</option>
              <option value="partially_paid">{t('invoices.partially_paid')}</option>
              <option value="paid">{t('invoices.paid')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('invoices.no_invoices')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Invoices will appear here when stays are completed.
            </p>
            {hasPermission(5001) && (
              <Link
                to="/invoices/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('invoices.create_invoice')}</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Invoice</th>
                  <th className="table-header-cell">Guest</th>
                  <th className="table-header-cell">Room</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Issue Date</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            INV-{invoice._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.stay.client.firstName} {invoice.stay.client.lastName}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900 dark:text-white">
                        Room {invoice.stay.room.roomNumber}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">${invoice.totalAmount}</div>
                        {invoice.payments.length > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Paid: ${getTotalPaid(invoice.payments)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.paymentStatus)}`}>
                        {t(`invoices.${invoice.paymentStatus}`)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {hasPermission(5003) && (
                          <Link
                            to={`/invoices/edit/${invoice._id}`}
                            className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                        )}
                        {hasPermission(5004) && (
                          <button
                            onClick={() => handleDelete(invoice._id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;