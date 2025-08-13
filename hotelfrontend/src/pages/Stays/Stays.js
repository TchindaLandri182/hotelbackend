import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Stays = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        const mockStays = [
          {
            _id: '1',
            client: { _id: '1', firstName: 'John', lastName: 'Doe' },
            room: { _id: '1', roomNumber: '101' },
            startDate: '2024-01-15T00:00:00Z',
            endDate: '2024-01-20T00:00:00Z',
            status: 'confirmed',
            notes: 'Late check-in requested',
            createdAt: '2024-01-10T10:30:00Z'
          },
          {
            _id: '2',
            client: { _id: '2', firstName: 'Marie', lastName: 'Dubois' },
            room: { _id: '2', roomNumber: '102' },
            startDate: '2024-01-18T00:00:00Z',
            endDate: '2024-01-25T00:00:00Z',
            status: 'in-progress',
            notes: 'Anniversary celebration',
            actualCheckIn: '2024-01-18T15:30:00Z',
            createdAt: '2024-01-15T14:20:00Z'
          },
          {
            _id: '3',
            client: { _id: '3', firstName: 'Hans', lastName: 'Mueller' },
            room: { _id: '3', roomNumber: '201' },
            startDate: '2024-01-22T00:00:00Z',
            endDate: '2024-01-28T00:00:00Z',
            status: 'pending',
            notes: 'Business trip',
            createdAt: '2024-01-20T09:15:00Z'
          }
        ];
        
        setStays(mockStays);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in-progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredStays = stays.filter(stay => {
    const matchesSearch = stay.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stay.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stay.room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || stay.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('stays.confirm_delete'))) {
      setStays(stays.filter(stay => stay._id !== id));
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
            {t('stays.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage guest bookings and reservations
          </p>
        </div>
        {hasPermission(9001) && (
          <Link
            to="/stays/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('stays.create_stay')}</span>
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
              <option value="pending">{t('stays.pending')}</option>
              <option value="confirmed">{t('stays.confirmed')}</option>
              <option value="in-progress">{t('stays.in_progress')}</option>
              <option value="completed">{t('stays.completed')}</option>
              <option value="cancelled">{t('stays.cancelled')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stays Table */}
      {filteredStays.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('stays.no_stays')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first booking.
            </p>
            {hasPermission(9001) && (
              <Link
                to="/stays/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('stays.create_stay')}</span>
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
                  <th className="table-header-cell">Guest</th>
                  <th className="table-header-cell">Room</th>
                  <th className="table-header-cell">Dates</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Notes</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStays.map((stay) => (
                  <tr key={stay._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {stay.client.firstName.charAt(0)}{stay.client.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {stay.client.firstName} {stay.client.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Room {stay.room.roomNumber}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(stay.startDate).toLocaleDateString()} - {new Date(stay.endDate).toLocaleDateString()}
                      </div>
                      {stay.actualCheckIn && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Checked in: {new Date(stay.actualCheckIn).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(stay.status)}`}>
                        {t(`stays.${stay.status}`)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {stay.notes || '-'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {hasPermission(9003) && (
                          <Link
                            to={`/stays/edit/${stay._id}`}
                            className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                        )}
                        {hasPermission(9004) && (
                          <button
                            onClick={() => handleDelete(stay._id)}
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

export default Stays;