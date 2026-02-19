# 🚀 Deploy Your App Online (Free)

## Option 1: Railway (Recommended - Easiest)

### Deploy Backend (Laravel)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Laravel
6. Add environment variables:
   - `APP_KEY` (copy from your .env)
   - `DB_CONNECTION=sqlite`
7. Your backend will be live at: `https://your-app.railway.app`

### Deploy Frontend (React)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Set Root Directory: `frontend`
6. Add environment variable:
   - `VITE_API_URL=https://your-backend.railway.app/api`
7. Deploy!
8. Your frontend will be live at: `https://your-app.vercel.app`

---

## Option 2: Render (Also Free)

### Backend
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `composer install && php artisan migrate --force`
6. Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`
7. Add environment variables from .env

### Frontend
1. New → Static Site
2. Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Add environment variable: `VITE_API_URL`

---

## Option 3: Netlify + Railway

### Backend on Railway (same as Option 1)

### Frontend on Netlify
1. Go to https://netlify.com
2. Drag and drop your `frontend` folder
3. Or connect GitHub repo
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Environment variables → Add `VITE_API_URL`

---

## Quick Setup Steps

### 1. Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Update .gitignore
Already done! Your .gitignore is set up correctly.

### 3. Create Production .env
The deployment platform will use environment variables.

### 4. Database
For production, you have options:
- **SQLite** (easiest, works on Railway/Render)
- **MySQL** (use PlanetScale free tier)
- **PostgreSQL** (use Railway/Render free tier)

---

## Recommended: Railway + Vercel (Fastest Setup)

### Step 1: Deploy Backend to Railway
```bash
# Railway will auto-detect and deploy
# Just connect your GitHub repo
```

### Step 2: Get Backend URL
After Railway deploys, you'll get a URL like:
`https://structask-backend-production.up.railway.app`

### Step 3: Update Frontend .env
```
VITE_API_URL=https://structask-backend-production.up.railway.app/api
```

### Step 4: Deploy Frontend to Vercel
```bash
cd frontend
npm run build
# Then deploy to Vercel
```

---

## After Deployment

Your app will be accessible at:
- Frontend: `https://structask.vercel.app` (or your custom domain)
- Backend: `https://structask-backend.railway.app`

Anyone with the URL can access it from anywhere in the world!

---

## Cost
- **Railway**: Free tier (500 hours/month)
- **Vercel**: Free tier (unlimited)
- **Netlify**: Free tier (100GB bandwidth)
- **Render**: Free tier (750 hours/month)

All free tiers are enough for development and small projects!

---

## Need Help?
1. Push your code to GitHub first
2. Choose a platform (Railway recommended)
3. Follow the platform's deployment wizard
4. Update environment variables
5. Your app will be live!

Would you like me to help you deploy to a specific platform?
