# 🚀 Ngrok Setup - Make Your App Online in 5 Minutes

## Step 1: Download Ngrok

1. Go to: https://ngrok.com/download
2. Click "Download for Windows"
3. Extract the ZIP file to a folder (like `C:\ngrok`)

## Step 2: Sign Up (Free)

1. Go to: https://dashboard.ngrok.com/signup
2. Sign up with Google/GitHub or email
3. You'll be redirected to the dashboard

## Step 3: Get Your Auth Token

1. On the dashboard, you'll see your authtoken
2. Copy it (looks like: `2abc123def456ghi789jkl`)

## Step 4: Connect Your Account

Open PowerShell in the ngrok folder and run:
```powershell
.\ngrok config add-authtoken YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with your actual token.

## Step 5: Start Your Laravel Server

Make sure your Laravel app is running on port 8000.
Check if you see a PowerShell window with "Laravel development server started"

## Step 6: Start Ngrok

In the ngrok folder, run:
```powershell
.\ngrok http 8000
```

## Step 7: Get Your Public URL

You'll see something like:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:8000
```

**That's your public URL!** Copy `https://abc123.ngrok-free.app`

## Step 8: Share Your App

Send that URL to anyone - they can access your app from anywhere in the world!

---

## Important Notes

✅ **Free tier includes:**
- 1 online ngrok process
- 40 connections/minute
- Random URL each time

⚠️ **Limitations:**
- URL changes when you restart ngrok
- Shows ngrok warning page first time (click "Visit Site")
- Stops when you close the terminal

💡 **Tips:**
- Keep the ngrok terminal window open
- Keep the Laravel server running
- Don't close either window while people are using your app

---

## Quick Commands

**Start Laravel:**
```powershell
cd C:\Users\admin\fullstack-task-manager\backend
php artisan serve --host=0.0.0.0 --port=8000
```

**Start Ngrok:**
```powershell
cd C:\ngrok
.\ngrok http 8000
```

---

## Troubleshooting

**"command not found"?**
→ Make sure you're in the ngrok folder

**"ERR_NGROK_108"?**
→ Run the authtoken command again

**Can't access the URL?**
→ Make sure Laravel server is running on port 8000

---

Your app will be online as long as both windows stay open!
