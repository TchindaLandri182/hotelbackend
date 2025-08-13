import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Countries = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        const mockCountries = [
          {
            _id: '1',
            name: { en: 'United States', fr: 'États-Unis' },
            code: 'US',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: { en: 'France', fr: 'France' },
            code: 'FR',
            createdAt: '2024-01-10T14:20:00Z'
          },
          {
            _id: '3',
            name: { en: 'Germany', fr: 'Allemagne' },
            code: 'DE',
            createdAt: '2024-01-05T09:15:00Z'
          },
          {
            _id: '4',
            name: { en: 'Canada', fr: 'Canada' },
            code: 'CA',
            createdAt: '2024-01-01T12:00:00Z'
          }
        ];
        
        setCountries(mockCountries);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('countries.confirm_delete'))) {
      setCountries(countries.filter(country => country._id !== id));
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
            {t('countries.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage countries and territories
          </p>
        </div>
        {hasPermission(1401) && (
          <Link
            to="/countries/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('countries.create_country')}</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
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
        </div>
      </div>

      {/* Countries Grid */}
      {filteredCountries.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('countries.no_countries')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first country.
            </p>
            {hasPermission(1401) && (
              <Link
                to="/countries/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('countries.create_country')}</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map((country) => (
            <div key={country._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <GlobeAltIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {country.name.en}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {country.code}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">French Name:</span>
                    <span className="text-gray-900 dark:text-white">{country.name.fr}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Code:</span>
                    <span className="text-gray-900 dark:text-white font-mono">{country.code}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(country.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasPermission(1403) && (
                      <Link
                        to={`/countries/edit/${country._id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                    )}
                    {hasPermission(1404) && (
                      <button
                        onClick={() => handleDelete(country._id)}
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

export default Countries;