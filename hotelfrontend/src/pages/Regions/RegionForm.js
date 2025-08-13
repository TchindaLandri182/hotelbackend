import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RegionForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: { en: '', fr: '' },
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Load countries
    const loadData = async () => {
      // Mock data - replace with API calls
      setCountries([
        { _id: '1', name: { en: 'United States', fr: 'États-Unis' }, code: 'US' },
        { _id: '2', name: { en: 'France', fr: 'France' }, code: 'FR' },
        { _id: '3', name: { en: 'Germany', fr: 'Allemagne' }, code: 'DE' }
      ]);
    };

    loadData();

    // Load region data if editing
    if (isEdit) {
      const loadRegion = async () => {
        // Mock data - replace with API call
        setFormData({
          name: { en: 'California', fr: 'Californie' },
          country: '1'
        });
      };
      loadRegion();
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
    
    if (!formData.country) {
      newErrors.country = t('errors.required_field');
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
      
      toast.success(isEdit ? t('regions.region_updated') : t('regions.region_created'));
      navigate('/regions');
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
          {isEdit ? t('regions.edit_region') : t('regions.create_region')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update region information' : 'Add a new region'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name.en" className="form-label">
                {t('regions.name_en')}
              </label>
              <input
                id="name.en"
                name="name.en"
                type="text"
                required
                className={`form-input ${errors['name.en'] ? 'border-red-500' : ''}`}
                placeholder="California"
                value={formData.name.en}
                onChange={handleChange}
              />
              {errors['name.en'] && (
                <p className="form-error">{errors['name.en']}</p>
              )}
            </div>

            <div>
              <label htmlFor="name.fr" className="form-label">
                {t('regions.name_fr')}
              </label>
              <input
                id="name.fr"
                name="name.fr"
                type="text"
                required
                className={`form-input ${errors['name.fr'] ? 'border-red-500' : ''}`}
                placeholder="Californie"
                value={formData.name.fr}
                onChange={handleChange}
              />
              {errors['name.fr'] && (
                <p className="form-error">{errors['name.fr']}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="form-label">
              {t('regions.country')}
            </label>
            <select
              id="country"
              name="country"
              required
              className={`form-input ${errors.country ? 'border-red-500' : ''}`}
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">{t('regions.select_country')}</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name.en} ({country.code})
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="form-error">{errors.country}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/regions')}
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

export default RegionForm;