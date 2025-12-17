# API Documentation - Affiliate Monitor

Base URL: `http://localhost:3000/api/v1`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via JWT token.

**Header:**
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "affiliateIds": {},
      "active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "affiliateIds": {
      "amazon": "your-tag",
      "shopee": "your-id"
    }
  }
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "affiliateIds": {
    "amazon": "your-amazon-tag",
    "shopee": "your-shopee-id",
    "mercadolivre": "your-ml-id"
  }
}
```

### Sources

#### List Sources
```http
GET /sources
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Promobit RSS",
      "type": "rss",
      "url": "https://www.promobit.com.br/rss",
      "active": true,
      "fetchCount": 10,
      "lastFetchedAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### Create Source
```http
POST /sources
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My RSS Feed",
  "type": "rss",
  "url": "https://example.com/feed.xml",
  "active": true,
  "config": {}
}
```

#### Update Source
```http
PUT /sources/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "active": false
}
```

#### Delete Source
```http
DELETE /sources/:id
Authorization: Bearer <token>
```

### Channels

#### List Channels
```http
GET /channels
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "My Telegram Channel",
      "type": "telegram",
      "active": true,
      "messageCount": 50,
      "config": {
        "botToken": "...",
        "chatId": "..."
      }
    }
  ]
}
```

#### Create Channel
```http
POST /channels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Telegram Deals",
  "type": "telegram",
  "active": true,
  "config": {
    "botToken": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
    "chatId": "-1001234567890"
  }
}
```

#### Update Channel
```http
PUT /channels/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "active": false
}
```

#### Delete Channel
```http
DELETE /channels/:id
Authorization: Bearer <token>
```

### Offers

#### List Offers
```http
GET /offers?status=sent&platform=amazon&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: pending, processing, sent, failed, skipped
- `platform`: amazon, shopee, mercadolivre
- `sourceId`: Filter by source ID
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "offers": [
      {
        "id": 1,
        "title": "Great Product Deal",
        "description": "Amazing discount on...",
        "originalUrl": "https://amazon.com/...",
        "affiliateUrl": "https://amazon.com/...?tag=your-tag",
        "imageUrl": "https://...",
        "price": 99.90,
        "originalPrice": 199.90,
        "discount": 50,
        "platform": "amazon",
        "status": "sent",
        "createdAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

#### Get Offer
```http
GET /offers/:id
Authorization: Bearer <token>
```

#### Get Stats
```http
GET /offers/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1000,
    "pending": 10,
    "sent": 950,
    "failed": 40
  }
}
```

### Rules

#### List Rules
```http
GET /rules
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Amazon to Telegram",
      "sourceId": 1,
      "channelId": 1,
      "active": true,
      "filters": {
        "keywords": ["tech", "gadget"],
        "minDiscount": 30,
        "maxPrice": 500
      },
      "matchCount": 100,
      "source": { ... },
      "channel": { ... }
    }
  ]
}
```

#### Create Rule
```http
POST /rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tech Deals to Telegram",
  "sourceId": 1,
  "channelId": 1,
  "active": true,
  "filters": {
    "keywords": ["tech", "laptop"],
    "minDiscount": 30,
    "minPrice": 100,
    "maxPrice": 2000,
    "platforms": ["amazon", "shopee"]
  }
}
```

**Filter Options:**
- `keywords`: Array of keywords to search in title/description
- `minDiscount`: Minimum discount percentage
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `platforms`: Array of platforms to filter

#### Update Rule
```http
PUT /rules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "active": false,
  "filters": { ... }
}
```

#### Delete Rule
```http
DELETE /rules/:id
Authorization: Bearer <token>
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Common Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/missing token)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Exceeding limit returns 429 status

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```
