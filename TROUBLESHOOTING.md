# Troubleshooting Guide

## Page Stuck on Loading Spinner

If the page shows a loading spinner and doesn't load:

### Quick Fixes

1. **Hard Refresh Browser**
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`
   - This clears cached JavaScript and CSS

2. **Clear Browser Cache**
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Click "Clear data"

3. **Check Browser Console**
   - Press `F12` or right-click → Inspect
   - Go to "Console" tab
   - Look for red error messages
   - Common errors:
     - **CORS errors**: Backend CORS is misconfigured
     - **Network errors**: Backend is not running
     - **TypeError**: JavaScript error in code

### Diagnostic Steps

#### 1. Verify Servers are Running

```bash
# Check backend
curl http://localhost:3001/entries
# Should return JSON array

# Check frontend
curl http://localhost:3000
# Should return HTML
```

#### 2. Check Network Tab

In browser DevTools:
1. Go to "Network" tab
2. Reload page
3. Look for failed requests (red)
4. Common issues:
   - `/entries` request pending forever → Backend not responding
   - `/entries` returns 404 → Wrong API URL
   - `/entries` shows CORS error → CORS misconfiguration

#### 3. Check Component State

If data loads but spinner persists:
- React component state issue
- Check `loading` state in page.tsx
- Should be set to `false` in `finally` block

### Solutions by Error Type

#### CORS Error
```
Access to fetch at 'http://localhost:3001/entries' from origin
'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```bash
# Restart backend server
cd backend
npm run start:dev
```

#### Network Error / Connection Refused
```
GET http://localhost:3001/entries net::ERR_CONNECTION_REFUSED
```

**Solution:**
- Backend is not running
- Start it: `cd backend && npm run start:dev`

#### 404 Not Found
```
GET http://localhost:3001/entries 404 (Not Found)
```

**Solution:**
- Check API_URL in frontend/.env.local
- Should be: `NEXT_PUBLIC_API_URL=http://localhost:3001`

#### Component Never Stops Loading

**Symptoms:**
- API returns data
- No errors in console
- Spinner keeps spinning

**Solution:**
1. Check browser console for React errors
2. Verify `/entries` API returns valid JSON array
3. Try this in console:
```javascript
fetch('http://localhost:3001/entries')
  .then(r => r.json())
  .then(console.log)
```

### Nuclear Option

If nothing works, restart everything:

```bash
# Stop all servers
pkill -f "nest start"
pkill -f "next dev"

# Clear frontend build
cd frontend
rm -rf .next

# Restart with fresh builds
cd ../backend
npm run start:dev

# In another terminal
cd frontend
npm run dev
```

Then:
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R)
3. Open http://localhost:3000

### Still Not Working?

Check these files for issues:

1. **frontend/src/app/page.tsx**
   - Line 19: `setLoading(false)` in `finally` block

2. **frontend/src/lib/api.ts**
   - Line 18: `API_URL` constant

3. **backend/src/main.ts**
   - Lines 9-13: CORS configuration

### Get Help

If you're still stuck:
1. Share browser console errors
2. Share backend terminal output
3. Share `curl http://localhost:3001/entries` output
