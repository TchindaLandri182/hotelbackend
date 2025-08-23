# Hotel Management System - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [User Management](#user-management)
4. [Hotel Management](#hotel-management)
5. [Room Management](#room-management)
6. [Client Management](#client-management)
7. [Booking Management](#booking-management)
8. [Invoice Management](#invoice-management)
9. [Food Service Management](#food-service-management)
10. [Reports and Analytics](#reports-and-analytics)
11. [Settings](#settings)
12. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Screen resolution: 1024x768 or higher (responsive design supports mobile devices)

### First Time Login
1. **Receive Invitation**: You'll receive an invitation email with a signup link
2. **Create Account**: Click the link and set your password
3. **Verify Email**: Enter the verification code sent to your email
4. **Complete Profile**: Add your name and profile picture
5. **Access System**: You're now ready to use the hotel management system

### Navigation
The system uses a sidebar navigation with the following main sections:
- **Dashboard**: Overview and quick stats
- **Hotels**: Manage hotel properties
- **Rooms**: Room inventory and status
- **Clients**: Customer information
- **Stays**: Booking and reservation management
- **Invoices**: Billing and payments
- **Food Items**: Restaurant menu management
- **Orders**: Food service orders
- **Users**: Staff and user management
- **Settings**: System preferences

### User Roles and Permissions
The system supports different user roles with specific permissions:

#### Admin
- Full system access
- Can manage all hotels, users, and settings
- Override all restrictions

#### Owner
- Manage owned hotels
- Create and manage hotel staff
- Access financial reports

#### Hotel Manager
- Manage assigned hotel operations
- Handle bookings and client services
- Manage room inventory

#### Restaurant Manager
- Manage food items and menus
- Process food orders
- Handle restaurant operations

#### Staff Roles
- Zone Agent, City Agent, Region Agent: Geographic management
- Various specialized roles with specific permissions

## Dashboard Overview

### Main Dashboard
The dashboard provides a comprehensive overview of your hotel operations:

#### Key Metrics Cards
- **Total Hotels**: Number of properties under management
- **Total Rooms**: Room inventory across all hotels
- **Active Stays**: Current guest bookings
- **Monthly Revenue**: Financial performance indicator
- **Occupancy Rate**: Room utilization percentage

#### Quick Actions
- Create new booking
- Add new client
- Generate invoice
- Add food item
- Invite new user

#### Recent Activities
- Latest bookings and check-ins
- Recent payments received
- New client registrations
- System notifications

#### Charts and Analytics
- Occupancy trends over time
- Revenue by hotel/month
- Popular room categories
- Food service performance

### Customization
- Switch between light and dark themes
- Change language (English/French)
- Adjust font size for accessibility
- Customize dashboard widgets

## User Management

### Viewing Users
1. Navigate to **Users** in the sidebar
2. View list of all system users
3. Use filters to find specific users:
   - Filter by role
   - Search by name or email
   - Filter by hotel assignment

### Creating New Users
1. Click **Create User** button
2. Fill in required information:
   - First Name and Last Name
   - Email address
   - Role selection
   - Hotel assignment (if applicable)
   - Profile picture (optional)
3. Set permissions based on role
4. Click **Save** to create user

### User Invitation System
1. Click **Invite User** instead of creating directly
2. Enter email and select role
3. System generates invitation link
4. Send link to new user
5. User completes registration process

### Managing User Permissions
1. Select user from list
2. Click **Edit** button
3. Navigate to **Permissions** tab
4. Check/uncheck specific permissions:
   - Hotel management permissions
   - Room management permissions
   - Client management permissions
   - Financial permissions
   - System administration permissions
5. Save changes

### User Status Management
- **Block/Unblock Users**: Temporarily disable access
- **Email Verification**: Resend verification emails
- **Password Reset**: Help users reset forgotten passwords

## Hotel Management

### Adding New Hotels
1. Navigate to **Hotels** section
2. Click **Create Hotel** button
3. Enter hotel information:
   - Hotel name
   - Complete address
   - Upload hotel logo
   - Select zone/location
   - Assign owners
4. Save hotel details

### Hotel Information Management
- **Basic Details**: Name, address, contact information
- **Visual Assets**: Logo, photos, branding materials
- **Location**: Zone, city, region assignment
- **Ownership**: Assign multiple owners if needed
- **Staff Assignment**: Link hotel managers and staff

### Hotel Operations
- **Room Categories**: Define different room types
- **Pricing Structure**: Set base prices for room categories
- **Amenities**: List available facilities and services
- **Policies**: Check-in/out times, cancellation policies

## Room Management

### Room Inventory
1. Navigate to **Rooms** section
2. View all rooms across hotels
3. Filter by:
   - Specific hotel
   - Room category
   - Availability status
   - Maintenance status

### Adding New Rooms
1. Click **Create Room** button
2. Select hotel
3. Choose room category
4. Enter unique room number
5. Set initial status
6. Save room details

### Room Status Management
The system tracks several room statuses:
- **Available**: Ready for booking
- **Occupied**: Currently has guests
- **Reserved**: Booked for future dates
- **Maintenance**: Out of service for repairs
- **Cleaning**: Being prepared for next guest

### Room Categories
- **Create Categories**: Define room types (Standard, Deluxe, Suite)
- **Set Base Prices**: Establish pricing for each category
- **Multilingual Names**: Support English and French descriptions
- **Amenity Lists**: Detail what's included in each category

### Maintenance Management
1. Mark rooms as "In Maintenance"
2. Add maintenance notes
3. Track repair progress
4. Return to service when complete

## Client Management

### Client Database
The system maintains comprehensive client profiles:

#### Personal Information
- Full name and contact details
- Date and place of birth
- Nationality and residence
- Profession and address
- Government ID information

#### Booking History
- Previous stays and preferences
- Payment history
- Special requests and notes
- Loyalty status

### Adding New Clients
1. Navigate to **Clients** section
2. Click **Create Client** button
3. Fill in all required fields:
   - Personal details
   - Contact information
   - Identification documents
   - Address information
4. Save client profile

### Client Search and Filtering
- **Quick Search**: Find by name or phone number
- **Advanced Filters**: Filter by nationality, city, profession
- **Booking Status**: See clients currently staying
- **Date Ranges**: Find clients by visit dates

### Client Communication
- **Contact History**: Track all interactions
- **Special Requests**: Note dietary restrictions, preferences
- **Feedback**: Record client satisfaction and complaints

## Booking Management

### Creating New Bookings
1. Navigate to **Stays** section
2. Click **Create Stay** button
3. Select client (or create new client)
4. Choose available room
5. Set check-in and check-out dates
6. Add special notes or requests
7. Confirm booking

### Booking Status Workflow
1. **Pending**: Initial booking request
2. **Confirmed**: Booking approved and guaranteed
3. **In Progress**: Guest has checked in
4. **Completed**: Guest has checked out
5. **Cancelled**: Booking was cancelled

### Check-in Process
1. Find booking in **Stays** list
2. Verify client identity
3. Update status to "In Progress"
4. Record actual check-in time
5. Provide room keys and information

### Check-out Process
1. Locate active stay
2. Process any outstanding charges
3. Update status to "Completed"
4. Record actual check-out time
5. Generate final invoice

### Room Availability
- **Real-time Status**: See current room availability
- **Booking Conflicts**: System prevents double-booking
- **Maintenance Scheduling**: Coordinate repairs with bookings

## Invoice Management

### Automatic Invoice Generation
- Invoices are automatically created when stays are completed
- Base charges calculated from room rates and stay duration
- Additional charges can be added manually

### Invoice Components
- **Room Charges**: Based on nightly rate and duration
- **Food Service**: Restaurant orders during stay
- **Additional Services**: Spa, laundry, etc.
- **Taxes**: Applicable local taxes
- **Discounts**: Applied promotions or loyalty benefits

### Payment Processing
1. **Payment Methods**: Cash, card, mobile money, bank transfer
2. **Partial Payments**: Track multiple payment installments
3. **Payment History**: Complete audit trail
4. **Outstanding Balances**: Monitor unpaid amounts

### Invoice Status
- **Pending**: Awaiting payment
- **Partially Paid**: Some payment received
- **Paid**: Fully settled
- **Overdue**: Past payment deadline

### Financial Reporting
- **Daily Sales**: Revenue by date
- **Payment Methods**: Breakdown by payment type
- **Outstanding Receivables**: Unpaid invoices
- **Hotel Performance**: Revenue by property

## Food Service Management

### Menu Management
1. Navigate to **Food Items** section
2. Create menu items with:
   - Multilingual names and descriptions
   - Pricing information
   - Category (Food or Beverage)
   - Availability status

### Order Processing
1. **Order Creation**: Link orders to guest stays
2. **Kitchen Communication**: Send orders to kitchen staff
3. **Status Tracking**: Monitor preparation progress
4. **Service Completion**: Mark orders as served

### Order Status Workflow
1. **Pending**: Order received, awaiting preparation
2. **Preparing**: Kitchen is working on order
3. **Served**: Order delivered to guest
4. **Cancelled**: Order was cancelled

### Integration with Billing
- Food orders automatically added to guest invoices
- Real-time pricing updates
- Automatic tax calculations
- Discount applications

## Reports and Analytics

### Occupancy Reports
- **Daily Occupancy**: Room utilization by date
- **Seasonal Trends**: Identify peak and low seasons
- **Room Category Performance**: Popular room types
- **Average Stay Duration**: Guest behavior patterns

### Financial Reports
- **Revenue Analysis**: Income by hotel, room type, period
- **Payment Reports**: Collection efficiency and methods
- **Outstanding Balances**: Accounts receivable aging
- **Profit Margins**: Revenue vs. costs analysis

### Guest Analytics
- **Guest Demographics**: Nationality, age, profession breakdown
- **Repeat Customers**: Loyalty and return rates
- **Booking Patterns**: Advance booking trends
- **Service Utilization**: Food service and amenities usage

### Operational Reports
- **Staff Performance**: User activity and productivity
- **Maintenance Tracking**: Room downtime and repair costs
- **Inventory Status**: Room availability and utilization
- **System Usage**: Login patterns and feature adoption

## Settings

### Profile Settings
- **Personal Information**: Update name, email, phone
- **Profile Picture**: Upload or change photo
- **Password Management**: Change login password
- **Contact Preferences**: Email notification settings

### Appearance Settings
- **Theme Selection**: Light, dark, or system theme
- **Language**: Switch between English and French
- **Font Size**: Adjust for accessibility needs
- **Layout Preferences**: Customize dashboard widgets

### System Preferences
- **Date Format**: Choose date display format
- **Currency**: Set default currency for pricing
- **Time Zone**: Configure local time zone
- **Notification Settings**: Control alert preferences

### Hotel-Specific Settings
- **Check-in/out Times**: Set standard times
- **Cancellation Policies**: Define booking rules
- **Tax Rates**: Configure applicable taxes
- **Service Charges**: Set automatic fees

## Troubleshooting

### Common Issues and Solutions

#### Login Problems
**Issue**: Cannot log in to the system
**Solutions**:
1. Verify email address and password
2. Check for caps lock or typing errors
3. Use "Forgot Password" if needed
4. Contact administrator if account is blocked
5. Clear browser cache and cookies

#### Booking Conflicts
**Issue**: Cannot create booking due to room conflict
**Solutions**:
1. Check room availability calendar
2. Verify dates are correct
3. Look for maintenance schedules
4. Consider alternative rooms
5. Contact system administrator

#### Payment Processing Issues
**Issue**: Cannot process payment or update invoice
**Solutions**:
1. Verify payment method details
2. Check invoice status and amounts
3. Ensure proper permissions
4. Try refreshing the page
5. Contact technical support

#### File Upload Problems
**Issue**: Cannot upload images or documents
**Solutions**:
1. Check file size (max 5MB)
2. Verify file format (JPG, PNG only)
3. Ensure stable internet connection
4. Try different browser
5. Contact IT support

### Performance Issues
**Issue**: System running slowly
**Solutions**:
1. Check internet connection speed
2. Close unnecessary browser tabs
3. Clear browser cache
4. Try different browser
5. Report to system administrator

### Data Synchronization
**Issue**: Information not updating across screens
**Solutions**:
1. Refresh the page
2. Log out and log back in
3. Check for system maintenance notices
4. Contact technical support
5. Try accessing from different device

### Mobile Access Issues
**Issue**: Problems using system on mobile device
**Solutions**:
1. Use supported mobile browsers
2. Ensure adequate screen size
3. Check mobile data connection
4. Try landscape orientation
5. Use desktop version for complex tasks

### Getting Help

#### In-System Help
- **User Guide**: Access this guide from the help menu
- **Tooltips**: Hover over elements for quick help
- **Context Help**: Click help icons for specific features

#### Contact Support
- **Email Support**: support@hotelmanagement.com
- **Phone Support**: Available during business hours
- **Live Chat**: Available for urgent issues
- **Training Sessions**: Schedule personalized training

#### Training Resources
- **Video Tutorials**: Step-by-step feature demonstrations
- **Webinars**: Regular training sessions
- **Documentation**: Comprehensive guides and manuals
- **Best Practices**: Industry-specific recommendations

### System Updates
- **Automatic Updates**: System updates automatically
- **Feature Announcements**: New features communicated via email
- **Maintenance Windows**: Scheduled during low-usage periods
- **Backup Procedures**: Data automatically backed up daily

### Security Best Practices
- **Strong Passwords**: Use complex, unique passwords
- **Regular Updates**: Keep browsers updated
- **Secure Networks**: Use trusted internet connections
- **Log Out**: Always log out when finished
- **Report Issues**: Report suspicious activity immediately

## Conclusion

This Hotel Management System is designed to streamline your hotel operations and improve guest satisfaction. The system grows with your business needs and provides the flexibility to manage single or multiple properties effectively.

For additional support or advanced training, please contact our support team. We're committed to helping you maximize the value of your hotel management system.

**Remember**: Regular use of the system and staying updated with new features will help you provide the best possible service to your guests while maintaining efficient operations.