import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Hotels = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockHotels = [
          {
            _id: '1',
            name: 'Grand Palace Hotel',
            address: '123 Main Street, Downtown',
            logo: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
            owners: [
              { firstName: 'John', lastName: 'Doe' },
              { firstName: 'Jane', lastName: 'Smith' }
            ],
            zone: { name: { en: 'Downtown', fr: 'Centre-ville' } },
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: 'Seaside Resort',
            address: '456 Ocean Drive, Beachfront',
            logo: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400',
            owners: [
              { firstName: 'Mike', lastName: 'Johnson' }
            ],
            zone: { name: { en: 'Beachfront', fr: 'Front de mer' } },
            createdAt: '2024-01-10T14:20:00Z'
          },
          {
            _id: '3',
            name: 'Mountain View Lodge',
            address: '789 Highland Road, Mountain View',
            logo: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
            owners: [
              { firstName: 'Sarah', lastName: 'Wilson' }
            ],
            zone: { name: { en: 'Mountain View', fr: 'Vue sur la montagne' } },
            createdAt: '2024-01-05T09:15:00Z'
          }
        ];
        setHotels(mockHotels);
        setTotalPages(1);
        setLoading(false);
      }, 1000);
    };

    fetchHotels();
  }, [currentPage, searchTerm]);

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm(t('hotels.confirm_delete'))) {
      // Simulate delete API call
      setHotels(hotels.filter(hotel => hotel._id !== id));
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
            {t('hotels.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your hotel properties
          </p>
        </div>
        {hasPermission(4001) && (
          <Link
            to="/hotels/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('hotels.create_hotel')}</span>
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

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('hotels.no_hotels')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first hotel.
            </p>
            {hasPermission(4001) && (
              <Link
                to="/hotels/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('hotels.create_hotel')}</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={hotel.logo}
                  alt={hotel.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {hotel.address}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-medium">Zone:</span>
                      <span className="ml-1">{hotel.zone.name.en}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Owners:</span>
                      <span className="ml-1">
                        {hotel.owners.map(owner => `${owner.firstName} ${owner.lastName}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(hotel.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasPermission(4003) && (
                      <Link
                        to={`/hotels/edit/${hotel._id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                    )}
                    {hasPermission(4004) && (
                      <button
                        onClick={() => handleDelete(hotel._id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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

export default Hotels;