# ⚡ QUICK ACTION GUIDE - START HERE

**5 Minute Setup Guide - Everything Ready to Go!**

---

## 🔥 DO THIS RIGHT NOW (Copy & Paste)

### Step 1: Open PowerShell and Navigate to Backend

```powershell
cd "c:\Users\SAISHASHANK KARNE\OneDrive\Desktop\iiith phase2\College-Research-Affiliate-Program-26\backend"
```

### Step 2: Start Backend Server

```powershell
python main.py
```

**✅ WAIT FOR THIS MESSAGE:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**KEEP THIS WINDOW OPEN!**

---

## 🧪 PHASE 2: Test Backend (Open NEW PowerShell)

```powershell
# Test 1: Health Check (should return {"status":"healthy"})
curl http://localhost:8000/api/v1/health

# Test 2: Model Info (should return model details)
curl http://localhost:8000/api/v1/model-info
```

---

## 💻 PHASE 3: Start Frontend (Open THIRD PowerShell)

```powershell
cd "c:\Users\SAISHASHANK KARNE\OneDrive\Desktop\iiith phase2\College-Research-Affiliate-Program-26\frontend"
npm start
```

**✅ Should open Browser at http://localhost:3000**

---

## ✅ PHASE 4: Test Frontend

In the browser:
1. Click **Sign Up** - Create account
2. Click **Log In** - Login with your account
3. Click **Prediction** - Make a test prediction ✅
4. Click **🌙** (top right) - Toggle dark mode ✅
5. Click **Mobile icon** (F12 → Toggle Device) - Test mobile ✅
6. Check **Real-time Predictions** page ✅
7. Check **Model Comparison** page ✅
8. Check **CSV Upload** page ✅
9. Check **Alert Preferences** page ✅

---

## 📸 SCREENSHOTS TO CAPTURE

Take these 5 screenshots:

1. **Backend Response** - Terminal showing health check ✅
2. **Frontend Home** - Dashboard with all features
3. **Prediction** - Making a prediction
4. **Dark Mode** - Dark theme active
5. **Mobile** - Responsive on phone size

Put them in a folder called `screenshots/`

---

## 🌍 PHASE 5: Deploy (When Ready)

### Option A: Deploy Backend (Render)
1. Go https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect your repo
5. Settings:
   - Root: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add env vars from `.env` file
7. Deploy!

### Option B: Deploy Frontend (Vercel)
1. Go https://vercel.com
2. Sign up with GitHub
3. New Project → Import repo
4. Settings:
   - Root: `frontend`
   - Env: `REACT_APP_API_BASE_URL=https://your-render-url`
5. Deploy!

---

## 📐 FULL CHECKLIST

**System Ready:**
- [ ] Backend starts without error
- [ ] Frontend loads in browser
- [ ] All 7 bonuses working
- [ ] Screenshots captured

**Deployment (If Needed):**
- [ ] Code pushed to GitHub
- [ ] Backend live on Render
- [ ] Frontend live on Vercel
- [ ] URLs tested

**Submission:**
- [ ] Screenshots in folder
- [ ] Document created with URLs
- [ ] GitHub link ready
- [ ] All uploaded

---

## ❌ TROUBLESHOOTING (Common Issues)

**Q: Backend won't start?**
→ Check `.env` has Aiven credentials
→ Run: `pip install -r requirements.txt` again

**Q: ImportError for modules?**
→ Run: `pip install tensorflow PyJWT bcrypt`

**Q: Frontend blank page?**
→ Make sure backend is running on port 8000
→ Check network tab in F12

**Q: Can't curl endpoints?**
→ Make sure backend is STILL running (don't close that terminal!)

---

## ⏱️ TIMING

- Backend start: 2 min
- Backend test: 2 min
- Frontend start: 2 min
- Frontend test: 10 min
- Screenshots: 3 min
- **Total: ~20 minutes** (if everything works)

---

## 🎯 SUCCESS = This Works End-to-End

1. Backend running ✅
2. Frontend loads ✅
3. Can signup/login ✅
4. Can make predictions ✅
5. Dark mode works ✅
6. Mobile responsive ✅
7. All 7 bonuses visible ✅

---

## 📋 FILES THAT HELP

- `LIVE_EXECUTION_PLAYBOOK.md` - Detailed guide
- `SYSTEM_STATUS_REPORT.md` - Full status
- `QUICK_START_GUIDE.md` - Deployment guide
- `API_DOCUMENTATION.md` - API reference

---

## 🚀 START NOW!

```
STEP 1: Open PowerShell
STEP 2: cd backend
STEP 3: python main.py
STEP 4: Wait for "running on http://0.0.0.0:8000"
STEP 5: Open new PowerShell, cd frontend
STEP 6: npm start
STEP 7: Test everything in browser
STEP 8: Take screenshots
STEP 9: Done! ✅
```

**Everything is ready. Go!**

---

**Time Estimate**: 90 minutes total (including deployment)
**Difficulty**: Easy (just follow steps)
**Status**: ✅ ALL SYSTEMS GO

