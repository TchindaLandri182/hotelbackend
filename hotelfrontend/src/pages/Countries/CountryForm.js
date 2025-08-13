import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CountryForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: { en: '', fr: '' },
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load country data if editing
    if (isEdit) {
      const loadCountry = async () => {
        // Mock data - replace with API call
        setFormData({
          name: { en: 'United States', fr: 'États-Unis' },
          code: 'US'
        });
      };
      loadCountry();
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
    
    if (!formData.code.trim()) {
      newErrors.code = t('errors.required_field');
    } else if (formData.code.length !== 2) {
      newErrors.code = 'Country code must be 2 characters';
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
      
      toast.success(isEdit ? t('countries.country_updated') : t('countries.country_created'));
      navigate('/countries');
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
          {isEdit ? t('countries.edit_country') : t('countries.create_country')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update country information' : 'Add a new country'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name.en" className="form-label">
                {t('countries.name_en')}
              </label>
              <input
                id="name.en"
                name="name.en"
                type="text"
                required
                className={`form-input ${errors['name.en'] ? 'border-red-500' : ''}`}
                placeholder="United States"
                value={formData.name.en}
                onChange={handleChange}
              />
              {errors['name.en'] && (
                <p className="form-error">{errors['name.en']}</p>
              )}
            </div>

            <div>
              <label htmlFor="name.fr" className="form-label">
                {t('countries.name_fr')}
              </label>
              <input
                id="name.fr"
                name="name.fr"
                type="text"
                required
                className={`form-input ${errors['name.fr'] ? 'border-red-500' : ''}`}
                placeholder="États-Unis"
                value={formData.name.fr}
                onChange={handleChange}
              />
              {errors['name.fr'] && (
                <p className="form-error">{errors['name.fr']}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="code" className="form-label">
              {t('countries.country_code')}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              maxLength="2"
              required
              className={`form-input ${errors.code ? 'border-red-500' : ''}`}
              placeholder="US"
              value={formData.code}
              onChange={handleChange}
              style={{ textTransform: 'uppercase' }}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              2-letter ISO country code (e.g., US, FR, DE)
            </p>
            {errors.code && (
              <p className="form-error">{errors.code}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/countries')}
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

export default CountryForm;