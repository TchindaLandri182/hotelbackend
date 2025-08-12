import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const Categories = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHotel, setFilterHotel] = useState('');
  const [hotels, setHotels] = useState([]);

  // Static data - will be replaced with API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        const mockHotels = [
          { _id: '1', name: 'Grand Palace Hotel' },
          { _id: '2', name: 'Seaside Resort' },
          { _id: '3', name: 'Mountain View Lodge' }
        ];
        
        const mockCategories = [
          {
            _id: '1',
            name: { en: 'Standard Room', fr: 'Chambre Standard' },
            description: { en: 'Comfortable standard room with basic amenities', fr: 'Chambre standard confortable avec équipements de base' },
            basePrice: 100,
            hotel: { _id: '1', name: 'Grand Palace Hotel' },
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: { en: 'Deluxe Room', fr: 'Chambre Deluxe' },
            description: { en: 'Spacious deluxe room with premium amenities', fr: 'Chambre deluxe spacieuse avec équipements premium' },
            basePrice: 150,
            hotel: { _id: '1', name: 'Grand Palace Hotel' },
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '3',
            name: { en: 'Ocean View Suite', fr: 'Suite Vue Océan' },
            description: { en: 'Luxury suite with stunning ocean views', fr: 'Suite de luxe avec vue imprenable sur l\'océan' },
            basePrice: 250,
            hotel: { _id: '2', name: 'Seaside Resort' },
            createdAt: '2024-01-10T14:20:00Z'
          },
          {
            _id: '4',
            name: { en: 'Mountain Suite', fr: 'Suite Montagne' },
            description: { en: 'Premium suite with mountain views', fr: 'Suite premium avec vue sur la montagne' },
            basePrice: 200,
            hotel: { _id: '3', name: 'Mountain View Lodge' },
            createdAt: '2024-01-05T09:15:00Z'
          }
        ];
        
        setHotels(mockHotels);
        setCategories(mockCategories);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHotel = !filterHotel || category.hotel._id === filterHotel;
    
    return matchesSearch && matchesHotel;
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('categories.confirm_delete'))) {
      setCategories(categories.filter(category => category._id !== id));
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
            {t('categories.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage room categories and pricing
          </p>
        </div>
        {hasPermission(1001) && (
          <Link
            to="/categories/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('categories.create_category')}</span>
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
              value={filterHotel}
              onChange={(e) => setFilterHotel(e.target.value)}
            >
              <option value="">{t('common.all')} Hotels</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('categories.no_categories')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first room category.
            </p>
            {hasPermission(1001) && (
              <Link
                to="/categories/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('categories.create_category')}</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <TagIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.name.en}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.hotel.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      ${category.basePrice}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      per night
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {category.description.en}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">French Name:</span>
                    <span className="text-gray-900 dark:text-white">{category.name.fr}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasPermission(1003) && (
                      <Link
                        to={`/categories/edit/${category._id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                    )}
                    {hasPermission(1004) && (
                      <button
                        onClick={() => handleDelete(category._id)}
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

export default Categories;