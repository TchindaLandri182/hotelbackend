# Hotel Management System - API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Hotel Management](#hotel-management)
4. [Room Management](#room-management)
5. [Client Management](#client-management)
6. [Stay Management](#stay-management)
7. [Invoice Management](#invoice-management)
8. [Food Item Management](#food-item-management)
9. [Order Item Management](#order-item-management)
10. [Zone Management](#zone-management)
11. [Category Management](#category-management)
12. [Price Period Management](#price-period-management)
13. [Error Handling](#error-handling)

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All API endpoints (except login and signup) require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Login
**POST** `/user/signin`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "2024-01-15T10:30:00.000Z",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "admin",
    "permissions": [1001, 1002, 1003]
  }
}
```

### Signup via Invitation
**POST** `/user/signup/invite`

Register a new user via invitation token.

**Request Body:**
```json
{
  "token": "invitation_token_here",
  "password": "newpassword123"
}
```

### Email Verification
**POST** `/user/verify-email`

Verify email with verification code.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "123456"
}
```

### Complete Profile
**POST** `/user/complete-profile`

Complete user profile after email verification.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
```
firstName: "John"
lastName: "Doe"
profileImage: <file>
```

## User Management

### Get Users
**GET** `/user`

Retrieve paginated list of users with optional filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `role` (string): Filter by role
- `search` (string): Search in name/email
- `hotel` (string): Filter by hotel ID

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 25,
  "page": 1,
  "pages": 3,
  "users": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "admin",
      "isEmailVerified": true,
      "isSignUpComplete": true,
      "blocked": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User by ID
**GET** `/user/:id`

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin",
    "permissions": [1001, 1002, 1003],
    "hotel": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Grand Hotel"
    }
  }
}
```

### Create User
**POST** `/user/signup`

**Headers:** `Content-Type: multipart/form-data`

**Request Body (Form Data):**
```
firstName: "Jane"
lastName: "Smith"
email: "jane@example.com"
password: "password123"
role: "hotelManager"
hotel: "60f7b3b3b3b3b3b3b3b3b3b4"
profileImage: <file>
```

### Update User
**PUT** `/user/:id`

**Headers:** `Content-Type: multipart/form-data`

**Request Body (Form Data):**
```
firstName: "Jane Updated"
lastName: "Smith Updated"
role: "owner"
permissions: [1001, 1002]
profileImage: <file>
```

### Delete User
**DELETE** `/user/:id`

**Response:**
```json
{
  "messageCode": "MSG_0060",
  "message": "User deleted"
}
```

### Generate Invite Link
**POST** `/user/invite`

**Request Body:**
```json
{
  "role": "hotelManager",
  "email": "newuser@example.com"
}
```

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "inviteLink": "https://yourapp.com/signup/invite?token=...",
  "message": "Invitation link generated"
}
```

## Hotel Management

### Get Hotels
**GET** `/hotel`

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search in name/address
- `zone`: Filter by zone ID
- `owner`: Filter by owner ID
- `sort`: Sort field (default: 'name')
- `order`: Sort order ('asc'/'desc')

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 10,
  "page": 1,
  "pages": 1,
  "hotels": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Grand Hotel",
      "address": "123 Main Street",
      "logo": "https://cloudinary.com/image.jpg",
      "owners": [
        {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "firstName": "John",
          "lastName": "Doe"
        }
      ],
      "zone": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
        "name": {
          "en": "Downtown",
          "fr": "Centre-ville"
        }
      }
    }
  ]
}
```

### Get Hotel by ID
**GET** `/hotel/:id`

### Create Hotel
**POST** `/hotel`

**Request Body:**
```json
{
  "name": "New Hotel",
  "address": "456 Oak Avenue",
  "logo": "https://cloudinary.com/logo.jpg",
  "owners": ["60f7b3b3b3b3b3b3b3b3b3b3"],
  "zone": "60f7b3b3b3b3b3b3b3b3b3b5"
}
```

### Update Hotel
**PUT** `/hotel/:id`

### Delete Hotel
**DELETE** `/hotel/:id`

## Room Management

### Get Rooms
**GET** `/room`

**Query Parameters:**
- `page`, `limit`: Pagination
- `hotel`: Filter by hotel ID
- `category`: Filter by category ID
- `isInMaintenance`: Filter by maintenance status
- `available`: Filter available rooms only
- `sort`: Sort field
- `order`: Sort order

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 50,
  "page": 1,
  "pages": 5,
  "rooms": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
      "roomNumber": "101",
      "hotel": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Grand Hotel"
      },
      "category": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b7",
        "name": {
          "en": "Standard Room",
          "fr": "Chambre Standard"
        }
      },
      "isInMaintenance": false
    }
  ]
}
```

### Get Room by ID
**GET** `/room/:id`

### Create Room
**POST** `/room`

**Request Body:**
```json
{
  "hotel": "60f7b3b3b3b3b3b3b3b3b3b4",
  "category": "60f7b3b3b3b3b3b3b3b3b3b7",
  "roomNumber": "102"
}
```

### Update Room
**PUT** `/room/:id`

**Request Body:**
```json
{
  "roomNumber": "102A",
  "category": "60f7b3b3b3b3b3b3b3b3b3b8",
  "isInMaintenance": true
}
```

### Delete Room
**DELETE** `/room/:id`

### Get All Rooms (Simple List)
**GET** `/room/all/list`

Returns a simple list of all rooms without pagination.

## Client Management

### Get Clients
**GET** `/client`

**Query Parameters:**
- `page`, `limit`: Pagination
- `hotel`: Filter by hotel ID
- `search`: Search in name/phone
- `status`: Filter by stay status
- `startDate`, `endDate`: Date range filter

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 100,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b8",
      "firstName": "Alice",
      "lastName": "Johnson",
      "dateOfBirth": "1990-05-15T00:00:00.000Z",
      "nationality": "American",
      "tel": "+1234567890",
      "nIDC": "ID123456789",
      "totalSpent": 500,
      "actualStay": []
    }
  ]
}
```

### Get Client by ID
**GET** `/client/:id`

### Create Client
**POST** `/client`

**Request Body:**
```json
{
  "firstName": "Bob",
  "lastName": "Wilson",
  "dateOfBirth": "1985-03-20",
  "placeOfBirth": "New York",
  "nationality": "American",
  "country": "USA",
  "cityOfResidence": "Los Angeles",
  "profession": "Engineer",
  "adresse": "789 Pine Street",
  "tel": "+1987654321",
  "nIDC": "ID987654321",
  "dateOfDelivrance": "2020-01-01",
  "placeOfDelivrance": "DMV Office"
}
```

### Update Client
**PUT** `/client/:id`

### Delete Client
**DELETE** `/client/:id`

### Get All Clients by Hotel
**GET** `/client/all/by-hotel?hotel=:hotelId`

## Stay Management

### Get Stays
**GET** `/stay`

**Query Parameters:**
- `page`, `limit`: Pagination
- `client`: Filter by client ID
- `room`: Filter by room ID
- `status`: Filter by status
- `startDate`, `endDate`: Date range filter

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 75,
  "page": 1,
  "pages": 8,
  "stays": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
      "client": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b8",
        "firstName": "Alice",
        "lastName": "Johnson"
      },
      "room": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
        "roomNumber": "101"
      },
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-01-20T00:00:00.000Z",
      "status": "confirmed",
      "notes": "Late check-in requested"
    }
  ]
}
```

