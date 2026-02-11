# FULL-STACK TASK MANAGER - COMPLETE SETUP GUIDE

## 📦 What's Included

This package contains a complete Laravel + React task management system with:
- ✅ Backend API (Laravel with Sanctum authentication)
- ✅ Frontend UI (React + Vite)
- ✅ Database migrations and seeders
- ✅ Role-based access control
- ✅ Automatic task assignment
- ✅ 5 demo projects with sample data

## 👥 Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Customer | customer@project.com | customer123 | Create/Edit/Delete tasks |
| Frontend Dev | frontend@project.com | frontend123 | View/Update frontend tasks |
| Backend Dev | backend@project.com | backend123 | View/Update backend tasks |
| Server Admin | server@project.com | server123 | View/Update server tasks |

## 🚀 BACKEND SETUP (Laravel)

### Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL or MariaDB
- Laravel Herd (recommended) OR XAMPP/WAMP

### Step 1: Setup Backend Files

1. Extract the `backend` folder to your desired location
2. Open terminal in the `backend` folder

### Step 2: Install Dependencies

```bash
composer install
```

### Step 3: Configure Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Configure Database

Edit `.env` file and update database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_manager
DB_USERNAME=root
DB_PASSWORD=
```

### Step 5: Create Database

Create a new MySQL database named `task_manager`:

**Using MySQL Command Line:**
```sql
CREATE DATABASE task_manager;
```

**Or use phpMyAdmin** if using XAMPP

### Step 6: Run Migrations and Seeders

```bash
# Run migrations to create tables
php artisan migrate

# Seed database with demo data
php artisan db:seed
```

You should see:
```
Database seeded successfully!

Login credentials:
Customer: customer@project.com / customer123
Frontend: frontend@project.com / frontend123
Backend: backend@project.com / backend123
Server: server@project.com / server123
```

### Step 7: Start Laravel Server

**Option A: Using Laravel Herd (Recommended)**
- Open Herd and link the backend folder
- Your API will be at: `http://backend.test`

**Option B: Using Artisan Serve**
```bash
php artisan serve
```
- Your API will be at: `http://localhost:8000`

## 💻 FRONTEND SETUP (React)

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Step 1: Setup Frontend Files

1. Extract the `frontend` folder
2. Open terminal in the `frontend` folder

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure API URL

Edit `frontend/src/services/api.js` and update the API URL:

```javascript
// If using Laravel Herd:
const API_URL = 'http://backend.test/api'

// If using php artisan serve:
const API_URL = 'http://localhost:8000/api'
```

### Step 4: Start Development Server

```bash
npm run dev
```

The app will open at: `http://localhost:5173`

## 🎯 TESTING THE APPLICATION

### Test Customer Flow:

1. Login as customer@project.com / customer123
2. Select a project from dropdown
3. Create a new task
4. Select category (Frontend/Backend/Server)
5. Notice task appears in "My Tasks"

### Test Developer Flow:

1. Logout
2. Login as frontend@project.com / frontend123
3. See only frontend tasks assigned to you
4. Update task status
5. Cannot edit or delete tasks

### Test Multiple Projects:

1. Login as customer
2. Switch between different projects in dropdown
3. Each project has different assigned developers

## 📁 Project Structure

```
fullstack-task-manager/
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php   # Login/Logout
│   │   │   ├── ProjectController.php
│   │   │   └── TaskController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Project.php
│   │       ├── Task.php
│   │       └── ProjectAssignment.php
│   ├── database/
│   │   ├── migrations/              # Database schema
│   │   └── seeders/
│   │       └── DatabaseSeeder.php   # Demo data
│   ├── routes/
│   │   └── api.php                  # API endpoints
│   └── config/
│       └── cors.php                 # CORS config
│
└── frontend/                        # React App
    ├── src/
    │   ├── components/             # React components
    │   ├── services/              # API calls
    │   ├── context/               # Auth context
    │   └── App.jsx               # Main app
    └── package.json

```

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/{id}` - Get project details

### Tasks
- `GET /api/tasks` - List tasks (filtered by role)
- `POST /api/tasks` - Create task (customer only)
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task (customer only)

## 🐛 Troubleshooting

### Backend Issues

**Error: "Access denied for user"**
- Check MySQL credentials in `.env`
- Make sure MySQL server is running

**Error: "Class not found"**
```bash
composer dump-autoload
```

**CORS errors**
- Check `config/cors.php` includes your frontend URL
- Clear config cache: `php artisan config:clear`

### Frontend Issues

**API connection failed**
- Verify backend is running
- Check API URL in `services/api.js`
- Check browser console for errors

**Login not working**
- Clear browser cache
- Check Network tab for API response
- Verify credentials match seeder data

## 🔄 Git Workflow

### Initial Push to GitHub

```bash
# In project root
git init
git add .
git commit -m "Initial commit - Task Manager System"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Daily Workflow

```bash
# Pull latest changes
git pull origin main

# Make changes...

# Commit and push
git add .
git commit -m "Your commit message"
git push origin main
```

## 📊 Database Schema

### Users
- id, name, email, password, role (customer|frontend|backend|server)

### Projects
- id, name, description, customer_id

### Project Assignments
- id, project_id, user_id, role (frontend|backend|server)
- **Unique constraint: one developer per role per project**

### Tasks
- id, project_id, title, description, category, priority, status
- created_by (customer), assigned_to (developer)

## ✅ Feature Checklist

- [x] Login authentication
- [x] Role-based access control
- [x] 5 demo projects
- [x] Automatic task assignment
- [x] Customer can create/edit/delete tasks
- [x] Developers can only update status
- [x] Category-based assignment (frontend/backend/server)
- [x] Task filtering by project
- [x] Responsive UI design
- [x] API documentation
- [x] Demo data seeder

## 🎓 Learning Points

This project demonstrates:
1. Laravel API development with Sanctum auth
2. React frontend with modern hooks
3. Role-based permissions
4. Relational database design
5. API integration
6. State management
7. Form validation
8. CORS configuration

## 🆘 Need Help?

Common issues and solutions:

1. **Can't create database**
   - Use phpMyAdmin (XAMPP)
   - Or MySQL Workbench
   - Or command line: `mysql -u root -p`

2. **Composer not found**
   - Download from getcomposer.org
   - Add to PATH

3. **Node not found**
   - Download from nodejs.org
   - Restart terminal after install

4. **Port already in use**
   ```bash
   # Frontend: change port
   npm run dev -- --port 3001
   
   # Backend: change port
   php artisan serve --port=8001
   ```

---

Made with ❤️ for Team 1 - Happy coding!
