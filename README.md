# Weather App Backend API

This is the backend API for the Weather App full-stack project.

## Features

- RESTful API for clothing items management
- User authentication (JWT-based)
- Like/unlike functionality for items
- CORS enabled for frontend integration

## API Endpoints

### Items
- `GET /items` - Get all clothing items
- `POST /items` - Add new item (requires authentication)
- `DELETE /items/:id` - Delete item (requires authentication)
- `PUT /items/:id/likes` - Like an item (requires authentication)
- `DELETE /items/:id/likes` - Unlike an item (requires authentication)

### Users
- `GET /users` - Get all users

### Health Check
- `GET /health` - Server health status

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Environment

- **Port**: 3001 (default)
- **Environment**: Development/Production

## Authentication

The API uses Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## CORS

CORS is enabled to allow requests from the frontend application.

## Data Storage

Currently uses in-memory storage. In production, this would be replaced with a proper database (MongoDB, PostgreSQL, etc.).

## Frontend Integration

The frontend application should make requests to:
- Base URL: `http://localhost:3001`
- Items endpoint: `http://localhost:3001/items`
- Users endpoint: `http://localhost:3001/users`
