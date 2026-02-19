# Make Structask Accessible on Your Network (No Password!)

## Your Local IP Address: `192.168.254.114`

This is the simplest way - anyone on the same WiFi can access your app!

## Steps:

### 1. Open Command Prompt and run:

```cmd
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. Share this URL with anyone on the same WiFi:

**`http://192.168.254.114:8000/app`**

That's it! No passwords, no third-party services, just works!

## To Access:

- **On your computer:** `http://192.168.254.114:8000/app`
- **On your phone (same WiFi):** `http://192.168.254.114:8000/app`
- **On friend's device (same WiFi):** `http://192.168.254.114:8000/app`

## Important:

1. Keep the Command Prompt window open (don't close it)
2. Everyone must be on the SAME WiFi network
3. If your IP changes, you'll need to update the URL

## Firewall Note:

If others can't connect, you may need to allow PHP through Windows Firewall:
1. Windows will show a popup asking to allow PHP - click "Allow"
2. Or manually: Windows Security → Firewall → Allow an app → Find PHP

---

## Alternative: For Internet Access (Not Just WiFi)

If you need people outside your WiFi to access it, you'll need ngrok:

1. Download ngrok: https://ngrok.com/download
2. Sign up (free): https://dashboard.ngrok.com/signup
3. Get your authtoken from the dashboard
4. Run:
```cmd
ngrok config add-authtoken YOUR_TOKEN
ngrok http http://backend.test
```

You'll get a public URL like: `https://abc123.ngrok-free.app`

---

## Which Should You Use?

- **Same WiFi (classmates, home):** Use the IP method above (192.168.254.114:8000)
- **Internet access (anywhere):** Use ngrok

The IP method is simpler and has no passwords!
