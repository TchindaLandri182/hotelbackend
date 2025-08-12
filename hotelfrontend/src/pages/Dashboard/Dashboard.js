import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  BuildingOfficeIcon,
  KeyIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Static data - will be replaced with dynamic data later
  const stats = [
    {
      name: t('dashboard.total_hotels'),
      value: '12',
      change: '+2.1%',
      changeType: 'increase',
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500'
    },
    {
      name: t('dashboard.total_rooms'),
      value: '248',
      change: '+5.4%',
      changeType: 'increase',
      icon: KeyIcon,
      color: 'bg-green-500'
    },
    {
      name: t('dashboard.total_clients'),
      value: '1,429',
      change: '+12.3%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      name: t('dashboard.active_stays'),
      value: '89',
      change: '-2.1%',
      changeType: 'decrease',
      icon: CalendarDaysIcon,
      color: 'bg-yellow-500'
    },
    {
      name: t('dashboard.monthly_revenue'),
      value: '$45,231',
      change: '+8.7%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'bg-indigo-500'
    },
    {
      name: t('dashboard.occupancy_rate'),
      value: '78.2%',
      change: '+3.2%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-pink-500'
    }
  ];

  const quickActions = [
    {
      name: 'Create New Booking',
      description: 'Add a new guest reservation',
      href: '/stays/create',
      icon: CalendarDaysIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Add New Client',
      description: 'Register a new guest',
      href: '/clients/create',
      icon: UserGroupIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Generate Invoice',
      description: 'Create billing document',
      href: '/invoices/create',
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Add Food Item',
      description: 'Update restaurant menu',
      href: '/food-items/create',
      icon: PlusIcon,
      color: 'bg-yellow-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      message: 'New booking created for Room 101',
      time: '2 minutes ago',
      user: 'John Smith'
    },
    {
      id: 2,
      type: 'payment',
      message: 'Payment received for Invoice #INV-001',
      time: '15 minutes ago',
      user: 'Sarah Johnson'
    },
    {
      id: 3,
      type: 'checkin',
      message: 'Guest checked in to Room 205',
      time: '1 hour ago',
      user: 'Mike Wilson'
    },
    {
      id: 4,
      type: 'checkout',
      message: 'Guest checked out from Room 103',
      time: '2 hours ago',
      user: 'Emily Davis'
    },
    {
      id: 5,
      type: 'order',
      message: 'New food order for Room 301',
      time: '3 hours ago',
      user: 'David Brown'
    }
  ];

  const upcomingCheckouts = [
    {
      id: 1,
      room: '101',
      guest: 'Alice Johnson',
      checkoutTime: '11:00 AM',
      status: 'confirmed'
    },
    {
      id: 2,
      room: '205',
      guest: 'Bob Smith',
      checkoutTime: '12:00 PM',
      status: 'pending'
    },
    {
      id: 3,
      room: '308',
      guest: 'Carol Wilson',
      checkoutTime: '2:00 PM',
      status: 'confirmed'
    }
  ];

  const upcomingCheckins = [
    {
      id: 1,
      room: '102',
      guest: 'David Lee',
      checkinTime: '3:00 PM',
      status: 'confirmed'
    },
    {
      id: 2,
      room: '210',
      guest: 'Emma Davis',
      checkinTime: '4:00 PM',
      status: 'pending'
    },
    {
      id: 3,
      room: '315',
      guest: 'Frank Miller',
      checkinTime: '6:00 PM',
      status: 'confirmed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t('dashboard.welcome')}, {user?.firstName}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening at your hotels today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className={`ml-2 flex items-center text-sm ${
                      stat.changeType === 'increase' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('dashboard.quick_actions')}
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {action.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('dashboard.recent_activities')}
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{activity.user}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Schedule
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              {/* Checkouts */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Upcoming Checkouts
                </h3>
                <div className="space-y-2">
                  {upcomingCheckouts.map((checkout) => (
                    <div key={checkout.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-red-600 dark:text-red-400">
                            {checkout.room}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {checkout.guest}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {checkout.checkoutTime}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        checkout.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {checkout.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkins */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Upcoming Checkins
                </h3>
                <div className="space-y-2">
                  {upcomingCheckins.map((checkin) => (
                    <div key={checkin.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            {checkin.room}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {checkin.guest}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {checkin.checkinTime}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        checkin.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {checkin.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Placeholder for future dynamic charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trends
            </h2>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart will be implemented with dynamic data
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Occupancy Rate
            </h2>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart will be implemented with dynamic data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;