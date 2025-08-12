import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CategoryForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: { en: '', fr: '' },
    description: { en: '', fr: '' },
    basePrice: '',
    hotel: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // Load hotels
    const loadData = async () => {
      // Mock data - replace with API calls
      setHotels([
        { _id: '1', name: 'Grand Palace Hotel' },
        { _id: '2', name: 'Seaside Resort' },
        { _id: '3', name: 'Mountain View Lodge' }
      ]);
    };

    loadData();

    // Load category data if editing
    if (isEdit) {
      const loadCategory = async () => {
        // Mock data - replace with API call
        setFormData({
          name: { en: 'Standard Room', fr: 'Chambre Standard' },
          description: { 
            en: 'Comfortable standard room with basic amenities', 
            fr: 'Chambre standard confortable avec équipements de base' 
          },
          basePrice: '100',
          hotel: '1'
        });
      };
      loadCategory();
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    
    if (!formData.name.en.trim()) {
      newErrors['name.en'] = t('errors.required_field');
    }
    
    if (!formData.name.fr.trim()) {
      newErrors['name.fr'] = t('errors.required_field');
    }
    
    if (!formData.description.en.trim()) {
      newErrors['description.en'] = t('errors.required_field');
    }
    
    if (!formData.description.fr.trim()) {
      newErrors['description.fr'] = t('errors.required_field');
    }
    
    if (!formData.basePrice || isNaN(formData.basePrice) || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = t('errors.invalid_number');
    }
    
    if (!formData.hotel) {
      newErrors.hotel = t('errors.required_field');
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
      
      toast.success(isEdit ? t('categories.category_updated') : t('categories.category_created'));
      navigate('/categories');
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
          {isEdit ? t('categories.edit_category') : t('categories.create_category')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update category information' : 'Add a new room category'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name.en" className="form-label">
                {t('categories.name_en')}
              </label>
              <input
                id="name.en"
                name="name.en"
                type="text"
                required
                className={`form-input ${errors['name.en'] ? 'border-red-500' : ''}`}
                placeholder="Standard Room"
                value={formData.name.en}
                onChange={handleChange}
              />
              {errors['name.en'] && (
                <p className="form-error">{errors['name.en']}</p>
              )}
            </div>

            <div>
              <label htmlFor="name.fr" className="form-label">
                {t('categories.name_fr')}
              </label>
              <input
                id="name.fr"
                name="name.fr"
                type="text"
                required
                className={`form-input ${errors['name.fr'] ? 'border-red-500' : ''}`}
                placeholder="Chambre Standard"
                value={formData.name.fr}
                onChange={handleChange}
              />
              {errors['name.fr'] && (
                <p className="form-error">{errors['name.fr']}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="description.en" className="form-label">
                {t('categories.description_en')}
              </label>
              <textarea
                id="description.en"
                name="description.en"
                rows={3}
                required
                className={`form-input ${errors['description.en'] ? 'border-red-500' : ''}`}
                placeholder="Comfortable standard room with basic amenities"
                value={formData.description.en}
                onChange={handleChange}
              />
              {errors['description.en'] && (
                <p className="form-error">{errors['description.en']}</p>
              )}
            </div>

            <div>
              <label htmlFor="description.fr" className="form-label">
                {t('categories.description_fr')}
              </label>
              <textarea
                id="description.fr"
                name="description.fr"
                rows={3}
                required
                className={`form-input ${errors['description.fr'] ? 'border-red-500' : ''}`}
                placeholder="Chambre standard confortable avec équipements de base"
                value={formData.description.fr}
                onChange={handleChange}
              />
              {errors['description.fr'] && (
                <p className="form-error">{errors['description.fr']}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="basePrice" className="form-label">
                {t('categories.base_price')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className={`form-input pl-8 ${errors.basePrice ? 'border-red-500' : ''}`}
                  placeholder="100.00"
                  value={formData.basePrice}
                  onChange={handleChange}
                />
              </div>
              {errors.basePrice && (
                <p className="form-error">{errors.basePrice}</p>
              )}
            </div>

            <div>
              <label htmlFor="hotel" className="form-label">
                {t('categories.hotel')}
              </label>
              <select
                id="hotel"
                name="hotel"
                required
                className={`form-input ${errors.hotel ? 'border-red-500' : ''}`}
                value={formData.hotel}
                onChange={handleChange}
              >
                <option value="">{t('categories.select_hotel')}</option>
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

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/categories')}
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

export default CategoryForm;