# 👑 Admin Dashboard Features

## Admin Account

The admin account has full control over the system with a dedicated admin dashboard.

### Login Credentials
- **Email:** `admin@structask.com`
- **Password:** `admin123`

## Admin Dashboard Overview

When you login as admin, you'll see a completely different dashboard with three main sections:

### 1. 📊 Dashboard (Stats)
View system-wide statistics:
- Total Users
- Total Developers (Frontend, Backend, Server)
- Total Customers
- Total Projects
- Total Tasks
- Active Projects

### 2. 👥 Users Management
- **View all users** with their roles, status, and registration dates
- **Create developer accounts** (Frontend, Backend, Server Admin)
- **Toggle user status** (Active/Inactive)
- See user statistics and activity

#### Creating Developer Accounts
1. Click "+ Create Developer Account"
2. Fill in:
   - Name
   - Email
   - Password
   - Role (Frontend/Backend/Server)
3. Click "Create"
4. Developer can now login with those credentials

### 3. 📁 Projects Management
- **View all projects** from all customers
- **Create new projects** for any customer
- **Assign developers** to projects manually
- See project status and developer assignments

#### Creating Projects as Admin
1. Click "+ Create New Project"
2. Fill in:
   - Project Name
   - Project Description
   - Select Customer (from dropdown)
3. Click "Create Project"
4. System automatically assigns developers via round-robin
5. You can manually reassign developers if needed

#### Assigning Developers
1. Click "Assign Developers" on any project
2. Select:
   - Frontend Developer
   - Backend Developer
   - Server Admin
3. Click "Assign"
4. Developers will see the project in their dashboard

## Admin Capabilities

### What Admin CAN Do:
✅ View all users, projects, and tasks in the system
✅ Create developer accounts (Frontend, Backend, Server)
✅ Create projects for any customer
✅ Assign/reassign developers to projects
✅ View system-wide statistics
✅ Manage user status (activate/deactivate)
✅ See all customer accounts and their projects

### What Admin CANNOT Do:
❌ Create tasks (only customers can create tasks)
❌ Submit work on tasks (only developers can submit)
❌ Delete users (for data integrity)
❌ Change user roles after creation

## Admin vs Customer vs Developer

| Feature | Admin | Customer | Developer |
|---------|-------|----------|-----------|
| Create Projects | ✅ (for any customer) | ✅ (for self) | ❌ |
| Create Tasks | ❌ | ✅ | ❌ |
| View All Projects | ✅ | Own only | Assigned only |
| View All Tasks | ✅ | Own only | Assigned only |
| Create Developer Accounts | ✅ | ❌ | ❌ |
| Assign Developers | ✅ | ❌ (auto) | ❌ |
| Submit Work | ❌ | ❌ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |

## Use Cases

### Scenario 1: New Customer Needs a Project
1. Customer signs up via signup form
2. Admin logs in and goes to Projects tab
3. Admin clicks "+ Create New Project"
4. Admin selects the customer from dropdown
5. Admin fills in project details
6. System auto-assigns developers
7. Customer can now create tasks for the project

### Scenario 2: Need More Developers
1. Admin logs in and goes to Users tab
2. Admin clicks "+ Create Developer Account"
3. Admin fills in developer details
4. New developer can login and will be assigned to future projects

### Scenario 3: Reassign Developer
1. Admin goes to Projects tab
2. Admin clicks "Assign Developers" on a project
3. Admin selects different developers
4. Old developers lose access, new developers gain access

## Admin Dashboard Design

The admin dashboard has a different look from customer/developer dashboards:
- **Sidebar:** Dark theme with admin icon
- **Navigation:** Dashboard, Users, Projects tabs
- **Tables:** Clean data tables with action buttons
- **Modals:** Forms for creating users and projects
- **Stats Cards:** Large number displays for key metrics

## Security Notes

- Admin account is created in the database seeder
- Admin cannot be created via signup form
- Admin role is checked on backend for all admin operations
- Only users with `role = 'admin'` can access admin endpoints
- Admin actions are logged for audit purposes

## Quick Start for Admin

1. Login at: http://backend.test
2. Use credentials: `admin@structask.com` / `admin123`
3. You'll see the admin dashboard automatically
4. Start by viewing Dashboard stats
5. Go to Users to see all registered users
6. Go to Projects to create new projects or assign developers

---

**Note:** The admin dashboard is completely separate from the customer/developer dashboard. When admin logs in, they see a different interface optimized for system management.