### Get Stay by ID
**GET** `/stay/:id`

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "stay": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
    "client": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b8",
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice@example.com",
      "tel": "+1234567890"
    },
    "room": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
      "roomNumber": "101"
    },
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "actualCheckIn": "2024-01-15T15:30:00.000Z",
    "status": "in-progress",
    "invoice": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3ba",
      "totalAmount": 500,
      "paymentStatus": "pending"
    }
  }
}
```

### Create Stay
**POST** `/stay`

**Request Body:**
```json
{
  "client": "60f7b3b3b3b3b3b3b3b3b3b8",
  "room": "60f7b3b3b3b3b3b3b3b3b3b6",
  "startDate": "2024-02-01T00:00:00.000Z",
  "endDate": "2024-02-05T00:00:00.000Z",
  "notes": "Anniversary celebration"
}
```

### Update Stay
**PUT** `/stay/:id`

**Request Body:**
```json
{
  "status": "in-progress",
  "actualCheckIn": "2024-01-15T14:00:00.000Z",
  "notes": "Updated notes"
}
```

### Delete Stay
**DELETE** `/stay/:id`

## Invoice Management

### Get Invoices
**GET** `/invoice`

**Query Parameters:**
- `page`, `limit`: Pagination
- `stay`: Filter by stay ID
- `paymentStatus`: Filter by payment status
- `minAmount`, `maxAmount`: Amount range filter
- `startDate`, `endDate`: Date range filter

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 30,
  "page": 1,
  "pages": 3,
  "invoices": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3ba",
      "stay": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-01-20T00:00:00.000Z"
      },
      "totalAmount": 500,
      "issueDate": "2024-01-15T00:00:00.000Z",
      "paymentStatus": "pending",
      "payments": []
    }
  ]
}
```

