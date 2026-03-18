# ⚡ QUICK START DEPLOYMENT GUIDE

**Use this during actual deployment**

---

## 🔥 30-Minute Setup

### Step 1: Database (5-10 min)

**Option A: Aiven (Recommended)**
```bash
# 1. Go to https://aiven.io
# 2. Create free PostgreSQL service
# 3. Copy credentials below:

DB_HOST = "your-host.aivencloud.com"
DB_PORT = "12345"
DB_NAME = "defaultdb"
DB_USER = "avnadmin"
DB_PASSWORD = "your-password-here"
DB_SSL_MODE = "require"
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database: water_monitoring
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "water_monitoring"
DB_USER = "postgres"
DB_PASSWORD = "your-password"
```

### Step 2: Backend Configuration (2 min)

```bash
# 1. Copy template
cd backend
cp .env.template .env

# 2. Fill .env with your values:
DB_HOST=your-host
DB_PORT=your-port
DB_NAME=your-db
DB_USER=your-user
DB_PASSWORD=your-password
JWT_SECRET=your-random-secret-here-min-32-chars
JWT_ALGORITHM=HS256
APP_NAME=Water-Monitoring
ENVIRONMENT=production

# 3. Optional: Email alerts
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 3: Test Backend (5 min)

```bash
# Terminal 1: Start backend
cd backend
pip install -r requirements.txt
python main.py

# Terminal 2: Test endpoints
curl http://localhost:8000/api/v1/health

# Should return:
# {"status":"ok","message":"API is running"}
```

### Step 4: Test Frontend (5 min)

```bash
# Terminal 3: Start frontend
cd frontend
npm install
npm start

# Open browser: http://localhost:3000
# Test: Click Login → Signup → Create account
```

---

## 🌍 Production Deployment (15 min)

### Backend to Render

```bash
# 1. Go to https://render.com
# 2. Click "New +" → "Web Service"
# 3. Connect GitHub repo
# 4. Fill settings:
#    - Name: water-monitoring-backend
#    - Runtime: Python 3.9
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

# 5. Environment Variables:
#    - DB_HOST = your-aiven-host
#    - DB_PORT = 12345
#    - DB_NAME = defaultdb
#    - DB_USER = avnadmin
#    - DB_PASSWORD = xxxxxxxxx
#    - JWT_SECRET = your-random-string-here
#    - ENVIRONMENT = production

# 6. Click Deploy
# 7. Wait 5-10 minutes
# 8. Get URL: https://water-monitoring-backend.onrender.com

# Test: 
curl https://water-monitoring-backend.onrender.com/api/v1/health
```

### Frontend to Vercel

```bash
# 1. Go to https://vercel.com
# 2. Click "Add New..." → "Project"
# 3. Import GitHub repository
# 4. Framework: Create React App
# 5. Root Directory: frontend
# 6. Environment Variable:
#    - REACT_APP_API_BASE_URL = https://water-monitoring-backend.onrender.com

# 7. Click Deploy
# 8. Wait 3-5 minutes
# 9. Get URL: https://water-monitoring.vercel.app

# Test login and check if API calls work
```

---

## ✅ Verification Checklist

### Backend Endpoints Test

```bash
# 1. Health Check
curl https://your-backend.onrender.com/api/v1/health

# 2. Signup
curl -X POST https://your-backend.onrender.com/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# 3. Login
curl -X POST https://your-backend.onrender.com/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 4. Make Prediction (replace TOKEN with actual token)
curl -X POST https://your-backend.onrender.com/api/v1/predict \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"distance":100,"temperature":25}'
```

### Frontend Tests

- [ ] Can access: https://your-frontend.vercel.app
- [ ] Can create account
- [ ] Can login
- [ ] Can make prediction
- [ ] Can upload CSV file
- [ ] Dark mode toggle works
- [ ] Real-time streaming works
- [ ] Mobile responsive

---

## 🆘 Troubleshooting

### "Database Connection Failed"
```
✓ Check Aiven is running
✓ Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
✓ Check SSL certificate (DB_SSL_MODE=require)
✓ Verify IP whitelist in Aiven
```

### "API Not Responding"
```
✓ Check backend deployment status
✓ Check environment variables in Render
✓ Look at Render logs (click service → logs)
✓ Restart service if needed
```

### "Frontend Can't Connect to Backend"
```
✓ Check REACT_APP_API_BASE_URL in Vercel env
✓ Check CORS settings in backend (should be enabled)
✓ Verify backend URL is correct
✓ Check browser network tab for 403/CORS errors
```

### "WebSocket Not Working"
```
✓ Use wss:// not ws:// for production
✓ Check backend WebSocket endpoint active
✓ Verify no proxy blocking WebSocket
✓ Check Render has WebSocket enabled (it does by default)
```

---

## 📸 Screenshots to Capture

### For Submission

1. **Database Connection**
   ```
   Take screenshot of:
   - Aiven dashboard showing service
   - PostgreSQL connection info
   - Successfully connected from psql/pgAdmin
   ```

2. **Backend API**
   ```
   Take screenshot of:
   - curl or Postman showing /api/v1/health response
   - curl or Postman showing /api/v1/predict response
   - User profile showing logged-in user
   ```

3. **ML Models**
   ```
   Take screenshot of:
   - ML_TRAINING_LOG.md showing 5 experiments
   - Model comparison table (94% accuracy highlighted)
   - Training curves (accuracy and loss)
   ```

4. **Frontend Features**
   ```
   Take screenshot of:
   - Dashboard with college branding
   - 4 custom charts
   - Login page
   - Prediction page
   - Real-time streaming page
   - Mobile view responsiveness
   ```

5. **Deployed Application**
   ```
   Take screenshot of:
   - Browser showing deployed frontend URL
   - Successfully logged in
   - Making prediction on production
   - Dark mode working
   ```

---

## 🔐 Security Notes

### Never Commit These
```bash
# .env file (NEVER commit!)
# Database passwords (NEVER commit!)
# JWT secrets (NEVER commit!)
# SMTP credentials (NEVER commit!)
```

### .env.example (OK to commit)
```bash
# Safe to commit (no actual values):
DB_HOST=your-aiven-host-here
DB_PORT=12345
DB_USER=avnadmin
JWT_SECRET=your-secret-here-min-32-chars
```

### Environment Variables in Cloud
```bash
# Set in Render/Vercel dashboard, NOT in code
# Use secure vaults if available
# Rotate secrets periodically
# Never log sensitive data
```

---

## 📊 URLs Reference

Keep these handy during deployment:

```
Aiven Dashboard:
https://console.aiven.io

