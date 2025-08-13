import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ZoneForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: { en: '', fr: '' },
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Load cities
    const loadData = async () => {
      // Mock data - replace with API calls
      setCities([
        { _id: '1', name: { en: 'Los Angeles', fr: 'Los Angeles' } },
        { _id: '2', name: { en: 'San Francisco', fr: 'San Francisco' } },
        { _id: '3', name: { en: 'New York City', fr: 'New York' } },
        { _id: '4', name: { en: 'Paris', fr: 'Paris' } }
      ]);
    };

    loadData();

    // Load zone data if editing
    if (isEdit) {
      const loadZone = async () => {
        // Mock data - replace with API call
        setFormData({
          name: { en: 'Downtown', fr: 'Centre-ville' },
          city: '1'
        });
      };
      loadZone();
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
    
    if (!formData.city) {
      newErrors.city = t('errors.required_field');
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
      
      toast.success(isEdit ? t('zones.zone_updated') : t('zones.zone_created'));
      navigate('/zones');
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
          {isEdit ? t('zones.edit_zone') : t('zones.create_zone')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update zone information' : 'Add a new zone'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name.en" className="form-label">
                {t('zones.name_en')}
              </label>
              <input
                id="name.en"
                name="name.en"
                type="text"
                required
                className={`form-input ${errors['name.en'] ? 'border-red-500' : ''}`}
                placeholder="Downtown"
                value={formData.name.en}
                onChange={handleChange}
              />
              {errors['name.en'] && (
                <p className="form-error">{errors['name.en']}</p>
              )}
            </div>

            <div>
              <label htmlFor="name.fr" className="form-label">
                {t('zones.name_fr')}
              </label>
              <input
                id="name.fr"
                name="name.fr"
                type="text"
                required
                className={`form-input ${errors['name.fr'] ? 'border-red-500' : ''}`}
                placeholder="Centre-ville"
                value={formData.name.fr}
                onChange={handleChange}
              />
              {errors['name.fr'] && (
                <p className="form-error">{errors['name.fr']}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="city" className="form-label">
              {t('zones.city')}
            </label>
            <select
              id="city"
              name="city"
              required
              className={`form-input ${errors.city ? 'border-red-500' : ''}`}
              value={formData.city}
              onChange={handleChange}
            >
              <option value="">{t('zones.select_city')}</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name.en}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="form-error">{errors.city}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/zones')}
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

export default ZoneForm;