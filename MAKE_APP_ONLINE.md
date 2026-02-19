# Make Structask Accessible Online

This guide will help you make your Structask app accessible from any device on the internet using ngrok.

## Option 1: Using ngrok (Recommended - Quick & Easy)

### Step 1: Install ngrok

**Method A: Download from Website**
1. Go to [https://ngrok.com/download](https://ngrok.com/download)
2. Click on "Windows" 
3. Download the ZIP file
4. Extract `ngrok.exe` to a folder (e.g., `C:\ngrok\`)

**Method B: Using Chocolatey (if you have it installed)**
```cmd
choco install ngrok
```

### Step 2: Sign Up for ngrok (Free)
1. Go to [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. Create a free account
3. After login, go to "Your Authtoken" page
4. Copy your authtoken

### Step 3: Configure ngrok
Open Command Prompt and run:
```cmd
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### Step 4: Start Your Laravel App
Make sure Laravel Herd is running and your app is accessible at `http://backend.test`

### Step 5: Start ngrok Tunnel
Open a new Command Prompt and run:
```cmd
ngrok http http://backend.test
```

Or if using port 80:
```cmd
ngrok http 80
```

### Step 6: Get Your Public URL
After running ngrok, you'll see output like:
```
Forwarding    https://abc123.ngrok-free.app -> http://backend.test
```

Copy the `https://abc123.ngrok-free.app` URL - this is your public URL!

### Step 7: Update Laravel Configuration
Edit `backend/.env`:
```env
APP_URL=https://abc123.ngrok-free.app
SESSION_DOMAIN=.ngrok-free.app
SANCTUM_STATEFUL_DOMAINS=abc123.ngrok-free.app
```

Then run:
```cmd
cd backend
php artisan config:clear
php artisan cache:clear
```

### Step 8: Share Your Link!
Now anyone can access your app using the ngrok URL from any device!

## Important Notes

### Free ngrok Limitations:
- URL changes every time you restart ngrok
- Limited to 40 connections/minute
- Shows ngrok warning page on first visit (users can click "Visit Site")

### Keep ngrok Running:
- Don't close the Command Prompt window running ngrok
- If you close it, the public URL stops working
- Restart ngrok to get a new URL

### For Same Network Access (Alternative):
If devices are on the same WiFi network, you can use your local IP:

1. Find your IP address:
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Configure Laravel Herd to accept connections from network
3. Access from other devices: `http://192.168.1.100`

## Option 2: Deploy to Production (Permanent Solution)

For a permanent online presence, consider deploying to:
- **Heroku** (free tier available)
- **Railway** (free tier available)
- **DigitalOcean** ($5/month)
- **AWS/Azure** (various pricing)

Would you like help setting up any of these options?

## Troubleshooting

### Issue: "Invalid Host Header"
Add to `backend/.env`:
```env
APP_URL=https://your-ngrok-url.ngrok-free.app
```

### Issue: CORS Errors
Make sure `backend/config/cors.php` allows your ngrok domain.

### Issue: Session/Login Problems
Clear cache and update SESSION_DOMAIN in `.env` as shown in Step 7.

## Quick Start Commands

```cmd
# Terminal 1: Make sure Laravel is running (Herd should handle this)

# Terminal 2: Start ngrok
cd C:\path\to\ngrok
ngrok http http://backend.test

# Terminal 3: Update Laravel config
cd backend
php artisan config:clear
php artisan cache:clear
```

Your app is now online! 🚀
