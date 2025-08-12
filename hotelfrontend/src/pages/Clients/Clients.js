import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Clients = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockClients = [
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1985-03-15T00:00:00Z',
            nationality: 'American',
            country: 'USA',
            cityOfResidence: 'New York',
            profession: 'Engineer',
            tel: '+1-555-0123',
            nIDC: 'US123456789',
            totalSpent: 1250,
            actualStay: [],
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            firstName: 'Marie',
            lastName: 'Dubois',
            dateOfBirth: '1990-07-22T00:00:00Z',
            nationality: 'French',
            country: 'France',
            cityOfResidence: 'Paris',
            profession: 'Designer',
            tel: '+33-1-23-45-67-89',
            nIDC: 'FR987654321',
            totalSpent: 850,
            actualStay: [{ status: 'in-progress' }],
            createdAt: '2024-01-10T14:20:00Z'
          },
          {
            _id: '3',
            firstName: 'Hans',
            lastName: 'Mueller',
            dateOfBirth: '1978-11-08T00:00:00Z',
            nationality: 'German',
            country: 'Germany',
            cityOfResidence: 'Berlin',
            profession: 'Doctor',
            tel: '+49-30-12345678',
            nIDC: 'DE456789123',
            totalSpent: 2100,
            actualStay: [],
            createdAt: '2024-01-05T09:15:00Z'
          }
        ];
        setClients(mockClients);
        setTotalPages(1);
        setLoading(false);
      }, 1000);
    };

    fetchClients();
  }, [currentPage, searchTerm]);

  const filteredClients = clients.filter(client =>
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tel.includes(searchTerm) ||
    client.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm(t('clients.confirm_delete'))) {
      setClients(clients.filter(client => client._id !== id));
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
            {t('clients.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage guest information and profiles
          </p>
        </div>
        {hasPermission(2001) && (
          <Link
            to="/clients/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('clients.create_client')}</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      {filteredClients.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('clients.no_clients')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first client.
            </p>
            {hasPermission(2001) && (
              <Link
                to="/clients/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('clients.create_client')}</span>
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
                  <th className="table-header-cell">Client</th>
                  <th className="table-header-cell">Contact</th>
                  <th className="table-header-cell">Nationality</th>
                  <th className="table-header-cell">Profession</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Total Spent</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {client.nIDC}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {client.tel}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client.cityOfResidence}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {client.nationality}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client.country}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {client.profession}
                      </span>
                    </td>
                    <td className="table-cell">
                      {client.actualStay.length > 0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Currently Staying
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                          Not Staying
                        </span>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${client.totalSpent}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {hasPermission(2003) && (
                          <Link
                            to={`/clients/edit/${client._id}`}
                            className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                        )}
                        {hasPermission(2004) && (
                          <button
                            onClick={() => handleDelete(client._id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.previous')}
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('common.page')} {currentPage} {t('common.of')} {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Clients;