import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const Rooms = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHotel, setFilterHotel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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
        
        const mockRooms = [
          {
            _id: '1',
            roomNumber: '101',
            hotel: { _id: '1', name: 'Grand Palace Hotel' },
            category: { _id: '1', name: { en: 'Standard Room', fr: 'Chambre Standard' }, basePrice: 100 },
            isInMaintenance: false,
            status: 'available',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            roomNumber: '102',
            hotel: { _id: '1', name: 'Grand Palace Hotel' },
            category: { _id: '2', name: { en: 'Deluxe Room', fr: 'Chambre Deluxe' }, basePrice: 150 },
            isInMaintenance: false,
            status: 'occupied',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '3',
            roomNumber: '201',
            hotel: { _id: '2', name: 'Seaside Resort' },
            category: { _id: '3', name: { en: 'Ocean View Suite', fr: 'Suite Vue Océan' }, basePrice: 250 },
            isInMaintenance: true,
            status: 'maintenance',
            createdAt: '2024-01-10T14:20:00Z'
          },
          {
            _id: '4',
            roomNumber: '301',
            hotel: { _id: '3', name: 'Mountain View Lodge' },
            category: { _id: '4', name: { en: 'Mountain Suite', fr: 'Suite Montagne' }, basePrice: 200 },
            isInMaintenance: false,
            status: 'reserved',
            createdAt: '2024-01-05T09:15:00Z'
          }
        ];
        
        setHotels(mockHotels);
        setRooms(mockRooms);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'occupied':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return t('rooms.available');
      case 'occupied':
        return t('rooms.occupied');
      case 'reserved':
        return t('rooms.reserved');
      case 'maintenance':
        return t('rooms.maintenance');
      default:
        return status;
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHotel = !filterHotel || room.hotel._id === filterHotel;
    const matchesStatus = !filterStatus || room.status === filterStatus;
    
    return matchesSearch && matchesHotel && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('rooms.confirm_delete'))) {
      setRooms(rooms.filter(room => room._id !== id));
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
            {t('rooms.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage room inventory and availability
          </p>
        </div>
        {hasPermission(8001) && (
          <Link
            to="/rooms/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('rooms.create_room')}</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">{t('common.all')} Status</option>
              <option value="available">{t('rooms.available')}</option>
              <option value="occupied">{t('rooms.occupied')}</option>
              <option value="reserved">{t('rooms.reserved')}</option>
              <option value="maintenance">{t('rooms.maintenance')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <KeyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('rooms.no_rooms')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first room.
            </p>
            {hasPermission(8001) && (
              <Link
                to="/rooms/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t('rooms.create_room')}</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div key={room._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      room.status === 'available' ? 'bg-green-100 dark:bg-green-900/20' :
                      room.status === 'occupied' ? 'bg-red-100 dark:bg-red-900/20' :
                      room.status === 'reserved' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-gray-100 dark:bg-gray-900/20'
                    }`}>
                      {room.isInMaintenance ? (
                        <WrenchScrewdriverIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <KeyIcon className={`w-6 h-6 ${
                          room.status === 'available' ? 'text-green-600 dark:text-green-400' :
                          room.status === 'occupied' ? 'text-red-600 dark:text-red-400' :
                          room.status === 'reserved' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Room {room.roomNumber}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {room.hotel.name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(room.status)}`}>
                    {getStatusText(room.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <span className="text-gray-900 dark:text-white">{room.category.name.en}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Base Price:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${room.category.basePrice}/night
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasPermission(8003) && (
                      <Link
                        to={`/rooms/edit/${room._id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                    )}
                    {hasPermission(8004) && (
                      <button
                        onClick={() => handleDelete(room._id)}
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

export default Rooms;