# Hotel Management System - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [File Structure](#file-structure)
7. [Environment Setup](#environment-setup)
8. [Deployment](#deployment)
9. [Security](#security)
10. [Performance](#performance)

## System Overview

The Hotel Management System is a comprehensive web application designed to manage hotel operations including room management, client bookings, invoicing, food services, and user management. The system follows a microservices architecture with a Node.js backend and React frontend.

### Key Features
- Multi-hotel management
- Room inventory and categorization
- Client management and booking system
- Invoice generation and payment tracking
- Food item and order management
- User management with role-based permissions
- Real-time notifications via Socket.IO
- Multi-language support (English/French)
- Dark/Light theme support

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - React Router  │    │ - Express.js    │    │ - Mongoose ODM  │
│ - Context API   │    │ - Socket.IO     │    │ - GridFS        │
│ - Tailwind CSS  │    │ - JWT Auth      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   File Storage  │
                    │   (Cloudinary)  │
                    └─────────────────┘
```

### Component Architecture
- **Presentation Layer**: React components with hooks and context
- **Business Logic Layer**: Express.js controllers and services
- **Data Access Layer**: Mongoose models and database operations
- **External Services**: Cloudinary for file storage, Socket.IO for real-time communication

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Cloudinary storage
- **Real-time Communication**: Socket.IO
- **Email Service**: Nodemailer
- **Validation**: Validator.js
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **State Management**: Context API with hooks
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Internationalization**: react-i18next
- **Notifications**: React Toastify
- **Date Handling**: React DatePicker
- **Animations**: AOS (Animate On Scroll)

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **Build Tool**: Create React App (Frontend), Node.js (Backend)

## Database Schema

### Core Models

#### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum),
  permissions: [Number],
  location: Point (GeoJSON),
  emailCode: String,
  emailExpireIn: Date,
  isEmailVerified: Boolean,
  isSignUpComplete: Boolean,
  blocked: Boolean,
  profileImage: { public_id, url },
  invitedBy: ObjectId (User),
  hotel: ObjectId (Hotel),
  deleted: Boolean,
  createdBy: ObjectId (User),
  timestamps: true
}
```

#### Hotel Model
```javascript
{
  name: String,
  address: String,
  logo: String,
  owners: [ObjectId (User)],
  zone: ObjectId (Zone),
  deleted: Boolean,
  createdBy: ObjectId (User),
  timestamps: true
}
```

#### Room Model
```javascript
{
  hotel: ObjectId (Hotel),
  category: ObjectId (CategoryRoom),
  roomNumber: String,
  deleted: Boolean,
  isInMaintenance: Boolean,
  createdBy: ObjectId (User),
  timestamps: true
}
```

#### Stay Model
```javascript
{
  client: ObjectId (Client),
  room: ObjectId (Room),
  startDate: Date,
  endDate: Date,
  actualCheckIn: Date,
  actualCheckOut: Date,
  status: String (enum),
  tel: String,
  zoneOfResidence: String,
  zoneOfDestination: String,
  notes: String,
  deleted: Boolean,
  createdBy: ObjectId (User),
  timestamps: true
}
```

### Relationships
- One-to-Many: Hotel → Rooms, Hotel → Users
- Many-to-Many: Hotel → Owners (Users)
- One-to-One: Stay → Client, Stay → Room
- Hierarchical: Country → Region → City → Zone

## Authentication & Authorization

### Authentication Flow
1. **Login**: User provides email/password
2. **Verification**: System validates credentials
3. **Token Generation**: JWT token created with user info
4. **Token Storage**: Token stored in HTTP-only cookies
5. **Request Authorization**: Token validated on each request

### Authorization Levels
1. **Role-Based**: Admin, Owner, Manager, Agent roles
2. **Permission-Based**: Granular permissions for CRUD operations
3. **Hierarchy-Based**: Higher roles can manage lower roles
4. **Resource-Based**: Users can only access their assigned resources

### Permission System
```javascript
const permissions = {
  // Hotel Management
  createHotel: 4001,
  readHotel: 4002,
  updateHotel: 4003,
  deleteHotel: 4004,
  
  // Room Management
  createRoom: 8001,
  readRoom: 8002,
  updateRoom: 8003,
  deleteRoom: 8004,
  
  // User Management
  createUser: 1101,
  readUser: 1102,
  updateUser: 1103,
  deleteUser: 1104
};
```

## File Structure

### Backend Structure
```
server/
├── index.js                 # Application entry point
├── socket.js               # Socket.IO configuration
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
├── configs/
│   └── cloudinary.js       # Cloudinary configuration
├── constants/
│   ├── permissions.constants.js
│   ├── roleList.constants.js
│   └── roleHierarchy.js
├── controllers/            # Business logic
│   ├── userController.js
│   ├── hotelController.js
│   ├── roomController.js
│   └── ...
├── middlewares/           # Custom middleware
│   ├── authentication.js
│   ├── permissionMiddleware.js
│   └── multerMiddleware.js
├── models/               # Database models
│   ├── User.model.js
│   ├── Hotel.model.js
│   └── ...
├── routes/              # API routes
│   ├── userRoute.js
│   ├── hotelRoute.js
│   └── ...
└── services/           # External services
    ├── emailService.js
    ├── cloudinary.js
    └── logService.js
```

### Frontend Structure
```
hotelfrontend/
├── public/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout/
│   │   ├── Auth/
│   │   └── Common/
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── pages/           # Page components
│   │   ├── Dashboard/
│   │   ├── Hotels/
│   │   ├── Rooms/
│   │   └── ...
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── hotelService.js
│   │   └── ...
│   ├── i18n/           # Internationalization
│   │   ├── index.js
│   │   └── locales/
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom hooks
│   └── constants/      # Application constants
├── package.json
└── tailwind.config.js
```

## Environment Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables:
```env
PORT=5000
MONGOOSE_CONNECTION_URL=mongodb://localhost:27017/hotelmanagement
ACCESS_TOKEN_SECRET=your_access_token_secret
INVITE_TOKEN_SECRET=your_invite_token_secret
CLIENT_URL=http://localhost:3000
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory: `cd hotelfrontend`
2. Install dependencies: `npm install`
3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```
4. Start the development server: `npm start`

## Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGOOSE_CONNECTION_URL=mongodb+srv://username:password@cluster.mongodb.net/hotelmanagement
ACCESS_TOKEN_SECRET=strong_production_secret
CLIENT_URL=https://yourdomain.com
```

### Deployment Steps
1. **Backend Deployment**:
   - Build the application
   - Set production environment variables
   - Deploy to cloud platform (Heroku, AWS, etc.)
   - Configure MongoDB Atlas connection

2. **Frontend Deployment**:
   - Build the React application: `npm run build`
   - Deploy to static hosting (Netlify, Vercel, etc.)
   - Configure environment variables

3. **Database Setup**:
   - Set up MongoDB Atlas cluster
   - Configure network access and security
   - Create database indexes for performance

## Security

### Security Measures Implemented
1. **Password Security**: bcrypt hashing with salt rounds
2. **JWT Security**: Secure token generation and validation
3. **Input Validation**: Server-side validation for all inputs
4. **Rate Limiting**: Login attempt limiting
5. **CORS Configuration**: Proper cross-origin resource sharing
6. **File Upload Security**: File type and size validation
7. **SQL Injection Prevention**: Mongoose ODM protection
8. **XSS Prevention**: Input sanitization

### Security Best Practices
- Use HTTPS in production
- Implement proper session management
- Regular security audits
- Keep dependencies updated
- Implement proper logging and monitoring

## Performance

### Optimization Strategies
1. **Database Optimization**:
   - Proper indexing on frequently queried fields
   - Pagination for large datasets
   - Aggregation pipelines for complex queries

2. **API Optimization**:
   - Response caching where appropriate
   - Compression middleware
   - Efficient query patterns

3. **Frontend Optimization**:
   - Code splitting and lazy loading
   - Image optimization
   - Bundle size optimization
   - Memoization of expensive operations

### Monitoring
- Application performance monitoring
- Database query performance
- Error tracking and logging
- User experience metrics

## Troubleshooting

### Common Issues
1. **Database Connection**: Check MongoDB connection string and network access
2. **Authentication Errors**: Verify JWT secret and token expiration
3. **File Upload Issues**: Check Cloudinary configuration and file size limits
4. **CORS Errors**: Verify frontend URL in CORS configuration

### Debugging
- Use console.log for development debugging
- Implement proper error logging in production
- Use MongoDB Compass for database inspection
- Browser developer tools for frontend debugging

## Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with proper testing
3. Submit pull request with detailed description
4. Code review and approval process
5. Merge to main branch

### Code Standards
- Follow ESLint configuration
- Use consistent naming conventions
- Write comprehensive comments
- Implement proper error handling
- Write unit tests for critical functions