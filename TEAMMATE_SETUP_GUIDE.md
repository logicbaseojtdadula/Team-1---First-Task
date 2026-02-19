# 🚀 Teammate Setup Guide - After Pulling Updates

## Important: You MUST rebuild the frontend after pulling!

When you pull updates from GitHub, the React frontend needs to be rebuilt and copied to Laravel's public folder.

### Step-by-Step Setup

#### 1. Pull the Latest Updates
```bash
git pull origin feature/structask-updates
```

#### 2. Install Backend Dependencies (if needed)
```bash
cd backend
composer install
```

#### 3. Setup Database
```bash
# Still in backend folder
php artisan migrate:fresh --seed
php artisan storage:link
```

#### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 5. **CRITICAL: Build Frontend**
```bash
# Still in frontend folder
npm run build
```

#### 6. **CRITICAL: Copy Built Files to Laravel**
```bash
# Windows PowerShell (from frontend folder)
Remove-Item -Recurse -Force ../backend/public/app
Remove-Item -Recurse -Force ../backend/public/assets
Remove-Item -Force ../backend/public/index.html
Copy-Item -Recurse dist/* ../backend/public/
```

OR use this single command:
```bash
# Windows CMD (from frontend folder)
rmdir /s /q ..\backend\public\app & rmdir /s /q ..\backend\public\assets & del ..\backend\public\index.html & xcopy /E /I /Y dist\* ..\backend\public\
```

#### 7. Access the Application
Open your browser and go to:
- **http://backend.test** (if using Laravel Herd)
- **http://localhost:8000** (if using `php artisan serve`)

### Why the Sidebar Wasn't Clickable

The sidebar wasn't clickable because you were viewing the OLD built version of the frontend. The new code with working click handlers was in the source files, but not in the built files that Laravel serves.

### Quick Rebuild Script

Create a file `REBUILD.bat` in the project root:
```batch
@echo off
echo Rebuilding Frontend...
cd frontend
call npm run build
echo Copying to Laravel...
rmdir /s /q ..\backend\public\app
rmdir /s /q ..\backend\public\assets
del ..\backend\public\index.html
xcopy /E /I /Y dist\* ..\backend\public\
echo Done! Refresh your browser.
cd ..
```

Then just double-click `REBUILD.bat` whenever you pull updates!

### Login Credentials

After setup, login with:

**Customer:**
- Email: `customer@project.com`
- Password: `customer123`

**Frontend Developer 1:**
- Email: `frontend1@structask.com`
- Password: `frontend123`

**Backend Developer 1:**
- Email: `backend1@structask.com`
- Password: `backend123`

**Server Admin 1:**
- Email: `server1@structask.com`
- Password: `server123`

### Troubleshooting

**Sidebar still not clickable?**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh (Ctrl + F5)
3. Check browser console for errors (F12)

**Can't access http://backend.test?**
1. Make sure Laravel Herd is running
2. Try http://localhost or http://127.0.0.1
3. Or run: `cd backend && php artisan serve` then use http://localhost:8000

**Database empty?**
Run: `cd backend && php artisan migrate:fresh --seed`

### Need Help?

Check these files:
- `PROJECT_STATUS.md` - Complete project info
- `ACCESS_LINKS.md` - All access URLs
- `LOGIN_CREDENTIALS.md` - All account credentials
