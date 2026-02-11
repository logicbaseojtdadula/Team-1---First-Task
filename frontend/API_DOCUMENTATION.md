# API Documentation for Backend Developer

This document outlines the API endpoints that the frontend expects from the backend.

## Base URL
The frontend will make requests to: `{VITE_API_URL}` (configurable via .env)

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

## Endpoints

### 1. User Registration
**POST** `/api/register`

Request Body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "customer|frontend|backend|server"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

### 2. User Login
**POST** `/api/login`

Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response (200):
```json
{
  "user": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

### 3. User Logout
**POST** `/api/logout`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

### 4. Get Authenticated User
**GET** `/api/user`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "id": 1,
  "name": "string",
  "email": "string",
  "role": "string"
}
```

### 5. Get All Projects
**GET** `/api/projects`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
[
  {
    "id": 1,
    "name": "string",
    "description": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

### 6. Get Single Project
**GET** `/api/projects/:id`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 7. Get All Tasks
**GET** `/api/tasks`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "status": "pending|in-progress|completed",
    "category": "string",
    "project_id": 1,
    "project": {
      "id": 1,
      "name": "string"
    },
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

### 8. Create Task
**POST** `/api/tasks`

Headers: `Authorization: Bearer {token}`

Request Body:
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "project_id": 1,
  "status": "pending"
}
```

Response (201):
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "pending",
  "category": "string",
  "project_id": 1,
  "project": {
    "id": 1,
    "name": "string"
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 9. Update Task
**PUT** `/api/tasks/:id`

Headers: `Authorization: Bearer {token}`

Request Body (all fields optional):
```json
{
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed",
  "category": "string",
  "project_id": 1
}
```

Response (200):
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "string",
  "category": "string",
  "project_id": 1,
  "project": {
    "id": 1,
    "name": "string"
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 10. Delete Task
**DELETE** `/api/tasks/:id`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "message": "Task deleted successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error message"
}
```

## CORS Configuration
The backend should allow requests from the frontend origin (default: http://localhost:5173)

## Notes for Backend Developer
1. All datetime fields should be in ISO 8601 format
2. Token should be a Bearer token (JWT recommended)
3. The frontend automatically adds the token to all requests after login
4. On 401 errors, the frontend will automatically logout the user
5. The frontend expects JSON responses with appropriate status codes
