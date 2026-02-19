# Get Structask Online in 5 Minutes with ngrok

## Why ngrok?
- Works from anywhere (not just same WiFi)
- No password prompts
- Most reliable option
- Free tier is perfect for demos

## Step-by-Step Setup:

### Step 1: Download ngrok (1 minute)

1. Go to: **https://ngrok.com/download**
2. Click **Windows (64-bit)**
3. Download the ZIP file
4. Extract it to your Desktop (you'll get `ngrok.exe`)

### Step 2: Create Free Account (1 minute)

1. Go to: **https://dashboard.ngrok.com/signup**
2. Sign up with email or GitHub (it's free!)
3. After login, you'll see your **authtoken** - keep this page open!

### Step 3: Setup ngrok (1 minute)

Open Command Prompt where you extracted ngrok.exe:

```cmd
cd Desktop
ngrok config add-authtoken YOUR_TOKEN_FROM_STEP_2
```

(Replace YOUR_TOKEN_FROM_STEP_2 with the actual token from the dashboard)

### Step 4: Start the Tunnel (30 seconds)

In the same Command Prompt:

```cmd
ngrok http http://backend.test
```

### Step 5: Get Your URL (30 seconds)

You'll see something like:

```
Forwarding    https://abc-123-def.ngrok-free.app -> http://backend.test
```

**Copy that URL!** That's your public link!

### Step 6: Share It! (Done!)

Share the URL with anyone:
- `https://abc-123-def.ngrok-free.app/app`

Add `/app` at the end to go directly to your Structask login page!

## Important Notes:

✅ **Keep Command Prompt Open** - Don't close the window running ngrok
✅ **First Visit Warning** - Users might see "Visit Site" button - just click it
✅ **URL Changes** - Free plan gives you a new URL each time you restart ngrok
✅ **No Limits** - Share with as many people as you want!

## Troubleshooting:

**Problem:** "Invalid Host Header"
**Solution:** 
1. Open `backend/.env`
2. Add: `APP_URL=https://your-ngrok-url.ngrok-free.app`
3. Run: `php artisan config:clear`

**Problem:** Can't find ngrok.exe
**Solution:** Make sure you're in the right folder:
```cmd
cd Desktop
dir ngrok.exe
```

**Problem:** Token not working
**Solution:** Copy the token again from https://dashboard.ngrok.com/get-started/your-authtoken

## Quick Reference:

```cmd
# Setup (one time only)
ngrok config add-authtoken YOUR_TOKEN

# Start tunnel (every time)
ngrok http http://backend.test

# Stop tunnel
Press Ctrl+C in the ngrok window
```

## Your Turn!

Follow the steps above and let me know when you have your ngrok URL!
