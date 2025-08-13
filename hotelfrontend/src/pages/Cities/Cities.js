import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Cities = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [regions, setRegions] = useState([]);

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        const mockRegions = [
          { _id: '1', name: { en: 'California', fr: 'Californie' } },
          { _id: '2', name: { en: 'New York', fr: 'New York' } },
          { _id: '3', name: { en: 'Île-de-France', fr: 'Île-de-France' } }
        ];
        
        const mockCities = [
          {
            _id: '1',
            name: { en: 'Los Angeles', fr: 'Los Angeles' },
            region: { _id: '1', name: { en: 'California', fr: 'Californie' } },
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: { en: 'San Francisco', fr: 'San Francisco' },
            region: { _id: '1', name: { en: 'California', fr: 'Californie' } },
            createdAt: '2024-01-10T14:20:00Z'
          },
          {
            _id: '3',
            name: { en: 'New York City', fr: 'New York' },
            region: { _id: '2', name: { en: 'New York', fr: 'New York' } },
            createdAt: '2024-01-05T09:15:00Z'
          },
          {
            _id: '4',
            name: { en: 'Paris', fr: 'Paris' },
            region: { _id: '3', name: { en: 'Île-de-France', fr: 'Île-de-France' } },
            createdAt: '2024-01-01T12:00:00Z'
          }
        ];
        
        setRegions(mockRegions);
        setCities(mockCities);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.region.name.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !filterRegion || city.region._id === filterRegion;
    
    return matchesSearch && matchesRegion;
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('cities.confirm_delete'))) {
      setCities(cities.filter(city => city._id !== id));
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
            {t('cities.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage cities within regions
          </p>
        </div>
        {hasPermission(1401) && (
          <Link
            to="/cities/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('cities.create_city')}</span>
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
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="">{t('common.all')} Regions</option>
              {regions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.name.en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      {filteredCities.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('cities.no_cities')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first city.
            </p>
            {hasPermission(1401) && (
              <Link
                to="/cities/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('cities.create_city')}</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div key={city._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {city.name.en}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {city.region.name.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">French Name:</span>
                    <span className="text-gray-900 dark:text-white">{city.name.fr}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Region:</span>
                    <span className="text-gray-900 dark:text-white">{city.region.name.en}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(city.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasPermission(1403) && (
                      <Link
                        to={`/cities/edit/${city._id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                    )}
                    {hasPermission(1404) && (
                      <button
                        onClick={() => handleDelete(city._id)}
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
    </div>
  );
};

export default Cities;