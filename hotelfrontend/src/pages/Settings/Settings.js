import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';
import {
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  LanguageIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const { theme, fontSize, changeTheme, changeFontSize } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    profileImage: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profileImage?.url || null);

  const tabs = [
    { id: 'profile', name: t('settings.profile_settings'), icon: UserCircleIcon },
    { id: 'appearance', name: t('settings.appearance'), icon: SunIcon }
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context
      updateUser({
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profileImage: imagePreview ? { url: imagePreview } : user.profileImage
      });
      
      toast.success(t('settings.settings_updated'));
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('errors.passwords_dont_match'));
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error(t('errors.password_too_short'));
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('settings.password_changed'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    toast.success(t('settings.settings_updated'));
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    toast.success(t('settings.settings_updated'));
  };

  const handleFontSizeChange = (newFontSize) => {
    changeFontSize(newFontSize);
    toast.success(t('settings.settings_updated'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                </div>
                <form onSubmit={handleProfileSubmit} className="card-body space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserCircleIcon className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </label>
                      <input
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.profile_image')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, JPEG or PNG. Max size 5MB.
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <label
                          htmlFor="profileImage"
                          className="btn-secondary text-sm cursor-pointer"
                        >
                          {t('settings.upload_image')}
                        </label>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setProfileData(prev => ({ ...prev, profileImage: null }));
                            }}
                            className="btn-secondary text-sm"
                          >
                            {t('settings.remove_image')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="form-label">
                        {t('auth.first_name')}
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="form-input"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="form-label">
                        {t('auth.last_name')}
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="form-input"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      {t('auth.email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled
                      className="form-input bg-gray-50 dark:bg-gray-700"
                      value={profileData.email}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed. Contact administrator if needed.
                    </p>
                  </div>

                  <div className="flex justify-end">
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
                        t('settings.update_profile')
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.change_password')}
                  </h2>
                </div>
                <form onSubmit={handlePasswordSubmit} className="card-body space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="form-label">
                      {t('settings.current_password')}
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        required
                        className="form-input pr-10"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="form-label">
                      {t('settings.new_password')}
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        required
                        className="form-input pr-10"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="form-label">
                      {t('settings.confirm_new_password')}
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        required
                        className="form-input pr-10"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
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
                        t('settings.change_password')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.theme')}
                  </h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        theme === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <SunIcon className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.light')}
                      </p>
                    </button>

                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <MoonIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.dark')}
                      </p>
                    </button>

                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        theme === 'system'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <ComputerDesktopIcon className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.system')}
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.language')}
                  </h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        i18n.language === 'en'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <LanguageIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.english')}
                      </p>
                    </button>

                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        i18n.language === 'fr'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <LanguageIcon className="w-8 h-8 mx-auto mb-2 text-red-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.french')}
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Font Size Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.font_size')}
                  </h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleFontSizeChange('small')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        fontSize === 'small'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">
                        Aa
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.small')}
                      </p>
                    </button>

                    <button
                      onClick={() => handleFontSizeChange('medium')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        fontSize === 'medium'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Aa
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.medium')}
                      </p>
                    </button>

                    <button
                      onClick={() => handleFontSizeChange('large')}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        fontSize === 'large'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
                        Aa
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('settings.large')}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;