### Get Invoice by ID
**GET** `/invoice/:id`

### Create Invoice
**POST** `/invoice`

**Request Body:**
```json
{
  "stay": "60f7b3b3b3b3b3b3b3b3b3b9",
  "totalAmount": 500,
  "paymentStatus": "pending",
  "payments": [
    {
      "amountPaid": 200,
      "datePaid": "2024-01-16T00:00:00.000Z",
      "method": "cash"
    }
  ]
}
```

### Update Invoice
**PUT** `/invoice/:id`

**Request Body:**
```json
{
  "paymentStatus": "partially_paid",
  "payments": [
    {
      "amountPaid": 200,
      "datePaid": "2024-01-16T00:00:00.000Z",
      "method": "cash"
    },
    {
      "amountPaid": 300,
      "datePaid": "2024-01-17T00:00:00.000Z",
      "method": "card"
    }
  ]
}
```

### Delete Invoice
**DELETE** `/invoice/:id`

## Food Item Management

### Get Food Items
**GET** `/food-item`

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search in name/description
- `hotel`: Filter by hotel ID
- `category`: Filter by category ('food'/'beverage')
- `minPrice`, `maxPrice`: Price range filter

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 40,
  "page": 1,
  "pages": 4,
  "foodItems": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3bb",
      "name": {
        "en": "Grilled Chicken",
        "fr": "Poulet Grillé"
      },
      "description": {
        "en": "Delicious grilled chicken with herbs",
        "fr": "Délicieux poulet grillé aux herbes"
      },
      "price": 25,
      "category": "food",
      "hotel": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Grand Hotel"
      }
    }
  ]
}
```

### Get Food Item by ID
**GET** `/food-item/:id`

### Create Food Item
**POST** `/food-item`

**Request Body:**
```json
{
  "name": {
    "en": "Caesar Salad",
    "fr": "Salade César"
  },
  "description": {
    "en": "Fresh caesar salad with croutons",
    "fr": "Salade césar fraîche avec croûtons"
  },
  "price": 15,
  "hotel": "60f7b3b3b3b3b3b3b3b3b3b4",
  "category": "food"
}
```

### Update Food Item
**PUT** `/food-item/:id`

### Delete Food Item
**DELETE** `/food-item/:id`

## Order Item Management

### Get Order Items
**GET** `/order-item`

**Query Parameters:**
- `page`, `limit`: Pagination
- `stay`: Filter by stay ID
- `foodItem`: Filter by food item ID
- `status`: Filter by status
- `startDate`, `endDate`: Date range filter

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 20,
  "page": 1,
  "pages": 2,
  "orderItems": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3bc",
      "stay": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-01-20T00:00:00.000Z"
      },
      "foodItem": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3bb",
        "name": {
          "en": "Grilled Chicken",
          "fr": "Poulet Grillé"
        },
        "price": 25
      },
      "quantity": 2,
      "orderDate": "2024-01-16T12:00:00.000Z",
      "status": "served",
      "servedBy": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
```

### Get Order Item by ID
**GET** `/order-item/:id`

### Create Order Item
**POST** `/order-item`

**Request Body:**
```json
{
  "stay": "60f7b3b3b3b3b3b3b3b3b3b9",
  "foodItem": "60f7b3b3b3b3b3b3b3b3b3bb",
  "quantity": 1,
  "status": "pending"
}
```

### Update Order Item
**PUT** `/order-item/:id`

**Request Body:**
```json
{
  "status": "preparing",
  "quantity": 2
}
```

### Delete Order Item
**DELETE** `/order-item/:id`

## Zone Management

### Get Zones
**GET** `/zone`

