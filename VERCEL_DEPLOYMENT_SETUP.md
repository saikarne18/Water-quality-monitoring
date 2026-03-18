# 🚀 Vercel Frontend Deployment Setup

**Frontend Application URL:** `https://water-quality-monitoring-azure.vercel.app`

## ✅ Complete Step-by-Step Instructions

### 1️⃣ Prerequisites
- GitHub account with repository: `saikarne18/Water-quality-monitoring`
- Vercel account (free tier available at vercel.com)
- Backend Render URL ready: `https://water-quality-monitoring-9qmp.onrender.com`
- Node.js 16+ installed locally

### 2️⃣ Prepare Repository
```bash
# Ensure frontend structure is correct:
# frontend/
#   ├── src/ (9 pages, 4 components, 2 contexts)
#   ├── public/ (index.html etc)
#   ├── package.json (all dependencies)
#   └── .env (NOT committed)

# Ensure no build errors locally:
cd College-Research-Affiliate-Program-26/frontend
npm install
npm run build  # Should complete successfully

# Push to GitHub
cd ..
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

### 3️⃣ Create Vercel Project
1. Go to **https://vercel.com**
2. Click **Add New** → **Project**
3. Select **Import Git Repository**
4. Search for `Water-quality-monitoring`
5. Click **Import**

### 4️⃣ Configure Project Settings
| Setting | Value |
|---------|-------|
| **Project Name** | water-monitoring-frontend |
| **Framework Preset** | Create React App |
| **Root Directory** | `frontend` |
| **Node Version** | 16.x (default) |

### 5️⃣ Set Environment Variable
Before deploying, add:

**Environment Variables section:**
```
Variable: REACT_APP_API_BASE_URL
Value: https://water-quality-monitoring-9qmp.onrender.com
```

### 6️⃣ Deploy
- Click **Deploy**
- Wait 3-5 minutes for build and deployment
- ✅ Status should show "Ready"
- Copy the URL: `https://water-quality-monitoring-azure.vercel.app`

### 7️⃣ Verify Deployment
```bash
# Visit the frontend URL in browser:
https://water-quality-monitoring-azure.vercel.app

# Should see:
✅ Water Quality Monitoring Dashboard loads
✅ Can navigate to Login/Signup pages  
✅ Can create new account
✅ Can log in with credentials
✅ All pages load without errors
✅ Dark mode toggle works
✅ Responsive on mobile view
```

---

## 🧪 Post-Deployment Testing

### Test Login Flow
1. Visit `https://water-quality-monitoring-azure.vercel.app`
2. Click "Sign Up" tab
3. Create new account:
   - Email: test@example.com
   - Password: Test@123
4. Click "Sign Up"
5. Log in with new credentials
6. Browser dashboard

### Test All Pages
- [ ] Home (Dashboard with analytics)
- [ ] CSV Upload (Batch predictions)
- [ ] Real-time Predictions (WebSocket)
- [ ] Model Comparison (CNN vs LSTM vs GRU)
- [ ] Alert Preferences (Alert settings)
- [ ] Alert History (Alert logs)
- [ ] Analytics (Advanced insights)

### Test Features
- [ ] Dark mode toggle (top-right button)
- [ ] Mobile responsive view
- [ ] Make single predictions
- [ ] Upload CSV file
- [ ] Configure alert preferences
- [ ] View real-time WebSocket updates

---

## 🔧 Troubleshooting

### Issue: Build fails during deployment
**Solution:** 
- Check build logs in Vercel dashboard
- Verify all npm dependencies are installed
- Ensure no syntax errors in React components
- Check if REACT_APP_API_BASE_URL is set

### Issue: "Failed to fetch from API"
**Solution:**
- Verify REACT_APP_API_BASE_URL environment variable is set correctly
- Check if backend Render service is running
- Verify CORS is enabled on backend

### Issue: Pages don't load or show blank
**Solution:**
- Open browser DevTools → Console for errors
- Check if API calls are being made (Network tab)
- Verify stored JWT token in localStorage
- Clear cache and reload

### Issue: WebSocket connection fails
**Solution:**
- Ensure backend is running and reachable
- Check if WebSocket endpoint is available
- Verify network doesn't block WebSocket
- Check browser console for specific error

---

## 📝 Environment Variable Reference

### REACT_APP_API_BASE_URL
This is the only required environment variable:
```
Development: http://127.0.0.1:8000
Production (Render): https://water-quality-monitoring-9qmp.onrender.com
```

The frontend uses this to construct all API endpoints:
- `/api/v1/signup` → Full URL becomes API endpoint
- `/api/v1/login` → Full URL becomes API endpoint
- WebSocket URLs also use this base

---

## ✅ Deployment Checklist
- [ ] Frontend code is pushed to GitHub
- [ ] REACT_APP_API_BASE_URL is set in Vercel environment
- [ ] Build completes successfully
- [ ] Frontend loads without errors
- [ ] Can sign up and log in
- [ ] API calls work (check Network tab)
- [ ] Dark mode and responsive design work
- [ ] All 9 pages are accessible

---

## 🔗 Final URLs

### Production URLs (After Deployment)
- **Frontend:** https://water-quality-monitoring-azure.vercel.app
- **Backend API:** https://water-quality-monitoring-9qmp.onrender.com
- **GitHub:** https://github.com/saikarne18/Water-quality-monitoring

### Development URLs (Local testing)
- **Frontend:** http://localhost:3000
- **Backend API:** http://127.0.0.1:8000

---

## 📱 Frontend Architecture
- **Framework:** React 18
- **Pages:** 9 (Login, Signup, Home, Prediction, RealtimePrediction, ModelComparison, CSVUpload, AlertPreferences, AlertHistory, Analytics)
- **Charts:** Recharts (4 different chart types)
- **State Management:** React Context (Auth, Theme)
- **Responsive:** 3 breakpoints (mobile, tablet, desktop)
- **Features:** Dark mode, JWT auth, WebSocket streaming, CSV upload, email alerts
