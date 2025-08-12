import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError(t('errors.required_field'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await verifyEmail(code);
      
      if (result.requiresProfileCompletion) {
        navigate('/complete-profile');
      } else if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || t('auth.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.verify_email')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="form-label">
              {t('auth.verification_code')}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              maxLength="6"
              required
              className="form-input text-center text-2xl tracking-widest"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            {error && (
              <p className="form-error">{error}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn-primary w-full flex justify-center py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
              ) : (
                t('auth.verify_email')
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {t('auth.resend_code')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;