# Structask Login Credentials

## Project Access
- **Local URL**: http://backend.test
- **Online URL**: https://uncontrovertible-obligable-felisa.ngrok-free.dev (if ngrok is running)

## Test Accounts

### Admin Account
- Email: `admin@structask.com`
- Password: `admin123`
- Role: Administrator
- Access: Admin users view at `/admin/users`

### Customer Accounts
- Email: `customer1@structask.com` to `customer3@structask.com`
- Password: `customer123`
- Role: Customer
- Can: Create projects, create tasks, view submissions

### Frontend Developer Accounts (5 accounts)
- Email: `frontend1@structask.com` to `frontend5@structask.com`
- Password: `frontend123`
- Role: Frontend Developer
- Can: View assigned tasks, submit work, delete completed tasks

### Backend Developer Accounts (5 accounts)
- Email: `backend1@structask.com` to `backend5@structask.com`
- Password: `backend123`
- Role: Backend Developer
- Can: View assigned tasks, submit work, delete completed tasks

### Server Admin Accounts (5 accounts)
- Email: `server1@structask.com` to `server5@structask.com`
- Password: `server123`
- Role: Server Administrator
- Can: View assigned tasks, submit work, delete completed tasks

## Features Implemented

✅ Automatic developer assignment (round-robin)
✅ Profile photo upload
✅ Task submission system (images, files, links)
✅ Real-time refresh button
✅ Structask color palette applied
✅ Forgot Password functionality (contact admin)
✅ All supervisor requirements met

## Quick Start

1. Open http://backend.test in your browser
2. Login with any account above
3. Test the features based on your role

## Notes
- Customers are automatically assigned 1 frontend, 1 backend, and 1 server admin per project
- Developers can be assigned to multiple projects
- System uses round-robin assignment (least assigned developer gets the next project)
