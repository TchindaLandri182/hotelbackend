import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ClientForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    country: '',
    cityOfResidence: '',
    profession: '',
    adresse: '',
    tel: '',
    nIDC: '',
    dateOfDelivrance: '',
    placeOfDelivrance: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load client data if editing
    if (isEdit) {
      const loadClient = async () => {
        // Mock data - replace with API call
        setFormData({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-03-15',
          placeOfBirth: 'New York',
          nationality: 'American',
          country: 'USA',
          cityOfResidence: 'New York',
          profession: 'Engineer',
          adresse: '123 Main Street, New York, NY 10001',
          tel: '+1-555-0123',
          nIDC: 'US123456789',
          dateOfDelivrance: '2020-01-15',
          placeOfDelivrance: 'DMV Office New York'
        });
      };
      loadClient();
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.required_field');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.required_field');
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('errors.required_field');
    }
    
    if (!formData.placeOfBirth.trim()) {
      newErrors.placeOfBirth = t('errors.required_field');
    }
    
    if (!formData.nationality.trim()) {
      newErrors.nationality = t('errors.required_field');
    }
    
    if (!formData.country.trim()) {
      newErrors.country = t('errors.required_field');
    }
    
    if (!formData.cityOfResidence.trim()) {
      newErrors.cityOfResidence = t('errors.required_field');
    }
    
    if (!formData.profession.trim()) {
      newErrors.profession = t('errors.required_field');
    }
    
    if (!formData.adresse.trim()) {
      newErrors.adresse = t('errors.required_field');
    }
    
    if (!formData.nIDC.trim()) {
      newErrors.nIDC = t('errors.required_field');
    }
    
    if (!formData.dateOfDelivrance) {
      newErrors.dateOfDelivrance = t('errors.required_field');
    }
    
    if (!formData.placeOfDelivrance.trim()) {
      newErrors.placeOfDelivrance = t('errors.required_field');
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
      
      toast.success(isEdit ? t('clients.client_updated') : t('clients.client_created'));
      navigate('/clients');
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
          {isEdit ? t('clients.edit_client') : t('clients.create_client')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update client information' : 'Add a new client to your system'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="form-label">
                  {t('clients.first_name')}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder={t('clients.first_name')}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="form-error">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="form-label">
                  {t('clients.last_name')}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder={t('clients.last_name')}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="form-label">
                  {t('clients.date_of_birth')}
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                {errors.dateOfBirth && (
                  <p className="form-error">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label htmlFor="placeOfBirth" className="form-label">
                  {t('clients.place_of_birth')}
                </label>
                <input
                  id="placeOfBirth"
                  name="placeOfBirth"
                  type="text"
                  required
                  className={`form-input ${errors.placeOfBirth ? 'border-red-500' : ''}`}
                  placeholder={t('clients.place_of_birth')}
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                />
                {errors.placeOfBirth && (
                  <p className="form-error">{errors.placeOfBirth}</p>
                )}
              </div>

              <div>
                <label htmlFor="nationality" className="form-label">
                  {t('clients.nationality')}
                </label>
                <input
                  id="nationality"
                  name="nationality"
                  type="text"
                  required
                  className={`form-input ${errors.nationality ? 'border-red-500' : ''}`}
                  placeholder={t('clients.nationality')}
                  value={formData.nationality}
                  onChange={handleChange}
                />
                {errors.nationality && (
                  <p className="form-error">{errors.nationality}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="form-label">
                  {t('clients.country')}
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  className={`form-input ${errors.country ? 'border-red-500' : ''}`}
                  placeholder={t('clients.country')}
                  value={formData.country}
                  onChange={handleChange}
                />
                {errors.country && (
                  <p className="form-error">{errors.country}</p>
                )}
              </div>

              <div>
                <label htmlFor="cityOfResidence" className="form-label">
                  {t('clients.city_of_residence')}
                </label>
                <input
                  id="cityOfResidence"
                  name="cityOfResidence"
                  type="text"
                  required
                  className={`form-input ${errors.cityOfResidence ? 'border-red-500' : ''}`}
                  placeholder={t('clients.city_of_residence')}
                  value={formData.cityOfResidence}
                  onChange={handleChange}
                />
                {errors.cityOfResidence && (
                  <p className="form-error">{errors.cityOfResidence}</p>
                )}
              </div>

              <div>
                <label htmlFor="profession" className="form-label">
                  {t('clients.profession')}
                </label>
                <input
                  id="profession"
                  name="profession"
                  type="text"
                  required
                  className={`form-input ${errors.profession ? 'border-red-500' : ''}`}
                  placeholder={t('clients.profession')}
                  value={formData.profession}
                  onChange={handleChange}
                />
                {errors.profession && (
                  <p className="form-error">{errors.profession}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="adresse" className="form-label">
                  {t('clients.address')}
                </label>
                <textarea
                  id="adresse"
                  name="adresse"
                  rows={3}
                  required
                  className={`form-input ${errors.adresse ? 'border-red-500' : ''}`}
                  placeholder={t('clients.address')}
                  value={formData.adresse}
                  onChange={handleChange}
                />
                {errors.adresse && (
                  <p className="form-error">{errors.adresse}</p>
                )}
              </div>

              <div>
                <label htmlFor="tel" className="form-label">
                  {t('clients.telephone')} ({t('common.optional')})
                </label>
                <input
                  id="tel"
                  name="tel"
                  type="tel"
                  className="form-input"
                  placeholder="+1-555-0123"
                  value={formData.tel}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Identification */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nIDC" className="form-label">
                  {t('clients.id_number')}
                </label>
                <input
                  id="nIDC"
                  name="nIDC"
                  type="text"
                  required
                  className={`form-input ${errors.nIDC ? 'border-red-500' : ''}`}
                  placeholder="ID123456789"
                  value={formData.nIDC}
                  onChange={handleChange}
                />
                {errors.nIDC && (
                  <p className="form-error">{errors.nIDC}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateOfDelivrance" className="form-label">
                  {t('clients.date_of_delivery')}
                </label>
                <input
                  id="dateOfDelivrance"
                  name="dateOfDelivrance"
                  type="date"
                  required
                  className={`form-input ${errors.dateOfDelivrance ? 'border-red-500' : ''}`}
                  value={formData.dateOfDelivrance}
                  onChange={handleChange}
                />
                {errors.dateOfDelivrance && (
                  <p className="form-error">{errors.dateOfDelivrance}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="placeOfDelivrance" className="form-label">
                  {t('clients.place_of_delivery')}
                </label>
                <input
                  id="placeOfDelivrance"
                  name="placeOfDelivrance"
                  type="text"
                  required
                  className={`form-input ${errors.placeOfDelivrance ? 'border-red-500' : ''}`}
                  placeholder={t('clients.place_of_delivery')}
                  value={formData.placeOfDelivrance}
                  onChange={handleChange}
                />
                {errors.placeOfDelivrance && (
                  <p className="form-error">{errors.placeOfDelivrance}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/clients')}
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

export default ClientForm;