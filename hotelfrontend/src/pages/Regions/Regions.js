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

const Regions = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [countries, setCountries] = useState([]);

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        const mockCountries = [
          { _id: '1', name: { en: 'United States', fr: 'États-Unis' }, code: 'US' },
          { _id: '2', name: { en: 'France', fr: 'France' }, code: 'FR' },
          { _id: '3', name: { en: 'Germany', fr: 'Allemagne' }, code: 'DE' }
        ];
        
        const mockRegions = [
          {
            _id: '1',
            name: { en: 'California', fr: 'Californie' },
            country: { _id: '1', name: { en: 'United States', fr: 'États-Unis' } },
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: { en: 'New York', fr: 'New York' },
            country: { _id: '1', name: { en: 'United States', fr: 'États-Unis' } },
            createdAt: '2024-01-10T14:20:00Z'
          },
          {
            _id: '3',
            name: { en: 'Île-de-France', fr: 'Île-de-France' },
            country: { _id: '2', name: { en: 'France', fr: 'France' } },
            createdAt: '2024-01-05T09:15:00Z'
          },
          {
            _id: '4',
            name: { en: 'Bavaria', fr: 'Bavière' },
            country: { _id: '3', name: { en: 'Germany', fr: 'Allemagne' } },
            createdAt: '2024-01-01T12:00:00Z'
          }
        ];
        
        setCountries(mockCountries);
        setRegions(mockRegions);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.country.name.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !filterCountry || region.country._id === filterCountry;
    
    return matchesSearch && matchesCountry;
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('regions.confirm_delete'))) {
      setRegions(regions.filter(region => region._id !== id));
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
            {t('regions.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage geographical regions
          </p>
        </div>
        {hasPermission(1401) && (
          <Link
            to="/regions/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('regions.create_region')}</span>
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
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="">{t('common.all')} Countries</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name.en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Regions Grid */}
      {filteredRegions.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('regions.no_regions')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first region.
            </p>
            {hasPermission(1401) && (
              <Link
                to="/regions/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('regions.create_region')}</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegions.map((region) => (
            <div key={region._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {region.name.en}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {region.country.name.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">French Name:</span>
                    <span className="text-gray-900 dark:text-white">{region.name.fr}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Country:</span>
                    <span className="text-gray-900 dark:text-white">{region.country.name.en}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(region.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasPermission(1403) && (
                      <Link
                        to={`/regions/edit/${region._id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                    )}
                    {hasPermission(1404) && (
                      <button
                        onClick={() => handleDelete(region._id)}
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

export default Regions;