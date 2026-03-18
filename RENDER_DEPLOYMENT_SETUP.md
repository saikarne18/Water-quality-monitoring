# 🚀 Render Backend Deployment Setup

**Backend Service URL:** `https://water-quality-monitoring-9qmp.onrender.com`

## ✅ Complete Step-by-Step Instructions

### 1️⃣ Prerequisites
- GitHub account with repository: `saikarne18/Water-quality-monitoring`
- Render account (free tier available at render.com)
- Aiven PostgreSQL credentials ready
- JWT secret key generated

### 2️⃣ Prepare Repository
```bash
# Ensure all files are in correct structure:
# backend/
#   ├── main.py (1,201 lines with all 20 endpoints)
#   ├── requirements.txt (all dependencies)
#   ├── runtime.txt (python-3.9.13)
#   └── .env (environment variables - NOT committed)

# Push latest code to GitHub
cd College-Research-Affiliate-Program-26
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 3️⃣ Create Render Web Service
1. Go to **https://render.com**
2. Click **New +** → **Web Service**
3. Select **Connect GitHub repository**
4. Choose `saikarne18/Water-quality-monitoring` repository

### 4️⃣ Configure Service Settings
| Setting | Value |
|---------|-------|
| **Name** | water-monitoring-api |
| **Environment** | Python 3 |
| **Region** | Singapore (or nearest) |
| **Branch** | main |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### 5️⃣ Set Environment Variables
In Render dashboard, go to **Environment**:

```
# Database Variables
DB_HOST=pg-15b7835e-saikarne18-c26f.f.aivencloud.com
DB_PORT=15211
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=YOUR_AIVEN_PASSWORD_HERE  # Set this to your Aiven password
DB_SSLMODE=require

# JWT Variables
JWT_SECRET=water-monitoring-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Python
PYTHON_VERSION=3.9.13
```

### 6️⃣ Deploy
- Click **Create Web Service**
- Wait 5-10 minutes for deployment
- ✅ Status should show "Live"
- Copy the URL: `https://water-quality-monitoring-9qmp.onrender.com`

### 7️⃣ Verify Deployment
```bash
# Test health endpoint
curl https://water-quality-monitoring-9qmp.onrender.com/api/v1/health

# Should return:
{"status":"healthy"}

# Test model info endpoint
curl https://water-quality-monitoring-9qmp.onrender.com/api/v1/model-info

# Should return model details with 92% accuracy
```

---

## 🔧 Troubleshooting

### Issue: Deployment fails
**Solution:** Check build logs in Render dashboard. Ensure:
- All dependencies in requirements.txt
- Python version matches runtime.txt
- DB credentials are correct

### Issue: Cannot connect to database
**Solution:** 
- Verify Aiven PostgreSQL is running
- Check DB_SSLMODE=require is set
- Verify all DB_* environment variables are correct

### Issue: API returns 500 errors
**Solution:**
- Check service logs: `render logs`
- Verify JWT_SECRET is set
- Ensure database tables are created

---

## 📝 Environment Variables Reference

### Database Connection (Aiven)
```
DB_HOST: PostgreSQL host from Aiven console
DB_PORT: Usually 15211 for Aiven
DB_NAME: Database name (defaultdb)
DB_USER: Aiven admin user
DB_PASSWORD: Aiven admin password
DB_SSLMODE: Always "require" for Aiven
```

### JWT Configuration
```
JWT_SECRET: Min 32 characters, used for token signing
JWT_ALGORITHM: "HS256" for HMAC-SHA256
JWT_EXPIRATION_HOURS: 24 for daily token expiry
```

---

## ✅ Deployment Checklist
- [ ] GitHub repository is up to date
- [ ] All environment variables are configured in Render
- [ ] Backend builds successfully
- [ ] Health endpoint returns {"status":"healthy"}
- [ ] Model info endpoint returns correct data
- [ ] Database connection works
- [ ] JWT token creation works
