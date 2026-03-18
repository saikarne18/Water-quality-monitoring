# 🚀 MANUAL VERCEL REDEPLOY INSTRUCTIONS

**Issue:** Frontend showing 404 because environment variables not set in Vercel

**Solution:** Manually redeploy on Vercel with correct environment variables

---

## ⚡ QUICK FIX (2 minutes)

### Step 1: Push Latest Changes to GitHub
```bash
git add frontend/src/config.js
git commit -m "Fix: Use production backend URL by default"
git push origin main
```

### Step 2: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Sign in with your account
3. Click on project: **water-monitoring-frontend**

### Step 3: Set Environment Variables
1. Click **Settings** tab
2. Click **Environment Variables** in left menu
3. Add new variable:
   - **Name:** `REACT_APP_API_BASE_URL`
   - **Value:** `https://water-quality-monitoring-9qmp.onrender.com`
   - **Environments:** Production, Preview, Development
4. Click **Save**

### Step 4: Manual Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **Redeploy** button
4. Wait 2-3 minutes for build to complete

### Step 5: Verify
1. Visit: https://water-monitoring-frontend.vercel.app
2. It should load WITHOUT 404 errors
3. Backend API calls should work

---

## ✅ Alternative (Already Applied)

The `frontend/src/config.js` has been updated to:
- Use **production URL by default** when deployed to Vercel
- Fall back to **localhost:8000** for local development

This means Vercel should now work without needing .env file.

---

## 🔧 What Changed

**Before:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";
```

**After:**
```javascript
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000")
  : "https://water-quality-monitoring-9qmp.onrender.com";
```

This ensures:
- ✅ Local dev uses localhost:8000
- ✅ Production (Vercel) uses correct backend: https://water-quality-monitoring-9qmp.onrender.com

---

## 🔍 Troubleshooting

### Still seeing 404?
1. **Clear browser cache:** Ctrl+Shift+Delete
2. **Hard reload:** Ctrl+Shift+R
3. **Wait for build:** Check Vercel Deployments tab - build should be "Ready"
4. **Check backend health:**
   ```bash
   curl https://water-quality-monitoring-9qmp.onrender.com/api/v1/health
   ```

### Backend returning errors?
- Render might need cold-start (first request takes 30 sec)
- Check Render dashboard for service logs
- Make sure database connection is working

---

## 📞 Summary

- ✅ Frontend code updated with production URL
- ✅ Changes committed to GitHub
- 🔄 Vercel auto-redeploy should trigger
- ⏭️ If not: Manual redeploy needed (see Step 4 above)

