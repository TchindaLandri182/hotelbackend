import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RoomForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    roomNumber: '',
    hotel: '',
    category: '',
    isInMaintenance: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hotels, setHotels] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load hotels and categories
    const loadData = async () => {
      // Mock data - replace with API calls
      setHotels([
        { _id: '1', name: 'Grand Palace Hotel' },
        { _id: '2', name: 'Seaside Resort' },
        { _id: '3', name: 'Mountain View Lodge' }
      ]);
      
      setCategories([
        { _id: '1', name: { en: 'Standard Room', fr: 'Chambre Standard' }, basePrice: 100 },
        { _id: '2', name: { en: 'Deluxe Room', fr: 'Chambre Deluxe' }, basePrice: 150 },
        { _id: '3', name: { en: 'Ocean View Suite', fr: 'Suite Vue Océan' }, basePrice: 250 },
        { _id: '4', name: { en: 'Mountain Suite', fr: 'Suite Montagne' }, basePrice: 200 }
      ]);
    };

    loadData();

    // Load room data if editing
    if (isEdit) {
      const loadRoom = async () => {
        // Mock data - replace with API call
        setFormData({
          roomNumber: '101',
          hotel: '1',
          category: '1',
          isInMaintenance: false
        });
      };
      loadRoom();
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = t('errors.required_field');
    }
    
    if (!formData.hotel) {
      newErrors.hotel = t('errors.required_field');
    }
    
    if (!formData.category) {
      newErrors.category = t('errors.required_field');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEdit ? t('rooms.room_updated') : t('rooms.room_created'));
      navigate('/rooms');
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? t('rooms.edit_room') : t('rooms.create_room')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update room information' : 'Add a new room to your hotel'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roomNumber" className="form-label">
                {t('rooms.room_number')}
              </label>
              <input
                id="roomNumber"
                name="roomNumber"
                type="text"
                required
                className={`form-input ${errors.roomNumber ? 'border-red-500' : ''}`}
                placeholder="101"
                value={formData.roomNumber}
                onChange={handleChange}
              />
              {errors.roomNumber && (
                <p className="form-error">{errors.roomNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="hotel" className="form-label">
                {t('rooms.hotel')}
              </label>
              <select
                id="hotel"
                name="hotel"
                required
                className={`form-input ${errors.hotel ? 'border-red-500' : ''}`}
                value={formData.hotel}
                onChange={handleChange}
              >
                <option value="">{t('rooms.select_hotel')}</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
              {errors.hotel && (
                <p className="form-error">{errors.hotel}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              {t('rooms.category')}
            </label>
            <select
              id="category"
              name="category"
              required
              className={`form-input ${errors.category ? 'border-red-500' : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">{t('rooms.select_category')}</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name.en} - ${category.basePrice}/night
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="form-error">{errors.category}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="isInMaintenance"
              name="isInMaintenance"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.isInMaintenance}
              onChange={handleChange}
            />
            <label htmlFor="isInMaintenance" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              {t('rooms.maintenance')}
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner w-4 h-4 border-2 border-white border-t-transparent"></div>
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                isEdit ? t('common.update') : t('common.create')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;