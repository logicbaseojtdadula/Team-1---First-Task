# 🌐 Deploy Your Project Online (Free)

## Quick Deploy - Railway + Vercel (Recommended)

### Step 1: Push to GitHub (if not done)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect Laravel
6. Add these environment variables in Railway:
   ```
   APP_KEY=base64:xlmKZKxmDqoeMCZXZDOOtrrt/WxcQ9M0Ntqp5+/YaQY=
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION=sqlite
   ```
7. Railway will give you a URL like: `https://your-app.up.railway.app`

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-app.up.railway.app/api
   ```
6. Click "Deploy"
7. Vercel will give you a URL like: `https://your-app.vercel.app`

### Step 4: Update CORS in Laravel

Edit `backend/config/cors.php`:
```php
'allowed_origins' => ['https://your-app.vercel.app'],
```

Push the change and Railway will auto-redeploy.

---

## Alternative: Use Ngrok (Temporary - For Testing)

If you just want to test online quickly without deploying:

### Install Ngrok
1. Download from https://ngrok.com/download
2. Sign up for free account
3. Install ngrok

### Expose Backend
```bash
ngrok http http://backend.test:80
```
You'll get a URL like: `https://abc123.ngrok.io`

### Expose Frontend
```bash
ngrok http 5173
```
You'll get a URL like: `https://xyz789.ngrok.io`

### Update Frontend .env
```
VITE_API_URL=https://abc123.ngrok.io/api
```

Restart frontend and share the frontend ngrok URL!

**Note:** Ngrok URLs change every time you restart, so this is only for temporary testing.

---

## Permanent Free Hosting Options

### Option 1: Railway (Backend) + Vercel (Frontend)
- **Cost:** Free
- **Backend:** Railway (500 hours/month free)
- **Frontend:** Vercel (unlimited)
- **Database:** SQLite (included)
- **Best for:** Production apps

### Option 2: Render (Both)
- **Cost:** Free
- **Backend:** Render Web Service
- **Frontend:** Render Static Site
- **Database:** SQLite or PostgreSQL
- **Best for:** All-in-one solution

### Option 3: Netlify (Frontend) + Railway (Backend)
- **Cost:** Free
- **Similar to Vercel + Railway**

---

## Which Should You Choose?

**For quick testing (5 minutes):**
→ Use Ngrok

**For permanent deployment (30 minutes):**
→ Use Railway + Vercel

**For simplicity:**
→ Use Render for both

---

## After Deployment

Your app will be accessible at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`

Anyone with the URL can access it from anywhere in the world!

---

## Need Help?

1. Make sure your code is pushed to GitHub
2. Choose Railway + Vercel (easiest)
3. Follow the steps above
4. Your app will be live in ~30 minutes

Would you like me to help you deploy to a specific platform?
