import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QuestionMarkCircleIcon,
  HomeIcon,
  BuildingOfficeIcon,
  KeyIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UsersIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const UserGuide = () => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const guideContent = [
    {
      id: 'getting-started',
      title: t('user_guide.getting_started'),
      icon: HomeIcon,
      content: [
        {
          title: 'System Requirements',
          description: 'Modern web browser (Chrome, Firefox, Safari, Edge), stable internet connection, screen resolution 1024x768 or higher.'
        },
        {
          title: 'First Time Login',
          description: 'Receive invitation email, create account, verify email, complete profile, and access the system.'
        },
        {
          title: 'Navigation',
          description: 'Use the sidebar navigation to access different sections. The system supports both light and dark themes.'
        }
      ]
    },
    {
      id: 'dashboard',
      title: t('user_guide.dashboard_guide'),
      icon: HomeIcon,
      content: [
        {
          title: 'Overview Cards',
          description: 'View key metrics including total hotels, rooms, clients, active stays, monthly revenue, and occupancy rates.'
        },
        {
          title: 'Quick Actions',
          description: 'Access frequently used functions like creating bookings, adding clients, generating invoices, and managing food items.'
        },
        {
          title: 'Recent Activities',
          description: 'Monitor latest system activities including bookings, payments, check-ins, and check-outs.'
        },
        {
          title: 'Today\'s Schedule',
          description: 'View upcoming check-ins and check-outs for better operational planning.'
        }
      ]
    },
    {
      id: 'hotel-management',
      title: t('user_guide.hotel_management'),
      icon: BuildingOfficeIcon,
      content: [
        {
          title: 'Adding Hotels',
          description: 'Create new hotel properties by providing name, address, logo, zone, and assigning owners.'
        },
        {
          title: 'Managing Information',
          description: 'Update hotel details, change ownership, modify location settings, and manage visual assets.'
        },
        {
          title: 'Hotel Operations',
          description: 'Configure room categories, set pricing structures, manage amenities, and define policies.'
        }
      ]
    },
    {
      id: 'room-management',
      title: t('user_guide.room_management'),
      icon: KeyIcon,
      content: [
        {
          title: 'Room Inventory',
          description: 'View all rooms across hotels, filter by hotel, category, availability status, and maintenance status.'
        },
        {
          title: 'Adding Rooms',
          description: 'Create new rooms by selecting hotel, choosing category, entering unique room number, and setting initial status.'
        },
        {
          title: 'Status Management',
          description: 'Track room statuses: Available, Occupied, Reserved, Maintenance, and Cleaning.'
        },
        {
          title: 'Categories',
          description: 'Define room types (Standard, Deluxe, Suite), set base prices, and manage multilingual descriptions.'
        }
      ]
    },
    {
      id: 'client-management',
      title: t('user_guide.client_management'),
      icon: UserGroupIcon,
      content: [
        {
          title: 'Client Database',
          description: 'Maintain comprehensive client profiles with personal information, booking history, and preferences.'
        },
        {
          title: 'Adding Clients',
          description: 'Register new clients with personal details, contact information, identification documents, and address.'
        },
        {
          title: 'Search and Filter',
          description: 'Find clients by name, phone number, nationality, city, profession, or booking status.'
        },
        {
          title: 'Communication',
          description: 'Track contact history, special requests, and client feedback for better service.'
        }
      ]
    },
    {
      id: 'booking-management',
      title: t('user_guide.booking_management'),
      icon: CalendarDaysIcon,
      content: [
        {
          title: 'Creating Bookings',
          description: 'Select client, choose available room, set check-in/out dates, and add special notes or requests.'
        },
        {
          title: 'Status Workflow',
          description: 'Manage booking statuses: Pending → Confirmed → In Progress → Completed or Cancelled.'
        },
        {
          title: 'Check-in Process',
          description: 'Verify client identity, update status to "In Progress", record actual check-in time, and provide room information.'
        },
        {
          title: 'Check-out Process',
          description: 'Process outstanding charges, update status to "Completed", record check-out time, and generate final invoice.'
        }
      ]
    },
    {
      id: 'billing-management',
      title: t('user_guide.billing_management'),
      icon: DocumentTextIcon,
      content: [
        {
          title: 'Invoice Generation',
          description: 'Automatically create invoices when stays are completed, including room charges and additional services.'
        },
        {
          title: 'Payment Processing',
          description: 'Accept various payment methods: cash, card, mobile money, and bank transfer.'
        },
        {
          title: 'Payment Tracking',
          description: 'Monitor partial payments, track payment history, and manage outstanding balances.'
        },
        {
          title: 'Financial Reports',
          description: 'Generate daily sales reports, payment method breakdowns, and outstanding receivables.'
        }
      ]
    },
    {
      id: 'user-management',
      title: t('user_guide.user_management'),
      icon: UsersIcon,
      content: [
        {
          title: 'User Roles',
          description: 'Manage different user roles: Admin, Owner, Hotel Manager, Restaurant Manager, and various agent roles.'
        },
        {
          title: 'Permissions',
          description: 'Assign granular permissions for CRUD operations on different system entities.'
        },
        {
          title: 'User Creation',
          description: 'Create users via invitation system, set roles, assign permissions, and manage hotel assignments.'
        },
        {
          title: 'Account Management',
          description: 'Block/unblock users, manage email verification, reset passwords, and update profiles.'
        }
      ]
    }
  ];

  const troubleshootingItems = [
    {
      issue: 'Cannot log in to the system',
      solutions: [
        'Verify email address and password',
        'Check for caps lock or typing errors',
        'Use "Forgot Password" if needed',
        'Contact administrator if account is blocked',
        'Clear browser cache and cookies'
      ]
    },
    {
      issue: 'Cannot create booking due to room conflict',
      solutions: [
        'Check room availability calendar',
        'Verify dates are correct',
        'Look for maintenance schedules',
        'Consider alternative rooms',
        'Contact system administrator'
      ]
    },
    {
      issue: 'System running slowly',
      solutions: [
        'Check internet connection speed',
        'Close unnecessary browser tabs',
        'Clear browser cache',
        'Try different browser',
        'Report to system administrator'
      ]
    },
    {
      issue: 'Cannot upload images or documents',
      solutions: [
        'Check file size (max 5MB)',
        'Verify file format (JPG, PNG only)',
        'Ensure stable internet connection',
        'Try different browser',
        'Contact IT support'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
          <QuestionMarkCircleIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('user_guide.welcome_title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('user_guide.welcome_description')}
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Navigation
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {guideContent.slice(0, 8).map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
              >
                <section.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {section.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Sections */}
      <div className="space-y-4">
        {guideContent.map((section) => (
          <div key={section.id} className="card">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full card-header flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <section.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              {expandedSections[section.id] ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections[section.id] && (
              <div className="card-body border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  {section.content.map((item, index) => (
                    <div key={index} className="border-l-4 border-primary-200 dark:border-primary-800 pl-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Troubleshooting Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('user_guide.troubleshooting')}
          </h2>
        </div>
        <div className="card-body">
          <div className="space-y-6">
            {troubleshootingItems.map((item, index) => (
              <div key={index} className="border-l-4 border-red-200 dark:border-red-800 pl-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Issue: {item.issue}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Solutions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {item.solutions.map((solution, sIndex) => (
                      <li key={sIndex} className="text-sm text-gray-600 dark:text-gray-400">
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('user_guide.contact_support')}
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Email Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                support@hotelmanagement.com
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Response within 24 hours
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Phone Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                +1 (555) 123-4567
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Available during business hours
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Before contacting support, try checking this user guide and the troubleshooting section. 
              Most common issues can be resolved quickly using the provided solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;