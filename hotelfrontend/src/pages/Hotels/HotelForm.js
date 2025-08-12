import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const HotelForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    logo: '',
    owners: [],
    zone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [zones, setZones] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    // Load zones and owners
    const loadData = async () => {
      // Mock data - replace with API calls
      setZones([
        { _id: '1', name: { en: 'Downtown', fr: 'Centre-ville' } },
        { _id: '2', name: { en: 'Beachfront', fr: 'Front de mer' } },
        { _id: '3', name: { en: 'Mountain View', fr: 'Vue sur la montagne' } }
      ]);
      
      setOwners([
        { _id: '1', firstName: 'John', lastName: 'Doe' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith' },
        { _id: '3', firstName: 'Mike', lastName: 'Johnson' }
      ]);
    };

    loadData();

    // Load hotel data if editing
    if (isEdit) {
      const loadHotel = async () => {
        // Mock data - replace with API call
        setFormData({
          name: 'Grand Palace Hotel',
          address: '123 Main Street, Downtown',
          logo: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
          owners: ['1', '2'],
          zone: '1'
        });
      };
      loadHotel();
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

  const handleOwnersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      owners: selectedOptions
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('errors.required_field');
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('errors.required_field');
    }
    
    if (!formData.zone) {
      newErrors.zone = t('errors.required_field');
    }
    
    if (formData.owners.length === 0) {
      newErrors.owners = t('errors.required_field');
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
      
      toast.success(isEdit ? t('hotels.hotel_updated') : t('hotels.hotel_created'));
      navigate('/hotels');
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
          {isEdit ? t('hotels.edit_hotel') : t('hotels.create_hotel')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update hotel information' : 'Add a new hotel to your system'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">
                {t('hotels.hotel_name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder={t('hotels.hotel_name')}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="form-error">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="zone" className="form-label">
                {t('hotels.zone')}
              </label>
              <select
                id="zone"
                name="zone"
                required
                className={`form-input ${errors.zone ? 'border-red-500' : ''}`}
                value={formData.zone}
                onChange={handleChange}
              >
                <option value="">{t('hotels.select_zone')}</option>
                {zones.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.name.en}
                  </option>
                ))}
              </select>
              {errors.zone && (
                <p className="form-error">{errors.zone}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="form-label">
              {t('hotels.hotel_address')}
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              className={`form-input ${errors.address ? 'border-red-500' : ''}`}
              placeholder={t('hotels.hotel_address')}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="form-error">{errors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="logo" className="form-label">
              {t('hotels.hotel_logo')} ({t('common.optional')})
            </label>
            <input
              id="logo"
              name="logo"
              type="url"
              className="form-input"
              placeholder="https://example.com/logo.jpg"
              value={formData.logo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="owners" className="form-label">
              {t('hotels.owners')}
            </label>
            <select
              id="owners"
              name="owners"
              multiple
              required
              className={`form-input ${errors.owners ? 'border-red-500' : ''}`}
              value={formData.owners}
              onChange={handleOwnersChange}
              size={4}
            >
              {owners.map((owner) => (
                <option key={owner._id} value={owner._id}>
                  {owner.firstName} {owner.lastName}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hold Ctrl/Cmd to select multiple owners
            </p>
            {errors.owners && (
              <p className="form-error">{errors.owners}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/hotels')}
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

export default HotelForm;