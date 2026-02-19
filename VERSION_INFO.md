# 📦 Project Versions

## Version 1 (Original - BACKUP)
**Folders:** `backend-v1-backup` and `frontend-v1-backup`

**Features:**
- Public signup for all users
- Customer, Frontend Dev, Backend Dev, Server Admin roles
- Customers create projects and tasks
- Tasks auto-assigned to developers
- Developers see and update their tasks

**Access:**
- Backend: `http://backend.test` (Laravel Herd)
- Frontend: `http://localhost:5173`
- Login: customer@project.com / customer123

---

## Version 2 (New - Admin-Controlled)
**Folders:** `backend` and `frontend`

**Features:**
- Admin creates all developer accounts
- No public signup for developers
- Admin assigns developers to projects
- Customers create projects/tasks
- Developers see surprise tasks when they login

**Changes:**
1. Added Admin role
2. Removed signup page
3. Admin dashboard for user management
4. Project assignment by admin
5. Minimal developer view

---

## How to Switch Between Versions

### Use Version 1 (Original):
```bash
# Rename current folders
mv backend backend-v2
mv frontend frontend-v2

# Restore v1
mv backend-v1-backup backend
mv frontend-v1-backup frontend

# Run
cd frontend && npm run dev
```

### Use Version 2 (New):
```bash
# Rename current folders
mv backend backend-v1-backup
mv frontend frontend-v1-backup

# Restore v2
mv backend-v2 backend
mv frontend-v2 frontend

# Run
cd frontend && npm run dev
```

---

Both versions are preserved and you can switch anytime!
