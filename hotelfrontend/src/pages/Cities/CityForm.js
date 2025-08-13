import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CityForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: { en: '', fr: '' },
    region: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    // Load regions
    const loadData = async () => {
      // Mock data - replace with API calls
      setRegions([
        { _id: '1', name: { en: 'California', fr: 'Californie' } },
        { _id: '2', name: { en: 'New York', fr: 'New York' } },
        { _id: '3', name: { en: 'Île-de-France', fr: 'Île-de-France' } }
      ]);
    };

    loadData();

    // Load city data if editing
    if (isEdit) {
      const loadCity = async () => {
        // Mock data - replace with API call
        setFormData({
          name: { en: 'Los Angeles', fr: 'Los Angeles' },
          region: '1'
        });
      };
      loadCity();
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
    
    if (!formData.region) {
      newErrors.region = t('errors.required_field');
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
      
      toast.success(isEdit ? t('cities.city_updated') : t('cities.city_created'));
      navigate('/cities');
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
          {isEdit ? t('cities.edit_city') : t('cities.create_city')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update city information' : 'Add a new city'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name.en" className="form-label">
                {t('cities.name_en')}
              </label>
              <input
                id="name.en"
                name="name.en"
                type="text"
                required
                className={`form-input ${errors['name.en'] ? 'border-red-500' : ''}`}
                placeholder="Los Angeles"
                value={formData.name.en}
                onChange={handleChange}
              />
              {errors['name.en'] && (
                <p className="form-error">{errors['name.en']}</p>
              )}
            </div>

            <div>
              <label htmlFor="name.fr" className="form-label">
                {t('cities.name_fr')}
              </label>
              <input
                id="name.fr"
                name="name.fr"
                type="text"
                required
                className={`form-input ${errors['name.fr'] ? 'border-red-500' : ''}`}
                placeholder="Los Angeles"
                value={formData.name.fr}
                onChange={handleChange}
              />
              {errors['name.fr'] && (
                <p className="form-error">{errors['name.fr']}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="region" className="form-label">
              {t('cities.region')}
            </label>
            <select
              id="region"
              name="region"
              required
              className={`form-input ${errors.region ? 'border-red-500' : ''}`}
              value={formData.region}
              onChange={handleChange}
            >
              <option value="">{t('cities.select_region')}</option>
              {regions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.name.en}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="form-error">{errors.region}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/cities')}
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

export default CityForm;