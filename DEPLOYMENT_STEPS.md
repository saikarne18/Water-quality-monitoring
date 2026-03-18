# 🚀 COMPLETE DEPLOYMENT GUIDE

## Step-by-Step Instructions to Deploy

---

## ✅ PART 1: DEPLOY BACKEND TO RENDER

### Step 1.1: Go to Render.com
1. Visit https://render.com
2. Click **"Sign Up"** (or use GitHub login for faster setup)
3. Create account and verify email

### Step 1.2: Create New Web Service
1. Click **"New +"** → Select **"Web Service"**
2. Connect your GitHub repository: `saikarne18/Water-quality-monitoring`
3. Select it and click **"Connect"**

### Step 1.3: Configure Backend Deployment

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `water-monitoring-api` |
| **Environment** | `Python 3` |
| **Region** | `Singapore (Southeast Asia)` or your preferred |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### Step 1.4: Add Environment Variables

Click **"Advanced"** and add these variables:

```
DB_HOST = pg-15b7835e-saikarne18-c26f.f.aivencloud.com
DB_PORT = 15211
DB_NAME = defaultdb
DB_USER = avnadmin
DB_PASSWORD = YOUR_AIVEN_PASSWORD
DB_SSLMODE = require
JWT_SECRET = your_jwt_secret_key_here
JWT_ALGORITHM = HS256
JWT_EXPIRATION_HOURS = 24
```

### Step 1.5: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. ✅ When successful, you'll see: **"Your service is live"**
4. **Copy the URL** (e.g., `https://water-quality-monitoring-9qmp.onrender.com`)

---

## ✅ PART 2: DEPLOY FRONTEND TO VERCEL

### Step 2.1: Go to Vercel
1. Visit https://vercel.com
2. Click **"Sign Up"** → Select **"GitHub"**
3. Authorize Vercel to access your GitHub

### Step 2.2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Search for `Water-quality-monitoring`
3. Click **"Import"**

### Step 2.3: Configure Frontend Deployment

Fill in these settings:

| Field | Value |
|-------|-------|
| **Project Name** | `water-monitoring-frontend` |
| **Framework Preset** | `Create React App` |
| **Root Directory** | `frontend` |

### Step 2.4: Add Environment Variable

Click **"Environment Variables"** and add:

```
Name:  REACT_APP_API_BASE_URL
Value: https://water-quality-monitoring-9qmp.onrender.com
```
(Replace with your actual Render URL from Step 1.4)

### Step 2.5: Deploy
1. Click **"Deploy"**
2. Wait 3-5 minutes for build
3. ✅ When successful, you'll see: **"Congratulations! Your project has been successfully deployed"**
4. **Copy the URL** (e.g., `https://water-monitoring-frontend.vercel.app`)

---

## ✅ PART 3: VERIFY BOTH DEPLOYMENTS

### Test Backend
```
Visit: https://your-render-url.onrender.com/api/v1/health

You should see:
{"status":"healthy"}
```

### Test Model Info Endpoint
```
Visit: https://your-render-url.onrender.com/api/v1/model-info

You should see model details with 92% accuracy
```

### Test Frontend
```
Visit: https://your-vercel-url.vercel.app

You should see the Water Quality Monitoring dashboard
```

### Test Login (Optional)
1. Click "LOGOUT" button (if you don't have account)
2. Click "Sign Up" tab
3. Create test account
4. Log in and navigate pages
5. All pages should work! ✅

---

## 📱 TESTING CHECKLIST

After deployment, verify these work:

- [ ] Frontend loads at Vercel URL
- [ ] Backend health check returns `{"status":"healthy"}`
- [ ] Can view model info (92% accuracy shown)
- [ ] Can sign up for new account
- [ ] Can log in with created account
- [ ] Can view Home page with analytics
- [ ] Can view CSV Upload page
- [ ] Can view Alert Preferences page
- [ ] Can view Real-time Predictions page
- [ ] Can view Model Comparison page
- [ ] Dark mode toggle works
- [ ] Mobile view is responsive

---

## 🎉 FINAL URLS

After successful deployment, you'll have:

**Backend:** `https://water-quality-monitoring-9qmp.onrender.com`
**Frontend:** `https://water-monitoring-frontend.vercel.app`

---

## ⚠️ TROUBLESHOOTING

### Issue: Backend deployment fails
**Solution:**
- Check all environment variables are set correctly
- Ensure `DB_SSLMODE=require` is in variables
- Check build command: `pip install -r requirements.txt`
- Check start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Issue: Frontend won't connect to backend
**Solution:**
- Verify `REACT_APP_API_BASE_URL` matches your Render URL
- Check no trailing slash in API URL
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors (F12 → Console tab)

### Issue: Backend crashes on startup
**Solution:**
- Check all 6 environment variables are set
- Verify database credentials are correct
- Use `tensorflow-cpu` instead of `tensorflow` if memory is low

---

## 📞 SUPPORT

If you encounter issues:
1. Check the troubleshooting section above
2. Visit Render/Vercel logs (click "View Logs" on their dashboards)
3. Check GitHub issues in your repository

---

**Deployment checklist:**
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Both URLs verified working
- [ ] All 7 bonuses tested on live URLs
- [ ] Ready for final submission

**🎯 All done! Your system is now live in the cloud!**
