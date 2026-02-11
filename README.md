# Structask - Task Management System

A full-stack task management application built with Laravel (Backend) and React (Frontend).

## Features

- User authentication (Login/Register)
- Role-based access control (Customer, Frontend Dev, Backend Dev, Server Admin)
- Project management
- Task assignment and tracking
- Real-time task status updates
- Clean, professional UI design

## Tech Stack

**Backend:**
- Laravel 10
- Laravel Sanctum (Authentication)
- SQLite Database

**Frontend:**
- React 18
- Vite
- Axios
- React Router

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 16 or higher
- npm
- Laravel Herd (recommended) OR php artisan serve

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd fullstack-task-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations and seed demo data
php artisan migrate:fresh --seed
```

**Using Laravel Herd (Recommended):**
```bash
herd link
```
Your backend will be available at: `http://backend.test`

**OR using Artisan Serve:**
```bash
php artisan serve
```
Your backend will be available at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Update API URL in src/services/api.js
# If using Herd: http://backend.test/api
# If using artisan serve: http://localhost:8000/api

# Start development server
npm run dev
```

Your frontend will be available at: `http://localhost:5174`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@project.com | customer123 |
| Frontend Dev | frontend@project.com | frontend123 |
| Backend Dev | backend@project.com | backend123 |
| Server Admin | server@project.com | server123 |

## Project Structure

```
fullstack-task-manager/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── frontend/               # React App
    ├── src/
    │   ├── components/
    │   ├── context/
    │   └── services/
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/register` - Register new user
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/{id}` - Get project details

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task (customer only)
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task (customer only)

## Development

**Backend:**
```bash
cd backend
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

## Troubleshooting

**CORS Issues:**
- Check `backend/config/cors.php` includes your frontend URL
- Run `php artisan config:clear` after changes

**Database Issues:**
- Ensure `database/database.sqlite` file exists
- Run `php artisan migrate:fresh --seed` to reset

**Port Already in Use:**
- Frontend: Change port in vite config or let Vite auto-select
- Backend: Use `php artisan serve --port=8001`

## License

This project is for educational purposes.

## Contributors

- [Your Name]
- [Co-intern Name]
