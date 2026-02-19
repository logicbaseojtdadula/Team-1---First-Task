# Quick Setup: Make Structask Online in 5 Minutes

## Step 1: Download ngrok (1 minute)

1. Open this link in your browser: **https://ngrok.com/download**
2. Click the **Windows** button
3. Click **Download** - it will download `ngrok.zip`
4. Extract the ZIP file to your Desktop (you'll get `ngrok.exe`)

## Step 2: Get Your Free ngrok Account (2 minutes)

1. Go to: **https://dashboard.ngrok.com/signup**
2. Sign up with your email (it's free!)
3. After login, you'll see your **authtoken** - copy it!

## Step 3: Run These Commands (2 minutes)

Open Command Prompt in the folder where you extracted ngrok.exe:

```cmd
# Configure ngrok with your token (replace with your actual token)
ngrok config add-authtoken YOUR_TOKEN_HERE

# Start the tunnel to your Laravel app
ngrok http http://backend.test
```

## Step 4: Copy Your Public URL

After running the command, you'll see something like:

```
Forwarding    https://1234-abc-def.ngrok-free.app -> http://backend.test
```

**That's your public URL!** Copy it and share it with anyone!

## Step 5: Update Laravel (Optional but Recommended)

Open `backend/.env` and add:

```env
APP_URL=https://your-ngrok-url.ngrok-free.app
SESSION_DOMAIN=.ngrok-free.app
```

Then run:
```cmd
cd backend
php artisan config:clear
```

## Done! 🎉

Your app is now accessible from anywhere in the world!

### Important:
- Keep the Command Prompt window with ngrok running
- If you close it, the URL stops working
- Each time you restart ngrok, you get a new URL (free plan)

### Test It:
1. Open the ngrok URL on your phone
2. Share it with friends
3. They can access your Structask app!

---

## Need Help?

If you get stuck, just tell me which step you're on and I'll help you!