**Query Parameters:**
- `page`, `limit`: Pagination
- `city`: Filter by city ID
- `search`: Search in zone names

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 15,
  "page": 1,
  "pages": 2,
  "zones": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "name": {
        "en": "Downtown",
        "fr": "Centre-ville"
      },
      "city": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3bd",
        "name": {
          "en": "New York",
          "fr": "New York"
        }
      }
    }
  ]
}
```

### Get Zone by ID
**GET** `/zone/:id`

### Create Zone
**POST** `/zone`

**Request Body:**
```json
{
  "name": {
    "en": "Uptown",
    "fr": "Quartier Haut"
  },
  "city": "60f7b3b3b3b3b3b3b3b3b3bd"
}
```

### Update Zone
**PUT** `/zone/:id`

### Delete Zone
**DELETE** `/zone/:id`

## Category Management

### Get Categories
**GET** `/category`

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search in category names
- `hotel`: Filter by hotel ID
- `minPrice`, `maxPrice`: Price range filter

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 8,
  "page": 1,
  "pages": 1,
  "categories": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "name": {
        "en": "Standard Room",
        "fr": "Chambre Standard"
      },
      "description": {
        "en": "Comfortable standard room with basic amenities",
        "fr": "Chambre standard confortable avec équipements de base"
      },
      "basePrice": 100,
      "hotel": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Grand Hotel"
      }
    }
  ]
}
```

### Get Category by ID
**GET** `/category/:id`

### Create Category
**POST** `/category`

**Request Body:**
```json
{
  "name": {
    "en": "Deluxe Room",
    "fr": "Chambre Deluxe"
  },
  "description": {
    "en": "Spacious deluxe room with premium amenities",
    "fr": "Chambre deluxe spacieuse avec équipements premium"
  },
  "basePrice": 200,
  "hotel": "60f7b3b3b3b3b3b3b3b3b3b4"
}
```

### Update Category
**PUT** `/category/:id`

### Delete Category
**DELETE** `/category/:id`

## Price Period Management

### Get Price Periods
**GET** `/price-period`

**Query Parameters:**
- `page`, `limit`: Pagination
- `entityType`: Filter by entity type ('Room'/'Food')
- `entityId`: Filter by entity ID
- `activeOnly`: Filter active periods only

**Response:**
```json
{
  "messageCode": "MSG_0003",
  "total": 12,
  "page": 1,
  "pages": 2,
  "pricePeriods": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3be",
      "entityType": "Room",
      "entityId": "60f7b3b3b3b3b3b3b3b3b3b6",
      "startDate": "2024-02-01T00:00:00.000Z",
      "endDate": "2024-02-28T00:00:00.000Z",
      "newPrice": 150
    }
  ]
}
```

### Get Price Period by ID
**GET** `/price-period/:id`

### Create Price Period
**POST** `/price-period`

**Request Body:**
```json
{
  "entityType": "Room",
  "entityId": "60f7b3b3b3b3b3b3b3b3b3b6",
  "startDate": "2024-03-01T00:00:00.000Z",
  "endDate": "2024-03-31T00:00:00.000Z",
  "newPrice": 180
}
```

### Update Price Period
**PUT** `/price-period/:id`

### Delete Price Period
**DELETE** `/price-period/:id`

## Error Handling

### Standard Error Response Format
```json
{
  "messageCode": "MSG_0001",
  "message": "Server error",
  "errors": {
    "field": "Validation error message"
  }
}
```

### Common Error Codes
- `MSG_0001`: Server error
- `MSG_0061`: Unauthorized
- `MSG_0095`: Forbidden
- `MSG_0053`: User not found
- `MSG_0004`: Hotel not found
- `MSG_0032`: Room not found
- `MSG_0084`: Client not found
- `MSG_0010`: Stay not found

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `500`: Internal Server Error

### Rate Limiting
- Login endpoint: 10 attempts per 24 hours per IP
- Other endpoints: Standard rate limiting applies

### Pagination
All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10-20 depending on endpoint)

Response includes pagination metadata:
```json
{
  "total": 100,
  "page": 1,
  "pages": 10,
  "data": [...]
}
```

### Filtering and Sorting
Most list endpoints support:
- `search`: Text search in relevant fields
- `sort`: Field to sort by
- `order`: Sort order ('asc' or 'desc')
- Various entity-specific filters

### File Upload
File upload endpoints accept `multipart/form-data`:
- Supported formats: JPG, JPEG, PNG
- Maximum file size: 5MB
- Files are stored in Cloudinary