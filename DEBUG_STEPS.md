# 🔍 DEBUG STEPS - Task Not Showing Issue

## Step 1: Open test_api.html
1. Open the file `test_api.html` in your browser
2. Check what tasks are returned for frontend developer
3. Take a screenshot and share what you see

## Step 2: Check Browser Console
1. Login as **customer@project.com**
2. Open browser console (F12)
3. Create a new task with category "frontend"
4. Look for the console log that says "Task created successfully"
5. Copy the response data

## Step 3: Check Frontend Developer View
1. **Logout completely** (click logout button)
2. **Close the browser tab** (important!)
3. **Open a new tab** and go to http://localhost:5173
4. Login as **frontend@project.com / frontend123**
5. Open console (F12)
6. Look for log: "Loaded tasks for user: frontend@project.com - Count: X"
7. What number do you see for Count?

## Step 4: Hard Refresh
1. While logged in as frontend developer
2. Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
3. This clears cache and reloads
4. Check if tasks appear now

## Step 5: Check Network Tab
1. Login as frontend developer
2. Open DevTools (F12) → Network tab
3. Refresh the page
4. Look for the request to `/api/tasks`
5. Click on it and check:
   - Request Headers → Authorization header present?
   - Response → What data is returned?

## Quick Test Command
Run this in your terminal to see what's in the database:

```bash
cd backend
php artisan tinker --execute="echo 'Frontend tasks: '; App\Models\Task::where('category', 'frontend')->get(['id', 'title', 'assigned_to'])->each(function(\$t) { echo \$t->id . ': ' . \$t->title . ' (assigned to: ' . \$t->assigned_to . ')' . PHP_EOL; });"
```

## Common Issues:

### Issue 1: Browser Cache
- Solution: Hard refresh (Ctrl + Shift + R)
- Or: Clear browser cache completely

### Issue 2: Old Token
- Solution: Logout, close browser, reopen, login again

### Issue 3: Wrong User ID
- The frontend developer must have ID = 2
- Check with: `php artisan tinker --execute="echo App\Models\User::where('email', 'frontend@project.com')->first()->id;"`

### Issue 4: Task Not Assigned Correctly
- Check task in database
- Run: `php artisan tinker --execute="App\Models\Task::latest()->first();"`

## What Should Happen:

1. Customer creates task with category "frontend"
2. Backend assigns task to user with ID 2 (frontend@project.com)
3. Frontend developer logs in
4. API call to `/api/tasks` returns tasks where `assigned_to = 2`
5. Dashboard displays those tasks

## Tell Me:
1. What do you see in test_api.html?
2. What count shows in console when logged in as frontend?
3. What does the Network tab show for /api/tasks response?