Render Dashboard:
https://dashboard.render.com

Vercel Dashboard:
https://vercel.com/dashboard

PostgreSQL Docs:
https://www.postgresql.org/docs/

FastAPI Docs:
https://fastapi.tiangolo.com/

React Docs:
https://react.dev/
```

---

## ⏱️ Timeline

**Expected Timing**:
- Database setup: 10 min
- Backend configuration: 5 min
- Backend testing: 10 min
- Frontend testing: 10 min
- Backend deployment: 5 min (+ 5-10 min deployment time)
- Frontend deployment: 5 min (+ 3-5 min deployment time)
- Final verification: 10 min

**Total: ~60 minutes** (mostly waiting for deployments)

---

## 🎯 Success Criteria

### All Endpoints Working
- [ ] POST /api/v1/signup ✓
- [ ] POST /api/v1/login ✓
- [ ] GET /api/v1/verify-token ✓
- [ ] POST /api/v1/predict ✓
- [ ] GET /api/v1/model-info ✓
- [ ] WS /ws/predictions ✓
- [ ] GET /api/v1/health ✓

### Frontend Features Working
- [ ] Signup/Login ✓
- [ ] Make predictions ✓
- [ ] Upload CSV ✓
- [ ] Real-time streaming ✓
- [ ] Dark mode ✓
- [ ] Mobile responsive ✓

### Deployment Complete
- [ ] Backend URL live ✓
- [ ] Frontend URL live ✓
- [ ] Both URLs publicly accessible ✓
- [ ] All features working end-to-end ✓
- [ ] Screenshots captured ✓

---

## 💡 Tips & Tricks

### Speed Up Render Deployment
- Free tier takes 5-10 min
- First deploy is slower
- Subsequent deploys are faster
- Keep browser open during deployment

### Speed Up Vercel Deployment
- Vercel is usually very fast (2-3 min)
- GitHub integration is seamless
- Can see build logs in real-time
- Auto-redeploy on push to main

### Debug Mode
```bash
# Backend debug logs
export DEBUG=1
python main.py

# Frontend debug logs
npm start  # Logs in browser console (F12)

# Check Render logs
# Dashboard → Select service → Logs tab

# Check Vercel logs
# Dashboard → Select project → Deployments → Select deployment → Logs
```

### Useful Commands
```bash
# Test database connection
psql "postgresql://user:pass@host:port/dbname?sslmode=require"

# Check port availability
lsof -i :8000

# Kill process on port
kill -9 $(lsof -t -i:8000)

# Check Python version
python --version

# Check Node version
node --version
```

---

## 📞 Quick Support

### Stuck on Database?
→ Follow `DATABASE_SETUP.md` step-by-step

### Stuck on Backend?
→ Check `API_DOCUMENTATION.md` for endpoint details

### Stuck on Frontend?
→ Run `npm start` locally first, test all features

### Stuck on Deployment?
→ Read `DEPLOY_BACKEND.md` and `DEPLOY_FRONTEND.md`

### Need Full Details?
→ See `IMPLEMENTATION_SUMMARY.md`

### Need Checklist?
→ Use `SUBMISSION_QUICK_CHECKLIST.md`

---

## 🚀 You're Ready!

Everything is implemented. Just execute these steps:

1. ✅ Database setup (10 min)
2. ✅ Backend test (10 min)  
3. ✅ Frontend test (10 min)
4. ✅ Backend deploy (10 min + wait)
5. ✅ Frontend deploy (10 min + wait)
6. ✅ Verify live (10 min)
7. ✅ Capture screenshots (10 min)
8. ✅ Submit (5 min)

**Total Time: ~90 minutes**

**Good luck! You've got this! 🎉**

