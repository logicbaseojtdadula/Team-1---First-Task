# 📊 How to View Your Database

## Database Location
Your SQLite database file is located at:
```
backend/database/database.sqlite
```

## Method 1: Using DB Browser for SQLite (Recommended - GUI)

### Download & Install
1. Download from: https://sqlitebrowser.org/dl/
2. Install DB Browser for SQLite
3. Open the application

### View Database
1. Click "Open Database"
2. Navigate to your project folder
3. Select `backend/database/database.sqlite`
4. Browse tables: users, projects, tasks, project_assignments, etc.

## Method 2: Using VS Code Extension

### Install Extension
1. Open VS Code
2. Go to Extensions (Ctrl + Shift + X)
3. Search for "SQLite Viewer" or "SQLite"
4. Install "SQLite Viewer" by Florian Klampfer

### View Database
1. In VS Code, navigate to `backend/database/database.sqlite`
2. Right-click the file
3. Select "Open Database"
4. Browse tables in the sidebar

## Method 3: Using PHP Script (Already Created!)

### Quick Check
Run this command in your terminal:
```bash
cd backend
php check_all_data.php
```

This will show you:
- All users (customers, developers)
- All projects with assignments
- All tasks with their assignments
- Developer status

### Simple Check
```bash
cd backend
php check_data.php
```

Shows a simpler overview of projects and tasks.

## Method 4: Using Laravel Tinker (Command Line)

### Access Database via Tinker
```bash
cd backend
php artisan tinker
```

Then run these commands:

**View all users:**
```php
User::all()
```

**View all projects:**
```php
Project::with('customer', 'assignments.user')->get()
```

**View all tasks:**
```php
Task::with('project', 'creator')->get()
```

**Count records:**
```php
echo "Users: " . User::count() . "\n";
echo "Projects: " . Project::count() . "\n";
echo "Tasks: " . Task::count() . "\n";
echo "Assignments: " . ProjectAssignment::count() . "\n";
```

**Exit tinker:**
```php
exit
```

## Method 5: Using Admin Users Page (Web Interface)

### View All Users
1. Open browser
2. Go to: http://backend.test/admin/users
3. See all registered users with their roles and stats

## Method 6: Using TablePlus (Professional Tool)

### Download & Install
1. Download from: https://tableplus.com/
2. Install TablePlus (free version available)

### Connect to Database
1. Click "Create a new connection"
2. Select "SQLite"
3. Browse to `backend/database/database.sqlite`
4. Click "Connect"

## Quick Database Stats

Run this to see current database state:
```bash
cd backend
php -r "require 'vendor/autoload.php'; \$app = require 'bootstrap/app.php'; \$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap(); echo 'Users: ' . \App\Models\User::count() . PHP_EOL; echo 'Projects: ' . \App\Models\Project::count() . PHP_EOL; echo 'Tasks: ' . \App\Models\Task::count() . PHP_EOL; echo 'Assignments: ' . \App\Models\ProjectAssignment::count() . PHP_EOL;"
```

## Database Tables

Your database contains these tables:
- **users** - All user accounts (customers, developers, admin)
- **projects** - All projects created by customers
- **project_assignments** - Which developers are assigned to which projects
- **tasks** - All tasks created by customers
- **task_submissions** - Files/links submitted by developers
- **personal_access_tokens** - API authentication tokens
- **password_reset_tokens** - Password reset functionality
- **failed_jobs** - Background job failures

## Backup Your Database

To backup your database:
```bash
# Windows
copy backend\database\database.sqlite backend\database\database_backup.sqlite

# Or with timestamp
copy backend\database\database.sqlite backend\database\database_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sqlite
```

## Reset Database (Fresh Start)

To reset database with seed data:
```bash
cd backend
php artisan migrate:fresh --seed
```

⚠️ **Warning:** This will delete ALL data and recreate with default accounts!

## Recommended: DB Browser for SQLite

For the best experience, I recommend **DB Browser for SQLite** because:
- ✅ Free and open source
- ✅ Easy to use GUI
- ✅ View, edit, and query data
- ✅ Export data to CSV/SQL
- ✅ No installation of additional software needed
- ✅ Works on Windows, Mac, Linux

Download: https://sqlitebrowser.org/dl/
