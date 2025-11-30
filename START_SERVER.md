# Step-by-Step Guide: Connect Frontend to Backend

## Step 1: Start the Backend Server

Open PowerShell in the project directory and run:
```powershell
npm start
```

You should see:
```
✅ MongoDB Connected (or ⚠️ MongoDB not available - that's OK for now)
🚀 Server running on port 8080
🔗 Health Check: http://localhost:8080/api/health
📊 Dashboard API: http://localhost:8080/api/dashboard
```

## Step 2: Test the Backend API Directly

Open a NEW browser tab and test these URLs:

1. **Health Check:**
   ```
   http://localhost:8080/api/health
   ```
   Should return: `{"status":"OK","database":"Connected" or "Offline","timestamp":"..."}`

2. **Dashboard API:**
   ```
   http://localhost:8080/api/dashboard
   ```
   Should return: `{"stats":{...},"upcomingClasses":[...]}`

If these work, your backend is running correctly!

## Step 3: Test the Frontend

1. Open your browser to: `http://localhost:8080`
2. Open Developer Tools (F12)
3. Go to the **Console** tab
4. Look for any errors

## Step 4: Check Network Requests

1. In Developer Tools, go to the **Network** tab
2. Refresh the page (F5)
3. Look for the `/api/dashboard` request
4. Click on it to see:
   - **Status**: Should be `200 OK` (not 404)
   - **Response**: Should show the JSON data

## Step 5: Common Issues & Fixes

### Issue: Still getting 404
- **Fix**: Make sure the server is running and you see the startup messages
- **Fix**: Check the server console for the debug message: `📡 API Request: GET /api/dashboard`

### Issue: CORS errors
- **Fix**: The CORS is already configured, but if you see CORS errors, check that `FRONTEND_URL` in `.env` matches your browser URL

### Issue: Connection refused
- **Fix**: Make sure the server is actually running on port 8080
- **Fix**: Check if another application is using port 8080

## Step 6: Verify Everything Works

Once the dashboard loads without errors:
- ✅ Stats cards should show real data
- ✅ Upcoming classes should appear
- ✅ No red errors in the console
- ✅ Network tab shows 200 status for `/api/dashboard`

## Debugging Tips

If something doesn't work:
1. Check the server console for error messages
2. Check the browser console (F12) for JavaScript errors
3. Check the Network tab to see what requests are being made
4. Verify the server is actually running: `Get-Process -Name node`

