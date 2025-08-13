import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BuildingOfficeIcon,
  KeyIcon,
  TagIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CakeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UsersIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: HomeIcon,
      permission: null
    },
    {
      name: t('navigation.hotels'),
      href: '/hotels',
      icon: BuildingOfficeIcon,
      permission: 4002 // readHotel
    },
    {
      name: t('navigation.rooms'),
      href: '/rooms',
      icon: KeyIcon,
      permission: 8002 // readRoom
    },
    {
      name: t('navigation.categories'),
      href: '/categories',
      icon: TagIcon,
      permission: 1002 // readCategoryRoom
    },
    {
      name: t('navigation.clients'),
      href: '/clients',
      icon: UserGroupIcon,
      permission: 2002 // readClient
    },
    {
      name: t('navigation.stays'),
      href: '/stays',
      icon: CalendarDaysIcon,
      permission: 9002 // readStay
    },
    {
      name: t('navigation.invoices'),
      href: '/invoices',
      icon: DocumentTextIcon,
      permission: 5002 // readInvoice
    },
    {
      name: t('navigation.food_items'),
      href: '/food-items',
      icon: CakeIcon,
      permission: 3002 // readFoodItem
    },
    {
      name: t('navigation.order_items'),
      href: '/order-items',
      icon: ShoppingCartIcon,
      permission: 6002 // readOrderItem
    },
    {
      name: t('navigation.price_periods'),
      href: '/price-periods',
      icon: CurrencyDollarIcon,
      permission: 7002 // readPricePeriod
    },
    {
      name: t('navigation.zones'),
      href: '/zones',
      icon: MapPinIcon,
      permission: 1402 // readLocation
    },
    {
      name: t('navigation.regions'),
      href: '/regions',
      icon: MapPinIcon,
      permission: 1402 // readLocation
    },
    {
      name: t('navigation.cities'),
      href: '/cities',
      icon: MapPinIcon,
      permission: 1402 // readLocation
    },
    {
      name: t('navigation.countries'),
      href: '/countries',
      icon: MapPinIcon,
      permission: 1402 // readLocation
    },
    {
      name: t('navigation.users'),
      href: '/users',
      icon: UsersIcon,
      permission: 1102 // readUser
    },
    {
      name: t('navigation.permissions'),
      href: '/permissions',
      icon: ShieldCheckIcon,
      permission: 1701 // managePermissions
    },
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: Cog6ToothIcon,
      permission: null
    },
    {
      name: t('navigation.user_guide'),
      href: '/user-guide',
      icon: QuestionMarkCircleIcon,
      permission: null
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Hotel MS
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;