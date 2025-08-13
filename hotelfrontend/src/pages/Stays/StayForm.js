import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const StayForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    client: '',
    room: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Load clients and rooms
    const loadData = async () => {
      // Mock data - replace with API calls
      setClients([
        { _id: '1', firstName: 'John', lastName: 'Doe' },
        { _id: '2', firstName: 'Marie', lastName: 'Dubois' },
        { _id: '3', firstName: 'Hans', lastName: 'Mueller' }
      ]);
      
      setRooms([
        { _id: '1', roomNumber: '101', hotel: { name: 'Grand Palace Hotel' } },
        { _id: '2', roomNumber: '102', hotel: { name: 'Grand Palace Hotel' } },
        { _id: '3', roomNumber: '201', hotel: { name: 'Seaside Resort' } }
      ]);
    };

    loadData();

    // Load stay data if editing
    if (isEdit) {
      const loadStay = async () => {
        // Mock data - replace with API call
        setFormData({
          client: '1',
          room: '1',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          status: 'confirmed',
          notes: 'Late check-in requested'
        });
      };
      loadStay();
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
    
    if (!formData.client) {
      newErrors.client = t('errors.required_field');
    }
    
    if (!formData.room) {
      newErrors.room = t('errors.required_field');
    }
    
    if (!formData.startDate) {
      newErrors.startDate = t('errors.required_field');
    }
    
    if (!formData.endDate) {
      newErrors.endDate = t('errors.required_field');
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
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
      
      toast.success(isEdit ? t('stays.stay_updated') : t('stays.stay_created'));
      navigate('/stays');
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
          {isEdit ? t('stays.edit_stay') : t('stays.create_stay')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update booking information' : 'Create a new guest booking'}
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="client" className="form-label">
                {t('stays.client')}
              </label>
              <select
                id="client"
                name="client"
                required
                className={`form-input ${errors.client ? 'border-red-500' : ''}`}
                value={formData.client}
                onChange={handleChange}
              >
                <option value="">{t('stays.select_client')}</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
              {errors.client && (
                <p className="form-error">{errors.client}</p>
              )}
            </div>

            <div>
              <label htmlFor="room" className="form-label">
                {t('stays.room')}
              </label>
              <select
                id="room"
                name="room"
                required
                className={`form-input ${errors.room ? 'border-red-500' : ''}`}
                value={formData.room}
                onChange={handleChange}
              >
                <option value="">{t('stays.select_room')}</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber} - {room.hotel.name}
                  </option>
                ))}
              </select>
              {errors.room && (
                <p className="form-error">{errors.room}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="form-label">
                {t('stays.start_date')}
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                className={`form-input ${errors.startDate ? 'border-red-500' : ''}`}
                value={formData.startDate}
                onChange={handleChange}
              />
              {errors.startDate && (
                <p className="form-error">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="form-label">
                {t('stays.end_date')}
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                className={`form-input ${errors.endDate ? 'border-red-500' : ''}`}
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && (
                <p className="form-error">{errors.endDate}</p>
              )}
            </div>
          </div>

          {isEdit && (
            <div>
              <label htmlFor="status" className="form-label">
                {t('common.status')}
              </label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">{t('stays.pending')}</option>
                <option value="confirmed">{t('stays.confirmed')}</option>
                <option value="in-progress">{t('stays.in_progress')}</option>
                <option value="completed">{t('stays.completed')}</option>
                <option value="cancelled">{t('stays.cancelled')}</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="form-label">
              {t('stays.notes')} ({t('common.optional')})
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="form-input"
              placeholder="Special requests or notes..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/stays')}
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

export default StayForm;